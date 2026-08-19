# personas/

La voce di un autore, scritta per essere usata dalle skill editoriali.

**Questa cartella non è versionata**, tranne questo file. I profili sono note su persone reali, e
la loro utilità dipende dal fatto che siano schiette: un file che sai finirà su GitHub lo scrivi
in modo diverso, e diventa inutile.

## A cosa serve

`refine-article` la carica prima di toccare il testo. Senza, la rifinitura si appoggia solo alle
regole di casa (`docs/editorial-guidelines.md`), che sono state ricavate dai pezzi di Marco: il
rischio concreto è che il primo articolo di un autore nuovo finisca per suonare come lui. La
persona esiste per evitarlo.

Non è un vincolo rigido. Se l'articolo o una richiesta esplicita dell'autore contraddicono la
persona, prevale l'autore.

## Come si crea

Te la propone `add-author` come ultimo passo, con un'intervista sulla voce. Se il tuo profilo
esiste già ma il file no, chiedi a Claude di crearlo partendo da questo template e da due o tre
pezzi che hai scritto altrove.

## Template

```markdown
# <Nome Cognome> (<author-key>)

## Voce
Come suona quando scrivo bene. Registro (formale, colloquiale, tecnico), ritmo delle frasi,
quanto mi espongo in prima persona.

## Metafore e immagini ricorrenti
Da dove prendo gli esempi: sport, musica, cucina, meccanica. Le metafore dell'autore valgono
piu' di quelle proposte da Claude, e vanno riconosciute per essere tenute.

## Cosa non faccio mai
Tic da evitare, parole che non uso, formati che rifiuto (es. le liste di consigli).

## Regole di stile personali
Enfasi tipografica, uso del corsivo, lunghezza dei paragrafi, come chiudo un pezzo.
Se scrivi in due lingue: le asimmetrie fra IT ed EN (es. le ripetizioni si alleggeriscono in
italiano, si tengono in inglese per coesione).

## Paletti
Argomenti che non tocco, cose che non racconto del mio lavoro, persone che non nomino.
```

## Regola di fallback

Nessun workflow si blocca se la persona manca. Le skill proseguono, applicano le sole regole di
casa e **lo dichiarano**, invece di inventare preferenze non documentate. Il contenuto del file
non si cita mai in chat: è privato, serve a orientare le scelte, non a essere esibito.
