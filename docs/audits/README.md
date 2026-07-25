# Audit del sito — storico e formato

Qui vivono i report della skill `site-audit` (`.claude/skills/site-audit/`): un file per run,
versionato, così lo storico sta in git e i collaboratori lo vedono.

Nome del file: `YYYY-MM-DD-site-audit.md`, con la data della run.

Le review storiche in `_design-review/` e `docs/archive/` sono precedenti a questo formato:
si leggono come contesto, non si usano come baseline di confronto.

---

## Il principio: i finding hanno un ID stabile

Un audit vale per il confronto con quello prima. Perché il confronto esista, ogni problema ha un
**ID che non cambia mai**: `<AREA>-<slug-kebab>`, dove lo slug descrive **il problema**, non il
file che lo contiene. Se il fix si sposta di componente, l'ID regge.

Aree e prefissi: `A11Y` (accessibilità), `SEO` (indicizzazione e social card), `PERF`
(performance), `READ` (leggibilità), `BRAND` (coerenza col brand), `ENTRY` (entry point e
contenuti).

Niente numerazione progressiva: si rinumera da sola al primo inserimento e rompe lo storico.

Ogni finding porta un **esito** rispetto all'audit precedente: `nuovo`, `persiste`, `peggiorato`,
`regressione`, `risolto`, `accettato`. Nessun finding vecchio può sparire senza esito.

I finding `accettato` sono decisioni consapevoli di Marco: restano nella loro sezione con
motivazione e data, e non tornano tra gli attivi nelle run successive.

---

## Struttura del report

```markdown
# Audit del sito — YYYY-MM-DD

- **Perimetro:** completo | aree: A11Y, SEO
- **Commit:** <short sha>  ·  **Ambiente:** build rigenerata | dist/ del <data>
- **Confrontato con:** docs/audits/<file precedente>.md | baseline zero
- **Non verificato:** <build non girata nel sandbox | browser non disponibile | live non raggiungibile | nulla>

## Verdetto

Cinque righe: com'è messo il sito, cosa è cambiato dall'ultima volta, la cosa più urgente.

## Riepilogo per area

| Area | Alto | Medio | Basso | Delta vs audit precedente |
|---|---|---|---|---|
| A11Y | 0 | 1 | 2 | -1 |
| ... |

## Finding attivi

### BRAND-emdash-copy-sito — Trattini lunghi nel copy del sito [Alto] · nuovo · dal 2026-07-22

**Evidenza.** 29 pagine su 33 in `dist/` contengono un trattino lungo fuori dai commenti HTML.
Comando: `for f in $(find dist -name "*.html"); do perl -0pe 's/<!--.*?-->//gs' "$f" | grep -q '—' && echo "$f"; done`.
Casi: `<title>`, `og:title`, `aria-label` in `src/components/landing/AuthorCard.astro:26`.

**Impatto.** Viola `CLAUDE.md` §4, che estende la regola a tutto il copy del sito e non ai soli
articoli. È il testo che compare nei risultati di ricerca e nelle anteprime social.

**Azione proposta.** Sostituire con due punti o parentesi nei sorgenti coinvolti, e aggiungere il
controllo sulla build in `preflight-article.mjs` o in un test, così non torna.

## Risolti dall'ultimo audit

- `PERF-lcp-lazy` — la cover dell'articolo ora è `eager` + `fetchpriority="high"`. Verificato su
  `/blog/<slug>/`.

## Accettati

- `READ-layout-vuoto` — accettato il 2026-06-30: si risolve da solo superati i sei articoli
  pubblicati, non vale un layout dedicato adesso.

## Osservazioni

Cose viste che non sono finding, e domande aperte per Marco.
```

---

## Cosa succede dopo il report

I finding `Alto` e `Medio` che valgono un lavoro si travasano in `TECH-IMPROVEMENTS.md` (o in
`NEW-IDEAS.md` se sono feature e non correzioni), citando l'ID e il report d'origine. I `Basso`
restano qui: un backlog gonfio di rifiniture è indistinguibile da un backlog non curato.

L'implementazione è di `roadmap-next`, in una sessione nuova. La coda git (branch, commit, PR) è
di `ship`. La skill `site-audit` non modifica nient'altro che il report: chi audita non implementa.
