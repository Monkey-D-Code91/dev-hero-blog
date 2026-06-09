import { getCollection } from "astro:content";
import type { ImageMetadata } from "astro";
import type { Lang } from "../i18n/ui";

// ──────────────────────────────────────────────
// Tipo condiviso tra BlogList e PostCard
// ──────────────────────────────────────────────
export interface ProcessedPost {
  title: string;
  description: string;
  pubDate: Date;
  slug: string;
  tags: string[];
  readingTime: string;
  cover?: ImageMetadata;
  coverAlt?: string;
  authorKey: string;
  authorName: string;
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
