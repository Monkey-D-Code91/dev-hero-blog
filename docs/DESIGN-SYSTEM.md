# Design System

Sistema di design portabile, derivato dal blog **The First Draft** ed esteso a UI applicativa.
Il significato del brand (perché questi colori, quale voce) sta in `brand.md`. Qui c'è
**come si costruisce**: token, scale, componenti, accessibilità.

**Nome interno:** Modern Tech Dark · **Versione:** 1.0 · **Ultimo aggiornamento:** 2026-07-26

**Stato dei contenuti.** Il documento contiene due tipi di materiale, sempre etichettati:

- **[in uso]** — implementato oggi sul blog. Valori verificati contro `src/styles/global.css` e i
  componenti in `src/components/`.
- **[esteso]** — definito qui per i prodotti applicativi futuri (form, tabelle, modali, stati). Non
  ancora implementato da nessuna parte, ma coerente per costruzione con i token in uso.

Il primo prodotto che implementa una parte **[esteso]** la promuove a **[in uso]** e aggiorna
questo file.

---

## Indice

1. [Principi](#1-principi)
2. [Token: colore](#2-token-colore)
3. [Token: tipografia](#3-token-tipografia)
4. [Token: spazio e layout](#4-token-spazio-e-layout)
5. [Token: forma, elevazione, z-index](#5-token-forma-elevazione-z-index)
6. [Token: motion](#6-token-motion)
7. [Componenti](#7-componenti)
8. [Accessibilità](#8-accessibilità)
9. [Microcopy di interfaccia](#9-microcopy-di-interfaccia)
10. [Adozione su un nuovo prodotto](#10-adozione-su-un-nuovo-prodotto)

---

## 1. Principi

Cinque regole operative. Servono a decidere nei casi che il documento non copre.

1. **L'elevazione la fa il bordo, non il fondo.** Le superfici scure sono quasi indistinguibili tra
   loro (1.06:1). Per staccare un elemento si aggiunge `border-border`, non un grigio più chiaro.
   Le ombre esistono ma sono l'ultima risorsa, non la prima.
2. **Un solo accento primario per schermata.** `accent` marca l'azione principale. Se due bottoni
   sono pieni di azzurro, nessuno dei due è primario.
3. **Il colore non è mai l'unico veicolo di informazione.** Ogni stato porta anche testo, icona o
   forma (WCAG 1.4.1).
4. **Densità bassa, respiro alto.** Le sezioni respirano (`py-20` / `py-24`), il contenuto sta in
   colonne strette (`max-w-2xl` per la lettura, `max-w-5xl` per il layout). Meglio scorrere che
   comprimere.
5. **Il movimento è un accessorio, mai un requisito.** Tutto resta usabile e leggibile con
   `prefers-reduced-motion: reduce`, e nulla ritarda il primo paint del contenuto.

---

## 2. Token: colore

### 2.1 Convenzione di naming

I token sono **semantici**, non descrittivi: `--color-accent`, non `--color-sky-400`. Il nome dice
il ruolo, così cambiare il valore non obbliga a rinominare nulla.

```
--color-<ruolo>           colore di base        --color-accent
--color-<ruolo>-<var>     variante del ruolo    --color-accent-2, --color-border-strong
--color-pillar-<nome>     colore identitario    --color-pillar-tech  (solo The First Draft)
```

Regola: **nel codice applicativo non compaiono hex letterali.** Se un hex serve, o è un token o
diventa un token.

### 2.2 Colori di base [in uso]

| Token | Hex | Ruolo | Contrasto vs `bg` |
|---|---|---|---|
| `--color-bg` | `#0b1120` | sfondo dell'applicazione | — |
| `--color-surface` | `#0f172a` | sezioni alternate | 1.06:1 |
| `--color-surface-2` | `#111827` | card, input, elementi sopraelevati | 1.06:1 |
| `--color-border` | `#1e293b` | bordi sottili decorativi | 1.29:1 |
| `--color-border-strong` | `#64748b` | bordi di controlli interattivi | **3.96:1** ✅ |
| `--color-text` | `#e6edf3` | testo principale | **15.94:1** ✅ |
| `--color-muted` | `#94a3b8` | testo secondario, label, meta | **7.34:1** ✅ |
| `--color-accent` | `#38bdf8` | CTA, link, focus ring | **8.79:1** ✅ |
| `--color-accent-2` | `#2dd4bf` | accento secondario, hover del primario | **10.12:1** ✅ |

`border` **non** raggiunge 3:1: è corretto, perché è decorativo. Un bordo che delimita un controllo
interattivo (input, select, checkbox) deve usare `border-strong` per soddisfare WCAG 1.4.11.

### 2.3 Colori identitari [in uso, specifici di The First Draft]

| Token | Hex | Ruolo |
|---|---|---|
| `--color-pillar-tech` | `#38bdf8` | pilastro tech (coincide con `accent`) |
| `--color-pillar-human` | `#2dd4bf` | pilastro human (coincide con `accent-2`) |
| `--color-pillar-ai` | `#818cf8` | pilastro AI (indigo, 6.31:1 su `bg`) |

Su un prodotto che non è First Draft questi tre token **non si portano**. Se serve un terzo accento,
si riusa il valore indigo con un nome neutro (`--color-accent-3`).

### 2.4 Colori di stato [esteso]

Il blog non ha stati applicativi. Questi sono definiti qui, scelti per armonia con la palette e
verificati per contrasto.

| Token | Hex | Uso | vs `bg` | vs `surface-2` |
|---|---|---|---|---|
| `--color-success` | `#34d399` | conferme, esiti positivi | 9.79:1 ✅ | 9.23:1 ✅ |
| `--color-warning` | `#fbbf24` | attenzione, azioni reversibili rischiose | 11.28:1 ✅ | 10.63:1 ✅ |
| `--color-danger` | `#f87171` | errori, azioni distruttive | 6.81:1 ✅ | 6.41:1 ✅ |
| `--color-info` | `#38bdf8` | informazioni neutre (alias di `accent`) | 8.79:1 ✅ | 8.28:1 ✅ |

**`success` e `accent-2` sono vicini di tinta e non vanno usati nella stessa schermata con
significati diversi.** Se una UI ha molto verde di stato, il secondario decorativo si toglie.

Per fondi tenui degli stati si usa il colore stesso a bassa opacità sopra `surface-2`
(es. `bg-danger/10 border border-danger/40`), non un hex dedicato: mantiene la palette a 13 valori.

### 2.5 Blocco CSS portabile

Copiabile in qualsiasi progetto, indipendente dal framework.

```css
:root {
  /* superfici */
  --color-bg: #0b1120;
  --color-surface: #0f172a;
  --color-surface-2: #111827;

  /* bordi */
  --color-border: #1e293b;         /* decorativo */
  --color-border-strong: #64748b;  /* controlli interattivi, >= 3:1 */

  /* testo */
  --color-text: #e6edf3;
  --color-muted: #94a3b8;

  /* accenti */
  --color-accent: #38bdf8;
  --color-accent-2: #2dd4bf;
  --color-accent-3: #818cf8;

  /* stato */
  --color-success: #34d399;
  --color-warning: #fbbf24;
  --color-danger: #f87171;
  --color-info: var(--color-accent);

  /* tipografia */
  --font-sans: "Inter Variable", ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-serif: "Newsreader Variable", Georgia, "Times New Roman", serif;

  /* raggi */
  --radius-sm: 0.25rem;   /* 4px  - inline code, tag minimi */
  --radius-md: 0.375rem;  /* 6px  - elementi densi */
  --radius-lg: 0.5rem;    /* 8px  - bottoni, input */
  --radius-xl: 0.75rem;   /* 12px - blocchi codice, pannelli */
  --radius-2xl: 1rem;     /* 16px - card, dialog */
  --radius-full: 9999px;  /*        pill, avatar, dot */

  /* motion */
  --duration-fast: 150ms;
  --duration-base: 200ms;
  --duration-slow: 600ms;
  --ease-standard: ease;

  /* z-index */
  --z-raised: 10;
  --z-popover: 20;
  --z-header: 40;
  --z-overlay: 50;
  --z-toast: 60;
}
```

### 2.6 Mapping Tailwind v4 (config CSS-first) [in uso]

Nel blog i token vivono in `src/styles/global.css`. I nomi `--color-*` generano automaticamente le
utility (`bg-bg`, `text-accent`, `border-border-strong`).

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-bg: #0b1120;
  --color-surface: #0f172a;
  --color-surface-2: #111827;
  --color-border: #1e293b;
  --color-border-strong: #64748b;
  --color-text: #e6edf3;
  --color-muted: #94a3b8;
  --color-accent: #38bdf8;
  --color-accent-2: #2dd4bf;

  /* stato (aggiungere nei prodotti applicativi) */
  --color-success: #34d399;
  --color-warning: #fbbf24;
  --color-danger: #f87171;

  --font-sans: "Inter Variable", ui-sans-serif, system-ui, sans-serif;
  --font-serif: "Newsreader Variable", Georgia, serif;
}
```

### 2.7 Consumo in React

Tre modi, in ordine di preferenza.

**a) Tailwind v4** (default, stesso stack del blog): le utility arrivano dal blocco `@theme`.
Nessun altro passo.

**b) CSS Modules / CSS puro**: si importa il blocco §2.5 una volta e si usano le variabili.

```css
.button { background: var(--color-accent); color: var(--color-bg); }
```

**c) Accesso da TypeScript** quando un valore serve in JS (grafici, canvas, librerie che vogliono
un colore come stringa). Si definisce **un solo** modulo, che rispecchia il CSS:

```ts
// src/design/tokens.ts
export const tokens = {
  color: {
    bg: "#0b1120",
    surface: "#0f172a",
    surface2: "#111827",
    border: "#1e293b",
    borderStrong: "#64748b",
    text: "#e6edf3",
    muted: "#94a3b8",
    accent: "#38bdf8",
    accent2: "#2dd4bf",
    accent3: "#818cf8",
    success: "#34d399",
    warning: "#fbbf24",
    danger: "#f87171",
  },
  radius: { sm: "0.25rem", md: "0.375rem", lg: "0.5rem", xl: "0.75rem", "2xl": "1rem" },
  duration: { fast: 150, base: 200, slow: 600 },
} as const;

export type ColorToken = keyof typeof tokens.color;
```

> **Attenzione alla duplicazione.** `tokens.ts` e il CSS sono due copie degli stessi valori: è il
> prezzo di avere i colori in JS. Vanno cambiati insieme, e nessun componente deve leggere il
> colore da `tokens.ts` se può prenderlo dal CSS. In alternativa,
> `getComputedStyle(document.documentElement).getPropertyValue("--color-accent")` elimina la copia
> al costo di una lettura a runtime: accettabile per un grafico, non in un render loop.

---

## 3. Token: tipografia

### 3.1 Famiglie [in uso]

| Token | Valore | Quando |
|---|---|---|
| `--font-sans` | Inter Variable | **default**: UI, navigazione, card, meta, form, tabelle, asset generati |
| `--font-serif` | Newsreader Variable | **solo** titolo h1 e corpo dei testi long-form |

Criterio: testo che si **usa** = Inter; testo che si **legge** = Newsreader. Un'applicazione è
quasi tutta Inter. Entrambe self-hosted via `@fontsource-variable/*`.

### 3.2 Scala [in uso]

Scala Tailwind di default, usata con parsimonia: nel blog il 90% del testo è `text-sm` o `text-xs`.

| Ruolo | Utility | Dimensione | Peso | Note |
|---|---|---|---|---|
| Display / hero | `text-4xl` → `text-6xl` | 36 → 60px | 600-700 | `tracking-tight` |
| H1 articolo | `text-3xl` → `text-4xl` | 30 → 36px | 600 | **serif**, unica eccezione |
| H2 sezione | `text-2xl` | 24px | 600 | |
| H3 | `text-xl` | 20px | 600 | |
| Titolo card | `text-lg` | 18px | 600 | `leading-snug` |
| Titolo card featured | `text-xl` → `text-2xl` | 20 → 24px | 600 | |
| Corpo UI | `text-sm` | 14px | 400 | **default dell'interfaccia** |
| Corpo long-form | `1.1875rem` | 19px | 400 | **serif**, `line-height: 1.7` |
| Meta, label, tag | `text-xs` | 12px | 400-500 | spesso `text-muted` |
| Micro-label | `text-[0.6875rem]` | 11px | 500 | limite inferiore, solo per legende |

**Sotto gli 11px non si scende.** Le label in maiuscoletto usano `uppercase tracking-widest` e
almeno `text-xs`.

### 3.3 Corpo long-form [in uso]

Regole della classe `.prose-dark`, override del plugin `@tailwindcss/typography` per il tema scuro:

- 19px / interlinea 1.7, colonna `max-w-2xl` (~68-72 caratteri per riga).
- Testo `#c8d6e4` (12.73:1), titoli `#f0f6fc` (17.30:1), lead `#a8bdd0` (9.73:1).
- Link in `accent`, `text-underline-offset: 3px`, spessore 1px.
- Codice inline: `bg-surface-2`, bordo `border`, `radius-sm`, 0.875em, testo `accent-2`.
- Blocchi `pre`: bordo `border`, `radius-xl`, fondo `surface-2`.

> **Nota di accessibilità sui token prose.** `--tw-prose-bullets` (`#5a7a94`) sta a 4.17:1 e
> `--tw-prose-counters` (`#7090a8`) a 5.60:1 sul background: sufficienti come elementi non
> testuali, ma sono i valori più bassi del sistema. Se un prodotto li usa per testo vero, vanno
> alzati.

---

## 4. Token: spazio e layout

### 4.1 Scala di spaziatura [in uso]

Base **4px** (scala Tailwind). I passi effettivamente in uso, in ordine di frequenza:

| Passo | rem / px | Uso tipico |
|---|---|---|
| `1` / `1.5` | 4 / 6px | gap tra dot, icone e testo |
| `2` / `2.5` | 8 / 10px | gap in linee di meta, padding dei chip |
| `3` | 12px | gap tra elementi di form |
| `4` | 16px | gap tra card in griglia stretta |
| `5` / `6` | 20 / 24px | **padding interno delle card**, gap di griglia |
| `8` | 32px | padding card grandi, gap di navigazione |
| `12` | 48px | separazione tra blocchi |
| `14` / `16` | 56 / 64px | sezioni compatte |
| `20` / `24` / `28` | 80 / 96 / 112px | **padding verticale delle sezioni di pagina** |

Regola: si scelgono passi della scala, mai valori arbitrari. Il padding di sezione standard è
`py-20` (mobile) → `py-24` (desktop).

### 4.2 Contenitori [in uso]

| Larghezza | Utility | Uso |
|---|---|---|
| Lettura | `max-w-2xl` (672px) | corpo articolo, testo lungo, form singolo |
| Pagina | `max-w-5xl` (1024px) | contenitore standard di navbar, footer, griglie |
| Intermedia | `max-w-3xl` (768px) | intro di sezione, testi di supporto |
| Stretta | `max-w-xl` (576px) | box newsletter, dialog |

Padding orizzontale del contenitore: `px-6`, con `mx-auto`.

### 4.3 Breakpoint [in uso]

Scala Tailwind di default, **mobile first**.

| Nome | Min-width | Cambio principale |
|---|---|---|
| (base) | 0 | colonna singola, menu a hamburger |
| `sm` | 640px | compare il wordmark, i form vanno in riga |
| `md` | 768px | compare la navigazione orizzontale, griglie a 2 colonne |
| `lg` | 1024px | griglie a 3 colonne, spaziature piene |
| `xl` | 1280px | raramente usato: il contenuto è già al massimo |

---

## 5. Token: forma, elevazione, z-index

### 5.1 Raggi [in uso]

| Token | Valore | Uso |
|---|---|---|
| `rounded-sm` | 4px | codice inline |
| `rounded-md` | 6px | elementi densi, celle |
| `rounded-lg` | 8px | **bottoni, input, logo in navbar** |
| `rounded-xl` | 12px | blocchi codice, pannelli, tooltip |
| `rounded-2xl` | 16px | **card, box newsletter, dialog** |
| `rounded-full` | pill | tag, avatar, dot, badge |

Convenzione: **8px per i controlli, 16px per i contenitori, pill per gli oggetti-etichetta.**

### 5.2 Elevazione

Il sistema è **flat con bordi**. Non esiste una scala di ombre a cinque livelli: ci sono tre
livelli e uno solo di essi usa un'ombra.

| Livello | Ricetta | Uso |
|---|---|---|
| 0 — piano | `bg-bg` | sfondo di pagina |
| 1 — superficie | `bg-surface-2 border border-border` | **card, pannelli, input** |
| 2 — flottante | `bg-surface-2 border border-border shadow-lg` | tooltip, dropdown, dialog, toast |

L'hover di una card **non** cambia l'ombra: cambia il bordo (`hover:border-accent/40`) e, se il
movimento è consentito, solleva di 2px.

### 5.3 Z-index [in uso + esteso]

| Token | Valore | Uso |
|---|---|---|
| `--z-raised` | 10 | elemento in rilievo nel flusso (link sopra l'overlay di una card) |
| `--z-popover` | 20 | tooltip, dropdown, mini-legende |
| `--z-header` | 40 | navbar sticky |
| `--z-overlay` | 50 | backdrop e dialog modali, menu mobile |
| `--z-toast` | 60 | notifiche, barra di progresso di lettura |

**Non si usano valori fuori scala.** Se serve un nuovo livello, si aggiunge qui.

---

## 6. Token: motion

| Token | Valore | Uso |
|---|---|---|
| `--duration-fast` | 150ms | tooltip, cambi di opacità |
| `--duration-base` | 200ms | hover, transizioni di colore e trasformazione |
| `--duration-slow` | 600ms | reveal on-scroll |
| `--ease-standard` | `ease` | tutto, salvo motivo esplicito |

Regole:

- **Si animano solo `opacity` e `transform`.** Mai `height`, `width`, `top`.
- **Reveal on-scroll:** gli elementi partono **visibili**. È il JS ad aggiungere la classe di
  nascondimento ai soli elementi sotto la piega, poi a rimuoverla quando entrano in vista.
  Nascondere l'above-the-fold con `opacity: 0` rimanderebbe l'LCP: è un bug di performance
  travestito da effetto.
- **`prefers-reduced-motion: reduce` azzera tutto** (`animation-duration` e `transition-duration` a
  0.001ms, `scroll-behavior: auto`). Il feedback che restava affidato al movimento deve avere una
  controparte statica: il sollevamento della card sparisce, il cambio di bordo resta.
- Ritardi progressivi per liste: 80ms per figlio, massimo tre passi.

---

## 7. Componenti

Ogni componente ha: **anatomia**, **varianti**, **stati**, **accessibilità**, e una **ricetta**
Tailwind pronta da copiare.

### 7.1 Card [in uso]

Contenitore standard di contenuto: post, autore, elemento di roadmap.

- **Anatomia:** contenitore (`article` o `div`) → striscia/immagine di testa opzionale → padding
  `p-6` (`md:p-8` in variante featured) → riga di meta → titolo → descrizione → footer di tag.
- **Varianti:** `default`, `featured` (padding e titolo maggiorati), `senza cover` (striscia
  gradiente `from-accent/20 via-accent to-accent-2/20` alta 1px come testa).
- **Stati:** hover → `border-accent/40` + sollevamento di 2px + titolo in `accent`.
- **Accessibilità:** l'elemento è etichettato dal titolo via `aria-labelledby`. Il **titolo** è il
  link principale, esteso a tutta la card con `after:absolute after:inset-0`. Gli elementi
  interattivi interni (byline) risalgono con `relative z-10`. **Niente link annidati:** in una
  lista i tag sono `span`, non link.

```html
<article class="group card-lift relative flex h-full flex-col rounded-2xl border border-border
                bg-surface-2 overflow-hidden transition-colors hover:border-accent/40"
         aria-labelledby="card-title-x">
  <div class="flex flex-col flex-1 p-6"> … </div>
</article>
```

### 7.2 Chip / Tag pill [in uso]

```html
<!-- link (archivio tag) -->
<a class="inline-flex items-center rounded-full border border-border bg-surface-2 px-2.5 py-0.5
          text-xs font-medium text-muted transition-colors hover:border-accent/40 hover:text-accent">#tag</a>

<!-- statico (dentro una lista già linkata) -->
<span class="inline-flex items-center rounded-full border border-border bg-surface-2 px-2.5 py-0.5
             text-xs font-medium text-muted">#tag</span>
```

Regola: **se non è cliccabile non ha hover.** L'hover su un elemento inerte è una promessa falsa.

### 7.3 Header sticky [in uso]

```html
<header class="sticky top-0 z-40 border-b border-border/60 bg-bg/80 backdrop-blur-md">
  <div class="mx-auto flex max-w-5xl items-center justify-between px-6 py-3"> … </div>
</header>
```

Voce attiva: `border-b border-accent pb-px font-medium text-text`. Voce inattiva:
`text-muted hover:text-text`. `scroll-padding-top: 5rem` su `html` compensa l'header negli anchor.

### 7.4 Form: input e bottone [in uso, base]

```html
<label for="email" class="sr-only">Email</label>
<input id="email" type="email" required
       class="min-w-0 flex-1 rounded-lg border border-border bg-bg px-4 py-2.5 text-text
              placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />

<button type="submit"
        class="shrink-0 rounded-lg bg-accent px-5 py-2.5 font-medium text-bg transition-colors hover:bg-accent-2">
  Iscriviti
</button>
```

> **Debito noto.** L'input in uso ha `border-border` (1.29:1), sotto la soglia WCAG 1.4.11 di 3:1
> per i bordi dei controlli. La versione corretta, e lo standard per i nuovi prodotti, è
> `border-border-strong` (3.96:1). Vale anche per select, textarea, checkbox e radio.

### 7.5 Bottone [esteso]

| Variante | Quando | Ricetta |
|---|---|---|
| **Primary** | l'azione principale, **una per schermata** | `bg-accent text-bg font-medium hover:bg-accent-2` |
| **Secondary** | azioni alternative | `border border-border-strong bg-surface-2 text-text hover:border-accent/60 hover:text-accent` |
| **Ghost** | azioni terziarie, barre di strumenti | `text-muted hover:text-text hover:bg-surface-2` |
| **Danger** | azioni distruttive | `bg-danger text-bg font-medium hover:bg-danger/85` |
| **Link** | navigazione inline | `text-accent underline-offset-4 hover:underline` |

| Taglia | Padding | Testo | Altezza |
|---|---|---|---|
| `sm` | `px-3 py-1.5` | `text-xs` | 30px |
| `md` (default) | `px-5 py-2.5` | `text-sm` | 42px |
| `lg` | `px-6 py-3` | `text-base` | 48px |

Base comune: `inline-flex items-center justify-center gap-2 rounded-lg transition-colors
disabled:opacity-50 disabled:pointer-events-none`.

**Stati.** `hover` cambia colore; `focus-visible` usa l'outline globale (§8); `disabled` è opacità
50% **più** `aria-disabled`, mai il solo colore; `loading` mostra uno spinner, mantiene la
larghezza del bottone e imposta `aria-busy="true"` senza rimuovere l'etichetta.

**Su touch la taglia `sm` non si usa da sola** come unico target: il minimo è 44×44px di area
cliccabile, ottenibile con padding esterno se il bottone deve restare visivamente piccolo.

### 7.6 Campo di form completo [esteso]

Anatomia: `label` → controllo → testo di aiuto → messaggio di errore.

```html
<div class="flex flex-col gap-1.5">
  <label for="name" class="text-sm font-medium text-text">Nome progetto</label>
  <input id="name" aria-describedby="name-help name-err" aria-invalid="true"
         class="rounded-lg border border-danger bg-surface-2 px-4 py-2.5 text-sm text-text
                placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent" />
  <p id="name-help" class="text-xs text-muted">Come comparirà nell'elenco.</p>
  <p id="name-err" class="text-xs text-danger">Questo nome è già in uso.</p>
</div>
```

Regole:

- **La label è sempre presente.** Se è visivamente superflua, si nasconde con `sr-only`: il
  `placeholder` non è una label.
- L'errore è collegato con `aria-describedby` **e** segnalato da `aria-invalid`. Il rosso da solo
  non basta.
- Il campo obbligatorio si segnala nella label, non con un asterisco senza legenda.
- La validazione parte al `blur` o al submit, non al primo carattere digitato.

### 7.7 Tabella [esteso]

```html
<table class="w-full text-sm">
  <caption class="sr-only">Elenco progetti</caption>
  <thead>
    <tr class="border-b border-border text-left text-xs uppercase tracking-widest text-muted">
      <th scope="col" class="px-4 py-3 font-medium">Nome</th>
    </tr>
  </thead>
  <tbody class="divide-y divide-border">
    <tr class="transition-colors hover:bg-surface-2">
      <td class="px-4 py-3 text-text">…</td>
    </tr>
  </tbody>
</table>
```

- **Niente zebra striping**: separa `divide-border`, evidenzia l'hover di riga.
- I numeri si allineano a destra e usano `tabular-nums`.
- Colonna di ordinamento: `aria-sort` sul `th` più un'icona; l'intestazione cliccabile è un
  `button` dentro il `th`, non il `th` stesso.
- L'intestazione fissa usa `sticky top-0 bg-bg z-10` dentro un contenitore con scroll.
- Su mobile: contenitore `overflow-x-auto` con `tabindex="0"` e `role="region"` etichettata, così
  la tabella è scorribile da tastiera.

### 7.8 Dialog modale [esteso]

Elemento nativo `<dialog>`: porta focus trap, `Esc` e inertizzazione dello sfondo senza libreria.

```html
<dialog class="m-auto w-full max-w-xl rounded-2xl border border-border bg-surface-2 p-6
               text-text shadow-lg backdrop:bg-bg/70 backdrop:backdrop-blur-sm">
  <h2 class="text-lg font-semibold">Titolo</h2>
  <p class="mt-2 text-sm text-muted">…</p>
  <div class="mt-6 flex justify-end gap-3">…</div>
</dialog>
```

- Apertura con `showModal()`, mai `show()`, altrimenti niente focus trap.
- Il focus va sul primo elemento interattivo e torna sull'elemento che ha aperto il dialog alla
  chiusura.
- Titolo collegato con `aria-labelledby`.
- **Le azioni distruttive non hanno il focus iniziale.**

### 7.9 Toast / notifica [esteso]

Contenitore fisso in basso a destra, `z-toast`, `max-w-sm`, stack verticale con `gap-3`.

```html
<div role="status" aria-live="polite"
     class="flex items-start gap-3 rounded-xl border border-border bg-surface-2 p-4 shadow-lg">
  <span class="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-success"></span>
  <p class="text-sm text-text">Salvato.</p>
</div>
```

- Successo e informazione: `role="status"` + `aria-live="polite"`.
- Errore: `role="alert"` + `aria-live="assertive"`.
- **Un toast non si chiude da solo se contiene l'unica copia di un'informazione importante.** Gli
  errori restano finché l'utente li chiude. Durata minima dei toast automatici: 5 secondi.

### 7.10 Badge di stato [esteso]

```html
<span class="inline-flex items-center gap-1.5 rounded-full border border-success/40 bg-success/10
             px-2 py-0.5 text-xs font-medium text-success">
  <span class="h-1.5 w-1.5 rounded-full bg-success"></span> Attivo
</span>
```

Stessa struttura per `warning`, `danger`, `accent`. **Il testo dello stato è sempre presente**: il
solo pallino colorato non comunica nulla a chi non distingue i colori.

### 7.11 Stati di pagina [esteso]

Quattro stati per ogni vista che carica dati. Nessuno è opzionale.

| Stato | Regola |
|---|---|
| **Loading** | skeleton `bg-surface-2` con `animate-pulse`, stessa geometria del contenuto finale, per evitare il salto di layout. Sotto reduced-motion l'animazione sparisce, il blocco resta. Contenitore con `aria-busy="true"`. |
| **Empty** | titolo breve, una riga che spiega **perché** è vuoto, una azione. Prima persona: "Non ho ancora nulla da mostrarti qui." |
| **Error** | cosa è andato storto in termini comprensibili, cosa può fare l'utente, un pulsante "Riprova". Niente codici di errore da soli, niente colpa all'utente. |
| **Partial** | quando alcuni dati mancano, si dichiara: il dato assente non si finge zero. È il principio di onestà applicato alla UI. |

### 7.12 Componenti identitari [in uso, solo The First Draft]

- **Glifo focus (triade):** tre dot in ordine fisso tech · human · ai, pieni o vuoti, colori dei
  pilastri, `role="img"` con `aria-label` completo, tooltip CSS-only su hover e `focus-visible`.
  Indicatore qualitativo, **mai** un punteggio.
- **Barra di progresso di lettura:** riga fissa alta 3px in cima, `z-toast`, riempita via
  `transform: scaleX()`, gradiente `accent → accent-2`. Puramente decorativa: `pointer-events: none`
  e nessun ruolo ARIA.

Su un prodotto non-First-Draft questi due non si portano.

---

## 8. Accessibilità

Target: **WCAG 2.1 livello AA**. Le regole seguenti sono un gate, non un collaudo finale.

### 8.1 Contrasto: valori misurati

Tutti i colori di testo del sistema, misurati sul background `#0b1120`:

| Token | Rapporto | Esito |
|---|---|---|
| `text` `#e6edf3` | 15.94:1 | AAA |
| `muted` `#94a3b8` | 7.34:1 | AAA |
| `accent` `#38bdf8` | 8.79:1 | AAA |
| `accent-2` `#2dd4bf` | 10.12:1 | AAA |
| `accent-3` / pillar-ai `#818cf8` | 6.31:1 | AA |
| `success` `#34d399` | 9.79:1 | AAA |
| `warning` `#fbbf24` | 11.28:1 | AAA |
| `danger` `#f87171` | 6.81:1 | AA |
| `border-strong` `#64748b` | 3.96:1 | AA per elementi non testuali |
| `border` `#1e293b` | 1.29:1 | **solo decorativo** |

Su `surface-2` i valori scendono di circa il 5%: restano tutti sopra soglia.

Testo su fondo pieno: `bg` su `accent` = 8.79:1, `bg` su `danger` = 6.81:1. **Il testo dei bottoni
pieni è sempre `text-bg`, mai bianco:** su questi accenti chiari il bianco perderebbe contrasto.

### 8.2 Focus [in uso]

Un solo stile, globale, non sovrascrivibile per motivi estetici:

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 3px;
  border-radius: 2px;
}
```

**`outline: none` senza sostituto visibile è un bug**, non una scelta di design.

### 8.3 Regole non negoziabili

- **Tastiera:** ogni funzione raggiungibile con Tab, ordine di focus coerente con l'ordine visivo,
  nessuna trappola di focus fuori dai dialog modali.
- **Target:** minimo 44×44px di area interattiva su touch (l'area, non l'elemento visibile).
- **Colore:** mai unico veicolo di informazione (WCAG 1.4.1).
- **Movimento:** `prefers-reduced-motion: reduce` rispettato ovunque.
- **Immagini:** `alt` descrittivo se informative, `alt=""` + `aria-hidden` se decorative. Un logo
  accompagnato dal nome del prodotto è decorativo.
- **Landmark:** `header`, `nav` con `aria-label`, `main`, `footer` presenti su ogni pagina; skip
  link come primo elemento focusabile.
- **Zoom:** il layout regge fino al 200% senza scroll orizzontale.
- **Lingua:** `lang` corretto sull'`html`, `hreflang` sulle alternative per i prodotti bilingui.

### 8.4 Verifica

Ordine consigliato: `axe DevTools` per il grosso, poi navigazione **solo da tastiera** dell'intero
flusso, poi lettura con uno screen reader (VoiceOver su macOS) delle sole schermate critiche.
Il primo controllo trova la maggioranza dei problemi; il secondo trova quelli veri.

---

## 9. Microcopy di interfaccia

Il registro del brand (`brand.md` §1.5, "un pari che ha appena sbattuto la testa") e le
regole di voce (§2.1) valgono anche nelle etichette. In sintesi operativa:

- **Prima persona, diretta.** "Non ho trovato risultati", non "Nessun risultato disponibile".
- **Niente trattini lunghi (—)** in nessuna stringa di UI, `aria-label` compresi. Separatore nei
  titoli: punto mediano (`Prodotto · Sezione`). Negli `aria-label`: la virgola, che gli screen
  reader leggono meglio.
- **I bottoni descrivono l'azione**, non la conferma generica: "Salva le modifiche", non "OK".
- **Gli errori dicono cosa fare.** Non "Errore 422", ma "Questo nome è già in uso, provane un altro".
- **Mai colpevolizzare l'utente.** "Non sono riuscito a caricare i dati", non "Hai inserito dati
  non validi".
- **Niente maiuscolo urlato**, niente punti esclamativi multipli, niente urgenza artificiale.
- **Bilinguismo:** se il prodotto è bilingue, ogni stringa esiste in IT e EN nello stesso commit.
  La traduzione è idiomatica, non letterale.

---

## 10. Adozione su un nuovo prodotto

### Checklist

1. **Copia i token.** Blocco §2.5 (CSS puro) oppure §2.6 (Tailwind v4) come **unica** definizione
   del colore nel progetto. Nessun hex sparso nei componenti.
2. **Installa i font:** `@fontsource-variable/inter` sempre; `@fontsource-variable/newsreader` solo
   se il prodotto ospita lettura long-form.
3. **Imposta le basi globali:** `background`, `color`, `font-family`, `-webkit-font-smoothing`,
   `::selection`, `:focus-visible`, blocco `prefers-reduced-motion`.
4. **Decidi l'ereditarietà del brand** (`brand.md` Parte 4): pilastri, triade e logo FD si
   portano solo se il prodotto è della famiglia First Draft.
5. **Costruisci prima i cinque componenti base:** Button, Input/Field, Card, Dialog, Toast. Coprono
   la quasi totalità di un'applicazione interna.
6. **Definisci i quattro stati di pagina** (§7.11) prima di scrivere la prima vista con dati.
7. **Passa il gate di accessibilità** (§8.3) prima del rilascio, non dopo.

### Manutenzione

- Un valore nuovo (colore, raggio, durata, z-index) **entra prima qui**, poi nel codice.
- Un componente **[esteso]** implementato per la prima volta si promuove a **[in uso]** in questo
  file, con la ricetta reale.
- Se il codice diverge da questo documento, il bug è **nel codice**, salvo decisione esplicita
  registrata qui.
- La coerenza tra `src/styles/global.css` e §2 di questo file è la sola cosa che va verificata a
  ogni modifica di palette. Tutto il resto tollera un po' di ritardo; quella no.

### Documenti collegati

| Documento | Cosa contiene |
|---|---|
| `brand.md` | significato del brand, voce, motivi visivi, asset e script, ereditarietà |
| `editorial-guidelines.md` | regole editoriali dei contenuti del blog |
| `src/styles/global.css` | implementazione dei token sul blog |

`brand.md` e questo file sono la coppia normativa del brand: là il perché, qui il quanto. La
gerarchia completa è in fondo a `brand.md`.
