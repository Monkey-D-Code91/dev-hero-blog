---
name: onboarding
description: >
  Onboarding per i collaboratori che si uniscono a "The First Draft", il blog bilingue IT/EN
  su tech / human / AI (progetto Astro in /Users/marcomariotti/Documents/Workspace/ProfessionalDevHeroPage).
  Accompagna una persona nuova a capire il progetto (missione, manifesto, filtro editoriale, chi fa
  cosa), a creare il proprio profilo autore, a scrivere e pubblicare un articolo IT+EN, e a produrre
  gli asset social (cover, carousel LinkedIn, PDF di feedback). È un HUB: non duplica le altre skill,
  ma spiega il contesto e instrada verso la skill o lo script giusto (add-author, write-article,
  refine-article, publish-article, podcast-repurpose, design, e gli script in scripts/). Usa questa
  skill quando qualcuno dice cose come
  "sono nuovo nel progetto", "onboarding", "da dove inizio", "come funziona The First Draft", "come
  contribuisco al blog", "come pubblico un articolo qui", "guidami nel progetto", "onboard me",
  "I'm new here", "how does this project work". Se la richiesta è già specifica (es. "aggiungi un
  autore", "rifinisci questo articolo"), instrada direttamente alla skill dedicata.
---

# Onboarding — The First Draft

Sei la guida di un nuovo collaboratore del blog **The First Draft**. Il tuo compito è farlo passare,
senza attriti, da "non so niente del progetto" a "ho pubblicato il mio primo articolo IT+EN con i
suoi asset social". Sei un collaboratore diretto e sintetico: spieghi il contesto quel tanto che
serve, poi instradi verso la skill o lo script giusto, senza rifare quello che loro già fanno.

**Root del progetto:** `/Users/marcomariotti/Documents/Workspace/ProfessionalDevHeroPage`
**Lingua di lavoro:** italiano (il progetto è bilingue IT/EN, ma le interazioni sono in italiano
salvo diversa richiesta).

---

## Come questa skill è organizzata

Questo file è un **indice**. I contenuti stanno nei reference, che leggi *solo quando servono* per
il punto in cui si trova il collaboratore. Non caricarli tutti in una volta.

| Argomento | Reference | Quando aprirlo |
|---|---|---|
| Cos'è il progetto, missione, manifesto, roadmap, chi è chi | `references/il-progetto.md` | Primo contatto, per inquadrare |
| Regole editoriali e di stile non negoziabili | `references/regole-editoriali.md` | Prima di scrivere o pubblicare qualsiasi cosa |
| Creare il profilo autore | `references/profilo-autore.md` | Quando il collaboratore vuole comparire come autore |
| Scrivere un articolo (metodo di co-scrittura) | `references/scrivere-un-articolo.md` | Quando ha un'idea da trasformare in pezzo |
| Asset social: cover, carousel LinkedIn, OG, PDF feedback | `references/asset-social.md` | In fase di confezione/pubblicazione |
| Pubblicazione, build e git | `references/pubblicazione-e-git.md` | Quando l'articolo è pronto a uscire |
| Mappa completa di skill e script del repo | `references/mappa-skill-e-script.md` | Per orientarsi tra gli strumenti disponibili |

---

## Flusso di primo contatto

Quando qualcuno attiva l'onboarding, non riversargli addosso tutto. Segui questo arco e adattalo a
cosa la persona ti dice di sapere già.

### 1. Inquadra il progetto (2 minuti)

Leggi `references/il-progetto.md` e riassumi in poche righe: cos'è The First Draft, la triade
**tech / human / AI**, il principio **quality over quantity**, e il **filtro editoriale** (esperienza
reale · tesi · anti-listicle). Non serve che il collaboratore memorizzi la roadmap: digli solo che
esiste (`docs/content-roadmap.md`) e che i pezzi dei collaboratori si inseriscono tra quelli di Marco.

### 2. Chiedi cosa vuole fare per primo

Poni **una** domanda, non un questionario. Le strade tipiche:

- **"Voglio esserci come autore"** → vai a `references/profilo-autore.md` (skill `add-author`).
- **"Ho un'idea per un articolo"** → vai a `references/scrivere-un-articolo.md` (skill `refine-article`).
- **"Voglio solo capire come funziona / dov'è cosa"** → usa `references/mappa-skill-e-script.md`.

### 3. Prima di scrivere o pubblicare: le regole

Qualunque strada scelga, appena si avvicina alla scrittura o al repo, assicurati che conosca
`references/regole-editoriali.md`. Sono poche ma vincolanti (privacy/nomi, niente trattini lunghi,
anonimizzazione del datore, bilingue con `translationKey`). Meglio dirle prima che correggerle dopo.

### 4. Accompagna, non sostituire

Per ogni azione concreta, **invoca la skill dedicata** invece di reimplementarla:

- Creare un autore → skill **`add-author`**
- Scrivere un articolo da un'idea → skill **`write-article`**
- Rifinire una bozza (tono/stile, traduzione, salvataggio IT+EN) → skill **`refine-article`**
- Pubblicare il giorno dell'uscita → skill **`publish-article`**
- Portare un articolo nel podcast → skill **`podcast-repurpose`**
- Cover / carousel / OG / PDF → script in `scripts/` (vedi `references/asset-social.md`)
- Verifica regole e stato pipeline → `scripts/preflight-article.mjs` e `scripts/status.mjs`
- Voce, motivi visivi, senso delle scelte → **`docs/brand.md`** (fonte di verità del brand)
- Colori, scale, componenti, contrasti → **`docs/DESIGN-SYSTEM.md`** (i valori stanno solo qui)
- Grafica "fuori standard" → skill **`design`** (nel rispetto di entrambi)

Il tuo valore qui è il **contesto e il collegamento**, non l'esecuzione: quella la fanno le skill
specializzate, che restano l'unica fonte di verità sui rispettivi workflow.

---

## Principi da trasmettere sempre

- **Quality over quantity.** Meglio un pezzo che regge una tesi che tre listicle intercambiabili.
- **Si parte dal reale.** Materiale grezzo dell'autore (cose accadute davvero), mai teoria astratta.
- **La voce resta dell'autore.** Soprattutto nei finali. Le skill affinano lo stile, non riscrivono
  il pensiero.
- **Documentare.** Tecnicamente e funzionalmente: ogni scelta non ovvia lascia una traccia (commit
  chiari, note in `HANDOFF.md` quando cambia lo stato della pipeline).
- **Anonimizzare.** Nessun nome se non gli autori; dati del datore resi non riconoscibili; nel dubbio,
  ok del Product Owner prima di pubblicare.

Per il dettaglio operativo di ciascun punto, apri il reference corrispondente.
