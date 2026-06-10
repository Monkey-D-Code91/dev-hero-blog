import type { Lang } from "../i18n/ui";
import { BLOG } from "../config";

/**
 * Costruttori di JSON-LD (schema.org) per articoli e autori.
 * Restituiscono oggetti semplici, serializzati nel <head> da BaseLayout.
 * Obiettivo: legare ogni articolo a una Person reale (rich result Google,
 * "scritto da") e dare al profilo autore un'entità strutturata.
 */

/** Risolve un path/URL in URL assoluto rispetto a `site`. */
function abs(site: URL | undefined, pathOrUrl: string): string {
  return new URL(pathOrUrl, site).toString();
}

const publisher = (site: URL | undefined) => ({
  "@type": "Organization",
  name: BLOG.name,
  logo: { "@type": "ImageObject", url: abs(site, BLOG.logo) },
});

interface ArticleInput {
  site: URL | undefined;
  lang: Lang;
  title: string;
  description: string;
  /** Path canonico dell'articolo, es. "/blog/slug/". */
  canonicalPath: string;
  pubDate: Date;
  updatedDate?: Date;
  tags: string[];
  /** URL assoluto immagine (cover o OG di fallback). */
  imageUrl: string;
  authorName: string;
  /** Path del profilo autore, es. "/autori/key/". */
  authorPath: string;
  /** Link esterni dell'autore (LinkedIn/GitHub/sito). */
  authorSameAs: string[];
}

export function buildArticleSchema(i: ArticleInput) {
  const url = abs(i.site, i.canonicalPath);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: i.title,
    description: i.description,
    inLanguage: i.lang,
    datePublished: i.pubDate.toISOString(),
    dateModified: (i.updatedDate ?? i.pubDate).toISOString(),
    url,
    mainEntityOfPage: url,
    image: i.imageUrl,
    ...(i.tags.length ? { keywords: i.tags.join(", ") } : {}),
    author: {
      "@type": "Person",
      name: i.authorName,
      url: abs(i.site, i.authorPath),
      ...(i.authorSameAs.length ? { sameAs: i.authorSameAs } : {}),
    },
    publisher: publisher(i.site),
  };
}

interface PersonInput {
  site: URL | undefined;
  name: string;
  role: string;
  description: string;
  /** Path canonico del profilo, es. "/autori/key/". */
  canonicalPath: string;
  /** URL assoluto avatar, se presente. */
  imageUrl?: string;
  /** Link esterni (LinkedIn/GitHub/sito). */
  sameAs: string[];
  /** Competenze, mappate su knowsAbout. */
  knowsAbout?: string[];
}

export function buildPersonSchema(i: PersonInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: i.name,
    jobTitle: i.role,
    description: i.description,
    url: abs(i.site, i.canonicalPath),
    ...(i.imageUrl ? { image: i.imageUrl } : {}),
    ...(i.sameAs.length ? { sameAs: i.sameAs } : {}),
    ...(i.knowsAbout?.length ? { knowsAbout: i.knowsAbout } : {}),
    worksFor: publisher(i.site),
  };
}
