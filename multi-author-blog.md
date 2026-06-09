# Piano: da sito personale a blog multi-autore

## Context

Il sito oggi è **Marco-centrico**: la homepage `/` (IT) e `/en/` è la presentazione one-page di
Marco (Hero, About, Experience, Skills, Contact), con il blog come sezione aggiuntiva. I dati del
profilo vivono come **singleton globale** in `src/config.ts` (`SITE`) e in `src/i18n/ui.ts`
(hero, about, experience, skills, contact).

**Obiettivo**: trasformare il prodotto in un **blog multi-autore**. La pagina di presentazione di
Marco diventa una **pagina profilo autore** (una tra tante), raggiungibile cliccando sul nome
dell'autore di un articolo. Ogni autore avrà la propria pagina profilo, in futuro generata tramite
una **skill dedicata** (fuori scope adesso, ma lo schema dati va progettato per essere
scaffoldabile da un tool).

### Decisioni confermate con l'utente
- **Homepage `/`**: diventa una **landing del blog** (brand + articoli recenti + vetrina autori),
  NON l'indice nudo degli articoli.
- **Profilo autore**: **schema completo per tutti** — ogni autore compila l'equivalente
  dell'attuale presentazione (hero, about con stats, timeline esperienze, griglia skill, contatti).
- **Lingue**: **tutto bilingue obbligatorio** (IT+EN) — sia gli articoli sia i profili. Coerente
  con l'architettura i18n esistente. Vincolo: niente è pubblicabile finché entrambe le lingue non
  esistono.

### Default tecnici decisi in autonomia (modificabili)
- Rotte profilo: `/autori/[slug]/` (IT) e `/en/authors/[slug]/` (EN).
- Identificatore autore: campo `authorKey` condiviso tra le due lingue (stesso pattern di
  `translationKey` dei post).
- Avatar: campo opzionale `avatar` (immagine) **oppure** `monogram` (fallback iniziali), così
  ogni autore sceglie foto o monogramma senza vincoli.

### Vincolo di progetto (dipendenza dalla skill futura)
Lo schema autore di Fase C0 sarà a **campi obbligatori e bilingui**. Perché la scelta "completo +
bilingue per tutti" non diventi un collo di bottiglia manuale, la **skill futura** dovrà:
1. scaffoldare l'entry autore IT+EN dai dati forniti;
2. assistere/validare la traduzione;
3. validare lo schema (tutti i campi richiesti presenti in entrambe le lingue).
Questo è il presupposto su cui regge tutto il modello.

---

## Modello dati

### Collection `authors` (nuova)
Mirror del pattern dei post: cartella per lingua + chiave di collegamento.
```
src/content/authors/
  it/marco-mariotti.md
  en/marco-mariotti.md
```
- La **lingua** è data dalla sottocartella; lo **slug** dal nome file (uguale tra le lingue, è
  l'identità pubblica dell'autore).
- Le due versioni si collegano tramite `authorKey` condiviso.
- I campi strutturati (stats, experience[], skills[]) stanno nel **frontmatter**; la bio lunga
  ("about") può stare nel **body markdown**.

### Schema frontmatter autore (zod) — bozza
```ts
{
  authorKey: string,              // condiviso IT/EN (es. "marco-mariotti")
  name: string,
  role: string,                   // es. "Software Engineer & Tech Lead"
  badge: string,                  // eyebrow hero
  headline: string,               // titolo hero
  subline: string,                // paragrafo hero
  avatar: image() (optional),     // foto; se assente si usa il monogramma
  monogram: string,               // fallback iniziali (es. "MM")
  links: { linkedin?: string, github?: string, website?: string },
  stats: { years: string, teamSize?: string, countries?: string },
  experience: [{ period, role, company, description }],
  skills: [{ title, items: string[] }],
  contact: { heading, lead, cta },
  // about: nel body markdown
}
```

### Schema post — aggiunta
```ts
author: reference("authors")   // oppure authorKey: string
```
Ogni post dichiara il proprio autore. Il nome mostrato sull'articolo linka al profilo.

---

## Routing

| Pagina | IT | EN |
| --- | --- | --- |
| Landing blog | `/` | `/en/` |
| Lista articoli | `/blog/` | `/en/blog/` |
| Articolo | `/blog/[slug]/` | `/en/blog/[slug]/` |
| Profilo autore | `/autori/[slug]/` | `/en/authors/[slug]/` |
| Indice autori | `/autori/` | `/en/authors/` |
| Archivio tag | `/blog/tag/[tag]/` | `/en/blog/tag/[tag]/` |
| RSS | `/rss.xml` | `/en/rss.xml` |

---

## Fasi di sviluppo (isolate e verificabili)

### Fase C0 — Modello dati autori + brand del blog
- Definire la collection `authors` (schema completo, bilingue) in `src/content.config.ts`.
- **Migrare** i dati attuali di Marco (`SITE` + sezioni di `ui.ts`) nella prima entry autore
  (`it/marco-mariotti.md` + `en/marco-mariotti.md`).
- Scorporare il **brand del blog** dai dati di Marco: nuovo oggetto config (nome **First Draft**,
  logo/monogramma del blog, descrizione), favicon e OG image del blog (non più "MM" personale).
- **Verifica**: `astro build` ok; le entry autore sono leggibili dalla collection.

### Fase C1 — Pagina profilo autore
- Rendere **data-driven** i componenti esistenti Hero/About/Experience/Skills/Contact: ricevono i
  dati di un autore via props invece di leggere la config globale.
- Nuove rotte `/autori/[slug]/` e `/en/authors/[slug]/` che renderizzano il profilo completo
  dall'entry autore, con hreflang per-autore via `authorKey`.
- **Verifica**: `/autori/marco-mariotti/` riproduce l'attuale homepage di Marco, in IT ed EN.

### Fase C2 — Nuova homepage landing
- `/` e `/en/` diventano la landing del blog: hero del brand, **articoli recenti**, **vetrina
  autori** (card con avatar/monogramma, nome, ruolo → link al profilo).
- **Verifica**: la homepage mostra ultimi articoli e autori; tutti i link funzionano.

### Fase C3 — Collegamento articoli ↔ autori
- Aggiungere il campo `author` allo schema post (obbligatorio) e aggiornare i post esistenti.
- Mostrare la **byline autore** su PostCard, PostMeta e pagina articolo; il nome linka al profilo.
- Sezione "Articoli di {autore}" nella pagina profilo (elenco dei post firmati).
- **Verifica**: dal nome autore su un articolo si apre il profilo; il profilo elenca i suoi post.

### Fase C4 — Navigazione, switch lingua, SEO
- Aggiornare la **Navbar**: rimuovere gli anchor specifici di Marco (`/#about`, ecc.), logo →
  home del blog, voci Blog / Autori; LanguageSwitcher invariato sulle pagine globali.
- **LanguageSwitcher context-aware** sulle pagine profilo (→ profilo tradotto via `authorKey`).
- SEO: hreflang/OG per-profilo, sitemap, RSS con tag autore (`<author>` / `<dc:creator>`),
  OG image per-autore con fallback al brand.
- **Verifica**: nav coerente da ogni pagina; switch IT↔EN su un profilo apre la traduzione; feed
  validi.

### Fase C5 — Polish & QA
- Indice autori `/autori/`, reveal on-scroll sulle card, responsive, accessibilità (landmark,
  alt avatar, focus), stati vuoti (autore senza articoli).
- **Verifica**: build di produzione pulita + ispezione multi-viewport (375px / 1280px).

### Fase C6 — (Futuro) Skill di creazione profilo autore
- Skill che scaffolda una nuova entry autore (IT+EN), assiste la traduzione e valida lo schema.
- **Fuori scope ora**; lo schema di C0 è progettato per essere generato da questo tool.

---

## Rischi / note
- **Barriera d'ingresso** (completo + bilingue): mitigata SOLO dalla skill C6. Senza skill, ogni
  autore va inserito a mano in due lingue con tutti i campi → lento ed error-prone.
- **Demozione della home di Marco**: l'attuale one-page non è più su `/`, diventa
  `/autori/marco-mariotti/`. Atteso e voluto.
- **Brand**: nome del blog = **First Draft**. Dominio: **thefirstdraft.dev** (Cloudflare).
  Resta da definire il logo/monogramma (vedi C0).
- **Profili "magri"**: con schema obbligatorio completo, un autore con poca esperienza avrà sezioni
  forzate. Da valutare in C5 se rendere graziosamente collassabili le sezioni con pochi dati.
