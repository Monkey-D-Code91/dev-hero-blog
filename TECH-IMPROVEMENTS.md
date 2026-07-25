# The First Draft — Miglioramenti tecnici

_Analisi del 2026-07-17. Proposte ordinate per priorità; ogni voce dice perché serve, non solo cosa fare. Da spuntare o scartare esplicitamente, come la roadmap editoriale._

**Stato al 2026-07-22:** implementati i punti 1-7, 10, 11 (CI, README, zombie, test, anteprima draft, preflight, analytics, pulizia docs, RSS full-content). Aperti in attesa del loro trigger: **8** (rimuovere React, alla prima volta che si tocca la navbar) e **9** (ricerca Pagefind, oltre ~15 articoli pubblicati). Aperti e pronti da fare: **12, 13, 14**, trovati dalla checklist di `site-audit` il 2026-07-22. Per l'analytics resta il solo passo manuale di Marco: incollare il token Cloudflare.

> **Convenzione di stato** (letta dalla skill `roadmap-next`, vedi `.claude/skills/roadmap-next/`).
> **Il marker `— IMPLEMENTATO (YYYY-MM-DD)` nel titolo `###` è il segnale autorevole**: le voci
> senza marker sono aperte. Le voci chiuse da qui in avanti portano anche un paragrafo `**Stato**:`
> con cosa è stato fatto davvero e cosa è rimasto fuori (le voci chiuse prima del 2026-07-22 hanno
> il corpo già scritto come prosa di stato, e vanno bene così).
> Le sezioni "Cosa NON fare" sono decisioni negative: non si implementano mai.

## Lettura d'insieme

Lo stack (Astro 5 statico + Tailwind 4, Cloudflare assets-only, collection Zod con `translationKey`/`authorKey`/`arcKey`) è sano, coerente e proporzionato al progetto. L'architettura bilingue a coppia di file con chiave condivisa è la scelta giusta e va difesa, non sostituita. Il tooling editoriale (`preflight-article.mjs`, `status.mjs`, skill) è il vero asset tecnico del repo: il codice del sito è "finito" per la fase attuale, mentre la pipeline di pubblicazione è dove l'investimento tecnico rende di più.

I problemi reali sono pochi e quasi tutti di **igiene**, non di architettura: manca la CI, il README racconta un progetto che non esiste più, e ci sono due o tre pezzi "zombie" (Keystatic inerte, Giscus placeholder) che creano debito di attenzione.

## Priorità alta

### 1. CI su GitHub Actions (build + preflight) — IMPLEMENTATO (2026-07-17)

Oggi la validazione è tutta manuale e locale, e HANDOFF documenta che nel sandbox la build nemmeno gira (binari nativi macOS). Una CI su `ubuntu-latest` che a ogni PR esegue:

- `npm ci && npx astro build`
- `node scripts/preflight-article.mjs --all`
- `node scripts/status.mjs` (output informativo nel log)

risolve tre problemi in un colpo: nessuna PR di contenuto rompe la build, il preflight diventa un gate e non una buona abitudine, e si ottiene un ambiente Linux riproducibile che elimina i workaround a mano sui binari (`resvg` linux viene installato da npm su Linux senza trucchi). È il prerequisito naturale della routine schedulata già pianificata in HANDOFF: la routine Claude ragiona sulle decisioni, la CI fa i controlli deterministici.

Estensione opzionale: un job che rigenera le cover e fallisce se differiscono da quelle committate (determinismo degli asset verificato, non promesso).

**Stato**: fatto. `.github/workflows/ci.yml` gira su ogni PR e su push a `main` (ubuntu-latest, node 24): `npm ci`, preflight su tutti gli articoli, `npm test` (vitest), `npx astro check`, `npm run build`, più `status.mjs` informativo. Il job "Preflight & build" è il check richiesto dalla branch protection di `main`. **Non fatta** l'estensione opzionale sul determinismo delle cover: resta un'idea aperta, da valutare quando gli asset cambieranno abbastanza spesso da giustificarla.

### 2. Riscrivere il README — IMPLEMENTATO (2026-07-17)

Il README descrive ancora il "sito professionale di personal branding, single-page con Hero/Chi sono/Esperienza": è il progetto di partenza, non The First Draft. Chi arriva dal repo (collaboratori inclusi: esiste una skill di onboarding, ma il README è la prima cosa che si legge) trova una descrizione fuorviante. Va riscritto attorno a: cos'è il blog, la struttura bilingue a `translationKey`, dove vivono contenuti e docs (`docs/brand.md`, `docs/editorial-guidelines.md`), i comandi degli script, il deploy Cloudflare. Mezz'ora di lavoro, alto ritorno.

**Stato**: fatto. Il README ora descrive The First Draft: stack (Astro 5 statico, Tailwind 4, React solo per le island, deploy Cloudflare Workers), tabella dei comandi con gli script di `scripts/`, il pattern bilingue cartella-per-lingua + chiave condivisa (`translationKey`, `authorKey`, `arcKey`), i documenti normativi e il workflow editoriale guidato dalle skill.

### 3. Decidere il destino dei componenti zombie — IMPLEMENTATO (2026-07-17)

- **`keystatic.config.ts`**: eliminato. Era un doppio schema parallelo allo Zod per un CMS mai attivato; il metodo editoriale reale è la co-scrittura via skill. Recuperabile da git se mai servisse.
- **`Comments.astro` (Giscus)**: falso allarme dell'analisi iniziale: Giscus è **già configurato e attivo** (`GISCUS` compilato in `src/config.ts`, widget presente sulle pagine articolo live, categoria Discussions "Ideas"). Nessuna azione necessaria.

### 4. Test sulle funzioni load-bearing — IMPLEMENTATO (2026-07-17)

Implementato con Vitest (`vitest.config.ts` via `getViteConfig`, fixture e mock di
`astro:content` in `tests/`): accoppiamento IT/EN, ereditarietà roadmap→blog, draft
esclusi in produzione, related posts, formatting. `npm test` è un gate della CI.

Contesto originale: zero test nel repo. Non serve una suite: servono test mirati sulle tre logiche che, se si rompono, degradano il sito in silenzio (nessun errore di build, solo output sbagliato):

- accoppiamento IT/EN via `translationKey` (switch lingua, hreflang dei post);
- ereditarietà roadmap→blog (`src/utils/roadmap.ts`: tappe che ereditano titolo/data/URL dal post);
- ordinamento/filtri di `src/utils/blog.ts` (draft esclusi, related posts, upcoming).

`node --test` senza dipendenze nuove basta, agganciato alla CI del punto 1. In alternativa, estendere `preflight`/`status` con questi controlli: sono già il "test runner" di fatto del progetto.

## Priorità media

### 5. Preflight più ricco — IMPLEMENTATO (2026-07-17)

Aggiunti quattro controlli a `scripts/preflight-article.mjs`:

- **link interni** (E): un link a `/blog/<slug>/` o `/en/blog/<slug>/` verso un articolo inesistente, o verso un draft da un pezzo già pubblicato, è un errore bloccante;
- **numero di tag allineato col gemello** (W): i valori dei tag sono tradotti di proposito (`writing`/`scrittura`), quindi si confronta il conteggio, non i valori: un numero diverso segnala un tag perso in una lingua;
- **`focus` non vuoto** (W): senza pilastri tech/human/ai il glifo della triade sparisce.

Nota di calibrazione: la banda "description ottimale 110-160" ipotizzata in analisi è stata **scartata** dopo la verifica: scattava su tutti gli 8 articoli reali (scritti volutamente più lunghi), quindi sarebbe stata rumore. Resta il solo range 50-250 che cattura le description davvero rotte.

### 6. Anteprima dei draft per il gruppo di feedback — IMPLEMENTATO (2026-07-17)

Implementato sulle build di anteprima di Cloudflare Workers Builds: ogni build di un
branch diverso da `main` (es. le PR) include anche gli articoli `draft: true`, con
`noindex, nofollow` e un banner "Anteprima di lavoro" in cima a ogni pagina. La
produzione resta identica. Logica centralizzata in `src/utils/preview.ts`
(`PREVIEW_DRAFTS=1 npm run build` per riprodurla in locale). Flusso per il gruppo di
feedback: aprire una PR col draft e condividere il Preview URL della build Workers.
Il PDF (`scripts/generate-feedback-pdf.py`) resta come canale secondario.

### 7. Web analytics minimale — IMPLEMENTATO (2026-07-17)

Integrato Cloudflare Web Analytics (privacy-first, no cookie, nessun banner). Il beacon è
in `BaseLayout` e viene emesso **solo sul deploy di produzione reale**: escluso in dev e
nelle anteprime Workers, che falserebbero i dati (logica in `src/utils/analytics.ts`).
Token pubblico in `src/config.ts` (`CF_BEACON_TOKEN`), sovrascrivibile dalla env di build
`CF_BEACON_TOKEN` su Workers Builds. **Resta da fare (Marco)**: creare il sito su
Cloudflare Web Analytics e incollare il token, o impostarlo come variabile su Workers
Builds. Finché il token è "", l'analytics è spento e non viene emesso nulla.

Nota: la decisione sul pubblico (gate del case study #6 = solo ok PO, non una soglia)
rende questo un "utile per sapere se vieni letto", non un prerequisito.

## Priorità bassa / opportunistica

### 8. Rimuovere React

React 19 + `@astrojs/react` esistono per una sola island (`MobileMenu.tsx`). Un menu mobile si fa con un `<script>` vanilla in un componente Astro: si tolgono 4 dipendenze e l'unico bundle JS framework del sito. Non urgente (il costo runtime è già minimo grazie alle island), ma è una semplificazione onesta la prima volta che si tocca la navbar. Vincolo: se in roadmap ci sono island interattive future reali, tenerlo.

### 9. Ricerca full-text: non ora, ma con un trigger

Con 4-8 articoli la ricerca è rumore. Fissare il trigger adesso per non ridiscuterlo: **oltre ~15 articoli pubblicati**, aggiungere Pagefind (statico, zero backend, i18n-aware). Prima, la pagina tag basta.

### 10. Pulizia cartelle di lavorazione — IMPLEMENTATO (2026-07-17)

I due documenti di lavorazione eseguiti (`roadmap_design_review.md`,
`roadmap-page-implementation-plan.md`) spostati in `docs/archive/` con un README che ne
spiega lo stato; `docs/` resta ora solo fonte di verità viva (brand, editorial, roadmap,
podcast). `bakeoff/` era una cartella vuota e non tracciata: rimossa in locale (`personas/`
e `feedback/` restano gitignorate, invariate).

### 11. RSS a contenuto completo — IMPLEMENTATO (2026-07-17)

Verifica: i quattro feed (IT, EN, per-autore IT/EN) esponevano solo `description`. Scelta di
Marco: **contenuto completo** con la ricetta ufficiale Astro (`markdown-it` + `sanitize-html`).
Il corpo dell'articolo viene reso in `<content:encoded>`; `typographer` è OFF di proposito
(non deve convertire `--` in trattino lungo, vietato dalle linee guida). Logica condivisa in
`src/utils/rss.ts` (`renderPostContent` + `toRssItem`), che ha anche deduplicato la costruzione
dell'item nei quattro endpoint. Coperto da test.

## Trovati dalla checklist di `site-audit` (2026-07-22)

Emersi mentre si validavano i comandi della checklist della skill `site-audit` sulla `dist/`
esistente, quindi **prima** del primo report formale in `docs/audits/`. Ogni voce porta l'ID del
finding: quando l'audit girerà davvero, questi ID saranno quelli con cui li ritroverà.

### 12. Trattini lunghi nel copy del sito (`BRAND-emdash-copy-sito`) — severità alta

`CLAUDE.md` §4 vieta il trattino lungo in **tutto** il copy del brand, non nei soli articoli. Ma
l'unico controllo automatico che esiste, `preflight-article.mjs`, guarda solo i file degli
articoli: title, meta description, `og:title` e `aria-label` non li vede nessuno. Risultato:
**29 pagine su 33** della build lo contengono fuori dai commenti HTML.

```bash
for f in $(find dist -name "*.html"); do perl -0pe 's/<!--.*?-->//gs' "$f" | grep -q '—' && echo "$f"; done
```

Casi tipici: `<title>First Draft — Blog tech & AI</title>` e la sua `og:title`, i title delle
pagine tag (`#ai — Blog — First Draft`), il title della roadmap, `aria-label={`${name} — ...`}`
in `src/components/landing/AuthorCard.astro:26`. È il testo che finisce nei risultati di ricerca
e nelle anteprime social, cioè il primo contatto con il brand.

Il fix nei sorgenti è meccanico (due punti, virgole, parentesi). La parte che conta davvero è la
seconda: **un controllo automatico che impedisca il ritorno**, o come estensione di
`preflight-article.mjs` sui sorgenti `.astro`/`.ts`, o come test su `dist/` in `tests/`. Senza
quello si ripresenta al primo componente nuovo, e l'audit successivo lo registrerà come
regressione.

### 13. Pagina di lavoro `public/logos/` pubblicata in produzione (`ENTRY-pagina-di-servizio-pubblica`) — severità media

`dist/logos/index.html` viene deployato ed è raggiungibile. È una pagina di confronto tra le
opzioni di logo: nessun canonical, nessuna description, nessun OG, nessun hreflang, e mostra
anche le alternative scartate quando l'unico logo ufficiale è `fd-3-nib.svg` (`CLAUDE.md` §5).

```bash
for f in $(find dist -name "*.html"); do grep -q 'rel="canonical"' "$f" || echo "$f"; done
```

Decisione binaria, non un lavoro: o è una pagina pubblica e allora va curata come le altre, o è
materiale di lavoro e allora esce dal deploy (fuori da `public/`, o esclusa dalla build). La
seconda sembra quella giusta, ma è una scelta di Marco.

### 14. Il title di `/blog` dice "Marco Mariotti", non "First Draft" (`SEO-title-incoerente`) — severità media

`dist/blog/index.html` ha `<title>Blog — Marco Mariotti</title>`, residuo del sito di personal
branding da cui il progetto è partito. Tutto il resto del sito si presenta come First Draft, e la
pagina in questione è l'indice degli articoli: è la più probabile porta d'ingresso da ricerca dopo
i singoli pezzi. Vale la pena passare in rassegna i title di tutte le pagine non-articolo nella
stessa occasione, non solo questo.

## Cosa NON fare (anti-roadmap tecnica)

- **Niente SSR / backend / database**: nessun requisito attuale lo giustifica; lo statico è un vantaggio competitivo di manutenzione.
- **Niente CMS con UI** (vedi punto 3): il flusso editoriale reale è git + skill, e funziona.
- **Niente redesign**: il design system è appena stato consolidato (PR #6-7); il brand vive di coerenza, non di novità.
- **Niente automazione della scrittura**: il valore del blog è che i pezzi NON sono generabili. Il tooling automatizza la confezione (preflight, cover, PDF), mai il contenuto. Questo confine è identitario, non tecnico.
