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

### Home: ingresso delle immagini e ritorno dello scroll

Le sei card di «L'esperienza Timilia» non vengono più nascoste e rianimate al rientro nel viewport. Le fotografie mobile restano ferme nelle proprie card; solo il testo ha un ingresso iniziale. Su desktop tutte le foto restano montate e una progressione basata sui centri dei capitoli regola la dissolvenza nei due sensi. I riferimenti misurati non vengono trasformati. La foto precedente resta opaca sotto quella entrante, che viene mostrata dopo la decodifica; un caricamento lento non scopre il fondo della card. Non ci sono più zoom al cambio immagine o selezioni basate sull'ordine degli eventi `onViewportEnter`. Anche la materia decorativa segue la progressione continua fra i capitoli.

«Tempo · fermentazione · lavorazione» usa ora la fotografia pulita delle mani sull'impasto (`tera-hero-2.png`) al posto dell'immagine con testi incorporati. Il punto focale è al 38% orizzontale; la risoluzione richiesta tiene conto dell'altezza della card e del rapporto della fotografia, evitando di ingrandire una piccola immagine orizzontale dentro un ritaglio verticale.

Verificati tutti i sei capitoli in sequenza 0→5→0 nelle viewport 1440×1000, 1280×720 e 390×844, senza overflow o errori JavaScript. Sui due desktop, invertire lo scroll a metà dissolvenza conserva gli stessi nodi fotografici e restituisce la stessa composizione entro l'1,1% di opacità nel tempo di assestamento del test. Un impulso reale di rotellina seguito dall'inversione produce 64 e 66 valori intermedi di dissolvenza, senza vuoti fotografici. La prova con risposta dell'immagine «Tempo» sospesa conserva la copertura fotografica completa prima del suo caricamento. Verificati anche ritaglio, preferenza di movimento ridotto e relativo cambio durante la visita. Queste prove controllano il comportamento in Chromium headless e non certificano gli FPS su hardware fisico.

### Apertura TERA e galleria

La hero ora muove solo lo sfondo: eliminati lo zoom iniziale sovrapposto e il trascinamento separato del testo. La prima fotografia misura un contenitore fermo e anima un solo livello, con la stessa progressione smorzata. Sui dispositivi touch entrambi i parallasse sono disattivati. La grana usa due piccole texture PNG memorizzabili nella cache, senza filtri SVG o `mix-blend-mode` sulle sezioni intere. Le immagini della scena e della galleria vengono caricate in prossimità della rispettiva sezione, anziché richiedere dodici foto subito all'apertura.

«Dallo stesso impasto» ha destinazioni precise per ogni foto, frecce disabilitate alle estremità, supporto per clic rapidi, tastiera, swipe touch e trascinamento con il mouse. Lo snap è di prossimità e viene sospeso durante il trascinamento. Il gesto orizzontale resta alla galleria, mentre quello verticale prosegue sulla pagina con Lenis. L'indicatore usa un MotionValue: lo scorrimento non ricostruisce più l'intera galleria ad ogni fotogramma. La finestra fotografica conserva il blocco della pagina durante i cambi di foto, gestisce il focus e lo restituisce alla chiusura.

Prove browser 1440×1000 e 390×844: avanti/indietro, due clic rapidi, frecce della tastiera, trascinamento di 624 px su desktop e swipe di 299 px su touch, raggiungimento dell'ultima foto, navigazione circolare nella finestra, Escape, ripresa dello scroll verticale e assenza di overflow/errori JavaScript. Una misura di 18 impulsi da 110 px con CPU rallentata 4× sulle prime sezioni registra un intervallo massimo tra frame di 50,1 ms desktop e 16,8 ms nella viewport mobile; il percentile 95 desktop resta 33,4 ms. Sono misure headless su grafica software, non una certificazione della fluidità su hardware reale.

Build Next.js, lint e TypeScript. Prove browser su desktop e mobile con impulso reale della rotellina: avanzamento distribuito su più fotogrammi, continuità delle fotografie, ritorno indietro, overflow, variazione della preferenza movimento e pulizia del controller durante la navigazione.

Il confronto strumentale è in `docs/materia-motion-profile.json`: Chromium headless con CPU rallentata 4×, viewport 1440×1000 e 390×844, device pixel ratio 2 e 24 impulsi di rotellina da 120 px. La misura del callback di disegno al percentile 95 passa da 26,8 a 6,2 ms su desktop e da 17,9 a 9,0 ms su mobile. La grafica del browser di test è software: questi numeri confrontano le due implementazioni nello stesso ambiente e non certificano gli FPS di un telefono reale.

Aprire `/` e `/tera` nella preview del branch e valutare il movimento anche sul proprio dispositivo. Nessuna nuova variabile d’ambiente o modifica DNS. Account e pagamenti non sono stati collaudati con operazioni reali.
