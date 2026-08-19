# newsletter/

Le bozze delle uscite email, una per articolo pubblicato, prodotte dalla skill `newsletter-issue`.

## La convenzione

```
newsletter/<slug>.md
```

Oggetto, corpo riscritto per la casella di posta (non un riassunto del pezzo: una riscrittura con
un altro ritmo) e link con i parametri UTM. Le regole del canale stanno in `docs/brand.md` §3.6.

## Perché sono versionate

Lo erano state escluse dal repo perché il testo definitivo vive nell'archivio Buttondown. Ma
l'invio lo fa Marco, e la bozza la può scrivere chiunque: se resta su una macchina sola, l'uscita
di un collaboratore non arriva mai a chi deve premere invia. Ora viaggiano nella PR dell'articolo,
come le cover, i carousel e i post.

L'archivio Buttondown resta la fonte di verità del testo **inviato**. Qui c'è la bozza.

## Chi invia

Solo Marco, da Buttondown, dopo aver caricato la cover. Nessuna skill invia da sola, nemmeno se
glielo si chiede. Vedi `docs/workflow.md` §5.
