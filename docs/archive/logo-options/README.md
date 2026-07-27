# docs/archive/logo-options

Materiale di lavoro della scelta del logo, conclusa. `index.html` confrontava cinque opzioni
fianco a fianco (grande + versione navbar); viveva prima in `public/logos/`, dove Astro lo
deployava come pagina pubblica raggiungibile a `/logos/`, senza canonical, description, OG o
hreflang, e mostrando anche le alternative scartate (in violazione di `docs/brand.md` §3.2, che
vieta di usarle). Spostato qui il 2026-07-27 (punto 13 di `TECH-IMPROVEMENTS.md`): non è più
nel deploy di produzione.

**Opzione scelta: 3, "Pennino"** (`fd-3-nib.svg`). È l'unico logo ufficiale ed è l'unico rimasto
in `public/logos/` (insieme al suo raster `fd-3-nib.png`), da dove il sito lo usa davvero
(`src/config.ts`, `src/utils/og.ts`). La copia di `fd-3-nib.svg` in questa cartella è solo per
tenere la pagina di confronto autosufficiente; se il logo ufficiale cambia, questa copia resta
quella storica, non va aggiornata.

Le altre quattro SVG (`fd-1-monogram`, `fd-2-caret`, `fd-4-pilcrow`, `fd-5-wordmark`) sono le
opzioni scartate: esistono solo qui, per memoria.

Per riaprire il confronto: apri `index.html` in un browser direttamente da questa cartella
(percorsi relativi, nessun server necessario).
