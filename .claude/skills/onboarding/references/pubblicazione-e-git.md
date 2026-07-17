# Pubblicazione, build e git

Come un articolo passa da bozza a live. Riferimenti: `README.md` (comandi) e `HANDOFF.md` (flusso reale).

## Comandi del progetto

| Comando | Azione |
|---|---|
| `npm install` | Installa le dipendenze |
| `npm run dev` | Dev server su `localhost:4321` |
| `npm run build` | Genera il sito statico in `dist/` |
| `npm run preview` | Anteprima della build di produzione |

Non lanciare `npm run build` mentre `npm run dev` è attivo (corrompe la cache di Vite). Se capita:
ferma il dev server, `rm -rf node_modules/.vite .astro`, riavvia.

## Il ciclo dei draft

- Un articolo con `draft: true` nel frontmatter è **escluso dalla build di produzione** (schema in
  `src/content.config.ts`). È così che un pezzo sta "pronto ma non pubblicato".
- **Pubblicare** = togliere `draft: true` **su entrambe** le versioni (IT ed EN), poi `npm run build`.
- Le date (`pubDate`) e l'ordine seguono `docs/content-roadmap.md`; lo stato vivo sta in `HANDOFF.md`.

## Flusso di pubblicazione tipico

Il giorno di uscita, il flusso completo è codificato nella skill **`publish-article`**: usala
invece di andare a memoria. In sintesi:

1. Articolo IT+EN pronti (di norma via skill `refine-article`), con stesso `translationKey`.
2. **Preflight**: `node scripts/preflight-article.mjs src/content/blog/it/<slug>.md`
   (controlla anche il gemello EN; zero errori è vincolante).
3. Cover generate (`generate-cover.mjs`) e collegate nel frontmatter (`cover` + `coverAlt`).
4. Se serve il giro di feedback: PDF con `generate-feedback-pdf.py`.
5. Togli `draft: true` su IT ed EN.
6. `npm run build` **in locale** per validare (nel sandbox può non girare: vedi nota ambiente).
7. Aggiorna la roadmap: collection `src/content/roadmap/{it,en}` (tappa → `postTranslationKey`
   + `status: published`) e `docs/content-roadmap.md`. Verifica con `node scripts/status.mjs`.
8. Commit + PR su GitHub.
9. Condivisione su LinkedIn: carousel (`generate-carousel.mjs`) e/o post con **link nel primo
   commento**. Un gancio forte aiuta (es. per il pezzo sulla code review: "quindici minuti di lavoro,
   quattro ore di review").
10. Aggiorna `HANDOFF.md` se lo stato della pipeline è cambiato.

## Git — convenzioni

- Commit chiari e piccoli, in stile conventional commit. Esempi visti nel repo:
  `feat(authors): add <nome> profile`, `feat(blog): ...`.
- Contenuti sensibili: **prima l'ok del Product Owner**, poi il commit. Una volta nella storia git,
  un dato del datore non anonimizzato è difficile da togliere: meglio non farcelo entrare.
- File privati non versionati (es. `personas/`) restano fuori dal repo (`.gitignore`): non forzarli
  dentro.

## Deploy

Il sito è 100% statico: `dist/` va su qualsiasi hosting statico (Vercel/Netlify consigliati,
framework rilevato in automatico). Prima del deploy, il dominio va aggiornato in `astro.config.mjs`
(`site: '...'`) per canonical, `hreflang` e sitemap. Come collaboratore di norma **non tocchi il
deploy**: il tuo confine è arrivare a una PR pulita e validata.
