# Mappa di skill e script

Orientamento rapido: quale strumento per quale bisogno. L'onboarding **instrada**, non reimplementa.

## Skill del progetto (in `.claude/skills/`)

| Skill | A cosa serve | Quando instradare |
|---|---|---|
| **onboarding** | Questa: contesto del progetto + routing per un collaboratore nuovo | "sono nuovo", "da dove inizio", "come funziona" |
| **add-author** | Scaffolding profilo autore bilingue IT+EN, con auto-traduzione, validazione e file persona | "aggiungi un autore", "voglio la mia pagina autore" |
| **write-article** | Metodo di co-scrittura: dal materiale reale alla bozza completa, filtro editoriale come gate | "ho un'idea per un articolo", "scriviamo il prossimo pezzo" |
| **refine-article** | Rifinire tono/stile di una bozza, tradurla e salvarla in IT+EN con frontmatter, preflight e cover | "rifinisci questo pezzo", "sistema il tono" |
| **publish-article** | Runbook del giorno di pubblicazione: preflight, draft off, build, roadmap, PR, post LinkedIn | "pubblica l'articolo", "esce il pezzo oggi" |
| **podcast-repurpose** | Dall'articolo al kit episodio podcast (scaletta parlata, YouTube, Spotify) per pubblico non tech | "prepariamo la puntata", "show notes" |
| **design** | Design "fuori standard" (banner di canale, esperimenti); deve rispettare `docs/brand.md` | grafica oltre gli script cover/carousel/OG |

## Skill di processo

| Skill | A cosa serve | Quando instradare |
|---|---|---|
| **roadmap-next** | Prende il prossimo punto aperto da `TECH-IMPROVEMENTS.md` o `NEW-IDEAS.md`, valuta i trigger, implementa e aggiorna il backlog | "cosa c'è da fare adesso", "prossimo punto della roadmap" |
| **site-audit** | Controllo periodico del sito su checklist stabile (a11y, SEO, performance, leggibilità, brand, entry point); report datato in `docs/audits/`. **Sola lettura** | "audit del sito", "come sta messo", "cosa è peggiorato" |
| **ship** | La coda git: branch, staging esplicito, commit in italiano, PR, CI, merge, riallineamento di `main`. Fonte di verità della coda git | "chiudi", "fai la PR", "shippa" |

> Le tre si passano il lavoro in catena: `site-audit` trova e non tocca, `roadmap-next` sceglie e
> implementa, `ship` chiude. Nessuna delle tre fa il mestiere delle altre.

> Nota di routing: per gli asset standard di un articolo parti sempre dagli **script** dedicati
> (cover, carousel, OG): sono deterministici e allineati al brand. La skill `design` è per il
> "fuori standard", e la fonte di verità del brand è `docs/brand.md`.

## Script versionati (in `scripts/`, vedi `scripts/README.md`)

| Script | Output | Comando |
|---|---|---|
| `generate-cover.mjs` | Cover articolo 1600x836, stile brand | `node scripts/generate-cover.mjs src/content/blog/<lang>/<slug>.md` |
| `generate-carousel.mjs` | Carousel LinkedIn 1080x1350 (slide PNG + PDF) da spec | `node scripts/generate-carousel.mjs <articolo.md> [--spec f.json] [--out dir]` |
| `generate-og.mjs` | `public/og-image.png` 1200x630 (OG di default del sito) | `node scripts/generate-og.mjs` |
| `generate-feedback-pdf.py` | PDF "bozza per revisione" per il gruppo di feedback | `python3 scripts/generate-feedback-pdf.py <articolo.md> [out.pdf]` |
| `preflight-article.mjs` | Controllo editoriale/strutturale di una coppia IT+EN (bloccante se errori) | `node scripts/preflight-article.mjs <articolo.md>` \| `--all` |
| `status.mjs` | Stato pipeline: coppie, draft, asset, coerenza roadmap/blog (sola lettura) | `node scripts/status.mjs` |

## Documenti chiave del repo

| File | Contenuto |
|---|---|
| `README.md` | Stack, comandi, personalizzazione contenuti, deploy |
| `HANDOFF.md` | Stato vivo della pipeline + il metodo di co-scrittura adottato |
| `docs/editorial-guidelines.md` | Regole editoriali e di stile (fonte canonica) |
| `docs/brand.md` | Brand: pilastri, voce, palette, motivi visivi, formati (fonte canonica) |
| `docs/content-roadmap.md` | Roadmap editoriale, filtro, ordine di pubblicazione, track collaboratori |
| `docs/audits/` | Storico degli audit del sito, con il formato del report (`README.md`) |
| `src/content.config.ts` | Schema dei contenuti (blog + authors), regole di validazione |
| `scripts/README.md` | Documentazione degli script di pubblicazione |

## Regola d'oro

Se esiste una skill o uno script per un compito, **usalo** invece di rifarlo a mano: sono la fonte di
verità, restano manutenuti, e garantiscono coerenza. L'onboarding aggiunge il *contesto* e i
*collegamenti*, non una seconda implementazione.
