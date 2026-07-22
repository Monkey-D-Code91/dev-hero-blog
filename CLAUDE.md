# CLAUDE.md — The First Draft

Istruzioni operative per ogni sessione Claude Code su questo repo. Valgono per Marco e per i
collaboratori: quello che sta qui è vincolante, non un suggerimento.

**Cos'è il progetto:** blog bilingue IT/EN su **tech · human · AI**, sito Astro 5 statico
(`thefirstdraft.dev`), deploy su Cloudflare Workers. Podcast collegato: *The Human Constant*.
Lingua di lavoro delle sessioni: **italiano**.

---

## 1. Documenti normativi (leggili prima di agire)

| Se stai per... | Leggi prima |
|---|---|
| scrivere, tradurre o rifinire un testo | `docs/editorial-guidelines.md` |
| toccare colori, font, asset, logo | `docs/brand.md` |
| pianificare o riordinare le uscite | `docs/content-roadmap.md` |
| capire "dove eravamo rimasti" | `node scripts/status.mjs` (fatti) + `HANDOFF.md` se presente (decisioni) |
| entrare nel progetto da zero | skill `onboarding` |
| pianificare una feature nuova | `HOW-TO-PLAN.md` se presente, `NEW-IDEAS.md`, `TECH-IMPROVEMENTS.md` |

> **Attenzione:** `HANDOFF.md` è in `.gitignore` e `HOW-TO-PLAN.md` non è versionato, quindi
> esistono solo sulla macchina di Marco. Se non li trovi, non sono spariti: non li hai mai avuti.
> Ricostruisci lo stato con `node scripts/status.mjs` e con la roadmap.

`docs/brand.md` ed `docs/editorial-guidelines.md` sono **fonte di verità**: se il codice o uno
script diverge da lì, il bug è nel codice.

---

## 2. Workflow git — non negoziabile

- **Mai commit o push diretti su `main`.** Ogni modifica passa da un branch e da una PR.
  Non è una convenzione: la branch protection di GitHub **rifiuta** il push diretto, per tutti,
  admin inclusi (`enforce_admins: true`). Se un push su `main` viene respinto, non cercare un
  modo di aggirarlo: apri un branch.
- Naming branch: `feat/<slug>`, `fix/<slug>`, `chore/<slug>`, `docs/<slug>`, `perf/<slug>`.
- Commit in **conventional commit**, messaggio in **italiano**: `feat(newsletter): voce in navbar`.
- Ciclo standard:

  ```bash
  git switch -c feat/<slug>
  # ... modifiche ...
  git commit -m "feat(<scope>): <cosa cambia>"
  git push -u origin feat/<slug>
  gh pr create --fill                 # titolo + descrizione in italiano
  gh pr checks --watch                # aspetta la CI verde
  gh pr merge --squash --delete-branch
  git switch main && git pull
  ```

- **Merge:** la protezione richiede la PR e la CI verde, **zero approvazioni** (Marco è l'unico
  maintainer). Quindi `gh pr merge --squash --delete-branch` basta: **non usare `--admin`**
  (con `enforce_admins: true` non funzionerebbe comunque). Se il merge viene rifiutato le cause
  sono due: CI rossa, oppure branch non aggiornato rispetto a `main` (`strict: true`). Nel
  secondo caso: `git switch <branch> && git merge origin/main && git push`.
- Contenuti sensibili (dati del datore di lavoro): **prima l'ok del Product Owner, poi il commit**.
  Quello che entra nella storia git non si toglie più davvero.
- File privati (`personas/`, `feedback/` locali) restano fuori dal repo: non forzarli dentro.

---

## 3. Verifica prima del merge

- **Sempre**, prima della PR: `node scripts/preflight-article.mjs --all` e `npm run build`
  in locale (nel sandbox la build può non girare, vedi §7).
- **Modifiche UI**: verificale nel browser (`npm run dev`, poi Claude in Chrome) prima del merge.
  I bug arrivati in produzione finora erano tutti visivi e tutti trovati a occhio dopo il deploy.
- **Modifiche di codice non banali**: passa da `/code-review` prima di aprire la PR. Costa un
  messaggio, risparmia un fix post-deploy.
- La CI (`.github/workflows/ci.yml`) esegue: preflight su tutti gli articoli, `npm test` (vitest),
  `npx astro check`, `npm run build`, più `status.mjs` informativo.

---

## 4. Regole editoriali (sintesi vincolante)

- **Bilingue obbligatorio**: ogni articolo, autore e arco roadmap esiste in IT **e** EN, collegati
  dalla stessa chiave (`translationKey`, `authorKey`, `arcKey`). Mai pubblicare una lingua sola.
- **Gli slug sono diversi tra IT ed EN** (`imparare-a-guidare-non-a-correre` /
  `learning-to-steer-not-to-race`): a legarli è la chiave nel frontmatter, non il nome del file.
- Traduzione **idiomatica, non letterale**. In IT le ripetizioni ravvicinate si alleggeriscono,
  in EN no (ripetere il termine chiave dà coesione).
- **Niente trattini lunghi (—)** in nessun testo del brand: articoli IT/EN, newsletter, copy del
  sito, post social, testo negli asset. È una firma del testo generato: usa due punti, virgole,
  parentesi, punti. (Nei documenti interni come questo la regola non si applica.)
- **Niente nomi di persone**, tranne gli autori del blog. Per tutti gli altri: il ruolo
  ("un collega del team", "il Product Owner"). Dati del datore sempre anonimizzati.
- Prima persona, tono diretto. Filtro editoriale di ogni pezzo: **esperienza reale · tesi ·
  anti-listicle**, con lo sguardo tech/human/AI che emerge naturale.
- **Pubblicare** = togliere `draft: true` da IT **ed** EN, poi build. Un draft è escluso dalla
  build di produzione.
- Campi editoriali speciali (`revisions`, `discussion`, `openQuestions`, `respondsTo`,
  `feedbackReviewed`): rari e veri, mai riempitivi. Simmetria IT/EN verificata dal preflight.
  Regole in `docs/editorial-guidelines.md`.

---

## 5. Asset e brand

- **Logo ufficiale: `public/logos/fd-3-nib.svg`** (raster: `fd-3-nib.png`). Gli altri file in
  `public/logos/` sono alternative scartate: non usarli.
- Palette e tipografia: `docs/brand.md` e `src/styles/global.css` (Inter per tutto, Newsreader
  serif solo per titolo h1 e corpo dell'articolo).
- Gli asset standard **si generano con gli script, mai a mano**. Il fuori standard passa dalla
  skill `design`, che deve comunque rispettare `docs/brand.md`.

---

## 6. Comandi chiave

```bash
npm run dev                                     # dev server, localhost:4321
npm run build                                   # build statica in dist/
npm test                                        # vitest
npx astro check                                 # type check
node scripts/preflight-article.mjs --all        # controlli editoriali (bloccanti in CI)
node scripts/status.mjs                         # stato pipeline, sola lettura
node scripts/generate-cover.mjs <articolo.md>   # cover 1600x836
node scripts/generate-carousel.mjs <articolo.md># carousel LinkedIn 1080x1350 + PDF
node scripts/generate-og.mjs                    # OG di default del sito
node scripts/generate-logo-png.mjs fd-3-nib     # logo in PNG
python3 scripts/generate-feedback-pdf.py <art>  # PDF per il gruppo di feedback
```

Non lanciare `npm run build` mentre `npm run dev` è attivo (corrompe la cache di Vite). Se capita:
ferma il dev server, `rm -rf node_modules/.vite .astro`, riavvia.

---

## 7. Ambiente e configurazione

- Nel sandbox Linux `astro sync`/`build`, la generazione cover e il PDF **possono non girare**
  (`node_modules` compilati per macOS). Validare sempre in locale prima di pubblicare.
  Dettagli e workaround in `HANDOFF.md`.
- `src/config.ts` contiene brand, Giscus e `CF_BEACON_TOKEN` (Cloudflare Web Analytics). Il token
  **non è segreto** ma si imposta come **variabile `CF_BEACON_TOKEN` in Cloudflare Workers Builds**,
  non nel codice: la env ha la precedenza. Newsletter (Buttondown): username in `NEWSLETTER`;
  vuoto = newsletter spenta, il sito mostra la CTA RSS.
- Il dominio per canonical/hreflang/sitemap sta in `astro.config.mjs` (`site`).

---

## 8. Come lavorare in sessione

- **Una feature per sessione.** Tra un'idea e l'altra usa `/clear`: le sessioni lunghe finiscono
  in auto-compaction e da lì in poi Claude lavora su un riassunto, non sulla conversazione.
- **Il piano sta su file, non in chat.** Feature non banali: scrivi il piano in `docs/` o in un
  `.md` dedicato prima di implementare (vedi `HOW-TO-PLAN.md`), così sopravvive al cambio di
  sessione o di modello.
- **Chiedi prima di eseguire** quando la richiesta è ambigua: l'intervista iniziale ha sempre
  prodotto risultati migliori del one-shot. Ma se le informazioni ci sono, **procedi senza chiedere
  micro-conferme**: le conferme si riservano alle decisioni vere (prodotto, costi, contenuti
  pubblici, cosa esce e quando).
- **Non essere accondiscendente.** Problemi, errori e imprecisioni si segnalano subito, con
  alternative e pro/contro.
- A fine lavoro, se lo stato della pipeline è cambiato, **aggiorna `HANDOFF.md`** e la roadmap
  (`src/content/roadmap/{it,en}` + `docs/content-roadmap.md`).

---

## 9. Skill del repo (`.claude/skills/`)

**Editoriali:** `onboarding` (hub per chi è nuovo) · `write-article` (co-scrittura dalla prima
idea) · `refine-article` (tono e stile) · `publish-article` (runbook del giorno di uscita) ·
`add-author` (nuovo profilo autore IT+EN) · `podcast-repurpose` (kit episodio) ·
`design` (solo per il fuori standard).

**Di processo:** `roadmap-next` (prende il prossimo punto aperto da `TECH-IMPROVEMENTS.md` o
`NEW-IDEAS.md`, valuta i trigger, implementa e aggiorna il backlog) · `ship` (la coda git:
branch, staging esplicito, commit, PR, CI, merge, riallineamento di `main`). `ship` è la **fonte
di verità della coda git**: le altre skill la richiamano invece di riscriverla.

Usa la skill invece di andare a memoria. Se una skill è sbagliata o incompleta, correggila:
è la fonte di verità del processo, non un promemoria.
