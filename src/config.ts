/**
 * Brand del blog — identità del prodotto, indipendente dai singoli autori.
 * Usato da navbar, footer, meta/OG e favicon.
 */
export const BLOG = {
  name: "First Draft",
  monogram: "FD",
  domain: "thefirstdraft.dev",
  // Path del logo scelto (in /public/logos). Da finalizzare in C0 dopo la scelta.
  logo: "/logos/fd-3-nib.svg",
} as const;

/**
 * Configurazione Giscus per i commenti del blog.
 * Valori generati su https://giscus.app — non modificare manualmente.
 */
export const GISCUS: {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
} = {
  repo: "Monkey-D-Code91/dev-hero-blog",
  repoId: "R_kgDOSy0bHQ",
  category: "Ideas",
  categoryId: "DIC_kwDOSy0bHc4C-pHC",
};
