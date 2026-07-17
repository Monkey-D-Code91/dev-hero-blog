# The First Draft — Miglioramenti tecnici

_Analisi del 2026-07-17. Proposte ordinate per priorità; ogni voce dice perché serve, non solo cosa fare. Da spuntare o scartare esplicitamente, come la roadmap editoriale._

## Lettura d'insieme

Lo stack (Astro 5 statico + Tailwind 4, Cloudflare assets-only, collection Zod con `translationKey`/`authorKey`/`arcKey`) è sano, coerente e proporzionato al progetto. L'architettura bilingue a coppia di file con chiave condivisa è la scelta giusta e va difesa, non sostituita. Il tooling editoriale (`preflight-article.mjs`, `status.mjs`, skill) è il vero asset tecnico del repo: il codice del sito è "finito" per la fase attuale, mentre la pipeline di pubblicazione è dove l'investimento tecnico rende di più.

I problemi reali sono pochi e quasi tutti di **igiene**, non di architettura: manca la CI, il README racconta un progetto che non esiste più, e ci sono due o tre pezzi "zombie" (Keystatic inerte, Giscus placeholder) che creano debito di attenzione.

## Priorità alta

### 1. CI su GitHub Actions (build + preflight)

Oggi la validazione è tutta manuale e locale, e HANDOFF documenta che nel sandbox la build nemmeno gira (binari nativi macOS). Una CI su `ubuntu-latest` che a ogni PR esegue:

- `npm ci && npx astro build`
- `node scripts/preflight-article.mjs --all`
- `node scripts/status.mjs` (output informativo nel log)

risolve tre problemi in un colpo: nessuna PR di contenuto rompe la build, il preflight diventa un gate e non una buona abitudine, e si ottiene un ambiente Linux riproducibile che elimina i workaround a mano sui binari (`resvg` linux viene installato da npm su Linux senza trucchi). È il prerequisito naturale della routine schedulata già pianificata in HANDOFF: la routine Claude ragiona sulle decisioni, la CI fa i controlli deterministici.

Estensione opzionale: un job che rigenera le cover e fallisce se differiscono da quelle committate (determinismo degli asset verificato, non promesso).

### 2. Riscrivere il README

Il README descrive ancora il "sito professionale di personal branding, single-page con Hero/Chi sono/Esperienza": è il progetto di partenza, non The First Draft. Chi arriva dal repo (collaboratori inclusi: esiste una skill di onboarding, ma il README è la prima cosa che si legge) trova una descrizione fuorviante. Va riscritto attorno a: cos'è il blog, la struttura bilingue a `translationKey`, dove vivono contenuti e docs (`docs/brand.md`, `docs/editorial-guidelines.md`), i comandi degli script, il deploy Cloudflare. Mezz'ora di lavoro, alto ritorno.

### 3. Decidere il destino dei componenti zombie

Due pezzi dichiaratamente inerti che però chiedono manutenzione mentale:

- **`keystatic.config.ts`**: è un doppio schema parallelo allo Zod ("se aggiungi un campo aggiornalo in ENTRAMBI") per un CMS mai attivato. Il metodo editoriale reale è la co-scrittura via skill, non un form: la probabilità di attivare Keystatic è bassa e il costo del drift è certo. **Raccomandazione: eliminarlo** (il commento nel file stesso dice come). Recuperabile da git se mai servisse.
- **`Comments.astro` (Giscus)**: **deciso (2026-07-17): si attiva Giscus.** Il repo è già pubblico con Discussions abilitate; restano da fare: installare la app giscus sul repo, creare la categoria dedicata (es. "Commenti blog"), recuperare `repoId`/`categoryId` da giscus.app e compilarli in `src/config.ts`.

### 4. Test sulle funzioni load-bearing

Zero test nel repo. Non serve una suite: servono test mirati sulle tre logiche che, se si rompono, degradano il sito in silenzio (nessun errore di build, solo output sbagliato):

- accoppiamento IT/EN via `translationKey` (switch lingua, hreflang dei post);
- ereditarietà roadmap→blog (`src/utils/roadmap.ts`: tappe che ereditano titolo/data/URL dal post);
- ordinamento/filtri di `src/utils/blog.ts` (draft esclusi, related posts, upcoming).

`node --test` senza dipendenze nuove basta, agganciato alla CI del punto 1. In alternativa, estendere `preflight`/`status` con questi controlli: sono già il "test runner" di fatto del progetto.

## Priorità media

### 5. Preflight più ricco

Il preflight è ottimo; tre controlli che oggi mancano e che costano poco:

- **link interni**: gli articoli si citano a vicenda ("dittici", richiami tra #2 e #3); un link a uno slug rinominato o a un draft non pubblicato non viene rilevato da nulla;
- **coerenza dei tag** tra le due lingue della coppia (i tag sono per lingua e possono divergere silenziosamente);
- **lunghezza `description`** (target SEO/OG ~150-160 caratteri) e presenza di `focus` non vuoto.

### 6. Anteprima dei draft per il gruppo di feedback

**Deciso (2026-07-17): si fa, canale principale al posto dei PDF.** Da implementare dopo la CI (riusa lo stesso workflow).

Oggi il feedback pre-pubblicazione passa da PDF generati (weasyprint, binari nativi, workaround sandbox). Un deploy di preview (branch → Cloudflare, build con `DRAFT=1` che include i draft, `noindex` globale) darebbe al gruppo la pagina reale: tipografia vera, cover vera, link cliccabili, e un solo URL da rigenerare invece di un PDF per giro di revisione. Il PDF può restare per chi lo preferisce, ma smette di essere l'unico canale. Da fare dopo la CI (riusa lo stesso workflow).

### 7. Web analytics minimale

Non c'è alcuna misura: non sai se un articolo è stato letto da 30 o 3.000 persone, né da quale canale. Per un progetto che ragiona su "quando il blog avrà un pubblico" (vincolo esplicito della roadmap sul case study), un segnale serve. Cloudflare Web Analytics (già dentro l'ecosistema di deploy, privacy-first, uno script) o Plausible/Umami se si vuole di più. Nessun cookie banner necessario.

## Priorità bassa / opportunistica

### 8. Rimuovere React

React 19 + `@astrojs/react` esistono per una sola island (`MobileMenu.tsx`). Un menu mobile si fa con un `<script>` vanilla in un componente Astro: si tolgono 4 dipendenze e l'unico bundle JS framework del sito. Non urgente (il costo runtime è già minimo grazie alle island), ma è una semplificazione onesta la prima volta che si tocca la navbar. Vincolo: se in roadmap ci sono island interattive future reali, tenerlo.

### 9. Ricerca full-text: non ora, ma con un trigger

Con 4-8 articoli la ricerca è rumore. Fissare il trigger adesso per non ridiscuterlo: **oltre ~15 articoli pubblicati**, aggiungere Pagefind (statico, zero backend, i18n-aware). Prima, la pagina tag basta.

### 10. Pulizia cartelle di lavorazione

`bakeoff/` è vuota e versionata? (verificare), `personas/` e `feedback/` sono già gitignorate ma presenti in locale, `docs/roadmap_design_review.md` e `docs/roadmap-page-implementation-plan.md` sono documenti di lavorazione ormai eseguiti. Spostare i doc storici in `docs/archive/` (o eliminarli: sono in git) per tenere `docs/` come fonte di verità viva: oggi convivono documenti normativi (brand, editorial) e appunti di progetto esauriti.

### 11. RSS: verificare contenuto completo

Il manifesto è anti-algoritmo e l'RSS è il canale distributivo coerente con quel posizionamento (c'è già la nota a fine articolo). Verificare che i feed IT/EN espongano il **contenuto completo** e non solo il summary: un feed monco spinge il lettore RSS di nuovo dentro il browser, contro la promessa.

## Cosa NON fare (anti-roadmap tecnica)

- **Niente SSR / backend / database**: nessun requisito attuale lo giustifica; lo statico è un vantaggio competitivo di manutenzione.
- **Niente CMS con UI** (vedi punto 3): il flusso editoriale reale è git + skill, e funziona.
- **Niente redesign**: il design system è appena stato consolidato (PR #6-7); il brand vive di coerenza, non di novità.
- **Niente automazione della scrittura**: il valore del blog è che i pezzi NON sono generabili. Il tooling automatizza la confezione (preflight, cover, PDF), mai il contenuto. Questo confine è identitario, non tecnico.
