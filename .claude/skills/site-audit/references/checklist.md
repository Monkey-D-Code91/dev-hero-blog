# Checklist di site-audit

La checklist è **stabile per costruzione**: è ciò che rende confrontabili due audit a distanza di
mesi. Non riordinarla e non toglierne voci per fretta. Aggiungerne una è legittimo (il sito
cresce): si aggiunge in coda alla sua area, con la data, e nel report si dichiara che quel
controllo è nuovo, così il confronto non registra un finto peggioramento.

**Convenzioni.** I comandi assumono la radice del repo come working directory e una `dist/`
esistente (`npm run build`). Ogni voce ha un ID suggerito: usalo se il problema è quello tipico,
altrimenti conia uno slug che descriva il problema reale, sempre col prefisso dell'area.

---

## A11Y — Accessibilità

Base solida già presente nel progetto (token `--color-border-strong` per i bordi interattivi,
`:focus-visible`, `prefers-reduced-motion`, `aria-labelledby` sulle card, byline `sr-only`). Qui
si verifica che non sia stata erosa.

| # | Controllo | Come | Soglia / atteso | ID tipico |
|---|---|---|---|---|
| 1 | Immagini senza `alt` | `grep -roh '<img[^>]*>' dist --include="*.html" \| grep -v 'alt='` | nessun risultato | `A11Y-img-senza-alt` |
| 2 | Un solo `h1` per pagina | `for f in $(find dist -name "*.html"); do n=$(grep -o '<h1' "$f" \| wc -l \| tr -d ' '); [ "$n" != "1" ] && echo "$f: $n"; done` | nessun risultato | `A11Y-h1-multipli` |
| 3 | Gerarchia dei titoli senza salti | leggi l'articolo renderizzato: `h2` non deve saltare a `h4` | nessun salto | `A11Y-gerarchia-heading` |
| 4 | `lang` coerente col percorso | `grep -oh '<html[^>]*lang="[^"]*"' dist/index.html dist/en/index.html` | `it` sulle pagine IT, `en` su quelle sotto `/en/` | `A11Y-lang-errato` |
| 5 | Link con sola icona senza nome accessibile | `find dist -name "*.html" -print0 \| xargs -0 perl -0ne 'while(/<a\b[^>]*>\s*<svg.*?<\/svg>\s*<\/a>/gs){ $m=$&; print "$ARGV\n" unless $m=~/aria-label\|sr-only\|<title>/ }' \| sort -u` | nessun risultato. Il pattern cerca gli `<a>` il cui contenuto è **solo** una `svg`: i link con icona **e** testo non sono un problema e non devono comparire | `A11Y-link-icona-senza-nome` |
| 6 | Contrasto dei token | confronta `src/styles/global.css` con `docs/DESIGN-SYSTEM.md` §2, che riporta i contrasti gia' misurati; i sospetti sono `--color-muted` su `--color-surface` e i colori dei pilastri sul bg | corpo ≥4.5:1, testo grande e bordi interattivi ≥3:1 | `A11Y-contrasto-<elemento>` |
| 7 | Focus visibile ovunque | nel browser: `Tab` lungo home, indice, articolo, form newsletter | il focus si vede su ogni elemento raggiungibile, anche sulle card | `A11Y-focus-invisibile` |
| 8 | Navigazione da tastiera | nel browser: menu mobile, filtri per tag, share, commenti | tutto raggiungibile e azionabile senza mouse, senza trappole | `A11Y-tastiera-<componente>` |
| 9 | `prefers-reduced-motion` rispettato | `grep -rn "prefers-reduced-motion" src/styles/global.css src/components` | ogni animazione introdotta dopo l'ultimo audit è coperta | `A11Y-motion-non-coperto` |
| 10 | Form newsletter etichettato | leggi `src/components/NewsletterSignup.astro` | `label` associata o `aria-label`, errore annunciato | `A11Y-newsletter-form` |

---

## SEO — Indicizzazione e social card

| # | Controllo | Come | Soglia / atteso | ID tipico |
|---|---|---|---|---|
| 1 | Meta essenziali su ogni pagina | `for f in $(find dist -name "*.html"); do for t in 'rel="canonical"' 'hreflang="it"' 'hreflang="en"' 'og:image' 'name="description"'; do grep -q "$t" "$f" \|\| echo "$f manca $t"; done; done` | nessun risultato; le pagine statiche in `public/` che compaiono qui vanno valutate: probabilmente non dovrebbero essere pubbliche | `SEO-meta-mancanti` |
| 2 | Hreflang reciproci | per una coppia IT/EN di articoli, estrai gli `hreflang` da entrambe le pagine | la pagina IT punta alla EN **e** viceversa, con gli slug giusti (diversi per lingua) | `SEO-hreflang-non-reciproco` |
| 3 | Canonical corretto | `grep -oh 'rel="canonical" href="[^"]*"' dist/blog/*/index.html` | dominio di `astro.config.mjs`, nessun `localhost`, nessun doppio slash | `SEO-canonical-errato` |
| 4 | Title unici e non troncati | `grep -roh '<title>[^<]*</title>' dist --include="*.html" \| sort \| uniq -d` | lunghezza indicativa 50-60 caratteri. Le pagine tag IT ed EN condividono legittimamente il title quando il tag non è tradotto: è un finding **solo** se le due pagine non sono legate da `hreflang`. Ogni altro duplicato è un finding | `SEO-title-duplicati` |
| 5 | Description in range | riusa l'esito di `preflight-article.mjs --all` per gli articoli; per le pagine non-articolo leggi i `.astro` | 50-250 caratteri (stessa soglia del preflight) | `SEO-description-fuori-range` |
| 6 | OG image esistente e non di default sugli articoli | `grep -oh 'og:image" content="[^"]*"' dist/blog/*/index.html` | ogni articolo ha la sua OG, non `og-image.png` generica | `SEO-og-generica` |
| 7 | Sitemap e robots | `ls dist/sitemap-index.xml dist/robots.txt` e conta le URL nella sitemap | presenti; il conteggio cresce con gli articoli pubblicati e **non include i draft** | `SEO-sitemap` |
| 8 | Feed RSS | `ls dist/rss.xml dist/en/rss.xml dist/autori/*/rss.xml` e apri uno dei feed | presenti, XML valido, nessun draft dentro | `SEO-feed` |
| 9 | Draft non indicizzabili | `grep -rl 'noindex' dist --include="*.html"` | solo le anteprime di bozza, mai una pagina pubblicata | `SEO-noindex-errato` |
| 10 | Dati strutturati | `grep -l 'application/ld+json' dist/blog/*/index.html` e valida il JSON | presente sugli articoli, JSON ben formato, campi coerenti col frontmatter | `SEO-structured-data` |

---

## PERF — Performance

| # | Controllo | Come | Soglia / atteso | ID tipico |
|---|---|---|---|---|
| 1 | Peso totale della build | `du -sh dist` | crescita spiegabile dal numero di articoli; un salto improvviso è un finding | `PERF-peso-build` |
| 2 | Asset singoli pesanti | `find dist -type f -size +100k -printf "%s %p\n" \| sort -rn \| head` | le cover degli articoli sono le voci attese; se un derivato PNG è servito dove ci si aspetta webp, è un finding | `PERF-asset-pesanti` |
| 3 | JS spedito al browser | `find dist -name "*.js" \| xargs du -ch \| tail -1` | il sito è statico: il JS è quello delle isole React (menu mobile) e dei commenti. Una crescita significativa va spiegata | `PERF-js-cresciuto` |
| 4 | Immagine LCP dell'articolo | `grep -o '<img[^>]*>' dist/blog/<slug>/index.html \| head -1` | la cover above-the-fold ha `loading="eager"` e `fetchpriority="high"`, mai `lazy` | `PERF-lcp-lazy` |
| 5 | Immagini sotto la piega | stesso file, occorrenze successive | `loading="lazy"` | `PERF-lazy-mancante` |
| 6 | Dimensioni esplicite sulle immagini | `grep -o '<img[^>]*>' dist/blog/*/index.html \| grep -v 'width='` | ogni `img` ha `width`/`height` o un contenitore con aspect-ratio: evita il layout shift | `PERF-layout-shift` |
| 7 | Font | `find dist/_astro -name "*.woff2" \| wc -l` e i `@font-face` in `global.css` | solo Inter e Newsreader (`DESIGN-SYSTEM.md` §3.1), sottoinsiemi ragionevoli, `font-display` impostato | `PERF-font` |
| 8 | Beacon analytics (solo live) | sul sito live, presenza dello script Cloudflare Web Analytics | presente se `CF_BEACON_TOKEN` è configurato in Workers Builds (`CLAUDE.md` §7); assente in locale è normale | `PERF-analytics-assente` |

---

## READ — Leggibilità

Area prevalentemente visiva: si audita nel browser, non col grep. Se il browser non è disponibile,
marca l'area come parzialmente verificata nel report.

| # | Controllo | Come | Soglia / atteso | ID tipico |
|---|---|---|---|---|
| 1 | Misura della riga nel corpo articolo | nel browser, articolo aperto a larghezza desktop | 65-75 caratteri per riga | `READ-misura-riga` |
| 2 | Dimensione e interlinea del corpo | ispeziona il contenitore del testo | corpo 19-21px, `line-height` circa 1.7 su long-form | `READ-corpo-piccolo` |
| 3 | Gerarchia visiva dei titoli | scorri un articolo lungo | i livelli si distinguono a colpo d'occhio, il serif Newsreader è dove `DESIGN-SYSTEM.md` §3.1 dice (h1 e corpo articolo) | `READ-gerarchia-debole` |
| 4 | Resa su mobile | riduci a 390px | niente overflow orizzontale, tabelle e blocchi di codice scrollabili, tap target adeguati | `READ-mobile-<pagina>` |
| 5 | Indice e home con pochi articoli | home e `/blog` | il layout regge anche con pochi pezzi pubblicati, senza buchi che sembrano una pagina rotta | `READ-layout-vuoto` |
| 6 | Componenti editoriali speciali | apri un articolo che usa `revisions`, `discussion`, `openQuestions`, `Contradiction` | ogni componente è leggibile e distinguibile dal corpo; nessuno rompe il ritmo di lettura | `READ-componente-<nome>` |
| 7 | Pagine EN | ripeti 1-6 sulle pagine `/en/` | stessa qualità dell'italiano; il testo inglese è più lungo e a volte manda a capo diversamente | `READ-en-<problema>` |

---

## BRAND — Coerenza con brand.md e DESIGN-SYSTEM.md

| # | Controllo | Come | Soglia / atteso | ID tipico |
|---|---|---|---|---|
| 1 | Trattini lunghi nel copy del sito | `node scripts/check-copy.mjs` | exit 0. Dal 2026-07-25 il controllo e' automatico e **bloccante in CI** (`npm test`), quindi qui ci si aspetta che sia gia' verde: se e' rosso, qualcuno ha aggirato la CI. Copre i sorgenti; gli articoli restano a `preflight-article.mjs` | `BRAND-emdash-copy-sito` |
| 2 | Logo ufficiale | `grep -rn "logos/" src --include="*.astro" \| grep -v "fd-3-nib"` | nessun risultato: l'unico logo è `public/logos/fd-3-nib.svg` (`CLAUDE.md` §5), gli altri file sono alternative scartate | `BRAND-logo-non-ufficiale` |
| 3 | Favicon e OG di default | `ls dist/favicon.svg dist/og-image.png` e apri entrambi | coerenti con il logo attuale, non con una versione precedente | `BRAND-asset-vecchio` |
| 4 | Colori fuori dai token | `grep -rn "#[0-9a-fA-F]\{3,6\}" src --include="*.astro" --include="*.tsx"` | i colori vivono in `global.css` come token; un esadecimale in un componente è debito, e se non è in palette è un finding | `BRAND-colore-hardcoded` |
| 5 | Palette allineata | confronta i token di `global.css` con `docs/DESIGN-SYSTEM.md` §2.2-2.3 | identici; se divergono, il bug è nel codice | `BRAND-palette-divergente` |
| 6 | Tipografia allineata | `DESIGN-SYSTEM.md` §3 contro l'uso reale | Inter per tutto, Newsreader serif solo per h1 e corpo articolo | `BRAND-tipografia-divergente` |
| 7 | Voce del copy di interfaccia | leggi `src/i18n/ui.ts` | prima persona e tono diretto come nell'editoriale; nessun nome di persona oltre agli autori; nessun nome del datore di lavoro | `BRAND-voce-ui` |
| 8 | Asset live non aggiornati | sul sito live, apri logo, favicon e la cover dell'ultimo articolo | corrispondono ai file nel repo; se no è cache CDN e va invalidata | `BRAND-cdn-stale` |

---

## ENTRY — Entry point e igiene dei contenuti

| # | Controllo | Come | Soglia / atteso | ID tipico |
|---|---|---|---|---|
| 1 | Stato della newsletter | `grep -n "NEWSLETTER" src/config.ts` e apri `/newsletter` e `/en/newsletter` | se lo username Buttondown è valorizzato la CTA porta all'iscrizione, se è vuoto il sito mostra la CTA RSS (`CLAUDE.md` §7): la pagina non deve mai restare a metà tra le due | `ENTRY-newsletter-stato` |
| 2 | La newsletter è raggiungibile | naviga dalla home e da fondo articolo | almeno un punto d'ingresso visibile per pagina lunga, in entrambe le lingue | `ENTRY-newsletter-invisibile` |
| 3 | RSS raggiungibile | cerca il link ai feed nel footer e nel `<head>` | link visibile e `<link rel="alternate">` presente | `ENTRY-rss-nascosto` |
| 4 | Commenti | apri un articolo pubblicato | Giscus carica, l'empty state è dignitoso, il tema segue la palette | `ENTRY-commenti` |
| 5 | Podcast | cerca i riferimenti a *The Human Constant* | se il podcast è annunciato, il link esiste e funziona; un riferimento senza destinazione è un finding | `ENTRY-podcast-link-morto` |
| 6 | Link interni rotti | `grep -roh 'href="/[^"#?]*"' dist --include="*.html" \| sed 's/href="//;s/"$//' \| sort -u \| while read -r u; do p="dist${u%/}"; [ -f "$p" ] \|\| [ -f "$p/index.html" ] \|\| [ -d "$p" ] \|\| echo "MANCA $u"; done` | nessun risultato | `ENTRY-link-rotti` |
| 7 | Simmetria IT/EN delle pagine | confronta l'albero di `dist/` con quello sotto `dist/en/` | ogni pagina IT ha la gemella EN e viceversa; una sezione presente in una lingua sola è un finding **Alto** (`CLAUDE.md` §4) | `ENTRY-asimmetria-it-en` |
| 8 | Language switcher | su ogni tipo di pagina, cambia lingua | porta alla pagina equivalente, non alla home; sugli articoli usa lo slug tradotto | `ENTRY-switcher-fallback-home` |
| 9 | Pagine di servizio finite in produzione | l'esito del controllo SEO #1 elenca le pagine senza meta | ogni pagina statica in `public/` che finisce in `dist/` va decisa: pubblica e curata, oppure fuori dal deploy | `ENTRY-pagina-di-servizio-pubblica` |
| 10 | Coerenza roadmap pubblica | `node scripts/status.mjs` e apri `/roadmap` e `/en/roadmap` | quello che la pagina promette corrisponde a `src/content/roadmap` e a `docs/content-roadmap.md`; nessun articolo annunciato e mai uscito senza spiegazione | `ENTRY-roadmap-divergente` |
