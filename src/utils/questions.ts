import type { Lang } from "../i18n/ui";
import {
  getBlogPostUrl,
  getSlugFromEntryId,
  getPublishedPosts,
} from "./blog";

// ──────────────────────────────────────────────
// Tipi
// ──────────────────────────────────────────────

export type QuestionStatus = "open" | "resumed";

/** Domanda aperta risolta, pronta per il rendering. */
export interface ResolvedQuestion {
  /** Il testo della domanda, nella lingua richiesta. */
  question: string;
  /** Titolo dell'articolo che ha posto la domanda. */
  sourceTitle: string;
  /** URL dell'articolo d'origine. */
  sourceHref: string;
  /** Data di pubblicazione dell'articolo d'origine (per l'ordinamento). */
  sourceDate: Date;
  status: QuestionStatus;
  /** Presente solo se `status === "resumed"`: titolo del pezzo che la riprende. */
  resumedTitle?: string;
  /** Presente solo se `status === "resumed"`: URL del pezzo che la riprende. */
  resumedHref?: string;
}

export interface OpenQuestionsData {
  questions: ResolvedQuestion[];
  openCount: number;
  resumedCount: number;
}

// ──────────────────────────────────────────────
// Query + risoluzione
// ──────────────────────────────────────────────

/**
 * Raccoglie tutte le domande aperte dichiarate negli articoli pubblicati della
 * lingua data. Ogni domanda eredita titolo e URL dal proprio articolo d'origine;
 * se `resumedBy` punta a un articolo pubblicato, la domanda risulta "ripresa" e
 * porta il link al pezzo che la raccoglie (altrimenti resta "aperta").
 *
 * Ordinamento: prima le aperte, poi le riprese; dentro ogni gruppo, per data
 * dell'articolo d'origine decrescente (le più recenti in alto).
 */
export async function getOpenQuestions(lang: Lang): Promise<OpenQuestionsData> {
  const posts = await getPublishedPosts(lang);

  // Mappa translationKey → dati del post pubblicato (per titolo/URL, sia per la
  // fonte sia per l'eventuale pezzo che riprende la domanda).
  const postByKey = new Map(
    posts.map((p) => [
      p.data.translationKey,
      {
        title: p.data.title,
        href: getBlogPostUrl(lang, getSlugFromEntryId(p.id)),
      },
    ])
  );

  const questions: ResolvedQuestion[] = [];
  for (const post of posts) {
    for (const q of post.data.openQuestions ?? []) {
      const resumed = q.resumedBy ? postByKey.get(q.resumedBy) : undefined;
      questions.push({
        question: q.question,
        sourceTitle: post.data.title,
        sourceHref: getBlogPostUrl(lang, getSlugFromEntryId(post.id)),
        sourceDate: post.data.pubDate,
        status: resumed ? "resumed" : "open",
        resumedTitle: resumed?.title,
        resumedHref: resumed?.href,
      });
    }
  }

  const rank = (s: QuestionStatus) => (s === "open" ? 0 : 1);
  questions.sort((a, b) => {
    if (rank(a.status) !== rank(b.status)) return rank(a.status) - rank(b.status);
    return b.sourceDate.getTime() - a.sourceDate.getTime();
  });

  return {
    questions,
    openCount: questions.filter((q) => q.status === "open").length,
    resumedCount: questions.filter((q) => q.status === "resumed").length,
  };
}
