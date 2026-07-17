# Pagina "Roadmap" — Piano di implementazione

_Versione B · Capitoli editoriali — narrativo per archi, con date e collaboratori_
_Ultimo aggiornamento: 2026-07-17 · Autore: Marco (con Claude)_

---

## 1. Obiettivo funzionale

Aggiungere al blog una pagina pubblica `/roadmap` (+ `/en/roadmap`) che racconti la
direzione editoriale di First Draft come una serie di **archi narrativi** (capitoli),
ciascuno con un occhiello introduttivo, una barra di avanzamento e le sue tappe
(articoli). Ogni tappa mostra stato (pubblicato / in lavorazione / in programma),
data indicativa, focus tematico e firma (Marco o collaboratore).

È la versione reader-facing del documento interno `docs/content-roadmap.md`: comunica
trasparenza e visione senza esporre le note strategiche riservate.

### Non-obiettivi (v1)
- Nessun editing/commenti lato utente sulla roadmap.
- Nessuna sincronizzazione automatica bidirezionale con `content-roadmap.md`
  (resta la fonte strategica interna; la pagina ha la sua fonte dati curata).
- Nessun filtro/ricerca interattivi (rimandati a v2 se la lista cresce).

---

## 2. Decisione di architettura — fonte dati (ADR)

Serve una fonte dati strutturata per archi e tappe. Due opzioni, con trade-off.

### Opzione A — Content collection `roadmap` (**raccomandata**)
Una collection Astro `roadmap`, un file markdown per **arco** per lingua (mirror del
pattern bilingue già usato da `blog` e `authors`: cartella `it/` ed `en/` + chiave
condivisa). Il frontmatter contiene i metadati dell'arco e l'array ordinato delle tappe.

**Pro**
- Coerente con l'architettura esistente (`content.config.ts`, glob loader, zod).
- Type-safe: schema zod valida stato, date, focus, riferimenti autore.
- Editabile via **Keystatic** (la PO/Bettina può aggiornarla senza toccare il codice).
- Le tappe già pubblicate possono referenziare il `translationKey` di un post e
  ereditarne titolo/data/cover a build-time → **single source of truth**, zero drift.

**Contro**
- Setup iniziale leggermente più verboso (schema + config Keystatic).
- Item array nel frontmatter: la validazione di relazioni (item→post) va fatta in `utils`.

### Opzione B — Modulo TypeScript tipizzato `src/data/roadmap.ts`
Un file TS con array `arcs` tipizzati (interfaccia + `as const`), i18n via due export.

**Pro**
- Il più semplice e diretto; tutto tipizzato in un punto solo.
- Nessuna dipendenza da collection/Keystatic.

**Contro**
- Non editabile da CMS: ogni modifica editoriale richiede un commit di codice.
- Le stringhe bilingui vivono nel codice sorgente (meno pulito per contenuti).

**Raccomandazione:** Opzione A. Motiva la scelta il fatto che la roadmap è **contenuto
editoriale** che cambierà spesso e che la PO deve poter aggiornare. Se preferisci partire
veloce e rimandare Keystatic, l'Opzione B è un fallback legittimo e migrabile ad A senza
riscrivere i componenti (dipendono da un tipo `RoadmapArc`, non dalla sorgente).

---

## 3. Modello dati (Opzione A)

Nuova collection in `src/content.config.ts`:

```ts
const roadmap = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/roadmap" }),
  schema: () =>
    z.object({
      arcKey: z.string(),            // chiave condivisa IT/EN dello stesso arco (es. "arco-1")
      order: z.number(),             // ordine di visualizzazione degli archi
      numeral: z.string(),           // "I", "II" (etichetta visiva del capitolo)
      title: z.string(),             // "La disciplina del codice generato"
      lead: z.string(),              // occhiello narrativo (1-2 frasi)
      period: z.string(),            // "Lug – Set 2026"
      signature: z.string(),         // "a firma Marco" / "arco corale"
      items: z.array(
        z.object({
          // se presente, eredita titolo/data/cover dal post pubblicato:
          postTranslationKey: z.string().optional(),
          // campi manuali (obbligatori per le tappe di pipeline non ancora pubblicate):
          title: z.string().optional(),
          date: z.string(),                 // data indicativa "2026-08-23" o "Ago 2026"
          status: z.enum(["published", "in-progress", "planned"]),
          focus: z.array(z.string()).default([]),  // ["Tech","AI"]
          authorName: z.string(),           // "Marco Mariotti" / "Fabio Ziliani"
          collaborator: z.boolean().default(false),
        })
      ),
    }),
});
export const collections = { blog, authors, roadmap };
```

Regola di validazione (in `utils/roadmap.ts`, non nello schema): ogni item deve avere
**o** `postTranslationKey` **o** `title`. Se ha `postTranslationKey`, i campi ereditati
(titolo, data pub, cover, url) vincono su quelli manuali.

**Esempio contenuto** `src/content/roadmap/it/arco-1.md`:
```yaml
---
arcKey: arco-1
order: 1
numeral: "I"
title: La disciplina del codice generato
lead: Dal controllare il codice al leggerlo, fino al confine di ciò che non deleghiamo.
period: Lug – Set 2026
signature: a firma Marco
items:
  - postTranslationKey: la-sottile-linea-del-codice
    date: 2026-07-14
    status: published
    focus: [Tech, AI]
    authorName: Marco Mariotti
  - title: Nell'era dell'AI si legge più di quanto si scrive
    date: 2026-07-24
    status: in-progress
    focus: [Tech, Human]
    authorName: Marco Mariotti
---
```

---

## 4. Componenti (modulari, `src/components/roadmap/`)

| Componente | Responsabilità | Props principali |
|---|---|---|
| `RoadmapHero.astro` | Titolo pagina, occhiello, 3 stat card (avanzamento arco I, pipeline, firme) | `stats`, `lang` |
| `RoadmapArc.astro` | Un capitolo: numeral, titolo, lead, periodo, barra avanzamento, griglia item | `arc: ResolvedArc`, `lang` |
| `RoadmapItemCard.astro` | Singola tappa: badge stato, data, titolo (link se pubblicato), focus, firma | `item: ResolvedItem`, `lang` |
| `RoadmapProgress.astro` | Barra avanzamento accessibile (`role="progressbar"` + testo) | `done`, `total` |

Riuso stilistico: gli stessi token del design system (`bg-surface-2`, `border-border`,
`text-accent`, `text-accent-2`, `data-reveal`) e le stesse convenzioni di `PostCard.astro`
(card `rounded-2xl border`, hover `border-accent/40`). Nessun nuovo colore.

Stati → colore + testo (mai solo colore, per WCAG 1.4.1):
- `published` → accent azzurro `#38bdf8`, label "✓ Pubblicato".
- `in-progress` → teal `#2dd4bf`, anello vuoto, label "In lavorazione".
- `planned` → muted `#64748b`, label "In programma".
- `collaborator: true` → aggiunge la firma evidenziata (es. viola) accanto al focus.

---

## 5. Logica (`src/utils/roadmap.ts`)

Funzioni pure, testabili, isolate dai componenti:

- `getRoadmapArcs(lang)` → carica la collection per lingua, ordina per `order`.
- `resolveArc(arc, posts, lang)` → per ogni item: se `postTranslationKey`, risolve dal
  blog (titolo, data, cover, URL via `getBlogPostUrl`); calcola `href` solo per i pubblicati.
- `computeProgress(items)` → `{ done, total }` contando gli item `status: published`.
- `getRoadmapStats(arcs)` → aggregati per l'hero (pubblicati/totali arco I, pipeline, n. firme).

Il collegamento item→post usa `translationKey` (già presente nello schema `blog`) così un
articolo tradotto risolve nella lingua corretta senza duplicare dati.

---

## 6. Routing, i18n, navigazione

**Pagine** (mirror del pattern `pages/blog/index.astro`):
- `src/pages/roadmap/index.astro` (lang `it`, `path="/roadmap/"`).
- `src/pages/en/roadmap/index.astro` (lang `en`, `path="/en/roadmap/"`).

Entrambe: `BaseLayout` + `Navbar` (con `itHref`/`enHref` corretti per lo switch lingua)
+ `main#main` + `Footer`, come le altre pagine.

**i18n** (`src/i18n/ui.ts`): aggiungere una sezione `roadmap` per IT ed EN:
`nav` (etichetta menu "Roadmap"/"Roadmap"), `heading`, `lead`, `stats.*`,
`status.published|inProgress|planned`, `collaborator`. Le stringhe di contenuto degli
archi vivono nella collection, non qui.

**Navbar** (`src/components/Navbar.astro`): aggiungere la voce Roadmap all'array `links`,
tra Blog e Autori:
```ts
const roadmapHref = lang === "it" ? "/roadmap/" : "/en/roadmap/";
// ...
{ href: roadmapHref, label: t.roadmap.nav },
```
`isActive` funziona già con `startsWith`. `MobileMenu` riceve `links` come prop → si
aggiorna in automatico.

---

## 7. SEO / meta / structured data

- `BaseLayout` già gestisce canonical, hreflang, OG. Passare `hreflangIt="/roadmap/"`,
  `hreflangEn="/en/roadmap/"`.
- **JSON-LD**: `CreativeWorkSeries` (o `ItemList` di `BlogPosting`) per esporre l'arco
  editoriale ai motori. Costruito in `utils/structuredData.ts` (dove vivono già gli altri).
- **OG image**: v1 riusa `/og-image.png`. Opzionale v2: rotta OG dedicata
  (`pages/og/...`) con titolo "Roadmap" — lo generatore esiste già (`utils/og.ts`).

---

## 8. Accessibilità (target: parità con il resto del sito, WCAG AA)

- Gerarchia heading: `h1` = titolo pagina, `h2` = titolo di ogni arco, item come `h3`.
- Barra avanzamento: `role="progressbar"` + `aria-valuenow/min/max` + testo "2 di 6".
- Stato mai veicolato dal solo colore: sempre label testuale.
- `data-reveal` rispetta già `prefers-reduced-motion` (vedi `global.css`).
- Focus visibile ereditato dallo stile globale; link tappa = titolo (target ≥ 24px).
- Contrasto: accent/teal su navy già validati altrove; le label muted su card ≥ 4.5:1.

---

## 9. Keystatic (se Opzione A)

Aggiungere in `keystatic.config.ts` una collection `roadmap` con:
- `path: src/content/roadmap/*/` (per-lingua, come blog/authors),
- campi: `arcKey`, `order`, `numeral`, `title`, `lead`, `period`, `signature`,
- `items` come `fields.array` di oggetti (con `select` per lo `status`).

Così Bettina può aggiornare la pipeline dalla UI di Keystatic.

---

## 10. Documentazione (requisito interno)

- **Tecnica**: questo file + commenti negli schemi/utils (stile già in uso).
- **Funzionale**: breve sezione in `docs/editorial-guidelines.md` su cosa mostra la
  pagina, come si aggiorna una tappa e la regola "date indicative, non promesse".

---

## 11. Fasi e stima

| Fase | Contenuto | Output | Stima | Stato |
|---|---|---|---|---|
| 0 | Schema collection + contenuto reale (2 archi IT/EN) | `content.config.ts`, `src/content/roadmap/**` | 0.5 g | ✅ Fatto |
| 1 | `utils/roadmap.ts` (+ tipi) e risoluzione item→post | `src/utils/roadmap.ts` | 0.5 g | ✅ Fatto |
| 2 | Componenti (Hero, Arc, ItemCard, Progress, Upcoming) | `src/components/roadmap/**` | 1 g | ✅ Fatto |
| 3 | Pagine IT/EN + i18n + voce Navbar | `pages/roadmap/**`, `i18n/ui.ts`, `Navbar.astro` | 0.5 g | ✅ Fatto |
| 4 | JSON-LD + Keystatic | `structuredData.ts`, `keystatic.config.ts` | 0.5 g | ✅ Fatto |
| 5 | A11y/responsive/reduced-motion + doc + verifica | — | 0.5 g | 🟡 Parziale |

**Totale indicativo: ~3.5 giornate/uomo.** (Opzione B taglia ~0.5 g su fase 0/4.)

### Stato implementazione — 2026-07-17

Implementate le fasi 0–4 e la parte documentale della fase 5 (nota funzionale in
`editorial-guidelines.md`). Decisioni applicate: Opzione A (collection + Keystatic);
date esatte solo per pubblicati + prossima tappa, mese altrimenti; traduzioni EN
scritte; track etica nascosto con `upcomingTeaser` "In arrivo" in coda all'Arco II.

**Verifica ancora da completare in locale (fase 5):** `npx astro check` e
`npm run build` non sono stati eseguiti in ambiente sandbox perché `node_modules`
contiene binari nativi macOS (rollup/esbuild/sharp) non compatibili con Linux; per
non alterare l'ambiente locale non è stato reinstallato. Verificati invece:
la logica date/prossima-tappa con un test standalone (output atteso: Arco I 2/8,
data esatta solo fino a "La sottile linea del codice"), la coerenza di import/export
e delle chiavi i18n, la validità del pattern "funzione nel dizionario i18n"
(già usato da `authorPostsHeading`), e il **parsing YAML dei 4 file arco con un
parser reale** (tutti gli item con id/data/stato validi, teaser presenti). In fase
di verifica è emerso e stato corretto un bug: i titoli con `#` e `:` (es. "Musica
#1: l'origine") vanno **quotati**, altrimenti YAML tronca il valore (spazio+`#`
avvia un commento). Restano da fare in locale: `astro check`, build di produzione,
audit a11y e prova responsive/reduced-motion sul reso reale.

**Nota stile — risolta (2026-07-17):** i titoli di lavoro delle tappe sono stati
uniformati sostituendo il trattino lungo con i due punti (es. "Musica #1: l'origine"),
in linea con "Case study: 22s → 1.1s" e con la regola di `editorial-guidelines.md`.
Restano l'en-dash di "Italia–Albania" e la freccia "→", che non sono trattini lunghi.

---

## 12. Verifica (definition of done)

- [ ] `astro check` senza errori di tipo; `astro build` verde.
- [ ] `/roadmap` e `/en/roadmap` rendono; switch lingua corretto in entrambe.
- [ ] Le tappe pubblicate linkano al post giusto; le pipeline non hanno link.
- [ ] Barra avanzamento e stat coerenti con i dati (conteggio pubblicati).
- [ ] Navbar: voce Roadmap attiva sulle due pagine, presente anche nel MobileMenu.
- [ ] Audit a11y (skill `design:accessibility-review` o Lighthouse) ≥ AA, 0 blocker.
- [ ] Responsive: capitoli e griglia item impilano bene < 640px.
- [ ] `prefers-reduced-motion`: nessuna animazione forzata.

---

## 13. Decisioni aperte (da confermare prima di iniziare)

1. **Fonte dati**: Opzione A (collection + Keystatic) o B (file TS)? — _raccomando A_.
2. **Date lontane**: mostrare la data esatta anche per pezzi a 2+ mesi, o degradare a
   "mese/trimestre" oltre l'arco corrente per ridurre lo staleness? — _raccomando: data
   esatta solo per pubblicato + prossima tappa; "mese" per il resto._
3. **Traduzioni EN**: chi scrive i lead/titoli EN degli archi non ancora pubblicati?
4. **Track etica**: mostrare i placeholder "AI ed etica #1…N" o tenerli nascosti finché
   non definiti col collaboratore?
