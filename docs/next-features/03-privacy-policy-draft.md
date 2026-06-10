# Bozza — Privacy Policy / Informativa Newsletter

> **Stato: BOZZA.** Non è consulenza legale. Copre il minimo GDPR per la sola
> raccolta email della newsletter. Prima del go-live: (1) compilare i campi `{...}`,
> (2) far revisionare a chi di dovere, (3) tradurre in EN, (4) pubblicare come
> `/privacy` (IT) e `/en/privacy` (EN) e linkare dal form e dal footer.
>
> Scope volutamente ristretto alla newsletter. Se in futuro aggiungi analytics,
> commenti (Giscus salva dati su GitHub), o altri tracker, l'informativa va estesa.

---

## Campi da compilare prima della pubblicazione
- `{TITOLARE}` — nome e cognome o ragione sociale del titolare del trattamento (presumibilmente Marco Mariotti come persona fisica).
- `{EMAIL_CONTATTO}` — email per esercitare i diritti (es. una casella dedicata privacy@…).
- `{INDIRIZZO}` — indirizzo del titolare (opzionale per persona fisica, ma consigliato).
- `{DATA}` — data di ultimo aggiornamento.

---

## Informativa sul trattamento dei dati personali — Newsletter

**Ultimo aggiornamento: {DATA}**

### 1. Titolare del trattamento
Il titolare del trattamento dei dati è **{TITOLARE}**, contattabile all'indirizzo
email **{EMAIL_CONTATTO}**{, con sede in `{INDIRIZZO}`}.

### 2. Quali dati raccogliamo
Per il servizio di newsletter raccogliamo esclusivamente:
- il tuo **indirizzo email**;
- la **lingua** scelta (italiano o inglese), per inviarti i contenuti nella lingua corretta;
- dati tecnici minimi gestiti dal fornitore del servizio (es. data di iscrizione,
  conferma del consenso, eventuali statistiche di apertura).

Non raccogliamo altri dati anagrafici e non è richiesta la registrazione di un account.

### 3. Finalità e base giuridica
I tuoi dati sono trattati per **inviarti la newsletter** del blog First Draft
(aggiornamenti sui nuovi articoli e contenuti correlati). La base giuridica è il tuo
**consenso esplicito** (art. 6, par. 1, lett. a del GDPR), prestato spuntando l'apposita
casella nel modulo di iscrizione e confermato tramite email (double opt-in).

### 4. Fornitore del servizio (responsabile esterno)
La gestione tecnica della newsletter è affidata a **Buttondown** (Buttondown, LLC),
che agisce come responsabile del trattamento e che può conservare i dati su server
situati al di fuori dell'Unione Europea. Il trasferimento avviene nel rispetto delle
garanzie previste dal GDPR (es. clausole contrattuali standard).
Informativa del fornitore: https://buttondown.com/legal/privacy

### 5. Conservazione dei dati
Conserviamo il tuo indirizzo email **finché resti iscritto**. Puoi disiscriverti in
qualsiasi momento tramite il link presente in fondo a ogni email: alla disiscrizione i
tuoi dati vengono rimossi (o anonimizzati) dalle liste di invio entro tempi tecnici ragionevoli.

### 6. I tuoi diritti
In qualità di interessato hai diritto, in qualsiasi momento, di:
- **accedere** ai tuoi dati e chiederne una copia;
- chiederne la **rettifica** o la **cancellazione**;
- **revocare il consenso** (la revoca non pregiudica i trattamenti già effettuati);
- proporre **reclamo** all'autorità di controllo (in Italia, il Garante per la
  protezione dei dati personali — www.garanteprivacy.it).

Per esercitare questi diritti scrivi a **{EMAIL_CONTATTO}**.

### 7. Modifiche a questa informativa
Eventuali aggiornamenti saranno pubblicati su questa pagina con la relativa data di revisione.

---

## Checklist tecnica di conformità (per l'implementazione del form)
- [ ] Checkbox consenso **non pre-spuntata**, obbligatoria al submit.
- [ ] Testo accanto alla checkbox con **link a questa informativa**.
- [ ] **Double opt-in** attivo su Buttondown (email di conferma).
- [ ] Link **unsubscribe** in ogni email (automatico Buttondown).
- [ ] Pagina raggiungibile e linkata dal **footer** del sito, oltre che dal form.
- [ ] Versione **EN** pubblicata su `/en/privacy` con `hreflang` corretto (pattern già in `BaseLayout.astro`).
