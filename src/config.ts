/**
 * Dati di profilo indipendenti dalla lingua.
 * >>> COMPILA QUI i valori reali (cerca i commenti "TODO"). <<<
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
