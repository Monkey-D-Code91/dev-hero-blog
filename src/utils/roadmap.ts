import { getCollection } from "astro:content";
import type { Lang } from "../i18n/ui";
import {
  getBlogPostUrl,
  getSlugFromEntryId,
  getPublishedPosts,
  formatDate,
} from "./blog";

// ──────────────────────────────────────────────
// Tipi
// ──────────────────────────────────────────────

export type RoadmapStatus = "published" | "in-progress" | "planned";

/** Tappa risolta, pronta per il rendering (date già formattate, href se pubblicata). */
export interface ResolvedItem {
  title: string;
  /** Etichetta data già localizzata: esatta per pubblicati + prossima tappa, mese altrimenti. */
  dateLabel: string;
  isoDate: string;
  status: RoadmapStatus;
  focus: string[];
  authorName: string;
  collaborator: boolean;
  /** Presente solo per tappe pubblicate e collegate a un post. */
  href?: string;
}

export interface ResolvedArc {
  arcKey: string;
  numeral: string;
  title: string;
  lead: string;
  period: string;
  signature: string;
  items: ResolvedItem[];
  progress: { done: number; total: number };
  upcomingTeaser?: { label: string; text: string };
}

export interface RoadmapStats {
  firstArcDone: number;
  firstArcTotal: number;
  /** Tappe non ancora pubblicate (in lavorazione + in programma), tutti gli archi. */
  pipelineCount: number;
  /** Numero di firme distinte sull'intera roadmap. */
  signatures: number;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Data grossolana "mese anno" (es. "settembre 2026" / "September 2026"). */
function formatMonth(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
}

// ──────────────────────────────────────────────
// Query + risoluzione
// ──────────────────────────────────────────────

/**
 * Carica gli archi roadmap della lingua data, ordinati per `order`, e risolve
 * ogni tappa: le tappe collegate a un post pubblicato ereditano titolo/data/URL
 * dalla collection `blog`; le tappe di pipeline usano i dati inline.
 *
 * Regola date: la data esatta è mostrata solo per le tappe pubblicate e per la
 * prossima tappa in uscita DI OGNI arco (la più imminente non ancora pubblicata
 * al suo interno). Gli archi sono capitoli tematici che corrono in parallelo,
 * ognuno con la propria cadenza: la prossima uscita è quindi una per capitolo,
 * non una sola per tutta la roadmap. Tutte le altre tappe degradano a
 * "mese anno" per ridurre lo staleness.
 */
export async function getResolvedRoadmap(lang: Lang): Promise<ResolvedArc[]> {
  const arcs = (
    await getCollection("roadmap", (entry) => entry.id.startsWith(`${lang}/`))
  ).sort((a, b) => a.data.order - b.data.order);

  // Mappa translationKey → dati del post pubblicato (per ereditare titolo/data/URL).
  const publishedPosts = await getPublishedPosts(lang);
  const postByKey = new Map(
    publishedPosts.map((p) => [
      p.data.translationKey,
      {
        title: p.data.title,
        pubDate: p.data.pubDate,
        href: getBlogPostUrl(lang, getSlugFromEntryId(p.id)),
      },
    ])
  );

  // Prima passata: risolvi titolo/data/href e stato di ogni tappa.
  type PreItem = Omit<ResolvedItem, "dateLabel"> & { date: Date };
  const preArcs = arcs.map((arc) => {
    const items: PreItem[] = arc.data.items.map((item) => {
      const linked = item.postTranslationKey
        ? postByKey.get(item.postTranslationKey)
        : undefined;

      const title = linked?.title ?? item.title ?? "";
      const date = linked?.pubDate ?? item.date;

      return {
        title,
        date,
        isoDate: date.toISOString().slice(0, 10),
        status: item.status,
        focus: item.focus,
        authorName: item.authorName,
        collaborator: item.collaborator,
        href: item.status === "published" ? linked?.href : undefined,
      };
    });
    return { arc, items };
  });

  // Determina la prossima tappa in uscita DI OGNI CAPITOLO: la più imminente
  // non ancora pubblicata al suo interno. I capitoli corrono in parallelo e
  // hanno cadenza propria, quindi ognuno ha una "prossima uscita" sua: farne
  // una sola globale nasconderebbe la data esatta di tutti gli altri.
  // Il confronto è per riferimento, non per data: due tappe possono cadere
  // lo stesso giorno in capitoli diversi.
  const nextByArc = new Set(
    preArcs
      .map(({ items }) =>
        items
          .filter((i) => i.status !== "published")
          .reduce<PreItem | undefined>(
            (min, i) => (!min || i.date.getTime() < min.date.getTime() ? i : min),
            undefined
          )
      )
      .filter((i): i is PreItem => i !== undefined)
  );

  // Seconda passata: applica la formattazione data (esatta vs mese).
  return preArcs.map(({ arc, items }) => {
    const resolvedItems: ResolvedItem[] = items.map((i) => {
      const exact = i.status === "published" || nextByArc.has(i);
      const { date, ...rest } = i;
      return {
        ...rest,
        dateLabel: exact ? formatDate(date, lang) : formatMonth(date, lang),
      };
    });

    const done = resolvedItems.filter((i) => i.status === "published").length;

    return {
      arcKey: arc.data.arcKey,
      numeral: arc.data.numeral,
      title: arc.data.title,
      lead: arc.data.lead,
      period: arc.data.period,
      signature: arc.data.signature,
      items: resolvedItems,
      progress: { done, total: resolvedItems.length },
      upcomingTeaser: arc.data.upcomingTeaser,
    };
  });
}

/** Aggregati per l'hero: avanzamento del primo arco, pipeline totale, firme distinte. */
export function getRoadmapStats(arcs: ResolvedArc[]): RoadmapStats {
  const allItems = arcs.flatMap((a) => a.items);
  return {
    firstArcDone: arcs[0]?.progress.done ?? 0,
    firstArcTotal: arcs[0]?.progress.total ?? 0,
    pipelineCount: allItems.filter((i) => i.status !== "published").length,
    signatures: new Set(allItems.map((i) => i.authorName)).size,
  };
}
