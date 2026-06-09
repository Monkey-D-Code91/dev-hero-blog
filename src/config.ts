/**
 * Brand del blog — identità del prodotto, indipendente dai singoli autori.
 * Usato da navbar, footer, meta/OG e favicon.
 */
export const BLOG = {
  name: "First Draft",
  monogram: "FD",
  domain: "thefirstdraft.dev",
  // Path del logo scelto (in /public/logos). Da finalizzare in C0 dopo la scelta.
  logo: "/logos/fd-1-monogram.svg",
} as const;

/**
 * NOTA (C0→C1): i dati di Marco qui sotto verranno migrati nella collection
 * `authors` (src/content/authors/) e questa costante sarà rimossa quando le
 * pagine profilo saranno data-driven. Mantenuta ora per non rompere la build
 * della homepage one-page esistente.
 */
export const SITE = {
  name: "Marco Mariotti",
  monogram: "MM",
  role: "Software Engineer & Tech Lead",

  // TODO: sostituisci con l'URL reale del tuo profilo LinkedIn.
  linkedin: "https://www.linkedin.com/in/marco-mariotti-627074187/",

  // Numeri mostrati nella sezione "About".
  // TODO: aggiorna con i valori reali.
  stats: {
    years: "6+", // anni di esperienza
    teamSize: "7", // persone nel team
    countries: "2", // paesi (Italia + Albania)
  },
} as const;

/**
 * Configurazione Giscus per i commenti del blog.
 * Valori generati su https://giscus.app — non modificare manualmente.
 */
export const GISCUS = {
  repo: "Monkey-D-Code91/dev-hero-blog",
  repoId: "R_kgDOSy0bHQ",
  category: "Ideas",
  categoryId: "DIC_kwDOSy0bHc4C-pHC",
} as const;
