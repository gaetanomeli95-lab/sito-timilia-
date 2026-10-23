# Timilia — Materia, revisione della fluidità

Branch: `work/timilia-materia-v01`. Produzione e `main` non vengono aggiornate da questa anteprima.

## Esperienza

La home accompagna «Tutto comincia dall’impasto» con una materia che si raccoglie intorno alla fotografia delle mani di Tommaso. TERA usa una scena continua per i capitoli materia, ricerca, blend e pizza, con i testi e le fotografie esistenti.

La rotellina viene interpolata da Lenis 1.3.27 sulle sole pagine home e TERA. Il contenitore resta quello del documento: sticky, link e tastiera rimangono utilizzabili. I gesti touch mantengono lo scorrimento nativo. La preferenza «riduci movimento» disattiva lo smoothing e presenta le fotografie statiche; vale anche se la preferenza cambia durante la visita.

## Correzioni alla prima versione

- Una sola progressione smorzata muove fotografie, materia e indicatore. Il canvas non applica più un secondo ritardo né accoda un fotogramma separato.
- Le fotografie si sovrappongono senza sfumare verso un fotogramma vuoto. Sono caricate prima del rispettivo capitolo e condividono una sola maschera stabile.
- Le didascalie restano montate e scorrono al cambio capitolo; React aggiorna il capitolo soltanto quando cambia, senza richiamare lo stato ad ogni fotogramma.
- La geometria dei punti viene precalcolata una sola volta. Il ciclo di disegno interpola coordinate già disponibili, con 1.900 punti desktop e 1.100 sugli schermi piccoli, raggruppati per colore. Densità e risoluzione sono limitate.
- Il passaggio dal fallback statico alla scena animata conserva le dimensioni dei capitoli, evitando il precedente cambio di impaginazione all’avvio.
- Le animazioni restano sospese fuori vista e con scheda nascosta. Intro e finestre modali bloccano anche lo smoothing; all’uscita dalla pagina il controller viene distrutto.

Testi, ingredienti dichiarati, intro cinematografica e contenuti commerciali restano quelli esistenti. Il canvas resta decorativo: testo e fotografie sono HTML. Senza JavaScript o Canvas2D, le fotografie sono visibili accanto ai rispettivi capitoli. La correzione del precedente overflow della home e la gestione delle anteprime senza configurazione account sono conservate.

## Verifica

### Apertura TERA e galleria

La hero ora muove solo lo sfondo: eliminati lo zoom iniziale sovrapposto e il trascinamento separato del testo. La prima fotografia misura un contenitore fermo e anima un solo livello, con la stessa progressione smorzata. Sui dispositivi touch entrambi i parallasse sono disattivati. La grana usa due piccole texture PNG memorizzabili nella cache, senza filtri SVG o `mix-blend-mode` sulle sezioni intere. Le immagini della scena e della galleria vengono caricate in prossimità della rispettiva sezione, anziché richiedere dodici foto subito all'apertura.

«Dallo stesso impasto» ha destinazioni precise per ogni foto, frecce disabilitate alle estremità, supporto per clic rapidi, tastiera, swipe touch e trascinamento con il mouse. Lo snap è di prossimità e viene sospeso durante il trascinamento. Il gesto orizzontale resta alla galleria, mentre quello verticale prosegue sulla pagina con Lenis. L'indicatore usa un MotionValue: lo scorrimento non ricostruisce più l'intera galleria ad ogni fotogramma. La finestra fotografica conserva il blocco della pagina durante i cambi di foto, gestisce il focus e lo restituisce alla chiusura.

Prove browser 1440×1000 e 390×844: avanti/indietro, due clic rapidi, frecce della tastiera, trascinamento di 624 px su desktop e swipe di 299 px su touch, raggiungimento dell'ultima foto, navigazione circolare nella finestra, Escape, ripresa dello scroll verticale e assenza di overflow/errori JavaScript. Una misura di 18 impulsi da 110 px con CPU rallentata 4× sulle prime sezioni registra un intervallo massimo tra frame di 50,1 ms desktop e 16,8 ms nella viewport mobile; il percentile 95 desktop resta 33,4 ms. Sono misure headless su grafica software, non una certificazione della fluidità su hardware reale.

Build Next.js, lint e TypeScript. Prove browser su desktop e mobile con impulso reale della rotellina: avanzamento distribuito su più fotogrammi, continuità delle fotografie, ritorno indietro, overflow, variazione della preferenza movimento e pulizia del controller durante la navigazione.

Il confronto strumentale è in `docs/materia-motion-profile.json`: Chromium headless con CPU rallentata 4×, viewport 1440×1000 e 390×844, device pixel ratio 2 e 24 impulsi di rotellina da 120 px. La misura del callback di disegno al percentile 95 passa da 26,8 a 6,2 ms su desktop e da 17,9 a 9,0 ms su mobile. La grafica del browser di test è software: questi numeri confrontano le due implementazioni nello stesso ambiente e non certificano gli FPS di un telefono reale.

Aprire `/` e `/tera` nella preview del branch e valutare il movimento anche sul proprio dispositivo. Nessuna nuova variabile d’ambiente o modifica DNS. Account e pagamenti non sono stati collaudati con operazioni reali.
