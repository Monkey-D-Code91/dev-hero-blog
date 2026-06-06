/**
 * Dati di profilo indipendenti dalla lingua.
 * >>> COMPILA QUI i valori reali (cerca i commenti "TODO"). <<<
 */
export const SITE = {
  name: "Marco Mariotti",
  monogram: "MM",
  role: "Software Engineer & Tech Lead",

  // TODO: sostituisci con l'URL reale del tuo profilo LinkedIn.
  linkedin: "https://www.linkedin.com/in/marco-mariotti/",

  // Numeri mostrati nella sezione "About".
  // TODO: aggiorna con i valori reali.
  stats: {
    years: "8+", // anni di esperienza
    teamSize: "10+", // persone nel team
    countries: "2", // paesi (Italia + Albania)
  },
} as const;

/**
 * Configurazione Giscus per i commenti del blog.
 * >>> COMPILA con i valori da https://giscus.app dopo aver:
 *     1. Reso pubblico il repo GitHub e abilitato Discussions.
 *     2. Installato l'app giscus sul repo.
 *     3. Generato repo/repoId/category/categoryId su giscus.app. <<<
 */
export const GISCUS = {
  repo: "", // TODO: es. "Monkey-D-Code91/dev-hero-blog"
  repoId: "", // TODO: da giscus.app
  category: "Comments", // TODO: nome della categoria Discussions
  categoryId: "", // TODO: da giscus.app
} as const;
