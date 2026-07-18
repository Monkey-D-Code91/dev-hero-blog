import MarkdownIt from "markdown-it";
import sanitizeHtml from "sanitize-html";
import type { RSSFeedItem } from "@astrojs/rss";
import type { CollectionEntry } from "astro:content";
import type { Lang } from "../i18n/ui";
import { getSlugFromEntryId, getBlogPostUrl } from "./blog";

/**
 * Feed a contenuto COMPLETO (non solo sommario): il lettore RSS può leggere
 * l'articolo intero senza tornare nel browser, coerente col posizionamento
 * anti-algoritmo del blog. Ricetta ufficiale Astro: markdown-it + sanitize-html.
 *
 * `typographer` è OFF di proposito: convertirebbe "--" in trattino lungo,
 * vietato dalle linee guida editoriali del brand.
 */
const md = new MarkdownIt({ html: false, linkify: true, typographer: false });

/** Namespace Atom, da aggiungere all'`xmlns` del feed per usare <atom:link>. */
export const ATOM_XMLNS = { atom: "http://www.w3.org/2005/Atom" } as const;

/**
 * Link self-referenziale del feed (<atom:link rel="self">): il feed dichiara il
 * proprio URL canonico. Raccomandato dai validatori RSS. `path` è il percorso
 * del feed stesso (es. "/rss.xml").
 */
export function atomSelfLink(site: URL | undefined, path: string): string {
  const href = new URL(path, site).toString();
  return `<atom:link href="${href}" rel="self" type="application/rss+xml"/>`;
}

/** Rende il markdown del corpo articolo in HTML sicuro per il tag <content:encoded>. */
export function renderPostContent(body: string): string {
  return sanitizeHtml(md.render(body), {
    allowedTags: [
      "p", "br", "hr",
      "h2", "h3", "h4",
      "strong", "em", "del", "blockquote",
      "ul", "ol", "li",
      "a", "code", "pre",
    ],
    allowedAttributes: { a: ["href", "title"] },
  });
}

/**
 * Costruisce l'item RSS a contenuto completo di un post, condiviso dai quattro
 * feed (IT, EN, per-autore IT/EN). `dc:creator` per ogni autore.
 */
export function toRssItem(
  post: CollectionEntry<"blog">,
  lang: Lang,
  authorMap: Map<string, string>
): RSSFeedItem {
  return {
    title: post.data.title,
    description: post.data.description,
    content: renderPostContent(post.body ?? ""),
    pubDate: post.data.pubDate,
    link: getBlogPostUrl(lang, getSlugFromEntryId(post.id)),
    categories: post.data.tags,
    customData: post.data.authors
      .map((key) => `<dc:creator>${authorMap.get(key) ?? key}</dc:creator>`)
      .join(""),
  };
}
