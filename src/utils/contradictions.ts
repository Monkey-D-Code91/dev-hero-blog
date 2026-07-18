import type { CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/ui";
import {
  getBlogPostUrl,
  getSlugFromEntryId,
  getPublishedPosts,
  buildAuthorNameMap,
  formatAuthorList,
} from "./blog";

// ──────────────────────────────────────────────
// Tipi
// ──────────────────────────────────────────────

/** Un pezzo collegato dal formato "Contraddizione" (dittico a due firme). */
export interface ContradictionLink {
  title: string;
  href: string;
  /** Firma/e del pezzo collegato, già unite in testo localizzato. */
  authorName: string;
}

export interface Contradictions {
  /** Il pezzo a cui QUESTO articolo risponde (se pubblicato). */
  respondsTo?: ContradictionLink;
  /** I pezzi pubblicati che rispondono a QUESTO articolo. */
  respondedBy: ContradictionLink[];
}

// ──────────────────────────────────────────────
// Risoluzione
// ──────────────────────────────────────────────

/**
 * Risolve i collegamenti bidirezionali del formato "Contraddizione" per un
 * articolo: il pezzo a cui risponde (`respondsTo`) e i pezzi che gli rispondono
 * (`respondedBy`). Solo verso articoli pubblicati: un legame verso una bozza
 * non compare finché la bozza non esce. Chiave di collegamento: `translationKey`.
 */
export async function getContradictions(
  post: CollectionEntry<"blog">,
  lang: Lang
): Promise<Contradictions> {
  const posts = await getPublishedPosts(lang);
  const authorNameMap = await buildAuthorNameMap(lang);

  const toLink = (p: CollectionEntry<"blog">): ContradictionLink => ({
    title: p.data.title,
    href: getBlogPostUrl(lang, getSlugFromEntryId(p.id)),
    authorName: formatAuthorList(
      p.data.authors.map((k) => authorNameMap.get(k) ?? k),
      lang
    ),
  });

  const byKey = new Map(posts.map((p) => [p.data.translationKey, p]));
  const target = post.data.respondsTo
    ? byKey.get(post.data.respondsTo)
    : undefined;

  const respondedBy = posts.filter(
    (p) => p.data.respondsTo === post.data.translationKey && p.id !== post.id
  );

  return {
    respondsTo: target ? toLink(target) : undefined,
    respondedBy: respondedBy.map(toLink),
  };
}
