# Scrivere un articolo

Il metodo di co-scrittura del progetto, più il punto in cui subentra la skill dedicata.

## Il metodo (quality over quantity)

Rodato da Marco e riusato con successo. Fonte viva: la sezione "Il workflow che abbiamo adottato" in
`HANDOFF.md`. Sintesi:

1. **Partire dal reale.** Si parte da una situazione o un'idea vera del collaboratore (qualcosa
   accaduto davvero), mai dalla teoria. È lui a mettere per primo il materiale grezzo.
2. **Struttura prima.** Si fanno domande e si definisce l'ossatura (i punti salienti, un arco che
   regge). Prima si concorda la struttura, poi si scrive.
3. **Iterazione punto per punto.** Per ogni punto: il collaboratore propone il materiale, tu lo
   valuti da collaboratore (regge come perno? è anonimizzabile senza perdere forza? ha tensione
   narrativa? da cosa si ricavano tesi o euristiche?), proponi un'elaborazione con pro e contro, si
   discute e si "blocca" il punto prima di passare al successivo.
4. **Rifinire.** Si torna sui punti finché sono solidi e scorrevoli. Si taglia il superfluo (difesa
   anti-listicle), si tiene una tesi personale forte, la voce resta dell'autore (specie i finali).
5. **Assemblaggio e revisione.** Si mette insieme il pezzo, si curano le transizioni perché si legga
   come un unico ragionamento, si ripassano le linee guida editoriali.
6. **Traduzione e confezione.** Versione EN idiomatica con stesso `translationKey`; poi gli asset
   (cover, carousel, PDF di feedback) — vedi `references/asset-social.md`.

Perché funziona: l'articolo resta ancorato a esperienza vera e a una tesi; le domande fanno emergere
quello che l'autore già sa ma non aveva messo a fuoco; l'iterazione tiene alta la qualità senza
diluire il contenuto.

## Quando subentra la skill `refine-article`

Il metodo sopra è la fase di **pensiero e stesura**. Quando c'è una bozza (anche grezza) da rifinire
nel tono e poi **pubblicare** in IT+EN, instrada alla skill **`refine-article`**, che è l'unica fonte
di verità per quel workflow. In breve, `refine-article`:

- analizza la bozza, concorda il **tono** desiderato, e itera raffinando **solo stile e tono** (mai
  fatti, cifre, ordine delle sezioni, opinioni);
- raccoglie i metadati (author key, tag, data, `draft`), genera `title`/`description`/slug;
- **traduce in EN** in modo idiomatico e salva `src/content/blog/it/<slug-it>.md` e
  `src/content/blog/en/<slug-en>.md` con il frontmatter corretto e lo stesso `translationKey`.

## Prima di pubblicare davvero

- Rispetta `references/regole-editoriali.md` (nomi, anonimizzazione, niente trattini lunghi, bilingue).
- Un pezzo di collaboratore si **incastra nella roadmap** con il Product Owner: non pubblicare a
  sorpresa in mezzo alla pipeline di Marco. Aggiorna `HANDOFF.md` se sposti delle date.
- Se il materiale tocca il datore di lavoro (prodotti, clienti, numeri), serve l'**ok del PO**.

## Dopo la stesura

- Genera gli asset social: `references/asset-social.md`.
- Pubblica e versiona: `references/pubblicazione-e-git.md`.
