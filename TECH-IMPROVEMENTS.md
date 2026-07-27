# The First Draft — Miglioramenti tecnici

_Analisi del 2026-07-17. Proposte ordinate per priorità; ogni voce dice perché serve, non solo cosa fare. Da spuntare o scartare esplicitamente, come la roadmap editoriale._

**Stato al 2026-07-27:** implementati i punti 1-7, 9, 10, 11, 13 (CI, README, zombie, test, anteprima draft, preflight, analytics, pulizia docs, RSS full-content, ricerca Pagefind, pagina di lavoro `public/logos/` esclusa dal deploy). Aperto in attesa del suo trigger: **8** (rimuovere React, alla prima volta che si tocca la navbar). Chiusi il 2026-07-25: **12** (trattini lunghi nel copy, con guardia automatica) e **14** (title di /blog). Per l'analytics resta il solo passo manuale di Marco: incollare il token Cloudflare.

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

### 9. Ricerca full-text — IMPLEMENTATO (2026-07-27)

Con 4-8 articoli la ricerca è rumore. Fissare il trigger adesso per non ridiscuterlo: **oltre ~15 articoli pubblicati**, aggiungere Pagefind (statico, zero backend, i18n-aware). Prima, la pagina tag basta.

**Stato**: implementata in anticipo sul trigger (8 articoli, non ancora 15) su richiesta di Marco, per non doverla ridiscutere più avanti. Integrazione `astro-pagefind`, che indicizza a build time nell'hook `astro:build:done` (nessun passo CI aggiuntivo: `npm run build` produce già `dist/pagefind/`) e serve l'indice già costruito in `astro dev`.

Tre decisioni prese insieme a Marco. (1) **Scope solo articoli**: `data-pagefind-body` sull'`<article>` di `BlogPostLayout.astro`. Una volta presente su una pagina del sito, Pagefind indicizza *solo* le pagine che portano l'attributo: homepage, roadmap, autori e domande aperte restano fuori senza doverle escludere una per una. (2) **Ricerca per lingua corrente, non incrociata**: zero-config, comportamento nativo di Pagefind che legge l'attributo `lang` dell'`<html>` (già impostato da `BaseLayout`) e costruisce un indice indipendente per IT ed EN; su `/blog` si cerca solo tra gli articoli IT, su `/en/blog` solo tra gli EN. (3) **UI**: icona di ricerca in `Navbar.astro` (`pagefind-modal-trigger` in modalità `compact`) che apre un overlay (`pagefind-modal`), entrambi web component nativi di Pagefind 1.5+ (zero React aggiuntivo, coerente con la direzione del punto 8). Ricolorati via CSS custom properties `--pf-*` in `global.css` sulla palette navy di `docs/brand.md` (il sito è sempre dark, niente `prefers-color-scheme`).

**Non fatto**: metadata di risultato oltre al titolo (es. immagine di copertina nei risultati) — il default di Pagefind (titolo + estratto con evidenziazione del match) è già utile con 8 articoli; da rivalutare se la lista dei risultati diventa affollata.

Nota d'ambiente: nel sandbox di sviluppo usato per questa implementazione, `npm run build` fallisce per un limite noto del filesystem montato (vedi §7 di `CLAUDE.md`: qui è la fase di pulizia interna di Astro a non riuscire a rimuovere i file temporanei, non l'indicizzazione Pagefind in sé). `npx astro check` (0 errori) e `npm test` (51/51) passano regolarmente nello stesso ambiente. **La build va comunque validata in locale da Marco prima del merge**, come da regola generale del progetto.

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

### 12. Trattini lunghi nel copy del sito (`BRAND-emdash-copy-sito`) — severità alta — IMPLEMENTATO (2026-07-25)

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

**Stato**: corrette **24 occorrenze in 21 file** e, soprattutto, aggiunta la guardia che impedisce il ritorno: `scripts/check-copy.mjs` (sola lettura, exit 1 sulle violazioni) piu' `tests/copy-guard.test.ts`, quindi **bloccante in CI** attraverso `npm test`. A differenza del drift IT/EN, un trattino lungo nel copy non e' una decisione editoriale ma una violazione deterministica di `CLAUDE.md` §4: bloccare e' corretto.

Tre scelte. (1) **Controllo sui sorgenti, non su `dist/`**: in CI `npm test` gira **prima** di `npm run build`, quindi un controllo su `dist/` leggerebbe una build vecchia o assente. (2) **I commenti di codice non sono violazioni** e vengono rimossi prima di cercare (JSDoc, blocco, riga, HTML): dei 62 trattini presenti nei sorgenti, 38 erano commenti. Lo stripping dei commenti di riga scatta solo quando `//` apre la riga, altrimenti un `https://` dentro una stringa troncherebbe la riga e nasconderebbe violazioni vere; c'e' un test apposta. (3) **Solo l'em dash**: il trattino medio (–) e' stato escluso di proposito, perche' nei range di date ("Ott 2024 – Oggi") e' la forma tipograficamente corretta e vietarlo produrrebbe solo falsi positivi. Resta il buco teorico di chi scrive – al posto di —: se capitasse, si aggiunge una riga a `FORBIDDEN`.

Come separatore nei title e' stato scelto il **punto mediano** (`First Draft · Blog tech & AI`), che e' gia' il segno del brand (la triade tech · human · AI). Eccezione: nell'`aria-label` di `AuthorCard` si usa la **virgola**, perche' il punto mediano viene letto male dagli screen reader. Nella prosa (bio, meta description) si usano due punti o virgola, come prescrive `CLAUDE.md` §4.

**Non fatto** di proposito: gli articoli non sono toccati, li copre gia' `preflight-article.mjs`. La riga 1 della checklist di `site-audit` e' stata aggiornata per puntare al controllo automatico invece che al grep manuale su `dist/`.

### 13. Pagina di lavoro `public/logos/` pubblicata in produzione (`ENTRY-pagina-di-servizio-pubblica`) — severità media — IMPLEMENTATO (2026-07-27)

`dist/logos/index.html` viene deployato ed è raggiungibile. È una pagina di confronto tra le
opzioni di logo: nessun canonical, nessuna description, nessun OG, nessun hreflang, e mostra
anche le alternative scartate quando l'unico logo ufficiale è `fd-3-nib.svg` (`CLAUDE.md` §5).

```bash
for f in $(find dist -name "*.html"); do grep -q 'rel="canonical"' "$f" || echo "$f"; done
```

Decisione binaria, non un lavoro: o è una pagina pubblica e allora va curata come le altre, o è
materiale di lavoro e allora esce dal deploy (fuori da `public/`, o esclusa dalla build). La
seconda sembra quella giusta, ma è una scelta di Marco.

**Stato**: Marco ha scelto di escluderla dal deploy. `public/logos/index.html` e le quattro SVG
delle opzioni scartate (`fd-1-monogram`, `fd-2-caret`, `fd-4-pilcrow`, `fd-5-wordmark`) spostate
in `docs/archive/logo-options/` (con una copia di `fd-3-nib.svg` per tenere la pagina di
confronto autosufficiente; percorsi delle immagini nell'HTML resi relativi di conseguenza). In
`public/logos/` restano solo `fd-3-nib.svg` e `fd-3-nib.png`, gli unici usati dal codice
(`src/config.ts`, `src/utils/og.ts`): dopo la build, `/logos/` come pagina non esiste più, i due
asset restano serviti come file statici (corretto: sono l'unico logo ufficiale, non "materiale
di lavoro"). Nessun'altra reference nel codice puntava alle quattro SVG scartate, quindi lo
spostamento non ha toccato nient'altro. La riga 2 della checklist `site-audit` (`BRAND-logo-non-ufficiale`)
resta valida così com'è: verificava già solo i riferimenti da `src/`, non da `public/`.

### 14. Il title di `/blog` dice "Marco Mariotti", non "First Draft" (`SEO-title-incoerente`) — severità media — IMPLEMENTATO (2026-07-25)

`dist/blog/index.html` ha `<title>Blog — Marco Mariotti</title>`, residuo del sito di personal
branding da cui il progetto è partito. Tutto il resto del sito si presenta come First Draft, e la
pagina in questione è l'indice degli articoli: è la più probabile porta d'ingresso da ricerca dopo
i singoli pezzi. Vale la pena passare in rassegna i title di tutte le pagine non-articolo nella
stessa occasione, non solo questo.

**Stato**: `src/pages/blog/index.astro` e la gemella EN ora compongono il title come `Blog · ${BLOG.name}`. Chiuso insieme al punto 12 perche' erano esattamente le stesse righe: riscriverle per il trattino lungo e lasciarci "Marco Mariotti" avrebbe significato reintrodurre a mano un bug noto.

Fatta anche la rassegna dei title di tutte le pagine non-articolo suggerita dalla voce. Emerse due cose oltre a /blog: sei pagine (roadmap, domande aperte, newsletter, IT ed EN) avevano la stringa **"First Draft" hardcoded** invece di `BLOG.name`, ora normalizzate, cosi' il nome del brand ha una sola fonte; e gli **articoli non portano il brand nel title** (`title={post.data.title}`, senza suffisso), a differenza di ogni altra pagina. Su quest'ultima **e' stata presa una decisione esplicita il 2026-07-25: resta cosi'**, e la motivazione sta in "Cosa NON fare". Non e' un residuo da sistemare.

## Cosa NON fare (anti-roadmap tecnica)

- **Niente brand nel `<title>` degli articoli** (deciso il 2026-07-25). Ogni altra pagina porta il suffisso `· First Draft`, gli articoli no, e va bene cosi': l'asimmetria non e' una svista. Le pagine di elenco hanno titoli generici (`Blog`, `Autori`, `#ai`) che senza il brand sarebbero inidentificabili in un risultato di ricerca; il titolo di un articolo e' gia' specifico ed e' l'unica cosa che guadagna il click da una ricerca sull'argomento, quindi il brand li' compete per spazio con l'informazione che conta. Il brand resta comunque visibile in SERP nel dominio (`thefirstdraft.dev`) e nella cover OG. Numeri considerati: col suffisso 7 titoli su 8 restano sotto i ~60 caratteri utili (uno sfora di 3), e quando Google riscrive un title la modifica piu' frequente e' proprio la rimozione del brand. Valutate e scartate anche la variante "brand solo in `og:title`" (due valori da mantenere invece di uno, per un canale dove il dominio e' gia' mostrato). Se un giorno la riconoscibilita' del brand diventasse il collo di bottiglia misurato, si riapre con un dato in mano, non per coerenza estetica.

- **Niente SSR / backend / database**: nessun requisito attuale lo giustifica; lo statico è un vantaggio competitivo di manutenzione.
- **Niente CMS con UI** (vedi punto 3): il flusso editoriale reale è git + skill, e funziona.
- **Niente redesign**: il design system è appena stato consolidato (PR #6-7); il brand vive di coerenza, non di novità.
- **Niente automazione della scrittura**: il valore del blog è che i pezzi NON sono generabili. Il tooling automatizza la confezione (preflight, cover, PDF), mai il contenuto. Questo confine è identitario, non tecnico.
