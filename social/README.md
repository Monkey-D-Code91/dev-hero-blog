# social/

Le bozze dei post di lancio, una per lingua, prodotte dal passo 7 della catena
(`docs/workflow.md`).

## La convenzione

```
social/<slug>-it.md
social/<slug>-en.md
```

Ogni file contiene il post pronto da incollare e il testo del primo commento con il link e i
parametri UTM. Il carousel che lo accompagna sta in `carousels/<slug>-{it,en}/`.

## Perché sono versionate

Per la stessa ragione delle cover e dei carousel: sono artefatti di un articolo, viaggiano nella
sua PR e devono poter essere riletti a distanza di mesi. Un post consegnato solo come testo in
chat non è riutilizzabile, non passa dai controlli sul copy e non esiste in inglese.

Valgono anche qui le regole editoriali: niente trattini lunghi, nomi solo per gli autori,
anonimizzazione. Il controllo è automatico (`scripts/check-copy.mjs`).

## Chi pubblica

Nessuna skill pubblica da sola su LinkedIn. Le bozze si preparano qui, la pubblicazione la fa
Marco. Vedi `docs/workflow.md` §5.
