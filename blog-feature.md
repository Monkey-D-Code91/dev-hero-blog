# Piano: Sezione Blog (articoli + commenti)

## Context

Il sito personale di Marco (Astro + React + Tailwind v4, bilingue IT/EN, tema "Modern
Tech Dark") è attualmente una single-page. Vogliamo aggiungere un **blog** dove pubblicare
articoli, con **sezione commenti**, mantenendo una UX pulita e perfettamente coerente con il
resto del sito.

Decisioni confermate con l'utente:
- **Authoring**: articoli in **Markdown/MDX** versionati nel repo (Astro Content Collections). Nessun servizio esterno, MDX per usare componenti negli articoli.
- **Commenti**: **Giscus** (commenti via GitHub Discussions). Gratis, no ads/tracking, ideale per un pubblico tech. Richiede login GitHub per commentare.
- **Lingue**: blog **pienamente bilingue** — ogni articolo esiste in IT ed EN, e il selettore lingua funziona anche sul singolo articolo.
- **Funzioni**: tag/categorie, immagine di copertina, tempo di lettura, feed RSS.

Vincolo guida: il sito resta **100% statico** (nessun backend nostro). I commenti sono delegati a Giscus, i contenuti a file nel repo.

---

## Dipendenze da aggiungere

| Pacchetto | Scopo |
| --- | --- |
| `@astrojs/mdx` | supporto MDX negli articoli |
| `@astrojs/rss` | generazione feed RSS |
| `@tailwindcss/typography` | stile tipografico degli articoli (`prose`) |
| `reading-time` | calcolo del tempo di lettura |

Aggiornamenti config:
- `astro.config.mjs`: aggiungere l'integrazione `mdx()` all'array `integrations`.
- `src/styles/global.css`: aggiungere `@plugin "@tailwindcss/typography";` e una variante `prose` personalizzata coerente col tema scuro (vedi sotto).

---

## Architettura dei contenuti

### Content Collection
Definire la collection in **`src/content.config.ts`** (Astro 5 content layer, `glob` loader):

```
src/content/blog/
  it/
    mio-primo-articolo.md(x)
  en/
    my-first-article.md(x)
```

- La **lingua** è data dalla sottocartella (`it` / `en`); lo **slug** dal nome file.
- Gli **slug sono diversi per IT ed EN** (localizzati per la SEO): es. `it/ottimizzare-i-costi-roaming.md` → `/blog/ottimizzare-i-costi-roaming/` e `en/optimising-roaming-costs.md` → `/en/blog/optimising-roaming-costs/`.
- Poiché gli slug differiscono, le due traduzioni di uno stesso articolo si collegano **esclusivamente** tramite il campo frontmatter condiviso **`translationKey`** (usato dallo switch lingua per trovare la versione corrispondente).

### Schema frontmatter (zod)
```ts
{
  title: string,
  description: string,           // usata per meta + anteprima card + RSS
  pubDate: date,
  updatedDate: date (optional),
  translationKey: string,        // condiviso tra le versioni IT/EN dello stesso post
  tags: string[] (default []),
  cover: image() (optional),     // ottimizzata da Astro
  coverAlt: string (optional),   // testo alternativo accessibile
  draft: boolean (default false) // i draft sono esclusi dalla build di produzione
}
```

> Le cover si co-locano accanto al post o in `src/assets/blog/` e si referenziano nel frontmatter
> così Astro le ottimizza e ne genera versioni responsive.

### Tempo di lettura
Helper **`src/utils/readingTime.ts`** basato su `reading-time`, calcolato da `entry.body`.
Funziona sia nella lista (PostCard) sia nel post. La stringa "min di lettura" / "min read" viene
dalle traduzioni i18n.

---

## Routing (coerente con la i18n esistente: IT su `/`, EN su `/en/`)

| Pagina | IT | EN |
| --- | --- | --- |
| Lista blog | `/blog/` | `/en/blog/` |
| Articolo | `/blog/[slug]/` | `/en/blog/[slug]/` |
| Archivio tag | `/blog/tag/[tag]/` | `/en/blog/tag/[tag]/` |
| Feed RSS | `/rss.xml` | `/en/rss.xml` |

Pagine (thin wrapper che filtrano per lingua e delegano ai componenti condivisi):
```
src/pages/blog/index.astro
src/pages/blog/[...slug].astro
src/pages/blog/tag/[tag].astro
src/pages/rss.xml.ts
src/pages/en/blog/index.astro
src/pages/en/blog/[...slug].astro
src/pages/en/blog/tag/[tag].astro
src/pages/en/rss.xml.ts
```
Tutte usano `getStaticPaths` filtrando le entry per lingua (e escludendo i `draft` in produzione).

---

## Componenti (riutilizzano i token e i pattern del sito)

Da creare in `src/components/blog/`:

- **`PostCard.astro`** — card articolo per la lista: cover, titolo, data, tempo di lettura, tag.
  Hover coerente con le card Competenze (`hover:border-accent/40`), bordi `border-border`, sfondo `bg-surface-2`.
- **`BlogList.astro`** — griglia/elenco di `PostCard` ordinati per `pubDate` desc, con header di sezione (eyebrow accent + titolo) come le altre sezioni del sito.
- **`BlogPostLayout.astro`** — layout dell'articolo: hero con cover, titolo, meta (`<time>` data + tempo lettura + tag), contenuto in `prose`, link "← torna al blog", e `<Comments>` in fondo.
- **`PostMeta.astro`** — riga meta riutilizzabile (data, tempo di lettura, tag).
- **`TagPill.astro`** / **`TagList.astro`** — chip dei tag, link agli archivi tag.
- **`Comments.astro`** — embed Giscus (vedi sotto).
- **`Prose.astro`** (o classi `prose`) — wrapper tipografico per il contenuto Markdown.

### Stile articolo (`prose`)
Usare `@tailwindcss/typography` con override coerenti col tema scuro:
testo `--color-text`, heading bianchi, **link in `--color-accent`**, `blockquote`/bordi su `--color-border`,
blocchi codice su `--color-surface-2`. Definire una classe tipo `prose prose-invert` personalizzata in `global.css`.

---

## Commenti — Giscus

`Comments.astro` inietta lo script Giscus con i parametri di configurazione. Caratteristiche:
- `data-mapping="pathname"` → una discussione per articolo.
- `data-lang` impostato dinamicamente su `it`/`en` in base alla lingua della pagina.
- **Tema scuro** coerente: `data-theme` su un tema dark (es. `dark_dimmed`/`transparent_dark`) oppure un tema CSS custom su `#0b1120`.
- `loading="lazy"` per non penalizzare le performance.

Config centralizzata in **`src/config.ts`** (nuovo oggetto `GISCUS`), con valori segnaposto `TODO`:
```ts
export const GISCUS = {
  repo: "marcomariotti/<repo>",       // TODO
  repoId: "<repo-id>",                 // TODO (da giscus.app)
  category: "Comments",                // TODO
  categoryId: "<category-id>",         // TODO (da giscus.app)
};
```
Se i valori non sono configurati, `Comments.astro` mostra un **placeholder gentile** invece dello script (così build e layout reggono prima del setup).

### Azioni richieste all'utente (prerequisiti Giscus)
1. Rendere **pubblico** un repository GitHub (es. quello del sito) e abilitare **Discussions**.
2. Installare l'app **giscus** sul repo: https://github.com/apps/giscus
3. Su **https://giscus.app** ottenere `repoId` e `categoryId` (consigliata categoria "Announcements" o una dedicata "Comments").
4. Incollare i valori in `src/config.ts → GISCUS`.

---

## Modifiche a file esistenti

- **`src/components/Navbar.astro`**
  - Aggiungere la voce **"Blog"** (link a `/blog` o `/en/blog` secondo la lingua) nella nav desktop e nel menu mobile.
  - Rendere i link di sezione **assoluti rispetto alla home** (`/#about`, `/#experience`, …) usando `localizePath`, così funzionano anche dalle pagine del blog (oggi sono `#about`, validi solo in homepage).
- **`src/components/LanguageSwitcher.astro`**
  - Accettare una prop opzionale `altPath`. Sulle pagine articolo viene passato l'URL della **traduzione corrispondente** (lookup per `translationKey`); se manca la traduzione, fallback alla lista blog nell'altra lingua. Sulle altre pagine mantiene il comportamento attuale (`/` ↔ `/en/`).
- **`src/layouts/BaseLayout.astro`**
  - Aggiungere prop opzionale **`ogImage`** per sovrascrivere l'immagine OG di default con la **cover dell'articolo** (oggi è fissa su `/og-image.png`).
  - Aggiungere i `<link rel="alternate" type="application/rss+xml">` (IT/EN) nell'head.
  - (Opzionale) prop `ogType` per impostare `article` sui post.
- **`src/i18n/ui.ts`**
  - Nuova sezione `blog` con tutte le stringhe IT/EN: titolo/descrizione blog, "min di lettura", "Tag", "Tutti gli articoli", "← Torna al blog", "Pubblicato il", "Aggiornato il", "Nessun articolo", "Commenti", testo placeholder commenti, voce nav "Blog".
- **`astro.config.mjs`** — aggiungere `mdx()` alle integrazioni.
- **`src/styles/global.css`** — plugin typography + tema `prose`.

---

## Fasi di sviluppo (isolate e verificabili)

### Fase B0 — Setup infrastruttura
Installare dipendenze, aggiungere `mdx()`, `@plugin typography`, definire `src/content.config.ts` (schema + collection), util `readingTime`. Creare **2 articoli di esempio** accoppiati (IT+EN, stesso `translationKey`) con cover, per avere dati con cui lavorare.
**Verifica**: `astro build` ok, le entry della collection sono leggibili.

### Fase B1 — Lista blog + card
`PostCard.astro`, `BlogList.astro`, pagine `/blog` e `/en/blog`. Ordine per data, esclusione draft, stato vuoto.
**Verifica**: `/blog` e `/en/blog` mostrano gli articoli con cover, data, tempo di lettura, tag.

### Fase B2 — Pagina articolo
`BlogPostLayout.astro`, `PostMeta.astro`, rotte `[...slug]`, stile `prose`, OG per-post, `<time>` semantico, "torna al blog".
**Verifica**: un articolo si apre, è leggibile e ben formattato in entrambe le lingue.

### Fase B3 — Tag + RSS
Archivi tag (`/blog/tag/[tag]`, EN), `TagList`/`TagPill`, feed `/rss.xml` e `/en/rss.xml`, link RSS nell'head.
**Verifica**: gli archivi tag filtrano correttamente; i feed validano.

### Fase B4 — Navigazione + switch lingua bilingue
Aggiornare `Navbar` (voce Blog + anchor assoluti) e `LanguageSwitcher` (switch alla traduzione del post).
**Verifica**: dalla pagina blog la nav riporta alle sezioni home; lo switch IT↔EN su un articolo apre la traduzione.

### Fase B5 — Commenti Giscus
`Comments.astro` + `GISCUS` in config + placeholder se non configurato. Tema scuro e lingua dinamica.
**Verifica**: con valori reali, i commenti caricano e si integrano col tema; senza valori, compare il placeholder.

### Fase B6 — Polish & QA
Reveal on-scroll (`data-reveal`) sulle card, responsive (mobile/desktop), accessibilità (landmark `article`, alt cover, focus), coerenza visiva col resto del sito.
**Verifica**: build di produzione pulita + ispezione visiva multi-viewport.

---

## Verifica end-to-end
- `npm run dev` e ispezione di `/blog`, `/en/blog`, un articolo e un archivio tag (mobile 375px + desktop 1280px).
- Switch lingua su un articolo → apre la traduzione corretta.
- Tempo di lettura e tag corretti in lista e nel post.
- Feed RSS raggiungibili e validi (`/rss.xml`, `/en/rss.xml`).
- Giscus: con `GISCUS` configurato i commenti compaiono col tema scuro e la lingua giusta; senza, placeholder.
- `astro build` senza errori (ricorda: non lanciare build mentre `npm run dev` è attivo → cache Vite).

## Note / decisioni aperte
- **Voce nav "Blog"**: confermare se mostrarla sempre o solo dopo aver pubblicato il primo articolo.
- **Categoria Giscus**: consiglio una categoria dedicata "Comments" di tipo *Announcement* (solo il maintainer apre thread).
- **Moderazione**: con Giscus la moderazione avviene su GitHub Discussions (blocco/eliminazione commenti dal repo).
