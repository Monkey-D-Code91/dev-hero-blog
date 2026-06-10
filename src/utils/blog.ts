import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";
import type { ImageMetadata } from "astro";
import type { Lang } from "../i18n/ui";
import { getReadingTime } from "./readingTime";

// ──────────────────────────────────────────────
// Tipi condivisi tra BlogList e PostCard
// ──────────────────────────────────────────────

/** Autore risolto di un post: chiave + nome visualizzato. */
export interface PostAuthor {
  key: string;
  name: string;
}

export interface ProcessedPost {
  title: string;
  description: string;
  pubDate: Date;
  slug: string;
  tags: string[];
  readingTime: string;
  cover?: ImageMetadata;
  coverAlt?: string;
  /** Uno o più autori (co-autori inclusi), nell'ordine del frontmatter. */
  authors: PostAuthor[];
}

// ──────────────────────────────────────────────
// Helpers sugli ID della content collection
// ──────────────────────────────────────────────

/** Estrae la lingua dal prefisso dell'ID entry (es. "it/mio-articolo" → "it"). */
export function getLangFromEntryId(id: string): Lang {
  const [prefix] = id.split("/");
  return prefix === "en" ? "en" : "it";
}

/** Estrae lo slug URL dall'ID entry (es. "it/mio-articolo" → "mio-articolo"). */
export function getSlugFromEntryId(id: string): string {
  return id.split("/").slice(1).join("/");
}

/** Costruisce l'URL assoluto dell'articolo data la lingua e lo slug. */
export function getBlogPostUrl(lang: Lang, slug: string): string {
  return lang === "it" ? `/blog/${slug}/` : `/en/blog/${slug}/`;
}

/** Costruisce l'URL del profilo autore data la lingua e l'authorKey. */
export function getAuthorUrl(authorKey: string, lang: Lang): string {
  return lang === "it" ? `/autori/${authorKey}/` : `/en/authors/${authorKey}/`;
}

// ──────────────────────────────────────────────
// Query collection
// ──────────────────────────────────────────────

/**
 * Restituisce una mappa authorKey → name per tutti gli autori della lingua data.
 * Usata nei template per risolvere il nome dell'autore di un post senza N query.
 */
export async function buildAuthorNameMap(lang: Lang): Promise<Map<string, string>> {
  const authors = await getCollection("authors", (entry) =>
    entry.id.startsWith(`${lang}/`)
  );
  const map = new Map<string, string>();
  for (const a of authors) {
    map.set(a.data.authorKey, a.data.name);
  }
  return map;
}

/**
 * Trova l'entry autore per authorKey nella lingua data (null se assente).
 * Utile quando servono i dati completi (link, ruolo) e non solo il nome.
 */
export async function findAuthor(authorKey: string, lang: Lang) {
  const authors = await getCollection("authors", (entry) =>
    entry.id.startsWith(`${lang}/`)
  );
  return authors.find((a) => a.data.authorKey === authorKey) ?? null;
}

/**
 * Risolve in ordine le entry autore per una lista di authorKey (lingua data).
 * Le chiavi senza profilo corrispondente vengono saltate.
 */
export async function findAuthors(authorKeys: string[], lang: Lang) {
  const authors = await getCollection("authors", (entry) =>
    entry.id.startsWith(`${lang}/`)
  );
  const byKey = new Map(authors.map((a) => [a.data.authorKey, a]));
  return authorKeys
    .map((key) => byKey.get(key))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
}

/**
 * Trasforma le entry blog in ProcessedPost pronti per le card, risolvendo
 * autori (nome) e reading time in un solo passaggio. Centralizza la logica
 * prima duplicata in ogni pagina lista/tag/home.
 */
export async function processPosts(
  entries: CollectionEntry<"blog">[],
  lang: Lang
): Promise<ProcessedPost[]> {
  const nameMap = await buildAuthorNameMap(lang);
  return entries.map((p) => ({
    title: p.data.title,
    description: p.data.description,
    pubDate: p.data.pubDate,
    slug: getSlugFromEntryId(p.id),
    tags: p.data.tags,
    readingTime: getReadingTime(p.body, lang),
    cover: p.data.cover,
    coverAlt: p.data.coverAlt,
    authors: p.data.authors.map((key) => ({
      key,
      name: nameMap.get(key) ?? key,
    })),
  }));
}

/**
 * Recupera gli articoli pubblicati per una lingua, ordinati per pubDate decrescente.
 * In produzione i draft sono esclusi; in dev sono visibili per anteprima.
 */
export async function getPublishedPosts(lang: Lang) {
  const posts = await getCollection("blog", (entry) => {
    const isRightLang = getLangFromEntryId(entry.id) === lang;
    const isVisible = import.meta.env.PROD ? !entry.data.draft : true;
    return isRightLang && isVisible;
  });
  return posts.sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );
}

/**
 * Trova la versione nella lingua alternativa dello stesso articolo
 * tramite il campo `translationKey` condiviso.
 * Ritorna null se non esiste o non è pubblicata.
 */
export async function getAlternatePost(translationKey: string, targetLang: Lang) {
  const posts = await getCollection("blog", (entry) => {
    const isRightLang = getLangFromEntryId(entry.id) === targetLang;
    const isMatch = entry.data.translationKey === translationKey;
    const isVisible = import.meta.env.PROD ? !entry.data.draft : true;
    return isRightLang && isMatch && isVisible;
  });
  return posts[0] ?? null;
}

// ──────────────────────────────────────────────
// Formatting
// ──────────────────────────────────────────────

/** Formatta una data in modo localizzato (es. "15 maggio 2026" / "15 May 2026"). */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "it" ? "it-IT" : "en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Unisce una lista di nomi in testo localizzato:
 * "A", "A e B", "A, B e C" (it) / "A and B", "A, B and C" (en).
 * Per contesti testuali (OG image, RSS). In HTML si usano link separati.
 */
export function formatAuthorList(names: string[], lang: Lang): string {
  if (names.length <= 1) return names[0] ?? "";
  const conj = lang === "it" ? "e" : "and";
  if (names.length === 2) return `${names[0]} ${conj} ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} ${conj} ${names[names.length - 1]}`;
}
