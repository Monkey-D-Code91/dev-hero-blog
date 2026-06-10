# Roadmap "Visibilità autori" — piano di implementazione

> **Scopo di questo file.** È un piano operativo *autosufficiente* per implementare le
> feature rimanenti che danno visibilità e valore a ogni autore del blog **First Draft**.
> È pensato per essere aperto in una **nuova chat (Sonnet)**: leggi prima la sezione
> "Primer architettura" e "Convenzioni", poi prendi **una task alla volta** (una task =
> una chat = un commit). Non serve il contesto di altre conversazioni.

---

## Stato (cosa è GIÀ fatto — non rifare)

- **Tier 1 #1 — Card "About the author"** a fine articolo → `src/components/blog/AuthorCard.astro`, inserita in `BlogPostLayout.astro`.
- **Tier 1 #2 — JSON-LD** `BlogPosting`/`Person` → `src/utils/structuredData.ts`, prop `jsonLd` in `BaseLayout.astro`, usato nelle pagine post e in `AuthorLayout.astro`.
- **Tier 1 #3 — OG image per-post** generate a build-time → `src/utils/og.ts` (satori + resvg), endpoint `src/pages/og/[...route].png.ts`, font in `src/assets/og-fonts/`. Usa il logo `public/logos/fd-3-nib.svg` rasterizzato.
- **Tier 2 #4 — Co-autori** → schema `authors: string[]` (con legacy `author` normalizzato via transform Zod), helper `processPosts`/`findAuthors`/`formatAuthorList`, byline/card/JSON-LD/OG/RSS/Keystatic tutti multi-autore.
- **Tier 2 #5 — Related posts** → `src/utils/blog.ts` (`getRelatedPosts`), `src/components/blog/RelatedPosts.astro`, integrato in `BlogPostLayout.astro` e nelle pagine post IT/EN. Score per tag + autori comuni; fallback ai più recenti.
- **Tier 2 #6 — Avatar byline + share buttons** → `PostAuthor` esteso con `monogram/avatar/avatarAlt`; `processPosts` risolve i dati completi autore; `PostMeta.astro` e `PostCard.astro` mostrano avatar/monogramma 24px (20px nelle card); `src/components/blog/ShareButtons.astro` (LinkedIn, X, copia link con feedback 2s); `BlogPostLayout.astro` accetta `url` e renderizza `ShareButtons`.

**Rimanenti** (oggetto di questo piano): **#7, #8, #9** (Tier 3).

---

## Primer architettura (leggere prima di toccare codice)

- **Stack**: Astro 5 **statico (SSG)**, nessun adapter. React solo per isole (es. MobileMenu). Tailwind v4. Output `dist/`.
- **Bilingue** IT/EN: `defaultLocale: 'it'`, `prefixDefaultLocale: false` (IT senza prefisso, EN sotto `/en/`). Config in `astro.config.mjs`, `site: 'https://thefirstdraft.dev'`.
- **Content collections** (`src/content.config.ts`):
  - `blog`: cartelle `src/content/blog/{it,en}/*.md`. Campi chiave: `title, description, pubDate, updatedDate?, translationKey, tags[], cover?, coverAlt?, draft, authors[]`.
    - `translationKey` lega la versione IT ed EN dello stesso articolo.
    - `authors` è un array di `authorKey`. Accetta anche legacy `author: "x"` (un transform normalizza sempre a `authors`).
  - `authors`: cartelle `src/content/authors/{it,en}/*.md`. Campi: `authorKey, name, role, badge, headline, subline, avatar?, avatarAlt?, monogram, links{linkedin?,github?,website?}, stats{years,teamSize?,countries?}, aboutLead, experience[], skills[]`. La bio lunga è nel **body markdown**.
    - `authorKey` lega la versione IT ed EN dello stesso autore; coincide col nome file.
- **Utils principali** (`src/utils/blog.ts`) — riusare SEMPRE questi, non riscrivere query:
  - `getLangFromEntryId(id)`, `getSlugFromEntryId(id)` — l'id entry è tipo `"it/slug"`.
  - `getBlogPostUrl(lang, slug)` → `/blog/slug/` o `/en/blog/slug/`.
  - `getAuthorUrl(authorKey, lang)` → `/autori/key/` o `/en/authors/key/`.
  - `getPublishedPosts(lang)` — post pubblicati (draft esclusi in PROD), ordinati per data desc.
  - `getAlternatePost(translationKey, targetLang)` — versione nell'altra lingua.
  - `buildAuthorNameMap(lang)` → `Map<authorKey,name>`.
  - `findAuthor(authorKey, lang)` / `findAuthors(keys, lang)` — entry complete (per link/ruolo).
  - `processPosts(entries, lang)` → `ProcessedPost[]` (titolo, slug, readingTime, cover, `authors: {key,name}[]`). **Da usare per ogni lista di card.**
  - `formatAuthorList(names, lang)` → "A", "A e B", "A, B e C" (it) / "... and ..." (en).
  - `ProcessedPost` e `PostAuthor` sono i tipi condivisi tra le card.
- **Altri util**: `src/utils/structuredData.ts` (JSON-LD), `src/utils/og.ts` (OG image), `src/utils/readingTime.ts`.
- **i18n** (`src/i18n/ui.ts`): dizionari `ui.it` / `ui.en` con la STESSA struttura. Nei componenti: `const t = useTranslations(lang)` (da `src/i18n/utils.ts`), poi `t.blog.<chiave>`. **Ogni testo nuovo va aggiunto in entrambe le lingue.**
- **Layout**: `BaseLayout.astro` (head: title/description/canonical/hreflang/OG/Twitter/JSON-LD/RSS autodiscovery; prop `ogImage`, `ogType`, `jsonLd`, `path`, `hreflangIt/En`). `AuthorLayout.astro` (pagina profilo). `BlogPostLayout.astro` (corpo articolo: header+PostMeta, cover, contenuto, **AuthorCard**, **Comments**).
- **Componenti blog** (`src/components/blog/`): `BlogList`, `PostCard`, `PostMeta`, `AuthorCard`, `AuthorPosts`, `TagPill`, `Comments` (Giscus, già configurato).
- **Pagine**: `src/pages/{blog,en/blog}/{index,[slug]}.astro`, `.../tag/[tag].astro`, `src/pages/{index,en/index}.astro`, `src/pages/{autori/[slug],en/authors/[slug]}.astro`, `rss.xml.ts` + `en/rss.xml.ts`, `og/[...route].png.ts`.
- **Keystatic**: `keystatic.config.ts` alla root è **inerte** (non agganciato ad Astro) ma va tenuto allineato allo schema Zod quando si aggiungono campi al frontmatter.

### Design tokens (Tailwind v4, `src/styles/global.css`)
`--color-bg:#0b1120` · `--color-surface:#0f172a` · `--color-surface-2:#111827` · `--color-border:#1e293b` · `--color-text:#e6edf3` · `--color-muted:#94a3b8` · `--color-accent:#38bdf8` · `--color-accent-2:#2dd4bf`.
Utility generate: `bg-bg`, `bg-surface-2`, `border-border`, `text-text`, `text-muted`, `text-accent`, ecc.
Pattern ricorrenti: box = `rounded-2xl border border-border bg-surface-2 p-6`; eyebrow di sezione = `text-sm font-semibold uppercase tracking-widest text-accent`; icone = **SVG inline** (niente librerie di icone nei componenti). Reveal on-scroll via attributo `data-reveal` (+ `data-reveal-delay`).

---

## Convenzioni e guardrail (valide per ogni task)

1. **Parità bilingue**: ogni modifica visibile va replicata IT **ed** EN (componenti condivisi prendono `lang`; testi in `ui.ts` in entrambe le lingue).
2. **Riusa gli helper** di `blog.ts` (soprattutto `processPosts`); non duplicare le query/mappature.
3. **Verifica obbligatoria**: `npx astro build` deve completare **senza errori** (34+ pagine). Per le modifiche visibili, avviare il preview e fare screenshot (vedi sotto). Per JSON-LD/RSS/OG, ispezionare l'output in `dist/`.
4. **Non rompere i co-autori**: i post hanno `authors: string[]`. Tutto ciò che mostra l'autore deve gestire N autori.
5. **Git**: lavorare su `main`. Commit con corpo descrittivo che termina con
   `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.
   L'identità git è già configurata (`Monkey-D-Code91` / `marco.mariotti09@gmail.com`).
   `dist/` è gitignored. Una task = un commit; pushare su `main` solo se l'utente lo chiede.
6. **Una task per chat**: per non saturare il contesto, implementa una sola voce per conversazione. All'inizio della chat: leggi questo file + i file elencati nella task.

### Come verificare nel preview (tool `preview_*`)
- `preview_start` con il config `astro-dev` (porta 4321) — c'è già `.claude/launch.json`.
- Naviga via `preview_eval` con `window.location.href = '...'`.
- `preview_console_logs` (level `error`), `preview_screenshot`, `preview_inspect`, `preview_resize` (mobile/desktop).
- Per contenuti generati (OG/JSON-LD/RSS) è più affidabile fare `npx astro build` e leggere i file in `dist/`.

---

## TASK #6 — Avatar nella byline + bottoni di condivisione (Tier 2)

Due sotto-feature; possono stare nello stesso commit.

**File da leggere prima**: `src/utils/blog.ts` (tipi `PostAuthor`/`ProcessedPost`, `processPosts`, `findAuthors`), `src/components/blog/PostMeta.astro`, `src/components/blog/PostCard.astro`, `src/components/blog/BlogPostLayout.astro`, `src/pages/blog/[slug].astro`, `src/components/Hero.astro` (per lo stile monogramma/avatar), `src/i18n/ui.ts`.

### 6a — Avatar/monogramma nella byline
1. Estendi `PostAuthor` in `blog.ts`: aggiungi `monogram: string` e `avatar?: ImageMetadata` (+ `avatarAlt?`).
2. Aggiorna `processPosts` per risolvere anche `monogram`/`avatar`: invece della sola `buildAuthorNameMap`, carica le entry complete (riusa `getCollection("authors", ...)` filtrando per lingua, costruisci una `Map<authorKey, {name,monogram,avatar,avatarAlt}>`). Mantieni la firma di `processPosts(entries, lang)`.
3. Anche le pagine post (`[slug].astro` it/en) costruiscono l'array `authors` per `BlogPostLayout`: arricchiscilo con monogram/avatar (puoi riusare `findAuthors`).
4. In `PostMeta.astro` (byline articolo): prima di ogni nome mostra un piccolo avatar **24px** (Astro `<Image>` se `avatar`, altrimenti box monogramma in stile `Hero.astro`: `rounded-full border border-border text-accent`). Mantieni i link e la congiunzione "e"/"and" già presenti.
5. (Opzionale) Stesso trattamento, più piccolo, in `PostCard.astro`.

> Nota: `ImageMetadata` passa correttamente attraverso le props di `getStaticPaths` (già fatto per `cover`).

### 6b — Bottoni di condivisione
1. Nuovo `src/components/blog/ShareButtons.astro`:
   - props: `url: string` (assoluto), `title: string`, `lang: Lang`;
   - bottoni: **LinkedIn** (`https://www.linkedin.com/sharing/share-offsite/?url=<enc(url)>`), **X** (`https://twitter.com/intent/tweet?text=<enc(title)>&url=<enc(url)>`), **Copia link** (bottone con `<script is:inline>` minimale che fa `navigator.clipboard.writeText` e cambia label per ~2s);
   - stile coerente con le icone social di `AuthorCard.astro` (box `h-9 w-9 rounded-lg border border-border ... hover:border-accent`), SVG inline.
2. In `[slug].astro` it/en passa `url = new URL(\`/blog/${slug}/\`, Astro.site).toString()` (e variante `/en/blog/`) e `title = post.data.title` a `BlogPostLayout`, che renderizza `<ShareButtons />` (suggerito: subito sotto il contenuto, sopra i related, oppure accanto alla AuthorCard).
3. i18n (`ui.ts`): `blog.shareHeading` = `"Condividi"` / `"Share"`, `blog.shareCopy` = `"Copia link"` / `"Copy link"`, `blog.shareCopied` = `"Copiato!"` / `"Copied!"`.

**Accettazione**: byline mostra avatar/monogramma per ogni autore (IT/EN, single e multi); bottoni share aprono i target corretti e "copia link" funziona; `astro build` ok; screenshot.

---

## TASK #7 — Campo `canonicalUrl` per il cross-posting (Tier 3)

**Obiettivo.** Permettere che un articolo pubblicato originariamente altrove (Medium/dev.to/blog personale dell'autore) dichiari il canonical esterno, consolidando il valore SEO sulla fonte originale. (Per il caso inverso — ripubblicare un pezzo di First Draft altrove — il `rel=canonical` va messo sull'altra piattaforma verso l'URL FD: nessuna modifica qui.)

**File da leggere prima**: `src/content.config.ts`, `src/layouts/BaseLayout.astro`, `src/pages/blog/[slug].astro` + en, `keystatic.config.ts`, `.claude/skills/refine-article/SKILL.md`.

**Approccio**
1. Schema `blog` (`content.config.ts`): aggiungi `canonicalUrl: z.string().url().optional()` (dentro l'`z.object`, prima del `.transform`).
2. `BaseLayout.astro`: aggiungi prop opzionale `canonicalUrl?: string`. Se presente, usalo per `<link rel="canonical">` **e** `og:url` al posto di `canonical` calcolato da `path`. (Lascia invariati hreflang.)
3. `[slug].astro` it/en: passa `canonicalUrl={post.data.canonicalUrl}` a `BaseLayout`. Valuta se nel JSON-LD (`structuredData.ts`, campo `mainEntityOfPage`/`url`) riflettere il canonical esterno quando presente (consigliato: sì, passa l'URL canonico effettivo).
4. `keystatic.config.ts`: aggiungi `canonicalUrl: fields.url({ label: "Canonical URL (se pubblicato prima altrove)" })` alla collection blog.
5. `refine-article/SKILL.md`: aggiungi il campo opzionale al template frontmatter con una riga di spiegazione.

**Accettazione**: senza il campo, comportamento invariato; con `canonicalUrl` impostato, `dist/.../index.html` mostra `<link rel="canonical">` e `og:url` verso l'URL esterno. `astro build` ok.

---

## TASK #8 — RSS per-autore (Tier 3)

**Obiettivo.** Feed RSS per singolo autore: `/autori/<key>/rss.xml` e `/en/authors/<key>/rss.xml`, così si può seguire la singola persona.

**File da leggere prima**: `src/pages/rss.xml.ts` e `src/pages/en/rss.xml.ts` (template di riferimento), `src/utils/blog.ts`, `src/layouts/BaseLayout.astro`, `src/layouts/AuthorLayout.astro`, `src/pages/autori/[slug].astro` + en.

**Approccio**
1. Nuovo `src/pages/autori/[slug]/rss.xml.ts` (IT):
   - `getStaticPaths` su `getCollection("authors")` filtrando `it/`; `params: { slug: authorKey }`.
   - nel `GET`: `posts = (await getPublishedPosts("it")).filter(p => p.data.authors.includes(slug))`; costruisci il feed con `@astrojs/rss` come in `rss.xml.ts` (title `"${BLOG.name} — <Nome autore>"`, `dc:creator` per autore, `<language>it-IT</language>`).
   - NB: convivono `src/pages/autori/[slug].astro` (pagina) e `src/pages/autori/[slug]/rss.xml.ts` (feed) — Astro li gestisce come route distinte.
2. Idem `src/pages/en/authors/[slug]/rss.xml.ts` (filtra `en/`, `en-GB`).
3. **Autodiscovery**: in `BaseLayout.astro` aggiungi una prop opzionale (es. `extraFeeds?: {title,href}[]`) e renderizza i relativi `<link rel="alternate" type="application/rss+xml">` oltre ai due globali. `AuthorLayout.astro` passa il feed dell'autore corrente (`/autori/<key>/rss.xml` o `/en/authors/<key>/rss.xml`).
4. (Opzionale) Mostra un piccolo link/icona "RSS" nella pagina profilo.

**Accettazione**: `dist/autori/<key>/rss.xml` e versione EN esistono e contengono solo i post di quell'autore; `astro build` ok; la pagina profilo espone l'autodiscovery del feed.

---

## TASK #9 — Statistiche di contributo sul profilo (+ verifica showcase home) (Tier 3)

**Obiettivo.** Dare a ogni autore un senso del proprio contributo e renderlo evidente: numero di articoli (ed eventualmente temi/tag ricorrenti) sulla pagina profilo. La "strip contributors" in homepage **esiste già** (`src/components/landing/AuthorsShowcase.astro`, usata in `index.astro`/`en/index.astro`): verificarla/eventualmente arricchirla, ma il focus della task è il profilo.

**File da leggere prima**: `src/pages/autori/[slug].astro` + en, `src/layouts/AuthorLayout.astro`, `src/components/About.astro` (dove vivono le `stats`), `src/components/blog/AuthorPosts.astro`, `src/utils/blog.ts`, `src/i18n/ui.ts`, `src/components/landing/AuthorsShowcase.astro`.

**Approccio**
1. Nelle pagine profilo (`autori/[slug].astro` + en) calcola il numero di articoli dell'autore:
   `const count = (await getPublishedPosts(lang)).filter(p => p.data.authors.includes(authorKey)).length;`
   (eventualmente anche i tag distinti più frequenti).
2. Passa il dato lungo la catena `AuthorLayout` → `About`/`Hero` (o un piccolo componente nuovo) e mostralo accanto alle `stats` esistenti (anni, team, paesi). Mantieni lo stile delle stat attuali.
3. i18n (`ui.ts`): aggiungi l'etichetta, es. `about.stats.articles` = `"Articoli pubblicati"` / `"Published articles"`.
4. (Opzionale) In `AuthorsShowcase` mostra il conteggio articoli per autore.

**Accettazione**: la pagina profilo mostra il numero di articoli dell'autore (IT/EN), coerente con quanti ne ha davvero; `astro build` ok; screenshot.

---

## Ordine consigliato

1. **#6 Avatar byline + share** (tocca i tipi `PostAuthor`/`processPosts`: farlo prima di altre task che leggono gli autori riduce i conflitti).
2. **#8 RSS per-autore** (isolato).
3. **#7 canonicalUrl** (piccolo, isolato).
4. **#9 Stats profilo** (isolato).

Ogni task è indipendente; #6 è l'unica che cambia un tipo condiviso (`PostAuthor`), quindi conviene non averla "in volo" insieme ad altre che toccano la byline.
