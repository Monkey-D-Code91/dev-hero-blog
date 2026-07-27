---
name: newsletter-issue
description: >
  Prepara l'uscita della newsletter di The First Draft (Buttondown) a partire da un articolo
  pubblicato: oggetto, corpo riscritto per l'email e link al pezzo con i parametri UTM, salvati
  in newsletter/<slug>.md pronti da incollare. Non e' un digest RSS e non e' un riassunto: e' una
  riscrittura per la casella di posta, dove il pezzo va raccontato daccapo con un ritmo diverso.
  Si ferma alla bozza: l'invio lo fa Marco. Usa questa skill quando Marco dice cose come "prepara
  la newsletter", "l'uscita per gli iscritti", "manda la mail dell'articolo", "scrivi l'email di
  questo pezzo", "newsletter issue", "prepare the newsletter", oppure quando publish-article
  arriva al passo della distribuzione. NON e' la skill per scrivere o rifinire l'articolo
  (write-article, refine-article), per pubblicarlo (publish-article) ne' per il post LinkedIn
  (publish-article, Passo 6).
---

# newsletter-issue — Dall'articolo all'email

La newsletter e' il canale proprietario del progetto: nessun algoritmo in mezzo, un'email a
uscita, e chi la riceve ha dato il permesso. Questo cambia il modo di scrivere. Su LinkedIn
combatti per l'attenzione; qui l'attenzione ce l'hai gia', e il rischio opposto e' sprecarla con
un'email che il lettore ha gia' letto sul blog. Lingua di lavoro: italiano.

Prima di scrivere leggi `docs/brand.md` §3.6 (inquadramento del canale, testo canonico della
welcome email IT ed EN) e §2.1 (regole di voce). Se divergono da questa skill, hanno ragione loro.

**Autonomia.** Un punto di controllo: la bozza (Passo 4). Prima misuri e proponi l'angolo, dopo
rifinisci con Marco. **L'invio non lo fai mai tu**, nemmeno se te lo chiede: vedi Passo 6.

---

## Passo 0 — Identifica il pezzo e verifica che sia davvero uscito

```bash
node scripts/status.mjs                                    # coppie, draft, pubblicati
grep -n "^draft:\|^title:\|^pubDate:\|^cover:" src/content/blog/it/<slug>.md
```

| Se Marco... | Cosa fai |
|---|---|
| indica l'articolo | quello |
| non specifica | proponi l'**ultimo pubblicato** senza uscita in `newsletter/`, e chiedi conferma |
| chiede l'uscita di un pezzo con `draft: true` | **fermati**: si annuncia solo cio' che il lettore puo' leggere. Il link porterebbe a una pagina che non esiste in produzione |

Controlla anche se per quel pezzo esiste gia' `newsletter/<slug>.md`: se c'e', stai rifacendo
un'uscita, e la domanda giusta e' se va rifinita quella invece di scriverne un'altra.

---

## Passo 1 — Leggi l'articolo intero, non la description

La `description` del frontmatter e' scritta per la SERP: e' compressa, neutra, ottimizzata per
un motore di ricerca. Come apertura di un'email non funziona.

Leggi il pezzo per intero e tira fuori tre cose:

1. **L'episodio concreto**: la scena reale da cui nasce il ragionamento. E' quasi sempre la
   partenza giusta per l'email, perche' e' la parte che si racconta, non si spiega.
2. **La tesi in una frase**: quella che l'articolo dimostra. Nell'email arriva verso la fine,
   come punto d'arrivo, non come titolo.
3. **La domanda che il pezzo lascia aperta**: se il frontmatter ha `openQuestions`, spesso e'
   gia' li'. Serve per chiudere l'email rivolgendosi al lettore.

Se esiste `personas/<author-key>.md` sulla macchina, leggilo per orientare la voce (e' privato e
non versionato: non citarlo).

---

## Passo 2 — Riscrivi, non riassumere

**Questo e' il passo che distingue la skill da un digest RSS**, ed e' l'errore piu' facile.
Un riassunto dice al lettore cosa c'e' nell'articolo e gli da' una ragione per non aprirlo.
L'email deve raccontare la stessa storia con un ritmo suo, e lasciare sul blog la parte che
merita la lettura lunga (il metodo, i dettagli, le sfumature).

Il formato, ricavato dall'uscita reale del 2026-07-25:

- **Paragrafi cortissimi**, spesso una frase. In casella di posta, su telefono, un paragrafo di
  sei righe e' un muro.
- **Nessun heading, nessun elenco puntato.** L'email e' un discorso continuo. `brand.md` lo dice
  esplicitamente: nessun effetto elenco.
- **Si apre sulla scena**, non sul contesto. "Un collega ha consegnato 20 righe su cinque
  componenti. Bastava una singola ref." Non "In questo articolo parlo di...".
- **Prima persona**, tono diretto, la voce dell'autore. Nessuna formula da redazione.
- **La tesi arriva in fondo**, condensata, come la frase che rimane.
- **Una domanda al lettore** prima del link: e' il canale dove la risposta vale piu'
  dell'iscrizione (`brand.md` §1.1), quindi l'email deve dare qualcosa a cui rispondere.
- **Lunghezza**: se supera le 350 parole circa, stai rifacendo l'articolo. Taglia.

Regole non negoziabili (`CLAUDE.md` §4):

- **Niente trattini lunghi.** Due punti, virgole, parentesi, punti.
- **Niente nomi di persone** tranne gli autori del blog: per tutti gli altri il ruolo
  ("un collega", "il Product Owner").
- **Dati del datore di lavoro anonimizzati.** Se l'articolo li ha gia' anonimizzati, l'email non
  deve reintrodurli per rendere la scena piu' vivida.

---

## Passo 3 — Oggetto e link

**Oggetto.** Corto, concreto, senza nome del brand (ce l'ha gia' il mittente). Il titolo
dell'articolo e' il punto di partenza, ma non sempre e' l'oggetto migliore: in casella di posta
l'**imperativo** funziona meglio dell'infinito, perche' parla al lettore invece di descrivere.
L'uscita reale lo mostra: l'articolo si chiama "Imparare a guidare, non a correre", l'email
"Impara a guidare, non a correre". Se cambi il titolo, dillo a Marco e spiega perche': e' una
scelta, non un refuso.

Evita le formule da marketing ("Non crederai a...", "Il segreto per..."): sono esattamente
l'anti-modello che il manifesto combatte.

**Link, sempre con UTM**, cosi' l'analytics distingue il traffico da email:

```
https://thefirstdraft.dev/blog/<slug>/?utm_source=thefirstdraft&utm_medium=email&utm_campaign=<slug-uscita>
```

`<slug-uscita>` e' lo slug dell'email (di solito quello dell'oggetto), non necessariamente quello
dell'articolo. La riga di chiusura non e' un "leggi qui" nudo: dice **cosa** trova chi clicca.

> La storia completa e' sul blog, con il metodo che insegno per non perdere il controllo del
> codice generato: <link>

**Immagine.** In testa va la cover dell'articolo, gia' generata in `src/assets/covers/`.
Su Buttondown si carica a mano: ricordalo a Marco nel riepilogo, non e' un passo che puoi fare tu.

---

## Passo 4 — Scrivi la bozza su file

```
newsletter/<slug>.md
```

`newsletter/` e' **gitignorato**, come `feedback/` e `carousels/`: e' un artefatto di lavorazione,
non contenuto del sito. Il testo definitivo vive nell'archivio Buttondown, che e' gia' pubblico.

Struttura del file:

```markdown
# Oggetto: <oggetto dell'email>

<!-- Cover: src/assets/covers/<slug>.png (da caricare a mano su Buttondown) -->

<corpo dell'email>

La storia completa e' sul blog, con <cosa trova>: <link con UTM>
```

Poi mostra a Marco oggetto e corpo **nella conversazione**, non solo il path: la rifinitura si fa
leggendo, e il testo va guardato adesso. Questo e' il punto di controllo.

---

## Passo 5 — Verifica

```bash
node scripts/check-copy.mjs        # la guardia sui trattini lunghi copre i sorgenti, non questo file
```

Il file dell'uscita e' gitignorato, quindi nessun controllo automatico lo tocca: **i controlli qui
li fai a mano**, ed e' proprio per questo che vanno fatti.

- nessun trattino lungo nel testo dell'email;
- nessun nome di persona oltre agli autori;
- il link funziona e punta al pezzo **pubblicato**, con gli UTM;
- l'oggetto non e' una promessa che il pezzo non mantiene;
- la lunghezza sta sotto le ~350 parole.

---

## Passo 6 — Consegna, e fermati

**Non invii tu.** Non e' una limitazione tecnica: un'email parte verso persone reali e non si
richiama indietro. La skill si ferma alla bozza anche se Marco chiede di mandarla.

Riepiloga:

- **oggetto** e path del file;
- **cover da caricare** a mano su Buttondown;
- il **link con UTM**, per copia diretta;
- cosa hai cambiato rispetto al titolo dell'articolo, se l'hai cambiato, e perche'.

Niente da committare: il file e' gitignorato e la skill non tocca il repo. Se durante il lavoro
emerge una modifica al sito o ai contenuti, quella passa da `ship` come tutto il resto.

---

## Versione EN (solo su richiesta)

L'archivio Buttondown ha **una lista sola, in italiano**. La regola del bilinguismo obbligatorio
di `CLAUDE.md` §4 vale per articoli, autori e roadmap: **non per la newsletter**, che e' un canale
con un pubblico solo.

Prepara la versione EN solo se Marco la chiede esplicitamente. E quando lo fa, ricordagli il
punto vero: senza una **seconda lista** su Buttondown quell'email non ha destinatari, e mandarla
alla lista italiana significa due email per articolo alle stesse persone. La decisione e' di
canale, non di traduzione. Il testo EN della welcome email e' gia' pronto in `brand.md`
§3.6, e serve da riferimento di voce.

---

## Rapporto con le altre skill

| Skill | Confine |
|---|---|
| `publish-article` | il rituale del giorno di uscita. Al passo della distribuzione passa qui per l'email, e resta suo il post LinkedIn |
| `write-article`, `refine-article` | fanno l'articolo. Qui si parte da un pezzo gia' pubblicato |
| `podcast-repurpose` | stessa logica di riuso su un altro canale, non si sovrappongono |
| `sync-translation` | se l'articolo cambia dopo l'invio, l'email e' gia' partita: non si rincorre |
| `ship` | serve solo se emerge una modifica al repo, che qui non e' la norma |

---

## Errori da non fare

- **Fare un digest.** "E' uscito un nuovo articolo, leggilo qui" e' il formato che la newsletter
  di questo progetto ha scelto di non essere.
- **Incollare l'articolo nell'email.** Se il lettore ha gia' tutto, il blog non lo apre e la
  discussione non nasce.
- **Riusare la `description` del frontmatter come apertura.** E' scritta per Google.
- **Heading ed elenchi puntati** dentro l'email: rompono il discorso e somigliano al contenuto
  costruito per essere scremato.
- **Annunciare un pezzo ancora `draft: true`.** Il link porta a una pagina che in produzione non
  esiste.
- **Dimenticare gli UTM** e perdere la traccia del traffico da email.
- **Mandare l'email.** Mai, per nessun motivo.
