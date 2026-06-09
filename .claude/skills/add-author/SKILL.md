---
name: add-author
description: >
  Scaffolds a new bilingual author profile (IT + EN) for the First Draft multi-author Astro blog
  at /Users/marcomariotti/Documents/Workspace/ProfessionalDevHeroPage. Collects all author data
  interactively in one language (user's choice), auto-translates to the other language using Claude,
  previews the translation for confirmation, generates both src/content/authors/it/[slug].md and
  src/content/authors/en/[slug].md with the correct frontmatter schema, and validates with
  `npx astro build`. Use this skill whenever the user wants to add a new author, create an author
  page, scaffold an author profile, or says things like "aggiungi un autore", "nuovo autore",
  "add author", "create author profile" — even if they don't mention the exact file paths.
  This is the designated workflow for all author creation on this project.
---

# add-author — Bilingual Author Scaffolding

This skill adds a new author to the First Draft blog. It guides you through collecting all required
profile data in your preferred language, then auto-translates to the other language so you only
have to provide information once.

**Project root:** `/Users/marcomariotti/Documents/Workspace/ProfessionalDevHeroPage`
**Schema:** `src/content.config.ts`
**Output files:**
- `src/content/authors/it/[slug].md`
- `src/content/authors/en/[slug].md`
**Style reference:** `src/content/authors/it/marco-mariotti.md` and `en/marco-mariotti.md`

---

## Step 1 — Choose input language

Ask the user:

> Vuoi inserire i dati in **italiano (IT)** o **inglese (EN)**?
> *(In which language do you want to provide the data — Italian or English?)*

Record their choice as `INPUT_LANG` (IT or EN) and the other as `OUTPUT_LANG`.

---

## Step 2 — Collect data interactively

Ask the user for each field in order. Show a short label and example. Wait for their answer before
moving on — no need to confirm each field, just collect them all in sequence.

### Fixed fields (same in both languages — never translate these)

1. **name** — Full name (e.g. "Marco Mariotti")
2. **authorKey** — URL slug, shared across IT/EN (e.g. "marco-mariotti"). Derive automatically
   from the name (lowercase, spaces → hyphens, strip accents), show it to the user, and ask for
   confirmation or a custom value.
3. **monogram** — 2–3 initials for the avatar fallback (e.g. "MM"). Suggest from initials.
4. **role** — Job title (e.g. "Software Engineer & Tech Lead"). Proper noun, stays the same in
   both languages.
5. **stats.years** — Years of experience (e.g. "6+")
6. **stats.teamSize** *(optional)* — Team size (e.g. "7"). Press Enter to skip.
7. **stats.countries** *(optional)* — Countries worked across (e.g. "2"). Press Enter to skip.
8. **links.linkedin** *(optional)* — Full LinkedIn URL. Press Enter to skip.
9. **links.github** *(optional)* — Full GitHub URL. Press Enter to skip.
10. **links.website** *(optional)* — Personal website URL. Press Enter to skip.

### Localised fields (in INPUT_LANG — will be translated)

11. **badge** — Short eyebrow text above the hero headline
    (e.g. IT: "Tech Lead • Frontend & Telecomunicazioni")
12. **headline** — Hero headline, 1–2 punchy sentences
    (e.g. IT: "Ingegnere frontend e Tech Lead. Trasformo requisiti complessi in prodotti che funzionano.")
13. **subline** — Hero paragraph, 2–4 sentences introducing the author in first person
14. **aboutLead** — One-line guiding sentence for the About section
    (e.g. IT: "Tecnica e leadership, nello stesso ruolo.")
15. **about body** — Long bio for the About section body (2–4 sentences, no markdown headers).
    This goes in the markdown body, not the frontmatter.

### Experience entries (in INPUT_LANG)

Tell the user:
> "Aggiungiamo le tue esperienze lavorative. Inseriscile una alla volta. Scrivi **fine** quando hai
> finito. (Puoi anche saltare questa sezione.)"

For each entry, ask:
- **period** — Date range (IT: "Ott 2024 – Oggi" / EN: "Oct 2024 – Present")
- **role** — Job title
- **company** — Company name
- **description** — 2–3 sentences on responsibilities and impact

Repeat until the user types "fine" / "done" / "basta" / "stop". Empty list is valid.

### Skill categories (in INPUT_LANG)

Tell the user:
> "Aggiungiamo le categorie di skill. Inseriscile una alla volta. Scrivi **fine** quando hai finito."

For each category, ask:
- **title** — Category name (IT: "Tecnologie & Architettura" / EN: "Technology & Architecture")
- **items** — Skills, comma-separated (e.g. "React, TypeScript, Java")

Repeat until done. Empty list is valid.

### Avatar

Ask: "Hai una foto profilo da usare, o usiamo solo il monogramma come fallback?"
- **Photo**: ask for the path relative to project root (e.g. `src/assets/authors/nome.jpg`) and
  for `avatarAlt` text.
- **Monogram only**: no extra fields needed.

---

## Step 3 — Auto-translate to OUTPUT_LANG

Translate the localised fields from INPUT_LANG to OUTPUT_LANG. Reference the table below.
Keep the translated text natural, first-person, and consistent with the register of the existing
`marco-mariotti.md` files — that is the tone benchmark.

| Field | Translate? | Notes |
|---|---|---|
| name | ✗ | Proper noun |
| authorKey | ✗ | Slug |
| monogram | ✗ | Initials |
| role | ✗ | Job title |
| links, stats | ✗ | Numbers/URLs |
| badge | ✓ | Keep concise, same register |
| headline | ✓ | Keep the punchy 1-sentence style |
| subline | ✓ | Keep first-person voice |
| aboutLead | ✓ | Keep short and rhythmic |
| about body | ✓ | Keep first-person voice and paragraph structure |
| experience[].period | ✓ | Adapt month names only ("Ott"↔"Oct", "Oggi"↔"Present") |
| experience[].role | ✗ | Job title unchanged |
| experience[].company | ✗ | Company name unchanged |
| experience[].description | ✓ | Same tense, same detail level |
| skills[].title | ✓ | Translate category names; keep pure tech stack labels (e.g. "Java") unchanged |
| skills[].items | ✓ non-tech, ✗ tech tokens | "Gestione di team distribuiti"→translated; "React, TypeScript"→unchanged |

---

## Step 4 — Preview translation

Show a compact summary of all translated OUTPUT_LANG fields (not the full YAML — just key content):

```
=== Anteprima traduzione (OUTPUT_LANG) ===
badge:      <valore tradotto>
headline:   <valore tradotto>
subline:    <valore tradotto>
aboutLead:  <valore tradotto>
about body: <valore tradotto>

Esperienze:
  1. <period> | <company> — <primi 80 caratteri della descrizione>…

Skill:
  <titolo categoria>: <items separati da virgola>
```

Then ask:
> "La traduzione va bene? Rispondi **sì** per continuare, oppure dimmi cosa correggere."

Apply corrections and re-show the preview until confirmed.

---

## Step 5 — Generate the files

### YAML formatting rules
- Wrap in double quotes any string containing `:`, `#`, `–`, `[`, `]`, `{`, `}`, or leading spaces.
- The markdown body (about) goes **after** the closing `---`, NOT in the frontmatter.
- `avatar` / `avatarAlt`: include only if the user provided a photo.
- `links`: **always write the key**. If no links provided use `links: {}`. Never leave it as
  `links:` (null) — the schema requires an object.
- Omit optional stat fields (`teamSize`, `countries`) if left blank.
- Empty lists: write `experience: []` and `skills: []` (not omit the keys).

### File template

```yaml
---
authorKey: <slug>
name: <name>
role: <role>
badge: "<badge>"
headline: "<headline>"
subline: "<subline>"
# avatar: src/assets/authors/<slug>.jpg   ← only if photo provided
# avatarAlt: "<alt text>"                 ← only if photo provided
monogram: <XX>
links:
  linkedin: "<url>"    # omit if not provided
  github: "<url>"      # omit if not provided
  website: "<url>"     # omit if not provided
# If NO links at all: links: {}
stats:
  years: "<N+>"
  teamSize: "<N>"      # omit if not provided
  countries: "<N>"     # omit if not provided
aboutLead: "<one-line lead>"
experience:
  - period: "<period>"
    role: "<role>"
    company: "<company>"
    description: "<2-3 sentences>"
# If no experience: experience: []
skills:
  - title: "<category>"
    items:
      - "<item>"
# If no skills: skills: []
---

<about body — 2-4 sentences in prose>
```

Write both:
- `src/content/authors/it/<slug>.md` (IT language version)
- `src/content/authors/en/<slug>.md` (EN language version)

---

## Step 6 — Validate

From the project root, run:

```bash
npx astro build 2>&1 | tail -5
```

- **Pass** (output contains "Complete!" or "✓ Completed"): report success.
- **Fail**: show only the relevant error lines, diagnose the likely cause (YAML quoting, missing
  required field, invalid URL), fix the file(s), and re-run.

---

## Step 7 — Summary

```
✓ Profilo autore creato!

File generati:
  src/content/authors/it/<slug>.md
  src/content/authors/en/<slug>.md

Quando sei pronto a committare:
  git add src/content/authors/
  git commit -m "feat(authors): add <name> profile"

Il profilo sarà live su:
  /autori/<slug>/        (IT)
  /en/authors/<slug>/    (EN)
```
