# The First Draft — Brand

Fonte di verità del brand: perché esiste, per chi, con quale voce, con quali simboli, con quali
asset. Il **come si implementa** sta in `DESIGN-SYSTEM.md`, che è il suo compagno tecnico: dove
questo documento cita un colore o una dimensione lo fa per spiegarne il senso, i valori autorevoli
sono là. I due file sono l'unica coppia normativa del brand, e la gerarchia completa è in fondo.

**Versione:** 3.0 · **Ultimo aggiornamento:** 2026-07-27 · **Fondatore:** Marco Mariotti

| Parte | Contenuto | Si porta su altri prodotti? |
|---|---|---|
| **1. Fondamenta** | scopo, lettore, territori, registro, architettura del brand | come criterio di giudizio, sì |
| **2. Espressione** | voce, palette, tipografia | **sì, sempre** |
| **3. The First Draft** | pilastri, logo, triade, glifo focus, asset, podcast, newsletter, distribuzione | solo se il prodotto è della famiglia |
| **4. Prodotti interni** | cosa eredita un tool tuo | operativa |

> **Nota di storia del file.** Fino al 2026-07-27 questo documento conteneva solo l'operatività
> degli asset e la palette in copia; il significato del brand non stava scritto da nessuna parte e
> i valori erano duplicati in tre posti. La versione 3.0 unifica: qui il brand, in
> `DESIGN-SYSTEM.md` i token. Se cerchi `BRAND-IDENTITY.md`, è questo file.

---

# Parte 1 — Fondamenta

## 1.1 Perché esiste

**The First Draft è uno spazio di pensiero e di incontro, non un canale di acquisizione.**
Serve a ragionare meglio scrivendo, e a incontrare persone che ragionano sulle stesse cose.

Questo non è un dettaglio di tono: è il vincolo che decide tutto il resto. Un brand che deve
vendere ottimizza per attenzione e conversione. Questo ottimizza per **profondità e conversazione**,
e può permettersi di essere lento, lungo e scomodo.

### Come si riconosce che funziona

| Segnale che conta | Segnale che non conta |
|---|---|
| Obiezioni che reggono e rientrano nel pezzo (campo `discussion`) | Impression e reach su LinkedIn |
| Revisioni nate da uno scambio (campo `revisions`) | Numero di follower |
| Domande aperte che generano il pezzo successivo | Viralità di un singolo post |
| Iscritti alla newsletter che **rispondono** | Iscritti alla newsletter e basta |
| Collaboratori che chiedono di scrivere | Frequenza di pubblicazione tenuta a forza |

**Conseguenza operativa:** nessuna metrica di vanità entra nel sito, nei report o nel copy. Niente
contatori di lettori, niente "condiviso 200 volte", niente pulsanti che chiedono attenzione.
Non è pudore: sono numeri che spingerebbero verso il contenuto che il manifesto combatte.

### Cosa non è un obiettivo

Vendere qualcosa, costruire una lista da monetizzare, diventare una testata, pubblicare tanto.
Se un giorno uno di questi diventa un obiettivo, questo documento va riaperto dalla prima riga:
cambierebbe il pubblico, il registro e probabilmente i formati.

## 1.2 Il lettore

**Un Tech Lead, o un senior con responsabilità di team.** Chi ha la doppia responsabilità:
sceglie architetture *e* fa crescere persone, e paga il conto di entrambe.

Come vive le sue giornate: rivede codice che non ha scritto, alcuni pezzi generati; decide cosa
entra in produzione in un contesto dove un errore ha un costo reale; prova a far crescere qualcuno
che ha uno strumento capace di rispondere al posto suo; fa tutto questo mentre continua a
sviluppare. Ha poco tempo e una soglia alta di tolleranza per il rumore.

Cosa non trova altrove: contenuti o entusiasti ("l'AI cambia tutto") o accademici (paper e
benchmark), quasi nessuno che racconti un problema **mentre è ancora aperto**, dall'interno, senza
la posa di chi l'ha già risolto.

**Chi non è il lettore.** Chi cerca tutorial e istruzioni passo passo. Chi cerca trucchi di prompt
e scorciatoie di produttività. Chi vuole conferme. Il pubblico generalista (quello è il terreno
del podcast, §3.5). Scriverli qui sarebbe un modo garantito per non parlare a nessuno.

## 1.3 I quattro territori

Sono i terreni in cui la tua esperienza è un vantaggio non replicabile. Un pezzo che non ne tocca
almeno uno probabilmente non è tuo.

| Territorio | Perché è tuo | Rischio |
|---|---|---|
| **Far crescere persone nell'era dell'AI** | Guidi un team e fai mentoring mentre lo strumento risponde al posto dei junior. È il terreno meno presidiato. | Scivolare nel motivazionale. L'antidoto è l'episodio concreto. |
| **Ingegneria seria sotto vincoli reali** | SaaS B2B, grandi volumi, performance, sicurezza: dove le mode si infrangono. | Il vincolo di anonimizzazione: ogni caso passa dall'ok del Product Owner. |
| **La disciplina del codice generato** | Pratica quotidiana in un contesto dove sbagliare costa. È la spina dorsale della roadmap. | È il tema più affollato: il differenziale non è l'argomento, è il caso reale che porti. |
| **Team distribuiti tra culture e lingue** | Italia e Albania, seniority diverse, inglese lingua franca, AI come livellatore. Raro e verificato. | Oggi vale un solo articolo in roadmap: va coltivato o resta un episodio. |

I quattro non sono paralleli: **i primi due sono lo sguardo, gli altri due la materia.** I pezzi
migliori stanno all'incrocio, ed è lì che i tre pilastri tech · human · AI emergono senza forzarli.

## 1.4 Il differenziale

Formulazione interna, non uno slogan da mettere sul sito:

> The First Draft è il posto dove un Tech Lead in esercizio ragiona ad alta voce su cosa l'AI sta
> cambiando nel modo in cui si scrive codice e si fanno crescere le persone, partendo sempre da
> qualcosa che è successo davvero, e mostrando il ragionamento mentre è ancora in bozza.

Le tre parti difendibili, in ordine di robustezza:

1. **In esercizio.** Non un consulente che racconta il lavoro degli altri. Chi scrive ha ancora le
   mani nel codice e le persone da far crescere. Non è copiabile a comando.
2. **Mentre è ancora in bozza.** Il pensiero pubblicato prima di essere levigato, con le revisioni
   visibili e le domande lasciate aperte. È il nome del blog reso struttura, non estetica.
3. **Da qualcosa che è successo davvero.** Il filtro editoriale è anche il differenziale: rende i
   pezzi lenti da produrre e difficili da imitare.

### Le prove

Quello che sostiene la credibilità, da usare con parsimonia e mai come vanto: sei anni e più di
mestiere; guida tecnica di un team distribuito su due paesi; piattaforma SaaS B2B nel dominio
telecom, su grandi volumi di dati; un percorso che parte dal backend (Java, Kafka) e arriva
all'architettura frontend (React, TypeScript); casi misurati, come il refactor da 22s a 1.1s.

**Regole d'uso.** Il datore di lavoro compare nel profilo autore come dato di fatto, mai nei
contenuti come caso riconoscibile. Prodotti, clienti, architetture e numeri interni vanno
anonimizzati, e i casi sensibili passano dall'ok del Product Owner **prima** del commit.

## 1.5 Il registro

**Un pari che ha appena sbattuto la testa.** L'autorità nasce dall'essere nella stessa stanza del
lettore, non un passo avanti. Questo è il tratto che rende la voce riconoscibile: le regole di
scrittura in §2.1 ne sono solo la meccanica.

**Cosa fa:**

- Parte dall'episodio, non dalla tesi. Prima cosa è successo, poi cosa ne penso.
- Dichiara l'errore proprio, non quello degli altri. La lezione si paga in prima persona.
- Presenta la conclusione come provvisoria: "per ora funziona così", non "si fa così".
- Lascia visibile l'incertezza, e la promuove a domanda aperta invece di nasconderla.
- Dà consigli sotto forma di "cosa ho fatto io", non di imperativo al lettore.

**Cosa evita:**

- Il tono da keynote e la posa del veterano ("dopo vent'anni ho capito che...").
- Il formato "le 5 lezioni che ho imparato": è il listicle travestito da esperienza.
- L'umiltà di facciata usata come figura retorica prima di una lezione. Se il dubbio non è vero,
  non si scrive.
- Il bastian contrario di professione. Si mette in dubbio un'affermazione perché un caso reale la
  contraddice, non per posizionarsi.

Il registro vale anche nel copy di un'interfaccia: "Non ci sono ancora dati qui", non "Nessun
elemento disponibile".

## 1.6 Architettura del brand

**L'ombrello è la pubblicazione.** The First Draft è il riferimento; Marco Mariotti ne è il
fondatore e la firma principale, insieme ad altre voci.

Conseguenze, tutte già decise:

- **La reputazione si accumula sulla pubblicazione.** Un pezzo forte di un collaboratore fa
  crescere The First Draft, ed è l'effetto voluto: il progetto deve poter reggere anche senza di te.
- **Il tuo profilo professionale vive nella pagina autore.** Il materiale da CV (esperienza,
  competenze, dominio, contatti) confluisce in `/autori/marco-mariotti` come profilo di firma:
  chi sono, cosa faccio, perché puoi credermi. **Non esiste una sezione portfolio separata.**
  → *Intervento di prodotto aperto:* le componenti `About`, `Experience`, `Skills`, `Contact` e la
  home personale vanno riassorbite nella pagina autore. Finché non succede, il sito racconta
  un'architettura diversa da questa.
- **Le altre firme sono autori della pubblicazione**, non ospiti sul tuo spazio. Hanno pagina
  autore e feed RSS propri, come te.
- **I tool interni non portano il marchio** se non sono al servizio del blog (§4).

**Il rischio da tenere d'occhio:** l'obiettivo è personale (pensare meglio, incontrare persone) ma
l'ombrello è collettivo. Se un giorno il blog cresce a molte firme, la voce "pari che ha appena
sbattuto la testa" resta la tua o diventa un requisito per tutti? Oggi non serve rispondere;
serve accorgersene quando succede. Vedi *Questioni aperte* in fondo.

## 1.7 Cosa il brand non è

Un anti-modello esplicito decide più di dieci aggettivi positivi.

- Non è **il contenuto generato e intercambiabile**: né nei testi (listicle, "5 modi per..."), né
  nella grafica (stock illustration, gradiente viola generico, icone messe a caso).
- Non è **corporate neutro**: niente "we empower", niente noi maiestatis, niente voce di redazione.
- Non è **gamificato**: niente badge, punteggi, streak, barre di completamento decorative.
- Non è **rumoroso**: niente pop-up di uscita, urgenza artificiale, dark pattern, metriche di
  vanità esibite.
- Non è **dipendente da un algoritmo**: i canali proprietari (sito, RSS, newsletter) vengono prima
  delle piattaforme. LinkedIn è il tavolo di discussione, non il padrone del pubblico.
- Non è **un servizio a pagamento travestito**: nessuna call to action commerciale, nessun lead
  magnet, nessuna scarsità costruita.

---

# Parte 2 — Espressione

Il livello ereditabile da qualsiasi prodotto, First Draft o no.

## 2.1 Voce: le regole

Il registro (§1.5) è il carattere; queste sono le regole meccaniche che lo tengono in piedi.
Valgono per gli articoli e per il copy di un'interfaccia.

- **Prima persona, tono diretto e personale.** Le tesi sono dell'autore, non della redazione.
- **Onestà intellettuale.** Tesi scomode benvenute se vere e argomentate. Mai slogan.
- **Metafore precise e proprie** (il guardrail, il frate amanuense): sono un tratto distintivo,
  non un riempitivo. Una metafora presa a prestito vale meno di una frase piana.
- **Niente trattini lunghi (—)** in nessun testo destinato a essere letto: articoli, newsletter,
  copy del sito, `aria-label`, etichette di bottoni, testo negli asset, post social. Sono una firma
  del testo generato. Si usano due punti, virgole, parentesi, punti. Separatore nei title: il
  **punto mediano** (`First Draft · Blog`); negli `aria-label` la virgola, che gli screen reader
  leggono meglio. *Nei documenti interni come questo la regola non si applica.*
- **Niente nomi di persone**, tranne gli autori dichiarati. Per tutti gli altri: il ruolo
  ("un collega del team", "il Product Owner"). Dati del datore di lavoro sempre anonimizzati.
- **Niente maiuscolo urlato.** L'enfasi si fa con il corsivo o con la posizione nella frase.
- **Bilingue IT/EN con traduzione idiomatica**, non letterale. In IT le ripetizioni ravvicinate si
  alleggeriscono; in EN no, ripetere il termine chiave dà coesione.

Regole editoriali complete: `editorial-guidelines.md`. Microcopy applicativo:
`DESIGN-SYSTEM.md` §9.

## 2.2 Principi visivi

Quattro, in ordine di priorità. Servono a decidere nei casi che il design system non copre.

1. **Sostanza prima della superficie.** Ogni elemento visivo esiste perché serve a capire.
   Decorazione senza funzione informativa: fuori. È la traduzione visiva dell'anti-listicle.
2. **Sobrietà.** Un accento, non cinque. Corsivo per l'enfasi, mai maiuscolo. Nessuna animazione
   che chieda attenzione senza restituirla.
3. **Onestà.** Il prodotto non finge certezze che non ha: errori chiari, dati mancanti dichiarati,
   ipotesi segnalate come tali. Vale per il copy di una UI quanto per un articolo.
4. **Accessibile per default.** Contrasto AA come minimo, tastiera sempre,
   `prefers-reduced-motion` rispettato. Condizione di partenza, non collaudo finale.

**Un giudizio non si esprime mai come punteggio.** Niente barre, percentuali di gradimento, voti
sintetici o indicatori di completezza: sono l'estetica del contenuto in serie. Vale per i
*giudizi*, non per i dati: una dashboard che misura traffico o performance è quantitativa per
natura, e lì il numero è il contenuto, non una metafora.

## 2.3 Palette

Dark-first su navy profondo, in continuità con gli asset generati (cover, OG, carousel), che
nascono sullo stesso fondo. Valori, contrasti misurati e regole d'uso: `DESIGN-SYSTEM.md` §2.

Le tre cose identitarie, e quindi qui:

- **Un solo accento primario**, l'azzurro `#38bdf8`. Se due elementi hanno la stessa forza, nessuno
  dei due è primario.
- **L'elevazione la fa il bordo, non il fondo.** Le superfici scure sono quasi indistinguibili tra
  loro: è una scelta, non un limite. Si stacca con una linea, non con un grigio più chiaro.
- **Il colore non è mai l'unico veicolo di informazione.**

**Il dark non è un dogma.** È la scelta giusta per il blog e per gli asset. Un tool che ti serve in
ufficio di giorno può avere un tema chiaro senza tradire il brand, purché mantenga accento unico,
tipografia e principi. Se succede, il tema chiaro si definisce in `DESIGN-SYSTEM.md`, non a occhio.

## 2.4 Tipografia

| Famiglia | Quando | Perché |
|---|---|---|
| **Inter** (variable) | tutto: UI, navigazione, card, meta, tabelle, form, asset generati | neutra, leggibile a corpo piccolo |
| **Newsreader** (serif, variable) | **solo** titolo e corpo dei testi long-form | il brand parla di scrittura, e il serif nel corpo lungo lo racconta |

**Il criterio:** se il testo si *usa*, è Inter. Se il testo si *legge*, è Newsreader. Un tool è
quasi interamente Inter. Gli asset generati non usano mai il serif.

Entrambe self-hosted (`@fontsource-variable/*`): nessuna chiamata a Google Fonts, per privacy e per
performance. Scale complete: `DESIGN-SYSTEM.md` §3.

---

# Parte 3 — The First Draft

Il prodotto blog + podcast. Non si eredita per default.

## 3.1 Identità

- **Nome:** The First Draft · **Dominio:** `thefirstdraft.dev` · **Monogramma:** FD
- **Tre pilastri:** **tech · human · AI**, e la loro contraddizione apparente. Ogni contenuto vive
  nella tensione tra i tre; lo sguardo emerge in modo naturale, mai forzato.
- **Il nome è una promessa strutturale:** la prima bozza non è l'ultima. Per questo esistono le
  revisioni datate, il tavolo di discussione e le domande aperte. Non sono funzionalità: sono il
  nome reso meccanica.
- **Filtro editoriale:** esperienza reale · tesi · anti-listicle (`editorial-guidelines.md`).

## 3.2 Logo

- **Logo ufficiale:** `public/logos/fd-3-nib.svg` (raster: `fd-3-nib.png`), gli unici due file
  rimasti in `public/logos/`.
- Le quattro alternative scartate (`fd-1-monogram`, `fd-2-caret`, `fd-4-pilcrow`,
  `fd-5-wordmark`) non si usano: erano pubblicate come pagina di confronto a `/logos/`, spostate
  in `docs/archive/logo-options/` il 2026-07-27 (punto 13 di `TECH-IMPROVEMENTS.md`) perché
  materiale di lavoro, non contenuto del sito.
- Navbar: 36×36 con `rounded-lg`, accanto al wordmark testuale "First Draft" in Inter semibold,
  `tracking-tight`, nascosto sotto il breakpoint `sm`.
- Quando è accompagnato dal nome il logo è decorativo: `alt=""` e `aria-hidden`, con l'`aria-label`
  sul link contenitore.

## 3.3 Motivi visivi

1. **La triade.** Tre cerchi sovrapposti che si incontrano al centro: tech (sky `#38bdf8`),
   human (teal `#2dd4bf`), AI (indigo `#818cf8`, con un mini-grafo di nodi).
2. **Il "+" luminoso.** Il punto d'incontro dei tre cerchi, bianco su gradiente radiale.
3. **La sottolineatura ondulata.** Tratto teal tracciato a mano, come una correzione di bozza.
4. **La dot grid.** Griglia di punti discreta sullo sfondo, colore `#22304a`.

**Non si ridisegnano a mano: li rendono gli script.**

### Il glifo focus

Tre punti in ordine fisso tech · human · ai, nei colori dei pilastri, **pieni o vuoti**, su card e
header articolo, pilotati dal campo `focus` del frontmatter.

Indicatore **qualitativo**: un pilastro c'è o non c'è. Mai barre, percentuali o voti (§2.2). È
focusabile da tastiera, espone una mini-legenda in tooltip e ha un nome accessibile
(`role="img"` + `aria-label`).

## 3.4 Asset e formati canonici

| Asset | Formato | Strumento |
|---|---|---|
| Cover articolo | 1600×836 | `scripts/generate-cover.mjs` |
| OG di default del sito | 1200×630 | `scripts/generate-og.mjs` |
| Carousel LinkedIn | 1080×1350 (4:5), PNG + PDF | `scripts/generate-carousel.mjs` |
| PDF gruppo di feedback | A4 | `scripts/generate-feedback-pdf.py` |
| Logo PNG | derivato dall'SVG | `scripts/generate-logo-png.mjs fd-3-nib` |

**Regola:** per gli asset standard si usano **sempre** gli script (deterministici e on-brand). Il
fuori standard passa dalla skill `design`, che deve comunque rispettare questo documento.

Due dettagli che valgono solo per il rendering degli asset e non per il sito:

- **I font degli asset sono istanze statiche**, non la variable: `scripts/fonts/InterB.ttf` (700),
  `InterSB.ttf` (600), `InterM.ttf` (500). Il renderer non interpola gli assi variabili, quindi un
  peso nuovo richiede un file nuovo, non una dichiarazione CSS.
- **La dot grid usa `#22304a`**, che è un colore degli asset e **non** un token del design system:
  esiste solo negli script (`generate-cover`, `generate-og`, `generate-carousel`). Non aggiungerlo
  a `global.css` per simmetria: sul sito non serve.

## 3.5 Podcast: The Human Constant

Stesso brand visivo e stessa palette, wordmark proprio. **Pubblico diverso da quello del blog:**
curiosi anche senza background tecnico. L'angolo di ogni episodio è la contraddizione apparente tra
i tre pilastri. Cover episodio: `podcast-episode-cover.md`.

La differenza di pubblico è voluta, ma va sorvegliata: il blog non si adatta al podcast. Se un tema
funziona con i curiosi ma diluisce il lettore Tech Lead, resta un episodio e non diventa un
articolo.

## 3.6 Newsletter

Canale diretto (Buttondown), un'email a uscita, inquadrato come canale anti-algoritmo e non come
marketing. Si attiva impostando lo username in `src/config.ts` (`NEWSLETTER.buttondownUser`);
finché è vuoto resta spenta e il sito mostra la CTA RSS.

Icona: `public/logos/fd-3-nib.png`. Accento `#38bdf8` su fondo `#0b1120`.

Coerente con §1.1, **la risposta vale più dell'iscrizione**: la welcome email invita a rispondere e
le risposte sono il segnale, non il contatore degli iscritti.

Il formato di un'uscita curata (riscrittura per la casella di posta, non riassunto dell'articolo) è
codificato nella skill `newsletter-issue`.

### Welcome email: testo canonico

Parte alla conferma dell'iscrizione. Valgono le regole di §2.1: niente trattini lunghi, prima
persona, nessun effetto elenco.

#### Versione italiana (in uso)

**Oggetto:** Benvenuto sulla prima bozza

> Ciao,
>
> grazie per l'iscrizione, e benvenuto. Sono Marco.
>
> The First Draft è lo spazio dove scrivo di tre cose che sembrano tirare in direzioni opposte e invece si spiegano a vicenda: tech, human e AI. Non opinioni levigate costruite per un feed, ma il ragionamento mentre prende forma, sempre a partire da qualcosa di reale successo al lavoro.
>
> La maggior parte dei pezzi nasce dalla mia esperienza da sviluppatore e Tech Lead: cosa cambia davvero l'AI nel modo in cui scriviamo codice, come crescono le persone attorno, i problemi concreti che incontro. Ma vuole essere uno sforzo corale, non un monologo: altre voci sono già in arrivo, una su AI e musica, una su AI ed etica. Sguardi differenti sulla stessa tecnologia.
>
> Mi farò vivo a ogni nuovo articolo. Un'email, nient'altro.
>
> Per iniziare, ti lascio il manifesto: è il modo più chiaro per capire da dove nasce tutto questo e dove sta andando.
>
> **Elogio dell'idea grezza**
> https://thefirstdraft.dev/blog/elogio-dell-idea-grezza/
>
> Ci vediamo alla prossima bozza,
> Marco

#### Versione inglese (non ancora in uso)

Pronta per quando la distribuzione punterà anche al pubblico anglofono (obiettivo 2026, con il
punto di verifica A in fondo a questo documento). Non è la welcome email attiva: oggi il pubblico
arriva soprattutto da LinkedIn, in italiano.

**Oggetto:** Welcome to the first draft

> Hi,
>
> Thanks for subscribing, and welcome. I'm Marco.
>
> The First Draft is where I write about three things that seem to pull in different directions and end up explaining each other: tech, human, and AI. Not polished takes built for a feed, but reasoning while it still takes shape, always starting from something real that happened at work.
>
> Most pieces come from my own experience as a developer and Tech Lead: what AI actually changes in how we write code, how people grow around it, the real problems I run into. But this is meant to be a chorus, not a monologue. Other voices are already on the way: one on AI and music, one on AI and ethics. Different ways of looking at the same technology.
>
> You'll hear from me whenever a new piece goes out. One email, nothing else.
>
> A good place to start is the manifesto. It's the clearest way to see where this comes from and where it's going:
>
> **In Praise of the Rough Idea**
> https://thefirstdraft.dev/en/blog/in-praise-of-the-rough-idea/
>
> See you at the next draft,
> Marco

## 3.7 Distribuzione

- **LinkedIn:** post con gancio forte, **link nel primo commento**, carousel come documento PDF.
- **RSS:** feed a contenuto completo, per il sito e per singolo autore.
- **Bilinguismo:** ogni articolo, autore e arco roadmap esiste in IT **e** EN, collegati dalla
  stessa chiave (`translationKey`, `authorKey`, `arcKey`). Gli slug differiscono tra le lingue: a
  legarli è la chiave nel frontmatter, non il nome del file.

---

# Parte 4 — Prodotti interni

I prodotti previsti sono di due tipi soltanto: **tool privati per te** e **strumenti al servizio
del blog e del podcast**. Nessuno ha utenti terzi, e questo semplifica molto.

| | Tool privato | Strumento del blog |
|---|---|---|
| Eredita Parte 2 (voce, palette, tipografia, principi) | sì | sì |
| Porta logo, triade, glifo focus | **no** | sì |
| Si chiama "First Draft qualcosa" | no | sì (es. *First Draft Studio*) |
| Segno proprio | monogramma tipografico in Inter semibold, basta | il logo FD |
| Tema chiaro ammesso | sì, se serve al contesto d'uso (§2.3) | no, resta dark |
| Accessibilità | gate, come tutto il resto | gate |

**Checklist di avvio.**

1. Copia i token da `DESIGN-SYSTEM.md` §2.5 (CSS) o §2.6 (Tailwind v4) come **unica** definizione
   del colore. Nessun hex sparso nei componenti.
2. Installa `@fontsource-variable/inter`; Newsreader solo se il prodotto ospita lettura long-form.
3. Imposta le basi globali: background, colore, font, `::selection`, `:focus-visible`, blocco
   `prefers-reduced-motion`.
4. Dai al prodotto un nome e un segno propri se non è della famiglia First Draft. Non serve un logo
   disegnato per partire: serve che non ci sia il logo sbagliato.
5. Scrivi il copy con il registro di §1.5, anche se l'unico utente sei tu. È l'occasione di
   esercitarlo a costo zero.
6. Se serve qualcosa che qui non c'è (un colore, un tono, un componente), la modifica torna in
   questi due file. Un'eccezione non documentata diventa una divergenza in tre mesi.

**Vincolo esplicito:** su strumenti usati anche da colleghi in azienda non va nessun riferimento a
First Draft. Brand personale e contesto del datore di lavoro restano separati.

---

## Questioni aperte e punti di verifica

Nessuna di queste va affrontata oggi. Ognuna ha un **trigger** verificabile e una **decisione**
già formulata, così quando il momento arriva non si riparte dalla domanda. Stessa convenzione dei
backlog del repo (`TECH-IMPROVEMENTS.md`, `NEW-IDEAS.md`), leggibile dalla skill `roadmap-next`.

### A. Il bilinguismo regge il suo costo?

La decisione c'è già: *pubblico EN, obiettivo reale 2026* (risposta di Marco, `NEW-IDEAS.md`
2026-07-17). Quello che manca non è la scelta, è il momento in cui si guarda se ha pagato. Oggi non
è misurabile: `CF_BEACON_TOKEN` è vuoto, l'analytics è spento.

**Trigger:** analytics attivo da almeno 3 mesi **e** almeno 8 articoli pubblicati in EN.
**Come si verifica:** quota di sessioni su `/en/*` sul totale, e iscritti alla newsletter che
scrivono in inglese.
**Decisione:** sotto il 10% di sessioni EN, il bilinguismo passa da regola a scelta per pezzo (si
traduce quello che ha senso tradurre, non tutto per default). Sopra il 20%, si investe: pubblicazione
EN come canale di pari dignità, non come copia. In mezzo, si rimanda di sei mesi e si guarda la
derivata. **Attenzione:** la regola oggi vincolante ("mai pubblicare una lingua sola") è verificata
dal preflight, quindi questa decisione è anche una modifica di codice, non solo editoriale.

### B. Il registro è tuo o della pubblicazione?

"Un pari che ha appena sbattuto la testa" (§1.5) descrive te. L'ombrello però è la pubblicazione
(§1.6), e i collaboratori scrivono di musica e di etica, non di code review: lo stesso registro
potrebbe non calzare, o calzare fin troppo e appiattire le voci.

**Trigger:** quando esiste un secondo profilo autore in `src/content/authors/` **e** quel
collaboratore ha pubblicato il **secondo** pezzo. Sul primo non si capisce ancora niente.
**Come si verifica:** rileggere i due pezzi accanto ai tuoi e chiedersi se un lettore
riconoscerebbe la stessa mano o la stessa casa.
**Decisione:** o §1.5 si promuove a requisito della pubblicazione (e si scrive nelle linee guida
editoriali, con esempi), oppure si separa esplicitamente in "registro di Marco" e "regole minime
comuni" (§2.1, che sono già oggi le regole di tutti). La seconda è più probabile e più onesta.

### C. Il territorio "team distribuiti" è un territorio o un episodio?

I fatti oggi dicono episodio: vale l'articolo 8 del primo arco, e la pipeline provvisoria del
secondo arco (articoli 9-17) non contiene nessun pezzo su quel tema.

**Trigger:** al congelamento del secondo arco, cioè quando i pezzi etica sono definiti e la
pipeline provvisoria in `docs/content-roadmap.md` smette di essere provvisoria.
**Come si verifica:** contare i pezzi su team, culture e lingua nei due archi.
**Decisione:** se resta a uno, si declassa in §1.3 da territorio a *materiale ricorrente* (compare
dentro altri pezzi, non li genera). Se ne entra almeno un secondo, resta territorio e va coltivato
con un filone, come è successo alla disciplina del codice generato.

### D. Il tema chiaro, quando arriverà

§2.3 dice che un tool da ufficio può avere tema chiaro senza tradire il brand, ma il tema non
esiste: oggi c'è una sola palette.

**Trigger:** il primo prodotto interno che si usa prevalentemente di giorno e in ambiente
illuminato.
**Come si verifica:** banale, lo sai quando succede.
**Decisione:** il tema chiaro si definisce in `DESIGN-SYSTEM.md` come secondo set di token
semantici (stessi nomi, valori diversi), mai come override sparsi nei componenti. Vincoli
irrinunciabili: accento unico, elevazione col bordo, contrasto AA.

### Fuori da questa lista

**Il riassorbimento del CV nella pagina autore non è una questione aperta: è un lavoro deciso e non
ancora fatto.** Sta in `NEW-IDEAS.md` come voce di backlog con il suo trigger, dove `roadmap-next`
può prenderlo. Qui resta solo la nota in §1.6: finché non succede, il sito comunica
un'architettura di brand diversa da quella scritta in questo documento.

---

## Gerarchia delle fonti di verità

| Ambito | Fonte di verità |
|---|---|
| Significato del brand: scopo, lettore, registro, voce, motivi visivi, asset canonici | **`docs/brand.md`** (questo file) |
| Sistema di design: token, scale, componenti, accessibilità | **`docs/DESIGN-SYSTEM.md`** |
| Valori effettivi implementati sul blog | **`src/styles/global.css`** (`@theme`) |
| Regole editoriali dei contenuti | **`docs/editorial-guidelines.md`** |

**La regola in una riga:** se la domanda è *perché*, la risposta è qui; se è *quanto* o *quale
valore esatto*, è in `DESIGN-SYSTEM.md`; se è *cosa fa il sito oggi*, è in `global.css`.

**Regola di manutenzione.** Un valore che cambia si aggiorna in `global.css` e in
`DESIGN-SYSTEM.md`. Un significato che cambia (chi è il lettore, cosa vuol dire un colore, come
suona la voce) si aggiorna qui. Le due cose non si toccano quasi mai insieme, ed è un bene.

**Nessun valore si duplica tra i due file.** Questo documento cita un hex o una dimensione solo
quando il valore *è* il significato: i tre colori dei pilastri (§3.3), l'accento unico (§2.3), il
`#22304a` della dot grid che vive solo negli script (§3.4). Tutto il resto è un rimando. La
duplicazione è esattamente ciò che ha prodotto la divergenza sanata il 2026-07-27, quando le
tabelle degli asset di due documenti diversi avevano già smesso di coincidere.

Se il codice diverge da questa coppia di documenti, **il bug è nel codice**, salvo decisione
esplicita registrata qui o in `DESIGN-SYSTEM.md` §10.
