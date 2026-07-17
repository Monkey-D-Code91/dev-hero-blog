# The First Draft

Blog bilingue (IT/EN) su **tech · human · AI** e la loro contraddizione apparente: idee grezze
ancorate a esperienza reale, scritte, discusse e affinate. Il manifesto è il primo articolo,
["Elogio dell'idea grezza"](https://thefirstdraft.dev/blog/elogio-dell-idea-grezza/).

Ogni pezzo deve superare il filtro editoriale: **esperienza reale · tesi · anti-listicle**
(regole complete in `docs/editorial-guidelines.md`). Al blog si affiancherà il podcast
**The Human Constant**, stessi principi per un pubblico curioso anche non tecnico.

## Stack

- [Astro 5](https://astro.build): output 100% statico, content collections, i18n nativo (IT su `/`, EN su `/en/`)
- [Tailwind CSS v4](https://tailwindcss.com): styling CSS-first, palette e tipografia in `src/styles/global.css`
- [React](https://react.dev): solo per le island interattive (menu mobile)
- Deploy su Cloudflare Workers (assets-only, `wrangler.jsonc`)

## Comandi

| Comando | Azione |
| --- | --- |
| `npm install` | Installa le dipendenze |
| `npm run dev` | Dev server su `localhost:4321` |
| `npm run build` | Build statica in `dist/` |
| `npm run preview` | Anteprima locale della build |
| `node scripts/preflight-article.mjs --all` | Controlli editoriali e strutturali su tutti gli articoli |
| `node scripts/status.mjs` | Stato della pipeline di pubblicazione (sola lettura) |
| `node scripts/generate-cover.mjs <articolo>` | Cover 1600x836 in stile brand |
| `python3 scripts/generate-feedback-pdf.py <articolo>` | PDF per il gruppo di feedback |

Dettagli sul tooling in `scripts/README.md`.

> Nota: evita `npm run build` mentre `npm run dev` è attivo (può corrompere la cache di Vite).
> In tal caso: ferma il dev server, `rm -rf node_modules/.vite .astro` e riavvia.

## Come sono organizzati i contenuti

Tutto è bilingue con il pattern **cartella per lingua + chiave condivisa**: ogni contenuto
esiste in due file (uno in `it/`, uno in `en/`) collegati da una chiave nel frontmatter.

| Collection | Percorso | Chiave IT/EN |
| --- | --- | --- |
| Articoli | `src/content/blog/{it,en}/` | `translationKey` |
| Autori | `src/content/authors/{it,en}/` | `authorKey` |
| Roadmap pubblica (per archi) | `src/content/roadmap/{it,en}/` | `arcKey` |

Gli schemi (Zod) sono in `src/content.config.ts`. Le cover stanno in `src/assets/covers/`,
gli articoli con `draft: true` sono esclusi dalla build di produzione.

## Documenti normativi

- `docs/brand.md`: fonte di verità del brand (identità, voce, palette, tipografia)
- `docs/editorial-guidelines.md`: regole editoriali e privacy (mai nomi di persone, niente trattini lunghi, traduzione idiomatica)
- `docs/content-roadmap.md`: roadmap editoriale interna (la pagina `/roadmap` è la versione pubblica)

## Workflow editoriale

Il flusso di scrittura e pubblicazione è guidato dalle skill Claude Code del repo
(`.claude/skills/`): `onboarding` (punto di ingresso per chi è nuovo), `write-article`
(co-scrittura dalla prima idea), `refine-article` (rifinitura di tono e stile),
`add-author` (nuovo profilo autore IT+EN), `publish-article` (runbook del giorno di uscita),
`podcast-repurpose` (kit episodio).

## CI

Ogni PR esegue su GitHub Actions (`.github/workflows/ci.yml`): preflight editoriale su tutti
gli articoli, build Astro e stato pipeline. Una PR di contenuto non può rompere il sito.

## Deploy

Sito statico su Cloudflare Workers (worker `dev-hero-blog`, configurazione in
`wrangler.jsonc`). Il deploy è **automatico via Workers Builds**: ogni push su `main` va in
produzione, ogni PR genera una build di anteprima (visibile nei check della PR). Il deploy
manuale (`npm run build` + `npx wrangler deploy`) resta solo come fallback.

Le build di anteprima (branch diversi da `main`) **includono anche le bozze**
(`draft: true`), con `noindex` e un banner dedicato: è il canale di revisione per il
gruppo di feedback. In locale: `PREVIEW_DRAFTS=1 npm run build`. Logica in
`src/utils/preview.ts`.

Il dominio canonico è `https://thefirstdraft.dev` (impostato in `astro.config.mjs`:
canonical, `hreflang`, sitemap, OG).

## Analytics

Cloudflare Web Analytics (privacy-first, no cookie, nessun banner). Il beacon è emesso solo
sul deploy di produzione reale (non in dev né nelle anteprime). Per attivarlo: creare il sito
su Cloudflare Web Analytics e incollare il token in `CF_BEACON_TOKEN` (`src/config.ts`) oppure
impostarlo come variabile di build `CF_BEACON_TOKEN` su Workers Builds. Vuoto = spento.
