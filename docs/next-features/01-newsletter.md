# Feature 01 — Newsletter (iscrizione volontaria + banner CTA)

## Obiettivo
Permettere ai lettori di iscriversi a una newsletter via email. L'invito all'iscrizione
compare come banner/toast laterale non invasivo, con una CTA che porta al form.
Fine ultimo: costruire un canale diretto con l'audience → ricorrenza di visite e
credibilità degli autori (è la metrica che conta più dei pageview una tantum).

## Vincolo di partenza (leggere prima di tutto)
Il sito è **statico su Cloudflare Pages**, senza runtime server. Un `<form>` HTML ha
bisogno di un endpoint che riceva il POST. Non lo abbiamo. Quindi la raccolta email
**deve** passare da un servizio esterno o da una Pages Function. Tutto il resto del
plan dipende da questa scelta.

---

> ## ✅ Decisioni prese (2026-06-10)
> - **Provider: Buttondown.**
> - **Contenuto: digest automatico da RSS** (niente scrittura ad hoc al lancio).
> - **Privacy policy: in bozza** → vedi [03-privacy-policy-draft.md](03-privacy-policy-draft.md).
> - Form nostro (non embed), banner solo su pagine blog/articolo, liste IT/EN separate.

## Decisione 1 — Dove finiscono le email (provider) → **Buttondown**

Raccomando un **provider newsletter gestito** invece di costruire il backend.
Motivi: gestisce double opt-in, unsubscribe, bounce, deliverability e — soprattutto —
**conformità GDPR** (Marco è in UE: serve consenso esplicito + privacy policy + base
giuridica). Ricostruire questo a mano è il modo più veloce per finire in spam o fuori legge.

| Opzione | Free tier | Pro | Contro |
|---|---|---|---|
| **Buttondown** (consigliato) | 100 iscritti | Markdown-native, no-tracking, etico, API pulita, embed o form ospitato | UI invio essenziale |
| MailerLite | 1.000 iscritti | Generoso, editor visuale, automazioni | Più "marketing", branding sul free |
| ConvertKit/Kit | 10.000 iscritti | Pensato per creator | Pesante, overkill per un blog |
| Substack | illimitato | Zero setup, audience network | Branding Substack forte, ti porta via dal dominio → contro l'obiettivo "credibilità sul tuo sito" |
| Resend + DB proprio | — | Massimo controllo | Devi costruire opt-in/unsubscribe/GDPR da zero. **Sconsigliato qui.** |

**Raccomandazione: Buttondown.** Tono "developer/no-bullshit" coerente col blog,
form embeddabile, e supporta la **doppia lingua** mandando newsletter separate IT/EN
(vedi Decisione 4). Se prevedi crescita rapida oltre 100 iscritti a breve → MailerLite.

## Decisione 2 — Form ospitato vs form nostro
- **Form HTML nostro che fa POST all'API del provider** → controllo totale su markup,
  stile (Tailwind, dark theme), accessibilità. Richiede di esporre l'endpoint del
  provider; va protetto da spam (honeypot + eventuale captcha).
- **Form/embed ospitato dal provider** (`<script>` o `<iframe>`) → zero logica, ma
  stile estraneo al sito e un `<iframe>` stona col design curato attuale.

**Raccomandazione: form nostro** (markup proprio + `fetch` POST all'endpoint del
provider), così resta coerente con `Comments.astro`/`ShareButtons.astro`. Honeypot
field nascosto come anti-spam di base; niente captcha al lancio (attrito inutile a
volumi bassi).

---

## Architettura proposta (scelta A — statico)

1. **`src/config.ts`** — aggiungere blocco `NEWSLETTER` con `endpoint`, `enabled`,
   eventuale `provider`. Stesso pattern di `GISCUS`: feature spenta finché non
   configurata, così il merge non rompe nulla.
   ```ts
   export const NEWSLETTER = {
     enabled: false,
     endpoint: "", // es. https://buttondown.com/api/emails/embed-subscribe/<user>
   } as const;
   ```
2. **`src/components/NewsletterForm.astro`** — il form vero e proprio. Campo email +
   honeypot + checkbox consenso privacy (obbligatoria, GDPR). Stati: idle → loading →
   success/error gestiti con un piccolo `<script>` inline (no React necessario; in
   linea con lo stile Astro del progetto). Submit via `fetch`.
3. **`src/components/NewsletterBanner.tsx`** (React, perché serve stato + interazione)
   — il toast/banner laterale. Vedi Decisione 3.
4. **Pagina/sezione form** — la CTA del banner punta a:
   - opzione (a) **sezione in fondo a ogni articolo** + una sezione nella home blog, oppure
   - opzione (b) **pagina dedicata** `/newsletter` (e `/en/newsletter`).
   Raccomando **entrambe**: form inline a fine articolo (massima conversione, il
   lettore ha appena finito di leggere) + pagina dedicata come target "pulito" del banner.
5. **i18n** — nuove chiavi in `src/i18n/ui.ts` sotto `newsletter` per IT ed EN
   (titolo, sottotitolo, placeholder, CTA, testo consenso, messaggi success/error).

### Variante B (Cloudflare Pages Function)
Solo se vuoi raccogliere le email su infra tua: `@astrojs/cloudflare` in `hybrid`,
una function `POST /api/subscribe` che inoltra al provider con la API key come
**secret** (mai nel client). Vantaggio: la key non è esposta, validazione server-side.
Costo: introduci SSR runtime + secret management su un sito oggi banale. **Non vale la
pena al lancio** — passa a B solo se la chiave del provider non può stare client-side
(con Buttondown l'embed-subscribe è pensato per il client, quindi non serve).

---

## Decisione 3 — Comportamento del banner/toast (UX, è qui che si sbaglia di solito)

Il banner è la parte che può **danneggiare** la reputazione se fatta male (popup
aggressivo = esatto opposto della "credibilità"). Regole non negoziabili:

- **Posizione**: card in basso a destra (desktop), bottom full-width discreto (mobile).
  NON un modal a tutto schermo, NON un overlay che blocca la lettura.
- **Trigger**: comparire **dopo** un minimo di engagement, non al primo istante.
  Opzioni: dopo ~30s, oppure al ~50% di scroll dell'articolo, oppure su exit-intent
  (desktop). Raccomando **scroll 50% in pagina articolo** — segnala interesse reale.
- **Dismissal persistente**: alla chiusura o all'iscrizione, salvare un flag in
  `localStorage` (es. `nl-dismissed` con timestamp) e **non rimostrarlo per ~30-90
  giorni**. Riproporlo ogni visita è il modo più rapido per farsi odiare.
- **Mai** sulle pagine non-blog (home autori, landing) se l'obiettivo è il lettore di articoli — da decidere, ma di default lo limiterei al blog.
- **Accessibilità**: `role="region"` + `aria-label`, focus gestito, chiusura con `Esc`,
  bottone close con area touch ≥44px, rispettare `prefers-reduced-motion` per
  l'animazione di entrata. Coerente con l'attenzione a11y già presente (skip-link, `aria-labelledby`).

---

## Decisione 4 — Bilinguismo (problema reale, non cosmetico)
Il sito è IT/EN. Un iscritto IT non vuole email in inglese e viceversa. Opzioni:
- **Due liste/tag separati** sul provider, il form passa la lingua corrente
  (`getLangFromUrl`) come tag/campo nascosto. **Raccomandato.**
- Una lista sola, lingua ignorata → contenuto misto, disiscrizioni. Da evitare.

Implica che anche la **produzione dei contenuti** newsletter sia bilingue: è lavoro
editoriale ricorrente, non solo codice. Da mettere in conto (vedi Rischi).

---

## GDPR / legale (bloccante, non opzionale per un sito UE)
- **Double opt-in** attivo sul provider (email di conferma).
- **Checkbox consenso esplicito** nel form, non pre-spuntata, con link alla privacy policy.
- **Privacy policy**: oggi non esiste nel repo. Va creata (pagina `/privacy`) e linkata.
  Deve dichiarare provider usato, dati raccolti, base giuridica, diritti dell'utente.
- **Unsubscribe** in ogni email (lo dà il provider automaticamente).

> ⚠️ Senza privacy policy il form non dovrebbe andare live. È il primo blocco da risolvere.

---

## Effort stimato (scelta A, provider gestito)
| Blocco | Stima |
|---|---|
| Setup provider + liste IT/EN + double opt-in | 0.5 g |
| `NEWSLETTER` config + `NewsletterForm.astro` + i18n | 0.5 g |
| `NewsletterBanner.tsx` (trigger, localStorage, a11y) | 1 g |
| Pagina `/newsletter` + form inline fine articolo | 0.5 g |
| Privacy policy (testo + pagina) | 0.5 g |
| QA bilingue + a11y + test deliverability | 0.5 g |
| **Totale** | **~3.5 g** |

## Rischi e contro
- **Contenuto ricorrente**: la newsletter è un impegno editoriale continuo ×2 lingue.
  Se non c'è chi la scrive con costanza, la feature è codice morto. Mitigazione: partire
  con un **digest automatico** ("ultimi articoli pubblicati") generato dall'RSS già esistente,
  così l'invio non dipende da scrittura ad hoc. Buttondown/MailerLite supportano RSS-to-email.
- **Banner mal calibrato** → danno d'immagine. Mitigato dalle regole UX sopra; tenerlo conservativo.
- **Vendor lock-in** sugli iscritti: scegliere provider con export CSV libero (tutti quelli in tabella lo offrono).
- **Lock dimensionale del free tier** (Buttondown 100): da monitorare, piano di upgrade chiaro.

## ⚠️ Gotcha da verificare prima di partire (Buttondown + RSS)
Il **digest RSS-to-email di Buttondown è una automazione che storicamente richiede un
piano a pagamento**, mentre l'iscrizione e l'invio manuale sono nel free tier. Quindi:
- **Iscrizione + banner + form** → funzionano subito sul free (100 iscritti).
- **Digest automatico da RSS** → verificare se è incluso nel tuo piano; se no, o si passa
  a paid, o al lancio si manda il digest **a mano** (copincollando dall'RSS) finché non
  ha senso pagare. Da confermare ai prezzi/feature correnti di Buttondown prima dello sviluppo.

Decisione operativa proposta: **costruire prima iscrizione+banner** (free, valore subito),
**attivare il digest RSS dopo** quando i numeri giustificano il piano a pagamento.

## Stato domande
1. ~~Provider~~ → **Buttondown** ✅
2. ~~Contenuto~~ → **digest da RSS** ✅ (con il caveat sopra)
3. ~~Scope banner~~ → **solo pagine blog/articolo** ✅
4. ~~Privacy policy~~ → **bozza pronta** in [03-privacy-policy-draft.md](03-privacy-policy-draft.md) ✅
