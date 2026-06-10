# Feature 02 — Versione audio/podcast degli articoli (TTS via AI)

## Obiettivo
Ogni articolo ha un player audio con la versione "ascoltabile" del testo, generata
automaticamente da un servizio AI di text-to-speech. Aumenta accessibilità e tempo di
fruizione (ascolto in mobilità) → più visibilità per gli autori.

> ## ✅ Decisioni prese (2026-06-10)
> - **Generazione: build-time** (audio pre-generato, scelta A).
> - **Code block: segnaposto parlato** ("...segue un esempio di codice, lo trovi nell'articolo...").
> - **Storage: `public/audio/` in repo** ora; path astratto per migrare a R2 dopo.
> - **Feed podcast pubblico (Spotify/Apple): NO al lancio** — prima player on-page, poi si valuta.
> - **Flag frontmatter `audio: false`** per articolo: incluso, per escludere i pezzi troppo code-heavy.
> - **Provider TTS: ElevenLabs** (`eleven_multilingual_v2`) — scelto dopo bake-off per la
>   qualità/naturalezza della voce, in particolare in italiano.

## Vincolo di partenza
Sito **statico su Cloudflare Pages**. Tre problemi distinti da risolvere, non uno:
1. **Generazione** dell'audio dal testo (chi/quando lo fa).
2. **Storage/hosting** dei file audio (dove vivono gli mp3).
3. **Player** nella pagina articolo (UI).

La domanda chiave che decide tutto: **l'audio si genera a build-time o a runtime?**

---

## Decisione 1 — Quando si genera l'audio (la scelta architetturale centrale)

### Opzione A — Build-time, audio pre-generato (CONSIGLIATA)
Uno script genera l'mp3 quando l'articolo viene pubblicato/buildato e lo committa
(o lo carica su storage). Il sito serve un file statico.

- ✅ Coerente con l'architettura statica attuale — nessun runtime, nessun adapter.
- ✅ Costo TTS pagato **una volta** per articolo, non per ascolto.
- ✅ Player banale: `<audio src="...">`. Zero latenza per il lettore.
- ✅ Nessuna API key esposta al client.
- ❌ Serve un passo di generazione nel workflow editoriale (script + cache per non
  rigenerare articoli invariati).
- ❌ Rigenerazione manuale se il testo cambia (mitigabile con hash del contenuto).

### Opzione B — Runtime, generazione on-demand
Pages Function che chiama il TTS al primo play e cachea il risultato.
- ✅ Sempre sincronizzato col testo, zero step in fase di build.
- ❌ Introduce SSR runtime + secret + gestione cache/storage. Latenza al primo play.
- ❌ Costo per ascolto se la cache non regge. Più superficie da mantenere.

**Raccomandazione netta: A.** Per un blog con pochi articoli e contenuto stabile, la
pre-generazione è più semplice, più economica e non snatura il sito. B ha senso solo
con cataloghi enormi e contenuti che cambiano in continuazione — non è questo il caso.

---

## Decisione 2 — Quale servizio TTS → **ElevenLabs** ✅

Scelto dopo il bake-off: vince sulla **naturalezza della voce**, soprattutto in
italiano, che è il fattore n.1 di credibilità per questa feature. Modello
`eleven_multilingual_v2`. La voce è il driver, il costo superiore è accettato.

### Implicazioni operative della scelta ElevenLabs
- **Voce fissa per il brand**: scegliere UNA voce IT e UNA voce EN (o una voce
  multilingue che regga entrambe) dalla dashboard e bloccarne gli `voice_id` in config.
  Coerenza > varietà: il "podcast" deve avere sempre la stessa voce.
- **Costo a crediti/caratteri**: più alto di OpenAI ma **una-tantum per articolo**
  (scelta A, build-time). Verificare il piano: il free/starter ha un tetto di caratteri
  mensile che a regime può non bastare per articoli lunghi ×2 lingue → mettere in conto
  un piano a pagamento. Stimare i caratteri/mese (somma articoli × ~1.05 per la pulizia testo).
- **Uso commerciale**: consentito sui piani a pagamento — confermare i ToS per la
  pubblicazione pubblica dell'audio (vedi Rischi).
- **API key come secret**: vive solo in `.env` / CI, mai nel client (vale per build-time).

Requisiti che hanno guidato la scelta: **qualità alta** (voce robotica = danno di
credibilità, peggio che niente), **IT ed EN nativi**, API batch-friendly.

### Alternative valutate (per memoria, scartate)
| Servizio | Qualità | IT | Prezzo orientativo | Esito |
|---|---|---|---|---|
| **ElevenLabs** (`eleven_multilingual_v2`) | Top di gamma | ✅ ottimo | più caro, a credito | **SCELTO** — voce più naturale, IT convincente |
| OpenAI TTS (`gpt-4o-mini-tts`) | Alta | ✅ buono | ~$0.015/1k char | Scartato: più economico/semplice ma resa meno naturale |
| Google Cloud TTS (Neural2/Studio) | Alta | ✅ | a carattere | Non valutato a fondo; setup GCP più verboso |
| Azure Speech | Alta | ✅ | a carattere | Non valutato a fondo; buone voci IT, SSML ricco |
| Cartesia / PlayHT | Alta | parziale | variabile | Non valutato a fondo |

**Astrazione comunque consigliata**: tenere ElevenLabs **dietro `src/utils/tts.ts`** così,
se in futuro il costo o i ToS cambiano, il provider è sostituibile senza toccare il resto.

> Nota: budget caratteri/voce vanno verificati ai prezzi correnti di ElevenLabs prima di
> dimensionare il piano — i valori in tabella sono indicativi.

---

## Decisione 3 — Cosa diamo in pasto al TTS (sottovalutato, è qui che si rovina tutto)

`post.body` è **Markdown**. Darlo grezzo al TTS produce un disastro: legge `#`, `*`,
URL, e soprattutto **i blocchi di codice** — che su un blog tech sono ovunque e
all'ascolto sono insopportabili. Serve un pre-processing:

- **Strip** della sintassi markdown → testo pulito (es. `remark` + `strip-markdown`,
  o riuso della pipeline di rendering).
- **Code block**: NON leggerli carattere per carattere. Sostituirli con un segnaposto
  parlato ("...esempio di codice, vedi l'articolo...") o ometterli. **Da decidere.**
- **Frontmatter** escluso. Eventuale intro generata ("Articolo di {autore}, {titolo}").
- Normalizzare sigle/termini tecnici se il TTS li storpia (lista di override).

Questo pre-processing è **lavoro vero**, non un dettaglio. È il fattore n.1 di qualità percepita.

---

## Decisione 4 — Dove vivono gli mp3 (storage)

A build-time, l'audio va servito da qualche parte:
- **`public/audio/<slug>.mp3` committato in git** — semplice, zero infra, CDN di
  Cloudflare gratis. ❌ gonfia il repo (mp3 binari; un articolo ~5-10 min ≈ 3-8 MB).
  Accettabile con pochi articoli; valutare **git LFS** se cresce.
- **Cloudflare R2** (object storage, no egress fee, stesso ecosistema) — pulito, scala
  bene, repo leggero. ❌ un servizio in più da configurare.

**Raccomandazione**: partire con **`public/audio/` committato** (pochi articoli, zero
setup); migrare a **R2** se/quando il peso del repo dà fastidio. Astrarre il path così
la migrazione è indolore.

---

## Architettura proposta (scelta A)

1. **`scripts/generate-audio.mjs`** — sul modello di `scripts/generate-og.mjs` già
   presente. Per ogni articolo non-draft IT+EN:
   - estrae e pulisce il testo (Decisione 3),
   - calcola un **hash del contenuto**; se l'mp3 esiste già per quell'hash → skip (no
     rigenerazione, no costo),
   - chiama il TTS con la voce della lingua corretta,
   - scrive `public/audio/<lang>/<slug>.mp3` + un manifest (durata, hash).
   API key da `.env`, **mai** nel client. Lanciato manualmente (`npm run audio`) o
   come step pre-build in CI.
2. **`src/utils/tts.ts`** — astrazione del provider (input testo+lingua → mp3 buffer).
3. **`src/components/blog/AudioPlayer.astro`** (o `.tsx` se servono controlli ricchi) —
   player sopra il contenuto dell'articolo in `BlogPostLayout.astro`, dopo l'header.
   `<audio>` nativo o player custom con: play/pausa, velocità (1x/1.5x/2x — molto
   richiesta dagli ascoltatori), barra di avanzamento, durata. Renderizzato **solo se
   l'mp3 esiste** per quell'articolo (lookup nel manifest).
4. **i18n** — chiavi `audio` (es. "Ascolta l'articolo", "Versione audio", label a11y).
5. **`package.json`** — script `"audio": "node scripts/generate-audio.mjs"`.

---

## Decisione 5 — Bonus ad alto valore: feed podcast vero

Il repo ha **già RSS per blog e per-autore**. Con poco sforzo in più si può esporre un
**feed RSS podcast** (con tag `<enclosure>` audio + namespace iTunes) → sottomissibile
a **Spotify / Apple Podcasts / Pocket Casts**. Questo moltiplica la visibilità degli
autori su canali nuovi, che è *esattamente* l'obiettivo del blog. Sarebbe il vero
ritorno della feature, oltre al player on-page.

⚠️ Da valutare: un feed podcast su piattaforme richiede continuità e una soglia minima
di qualità audio — se la voce TTS è palesemente sintetica, alcune directory storcono il
naso e l'effetto-credibilità si ribalta. Consiglio: lanciare prima il **player on-page**,
misurare la qualità reale, e solo dopo decidere se aprire il feed podcast pubblico.

---

## Effort stimato (scelta A, ElevenLabs, storage in repo)
| Blocco | Stima |
|---|---|
| `tts.ts` + integrazione provider + .env/secret | 0.5 g |
| Pulizia testo (strip md, gestione code block) | 1 g |
| `generate-audio.mjs` + hash/cache + manifest | 1 g |
| `AudioPlayer` (speed, progress, a11y) + i18n | 1 g |
| QA qualità voce IT/EN + tuning pronuncia | 0.5–1 g |
| (Opzionale) feed podcast RSS + submit | +1 g |
| **Totale** | **~4–5 g** (+1 col feed) |

## Rischi e contro
- **Qualità voce = make or break.** TTS mediocre su un blog di "credibilità tech"
  fa più danno che bene. Gate di qualità in review prima del go-live, non dopo.
- **Code-heavy articles**: gli articoli tecnici sono pieni di codice; la versione audio
  di un pezzo molto tecnico può avere poco senso. Valutare un flag frontmatter
  `audio: false` per escludere caso per caso.
- **Costo**: lineare nei caratteri ma una-tantum per articolo (scelta A). Stimabile e basso a questi volumi.
- **Drift testo/audio**: se editi un articolo già pubblicato, l'audio diventa stale.
  Mitigato dall'hash (rigenera solo ciò che cambia) ma va lanciato lo script.
- **Peso repo** se l'audio resta in git → piano di migrazione a R2 pronto.
- **Licenza voce/uso commerciale (ElevenLabs)**: l'uso pubblico/commerciale dell'audio
  richiede un piano a pagamento e attribuzione su alcuni piani — confermare i ToS
  ElevenLabs prima del go-live, specie se poi si apre il feed podcast pubblico.
- **Tetto caratteri del piano**: ElevenLabs fattura a caratteri/mese; articoli lunghi ×2
  lingue consumano in fretta. Dimensionare il piano sui volumi reali per non bloccare le build.

## Stato domande
1. ~~Provider TTS~~ → **ElevenLabs** ✅
2. ~~Code block nell'audio~~ → **segnaposto parlato** ✅
3. ~~Storage~~ → **in repo** (`public/audio/`), R2 dopo ✅
4. ~~Feed podcast pubblico~~ → **no al lancio**, solo player on-page ✅
5. ~~Flag `audio: false`~~ → **incluso** ✅

### Unico punto ancora da chiudere prima di sviluppare
- **Scelta delle voci ElevenLabs**: quale `voice_id` per IT e quale per EN (o una voce
  multilingue unica). Usa `scripts/audio-bakeoff.mjs` con `ELEVEN_VOICE_ID` per provarne
  alcune e bloccare quelle definitive in config.
