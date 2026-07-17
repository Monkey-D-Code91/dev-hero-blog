# Design review — Pagina Roadmap

**Standard:** WCAG 2.1 AA · **Data:** 2026-07-17 · **Scope:** `/roadmap`, `/en/roadmap`
(componenti `src/components/roadmap/*`, contenuti `src/content/roadmap/*`)

---

## Esito in breve

**Nessun problema critico o bloccante.** Contrasti tutti conformi ad AA, semantica
corretta (heading, `dl`, `progressbar`), stati comunicati da colore **e** testo, focus
visibile ereditato dal tema. C'è **un bug funzionale** (bordo card "in lavorazione"
indeterminato) e una manciata di rifiniture minori, per lo più migliorie di robustezza
e di WCAG 2.2. Verdetto: **si può pubblicare; consiglio di sistemare il bug del bordo e
2-3 minori.**

| Severità | Conteggio |
|---|---|
| 🔴 Critico | 0 |
| 🟡 Maggiore | 1 |
| 🟢 Minore | 6 |

### Aggiornamento — 2026-07-17 (fix applicati)

- ✅ **R1** (bug bordo in-progress) — risolto: rami di bordo mutuamente esclusivi per stato.
- ✅ **U1** (stat "2/8" leggibile) — risolto: `aria-label` con la frase localizzata `progressCaption`.
- ✅ **P3** (✓ decorativo) — risolto: il "✓" è ora `aria-hidden`.
- ✅ **O1** (target < 24px / affordance) — risolto: card pubblicata interamente cliccabile
  con stretched-link (`article.relative` + `a.after:absolute after:inset-0`), un solo link.
- ⏸️ **P1** (numerale watermark), **P2** (bordo pill) — non-azioni / accettabili.
- ⏸️ **O2** (fallback no-JS) — fuori scope roadmap (pattern globale del sito).

Restano da eseguire in locale: `npx astro check` e prova responsive/tastiera sul reso.

---

## Findings

### Perceivable

| # | Problema | Criterio WCAG | Severità | Raccomandazione |
|---|----------|---------------|----------|-----------------|
| P1 | Il numerale d'arco ("I", "II") usa `text-border` (#1e293b) su sfondo #0b1120 ≈ **1.07:1**: praticamente invisibile a ipovedenti. È `aria-hidden` e il titolo porta il significato, quindi **non è una violazione**, ma l'informazione "capitolo N" è veicolata solo da un watermark quasi assente. | 1.4.3 (borderline) | 🟢 Minore | Accettabile così com'è. In alternativa alzare a `text-border-strong` (#64748b, ~4:1) o includere il numero nel testo del titolo. |
| P2 | Il bordo dei "focus pill" (Tech/Human/AI) `border-border` su `surface-2` ha contrasto ~1:1. | 1.4.11 | 🟢 Minore | Non è una violazione: i tag sono identificati dal testo (contrasto ok), il bordo è decorativo. Nessuna azione necessaria. |
| P3 | Il "✓" nella label "✓ Pubblicato" non è `aria-hidden`: uno screen reader può annunciare "segno di spunta Pubblicato". | 1.1.1 / 1.3.1 | 🟢 Minore | Avvolgere il "✓" in `<span aria-hidden="true">`. |

### Operable

| # | Problema | Criterio WCAG | Severità | Raccomandazione |
|---|----------|---------------|----------|-----------------|
| O1 | Il link della tappa pubblicata è solo il testo del titolo (`text-sm`, altezza ~19px): target < 24px. | 2.5.8 (WCAG **2.2** AA; non in 2.1) | 🟢 Minore | Rendere cliccabile l'intera card pubblicata (stretched link) — migliora sia il target sia l'affordance. |
| O2 | `[data-reveal]` parte con `opacity:0` e diventa visibile via IntersectionObserver: senza JS (solo utenti `no-preference`) il contenuto resta invisibile. Pattern ereditato da tutto il sito (`BlogList`, hero…). | 1.3.1 / robustezza | 🟢 Minore | Non specifico della roadmap. Valutare a livello globale un fallback `no-js` (es. classe `.no-js` che forza `opacity:1`). |

Focus e tastiera sono **conformi**: unici elementi interattivi sono i link-titolo delle
tappe pubblicate, in ordine DOM logico, con focus ring globale visibile (2px accent,
offset 3px). Nessuna trappola, nessun handler su hover-only.

### Understandable

| # | Problema | Criterio WCAG | Severità | Raccomandazione |
|---|----------|---------------|----------|-----------------|
| U1 | La stat "2/8" (`dd`) può essere letta da uno screen reader come "2 slash 8" o "due ottavi", perdendo il senso "2 di 8 pubblicati". | 1.3.1 | 🟢 Minore | Aggiungere testo accessibile: `aria-label="2 di 8 pubblicati"` sul `dd`, oppure una `<span class="sr-only">`. |

Nessun problema su cambi di contesto (3.2.1): niente cambia al focus. Nessun input da
etichettare in questa pagina (3.3.x non applicabili).

### Robust

| # | Problema | Criterio WCAG | Severità | Raccomandazione |
|---|----------|---------------|----------|-----------------|
| R1 | **Bug funzionale.** In `RoadmapItemCard`, per lo stato `in-progress` il `class:list` applica **sia** `border-border` **sia** `border-accent-2/40`: entrambe impostano `border-color`, quindi il vincitore dipende dall'ordine nel CSS generato da Tailwind, non dall'ordine delle classi. Il bordo teal della card "in lavorazione" potrebbe **non** comparire. | 4.1.2 (robustezza/visivo) | 🟡 **Maggiore** | Non impostare `border-border` quando `in-progress`. Es. un solo ramo che restituisce il bordo corretto per stato (vedi §Fix proposti). |

`progressbar` espone correttamente `role` + `aria-valuenow/min/max` + `aria-label`;
`article`/`h3` e `dl`/`dt`/`dd` sono semanticamente corretti.

---

## Verifica contrasto colore

Sfondi: `bg` #0b1120, `surface` #0f172a, `surface-2` #111827. Rapporti calcolati (WCAG).

| Elemento | Fg | Bg | Ratio | Richiesto | Pass |
|----------|----|----|-------|-----------|------|
| Testo titolo/corpo (`text`) #e6edf3 | #e6edf3 | #0b1120 | ~15.8:1 | 4.5:1 | ✅ |
| Testo muted (intro, date, lead) #94a3b8 | #94a3b8 | #0b1120 | ~7.3:1 | 4.5:1 | ✅ |
| Muted su card #94a3b8 | #94a3b8 | #111827 | ~6.9:1 | 4.5:1 | ✅ |
| Accent (occhiello, stat, "Pubblicato", link) #38bdf8 | #38bdf8 | #0b1120 | ~8.8:1 | 4.5:1 | ✅ |
| Accent su card #38bdf8 | #38bdf8 | #111827 | ~8.3:1 | 4.5:1 | ✅ |
| Accent-2 ("In lavorazione", teaser) #2dd4bf | #2dd4bf | #0b1120 | ~10:1 | 4.5:1 | ✅ |
| Nome collaboratore `text-accent/80` (blend) | ~#34a3ce | #111827 | ~5.7:1 | 4.5:1 | ✅ |
| Numerale d'arco (decorativo, `aria-hidden`) #1e293b | #1e293b | #0b1120 | ~1.1:1 | — | ⚪️ n/a |
| Barra avanzamento: riempita vs traccia | grad. accent | #1e293b | ≫3:1 | 3:1 | ✅ |

Tutti i testi significativi superano AA (molti anche AAA). L'unico rapporto basso è il
numerale, decorativo e nascosto agli screen reader.

## Navigazione da tastiera

| Elemento | Tab | Invio/Spazio | Esc | Frecce |
|----------|-----|--------------|-----|--------|
| Link-titolo tappa pubblicata | ✅ in ordine DOM | Attiva il link | — | — |
| Card pipeline / teaser | non focalizzabili (non interattivi) | — | — | — |
| Barra avanzamento | non focalizzabile (di sola lettura) | — | — | — |

## Screen reader (attesi)

| Elemento | Annunciato come | Nota |
|----------|-----------------|------|
| Numerale "I/II" | (nulla) | `aria-hidden` corretto |
| Titolo arco | "intestazione livello 2, La disciplina…" | ✅ |
| Barra avanzamento | "Arco I: 2 di 8 tappe pubblicate, 2 di 8" | ✅ label + valori |
| Stat "2/8" | "Arco I, 2 slash 8" | 🟢 U1: chiarire con `aria-label` |
| Label "✓ Pubblicato" | "segno di spunta Pubblicato" | 🟢 P3: nascondere il ✓ |

---

## Critica di design (oltre WCAG)

**Punti di forza**
- Gerarchia chiara: occhiello → h1 → intro → stat → capitoli. Ritmo verticale coerente.
- Sistema di stato leggibile (colore + etichetta + intensità della card), fedele al tema.
- La barra di avanzamento dà un colpo d'occhio sul progresso dell'arco.
- Il teaser "In arrivo" tratteggiato comunica un filone aperto senza sembrare vuoto.
- Uso disciplinato dei token esistenti: la pagina sembra nativa del blog.

**Migliorabile**
1. **Bordo card "in lavorazione" (R1)** — bug da correggere: il teal potrebbe non vedersi.
2. **Affordance card pubblicate (O1)** — solo il titolo è cliccabile; l'intera card
   dovrebbe esserlo (target più grande, hover già presente).
3. **Numerale watermark (P1)** — gradevole ma quasi invisibile; valutare +1 step di
   contrasto per dargli peso senza urlare.
4. **Stat solo per Arco I** — l'hero mostra l'avanzamento del primo arco; su archi
   successivi il lettore potrebbe aspettarsi il loro. Valutare una progress per arco già
   presente nei capitoli (c'è) e magari togliere ambiguità all'etichetta "Arco I".

---

## Fix proposti (prioritizzati)

1. 🟡 **R1 — bordo card in-progress** (`RoadmapItemCard.astro`). Sostituire i due rami di
   bordo con uno solo per stato:
   ```astro
   class:list={[
     "flex h-full flex-col rounded-2xl border p-4 transition-colors",
     status === "planned"     && "border-border bg-surface",
     status === "in-progress" && "border-accent-2/40 bg-surface-2",
     status === "published"   && "border-border bg-surface-2 hover:border-accent/40",
   ]}
   ```
2. 🟢 **U1 — stat accessibile** (`RoadmapHero.astro`): `dd` con `aria-label` esplicito
   (es. "2 di 8 pubblicati") o `sr-only`.
3. 🟢 **P3 — ✓ decorativo** (`RoadmapItemCard.astro`): `{status === "published" && (<span aria-hidden="true">✓ </span>)}`.
4. 🟢 **O1 — card pubblicata interamente cliccabile**: stretched-link sull'`<article>`
   (pseudo-elemento del link in copertura), che risolve anche il target < 24px.
5. 🟢 **P1 — numerale**: opzionale, `text-border-strong` al posto di `text-border`.
6. 🟢 **O2 — fallback no-JS**: intervento globale (non solo roadmap), fuori scope qui.

Nessuno di questi blocca la pubblicazione. Consiglio almeno #1 (bug) e #2–#3 (rapidi).
