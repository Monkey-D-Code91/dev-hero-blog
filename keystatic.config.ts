// @ts-nocheck — inerte finché non installi @keystatic/core (vedi "ATTIVAZIONE" in fondo).
import { config, fields, collection } from "@keystatic/core";

/**
 * Keystatic — CMS git-backed, allineato 1:1 allo schema Zod di src/content.config.ts.
 *
 * Stato: INERTE. Questo file da solo non tocca la build né l'output statico.
 *   - non è importato da astro.config.mjs
 *   - non aggiunge route /keystatic
 *   - per rimuoverlo: cancella questo file.
 *
 * Modello: LOCAL mode → l'editor a form gira su `localhost` e scrive gli stessi
 * file .md che hai già; i commit li fai tu con git. Resti 100% SSG.
 *
 * i18n: Keystatic non ha i18n nativo sulle collection, quindi il tuo pattern
 * cartella-per-lingua (it/ ed en/) diventa DUE collection per tipo — una per lingua.
 * Le factory qui sotto evitano la duplicazione dello schema.
 *
 * ⚠️ Doppio schema: questo file e lo Zod in src/content.config.ts sono due verità
 * parallele. Se aggiungi/rinomini un campo, aggiornalo in ENTRAMBI.
 */

type Locale = "it" | "en";

// ──────────────────────────────────────────────
// Collection BLOG (una per lingua)
// ──────────────────────────────────────────────
const blogCollection = (locale: Locale) =>
  collection({
    label: `Blog (${locale.toUpperCase()})`,
    // Filename = slug URL (es. code-review-nel-modo-sbagliato). Coincide con
    // getSlugFromEntryId() in src/utils/blog.ts.
    path: `src/content/blog/${locale}/*`,
    slugField: "title",
    // .md + frontmatter YAML, identico ai file esistenti (no .mdoc).
    format: { contentField: "content" },
    entryLayout: "content",
    schema: {
      // Il "name" finisce in frontmatter come `title`; lo slug è il filename.
      title: fields.slug({
        name: { label: "Titolo", validation: { isRequired: true } },
        slug: {
          label: "Slug (URL)",
          description: "Parte finale dell'URL. Deve restare stabile dopo la pubblicazione.",
        },
      }),
      description: fields.text({
        label: "Descrizione",
        description: "Usata in meta description e card.",
        multiline: true,
        validation: { isRequired: true },
      }),
      pubDate: fields.date({
        label: "Data di pubblicazione",
        validation: { isRequired: true },
      }),
      updatedDate: fields.date({ label: "Data ultimo aggiornamento" }),
      // Chiave condivisa IT/EN. Keystatic NON la sincronizza tra lingue:
      // deve combaciare a mano con l'altra versione dell'articolo.
      translationKey: fields.text({
        label: "Translation key",
        description: "Stessa stringa nella versione IT ed EN di questo articolo.",
        validation: { isRequired: true },
      }),
      // Uno o più autori (co-autori). Tendina sugli autori della stessa
      // lingua; ogni voce salva lo slug (= authorKey).
      authors: fields.array(
        fields.relationship({
          label: "Autore",
          collection: locale === "it" ? "authorsIt" : "authorsEn",
        }),
        {
          label: "Autori",
          itemLabel: (props) => props.value ?? "",
          validation: { length: { min: 1 } },
        }
      ),
      tags: fields.array(fields.text({ label: "Tag" }), {
        label: "Tag",
        itemLabel: (props) => props.value,
      }),
      cover: fields.image({
        label: "Cover",
        // Salvata accanto al .md; il path relativo è risolto da image() di Astro.
        directory: `src/content/blog/${locale}`,
        publicPath: "./",
      }),
      coverAlt: fields.text({ label: "Testo alternativo cover" }),
      draft: fields.checkbox({
        label: "Bozza",
        description: "Le bozze sono escluse dalla build di produzione.",
        defaultValue: false,
      }),
      canonicalUrl: fields.url({
        label: "Canonical URL (se pubblicato prima altrove)",
        description:
          "Se questo articolo è apparso originariamente su un'altra piattaforma (Medium, dev.to, blog personale), inserisci l'URL originale. Il sito punterà a quell'URL come canonical, consolidando il valore SEO sulla fonte originale.",
      }),
      content: fields.markdoc({ label: "Contenuto", extension: "md" }),
    },
  });

// ──────────────────────────────────────────────
// Collection AUTHORS (una per lingua)
// ──────────────────────────────────────────────
const authorsCollection = (locale: Locale) =>
  collection({
    label: `Autori (${locale.toUpperCase()})`,
    // Filename = authorKey (es. marco-mariotti).
    path: `src/content/authors/${locale}/*`,
    slugField: "authorKey",
    format: { contentField: "about" },
    entryLayout: "form",
    schema: {
      // Lo slug (filename) e il valore in frontmatter `authorKey` coincidono.
      // Tieni la chiave identica nella versione IT ed EN dello stesso autore.
      authorKey: fields.slug({
        name: {
          label: "Author key",
          description: "Chiave condivisa IT/EN (es. marco-mariotti). = nome del file.",
          validation: { isRequired: true },
        },
      }),
      name: fields.text({ label: "Nome", validation: { isRequired: true } }),
      role: fields.text({ label: "Ruolo", validation: { isRequired: true } }),
      badge: fields.text({ label: "Badge", validation: { isRequired: true } }),
      headline: fields.text({
        label: "Headline",
        multiline: true,
        validation: { isRequired: true },
      }),
      subline: fields.text({
        label: "Subline",
        multiline: true,
        validation: { isRequired: true },
      }),
      avatar: fields.image({
        label: "Foto profilo",
        description: "Opzionale: se assente si usa il monogramma.",
        directory: `src/content/authors/${locale}`,
        publicPath: "./",
      }),
      avatarAlt: fields.text({ label: "Testo alternativo foto" }),
      monogram: fields.text({
        label: "Monogramma",
        description: "Iniziali, usate se manca la foto (es. MM).",
        validation: { isRequired: true },
      }),
      links: fields.object(
        {
          linkedin: fields.url({ label: "LinkedIn" }),
          github: fields.url({ label: "GitHub" }),
          website: fields.url({ label: "Sito web" }),
        },
        { label: "Link" }
      ),
      stats: fields.object(
        {
          years: fields.text({ label: "Anni di esperienza", validation: { isRequired: true } }),
          teamSize: fields.text({ label: "Dimensione team" }),
          countries: fields.text({ label: "Paesi" }),
        },
        { label: "Statistiche" }
      ),
      aboutLead: fields.text({
        label: "Frase guida (About)",
        validation: { isRequired: true },
      }),
      experience: fields.array(
        fields.object({
          period: fields.text({ label: "Periodo", validation: { isRequired: true } }),
          role: fields.text({ label: "Ruolo", validation: { isRequired: true } }),
          company: fields.text({ label: "Azienda", validation: { isRequired: true } }),
          description: fields.text({
            label: "Descrizione",
            multiline: true,
            validation: { isRequired: true },
          }),
        }),
        {
          label: "Esperienze",
          itemLabel: (props) =>
            `${props.fields.company.value} — ${props.fields.role.value}`,
        }
      ),
      skills: fields.array(
        fields.object({
          title: fields.text({ label: "Categoria", validation: { isRequired: true } }),
          items: fields.array(fields.text({ label: "Competenza" }), {
            label: "Competenze",
            itemLabel: (props) => props.value,
          }),
        }),
        {
          label: "Competenze",
          itemLabel: (props) => props.fields.title.value,
        }
      ),
      // La bio lunga vive nel body markdown, come oggi.
      about: fields.markdoc({ label: "Bio (about)", extension: "md" }),
    },
  });

export default config({
  // Local mode: nessun cloud, nessun server in produzione.
  storage: { kind: "local" },
  ui: {
    brand: { name: "First Draft" },
  },
  collections: {
    blogIt: blogCollection("it"),
    blogEn: blogCollection("en"),
    authorsIt: authorsCollection("it"),
    authorsEn: authorsCollection("en"),
  },
});

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATTIVAZIONE (quando vorrai provarlo — passi reversibili, in local mode)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. npm install @keystatic/core @keystatic/astro
 *    (@astrojs/react è già presente nel progetto)
 *
 * 2. astro.config.mjs — aggiungi l'integrazione e abilita l'output server
 *    SOLO per la UI admin (il sito pubblico resta prerenderizzato):
 *
 *      import keystatic from '@keystatic/astro';
 *      import node from '@astrojs/node';        // npm i @astrojs/node
 *      export default defineConfig({
 *        output: 'static',                      // le pagine restano statiche
 *        adapter: node({ mode: 'standalone' }), // serve solo alle route /keystatic
 *        integrations: [react(), mdx(), icon(), sitemap(), keystatic()],
 *      });
 *
 * 3. npm run dev → apri http://localhost:4321/keystatic
 *
 * Per autori NON tecnici che editano dal browser serve invece GitHub mode
 * (storage: { kind: 'github', repo: 'owner/name' } + GitHub App) — quello sì
 * reintroduce una superficie server e va valutato al "gate del 2° autore".
 *
 * NOTA workflow: le skill add-author / refine-article fanno auto-traduzione
 * IT↔EN; Keystatic no. Usa le skill per CREARE bilingue, Keystatic per le
 * REVISIONI successive — non entrambi sullo stesso file in creazione.
 */
