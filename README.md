# Marco Mariotti — Sito professionale

Sito personale di personal branding (bilingue IT/EN) realizzato con **Astro + React + Tailwind CSS**.
Tema "Modern Tech Dark", single-page con sezioni Hero, Chi sono, Esperienza, Competenze e Contatti.

## Stack

- [Astro](https://astro.build) — framework, output statico, SEO
- [React](https://react.dev) — solo per le island interattive (menu mobile)
- [Tailwind CSS v4](https://tailwindcss.com) — styling (config CSS-first)
- i18n nativo di Astro (IT su `/`, EN su `/en/`)

## Comandi

| Comando             | Azione                                             |
| ------------------- | -------------------------------------------------- |
| `npm install`       | Installa le dipendenze                             |
| `npm run dev`       | Avvia il server di sviluppo su `localhost:4321`    |
| `npm run build`     | Genera il sito statico in `dist/`                  |
| `npm run preview`   | Anteprima locale della build di produzione         |

> Nota: evita di lanciare `npm run build` mentre `npm run dev` è attivo (può
> corrompere la cache di Vite). In tal caso: ferma il dev server, esegui
> `rm -rf node_modules/.vite .astro` e riavvia.

## Personalizzazione dei contenuti

I testi e i dati personali vivono in pochi file. Cerca i commenti `TODO`:

- **`src/config.ts`** — nome, ruolo, **URL LinkedIn**, numeri della sezione "Chi sono".
- **`src/i18n/ui.ts`** — tutti i testi in italiano e inglese (bio, timeline esperienza, competenze).
- **`scripts/generate-og.mjs`** — genera l'immagine di anteprima social; riesegui con
  `node scripts/generate-og.mjs` dopo aver cambiato nome/ruolo.

### Checklist contenuti ancora da fornire
1. URL LinkedIn reale (`src/config.ts`).
2. Voci reali della timeline esperienza (`src/i18n/ui.ts` → `experience.items`).
3. Eventuale nome azienda/prodotto (o lasciare generico per riservatezza).
4. Numeri reali di anni esperienza / persone nel team (`src/config.ts` → `stats`).

## Deploy

Il sito è 100% statico: la cartella `dist/` può essere pubblicata su qualsiasi hosting statico.

- **Vercel / Netlify** (consigliato): collega il repository, framework rilevato
  automaticamente (build `npm run build`, output `dist`).
- **GitHub Pages**: pubblica il contenuto di `dist/`.

Prima del deploy, aggiorna il dominio in **`astro.config.mjs`** (`site: '...'`):
serve per canonical, `hreflang` e sitemap.
