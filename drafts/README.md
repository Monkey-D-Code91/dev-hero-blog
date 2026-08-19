# drafts/

L'ingresso del workflow editoriale. Un pezzo entra da qui, in una lingua sola, e da qui parte la
catena descritta in `docs/workflow.md`.

## La convenzione

```
drafts/<slug>.md
```

- **Una lingua sola**, di norma l'italiano. La traduzione EN la produce il passo 3 della catena.
- **Frontmatter non necessario.** Metadati, slug definitivi, tag e `focus` li ricava il passo 3.
  Se ne metti, non fanno danno: verranno normalizzati.
- **Slug provvisorio.** Quello definitivo può cambiare quando il titolo si assesta, e gli slug IT
  ed EN saranno comunque diversi fra loro (a legarli è il `translationKey`, non il nome del file).

## Cosa succede alla bozza

Attraversa il gate editoriale, la rifinitura e la strutturazione, e **quando l'articolo esce viene
cancellata**. Questa cartella contiene solo lavoro in corso.

Non si perde niente: l'originale resta nella storia git, e il verdetto del gate resta per sempre
in `docs/verdicts/<translationKey>.md`.

## Se non hai ancora una bozza

Non serve arrivare qui con il pezzo finito. La skill `write-article` accompagna dall'idea alla
bozza e consegna proprio in questa cartella.

## Cosa non va qui

Appunti, materiale di ricerca, versioni parallele. Una bozza per pezzo, quella che vuole diventare
un articolo. Il resto tienilo fuori dal repo.
