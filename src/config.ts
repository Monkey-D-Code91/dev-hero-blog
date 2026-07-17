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

/**
 * Cloudflare Web Analytics: misura privacy-first (no cookie, no dato personale,
 * nessun banner richiesto), un solo beacon. Il token NON è segreto: compare
 * nell'HTML della pagina. Si ottiene dalla dashboard Cloudflare
 * (Web Analytics → Add a site → Manual → JS snippet, campo "token").
 *
 * Lasciare "" per tenerlo spento. In alternativa si può impostare da Workers
 * Builds senza toccare il codice con la env `CF_BEACON_TOKEN`, che ha la
 * precedenza (vedi src/utils/analytics.ts). Il beacon viene emesso SOLO sul
 * deploy di produzione reale (non in dev, non nelle anteprime Workers).
 */
export const CF_BEACON_TOKEN = "";
