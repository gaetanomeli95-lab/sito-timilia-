# Timilia — Materia, prima anteprima

Branch: `work/timilia-materia-v01`  
Base: `main` al commit `ca61a7669afcd187212927fe2cb47784d8d387a9`.

## Esperienza

- Home, capitolo «Tutto comincia dall’impasto»: la fotografia delle mani di Tommaso è accompagnata da farina che si raccoglie al progredire dello scroll.
- TERA, capitoli 02–05: una scena continua attraversa materia, ricerca, blend e pizza. La materia si raccoglie, trova un equilibrio e lascia il posto alle fotografie dei prodotti.
- Lo scorrimento resta nativo, reversibile e utilizzabile anche da tastiera. Gli indirizzi `#materia`, `#ricerca`, `#blend` e `#pizza` restano validi.
- I testi provengono dai contenuti esistenti. Il blend resta descritto senza introdurre ingredienti, proporzioni o proprietà nutrizionali.
- L’intro cinematografica e le altre pagine restano quelle esistenti.

## Implementazione

`MatterCanvas` è un renderer decorativo Canvas2D condiviso da home e TERA, caricato separatamente. Il contenuto rimane HTML; le fotografie sono elementi Next/Image. Il renderer usa una distribuzione deterministica: tornando indietro si ricostruisce la stessa forma.

Le coordinate dipendono dall’avanzamento della storia. Il canvas ridisegna solo durante cambiamenti di progressione, ridimensionamenti o piccoli spostamenti del puntatore; interrompe i frame fuori vista e con scheda nascosta. Densità e pixel ratio sono limitati per gli schermi piccoli. Non sono state aggiunte dipendenze.

La scena TERA usa fotografie fisse e testo a fianco su desktop; su mobile l’immagine occupa la parte alta e il testo ha un fondale opaco durante il passaggio. Con «riduci movimento», JavaScript disabilitato o Canvas2D indisponibile, ogni capitolo presenta testo e fotografia nel normale flusso della pagina.

## Verifica e revisione

- TypeScript: `npx tsc --noEmit`.
- Build Next.js: `npm run build`, comprensiva di lint e generazione delle pagine.
- Controllo browser su desktop e mobile: capitoli, ritorno all’indietro, fotografie, assenza di overflow orizzontale, fallback statici.
- Per la verifica browser locale si usano valori fittizi delle variabili pubbliche Supabase: la navbar esistente richiede una configurazione del client anche quando non si effettua l’accesso. I servizi account/pagamenti non fanno parte di questa modifica.

Aprire la preview Vercel del branch su `/` e `/tera#materia`. Verificare il ritmo sul proprio telefono prima di un’eventuale promozione. Questa modifica non richiede nuove variabili d’ambiente, configurazioni DNS o interventi sul dominio.
