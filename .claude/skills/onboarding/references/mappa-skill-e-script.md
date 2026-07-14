# Mappa di skill e script

Orientamento rapido: quale strumento per quale bisogno. L'onboarding **instrada**, non reimplementa.

## Skill del progetto (in `.claude/skills/`)

| Skill | A cosa serve | Quando instradare |
|---|---|---|
| **onboarding** | Questa: contesto del progetto + routing per un collaboratore nuovo | "sono nuovo", "da dove inizio", "come funziona" |
| **add-author** | Scaffolding profilo autore bilingue IT+EN, con auto-traduzione e validazione | "aggiungi un autore", "voglio la mia pagina autore" |
| **refine-article** | Rifinire tono/stile di una bozza e pubblicarla in IT+EN con frontmatter e metadati | "rifinisci questo pezzo", "sistema il tono", "pubblica l'articolo" |
| **brand** | Voce, identità visiva, messaging, coerenza e asset di brand | dubbi su tono di voce, coerenza brand, revisione asset |
| **design** | Hub design: logo, CIP, banner, slide, social photos, icone (varie piattaforme) | grafica social elaborata oltre agli script cover/carousel |
| **slides** | Presentazioni HTML strategiche (Chart.js, layout, copywriting) | deck/presentazioni, slide non-carousel |
| **design-system** | Design token (primitive/semantic), integrazione Tailwind | lavoro sui token del sito |
| **ui-styling** | shadcn/ui + Tailwind, componenti e theming | sviluppo UI del sito |
| **banner-design** | Banner multi-formato per social/ads/web/print | banner e cover di canale |
| **ui-ux-pro-max** | Knowledge base UI/UX (colori, tipografia, pattern, motion) | riferimento in fase di design/UI |

> Nota di routing: `design` include già sotto di sé slides, banner, brand ecc. Per gli asset standard
> di un articolo, però, parti sempre dagli **script** dedicati (cover, carousel, OG): sono
> deterministici e allineati al brand. Le skill di design sono per il "fuori standard".

## Script versionati (in `scripts/`, vedi `scripts/README.md`)

| Script | Output | Comando |
|---|---|---|
| `generate-cover.mjs` | Cover articolo 1600x836, stile brand | `node scripts/generate-cover.mjs src/content/blog/<lang>/<slug>.md` |
| `generate-carousel.mjs` | Carousel LinkedIn 1080x1350 (slide PNG + PDF) da spec | `node scripts/generate-carousel.mjs <articolo.md> [--spec f.json] [--out dir]` |
| `generate-og.mjs` | `public/og-image.png` 1200x630 (OG di default del sito) | `node scripts/generate-og.mjs` |
| `generate-feedback-pdf.py` | PDF "bozza per revisione" per il gruppo di feedback | `python3 scripts/generate-feedback-pdf.py <articolo.md> [out.pdf]` |

## Documenti chiave del repo

| File | Contenuto |
|---|---|
| `README.md` | Stack, comandi, personalizzazione contenuti, deploy |
| `HANDOFF.md` | Stato vivo della pipeline + il metodo di co-scrittura adottato |
| `docs/editorial-guidelines.md` | Regole editoriali e di stile (fonte canonica) |
| `docs/content-roadmap.md` | Roadmap editoriale, filtro, ordine di pubblicazione, track collaboratori |
| `src/content.config.ts` | Schema dei contenuti (blog + authors), regole di validazione |
| `scripts/README.md` | Documentazione degli script di pubblicazione |

## Regola d'oro

Se esiste una skill o uno script per un compito, **usalo** invece di rifarlo a mano: sono la fonte di
verità, restano manutenuti, e garantiscono coerenza. L'onboarding aggiunge il *contesto* e i
*collegamenti*, non una seconda implementazione.
