export type IngredientNote = {
  ingredient: string;
  role: string;
};

export type PizzaMoment = {
  name: string;
  image: string;
  alt: string;
  eyebrow: string;
  composition: IngredientNote[];
  outro?: string;
};

export const prologue = {
  kicker: "Prima del forno",
  headline: "In Sicilia abbiamo imparato che ogni fatica aspetta il suo frutto.",
  microcopy: "Qualità, passione e ingredienti selezionati. È così che nasce la nostra pizza.",
  image: "/images/menu-story/mani-tommaso.jpeg",
  alt: "Le mani di Tommaso, pizzaiolo e proprietario di Timilia, lanciano l'impasto tra la farina",
};

export const chapterOne = {
  number: "01",
  title: "La qualità non si misura in centimetri",
  manifesto: "Per noi la grandezza del bordo non determina la qualità di una pizza.",
  paragraphs: [
    "Sono altri i fattori che fanno davvero la differenza. Si parte dalla scelta delle materie prime, prima fra tutte la farina, e dalla capacità di lavorarla con le tecniche più adatte alle sue caratteristiche.",
    "È da qui che nasce l'impasto che cerchiamo ogni giorno: scioglievole, piacevole al morso e mai gommoso.",
  ],
  manifestoTwo: "Non basta far crescere un impasto. Bisogna conoscerlo.",
  manifestoTwoSub: "Capire la farina che si ha tra le mani e saperla lavorare nel modo giusto.",
};

export const beddaMatri: PizzaMoment = {
  name: "Bedda Matri",
  image: "/images/menu-story/bedda-matri.jpeg",
  alt: "Pizza Bedda Matri di Timilia: crema di zucchine, ricotta fresca, salsiccia, tuma e chips di zucchine fritte",
  eyebrow: "Dal nostro menù",
  composition: [
    { ingredient: "Crema di zucchine", role: "la base vegetale" },
    { ingredient: "Ricotta fresca", role: "la morbidezza" },
    { ingredient: "Salsiccia", role: "l'intensità" },
    { ingredient: "Tuma", role: "l'identità siciliana" },
    { ingredient: "Chips di zucchine fritte", role: "il contrasto finale, in uscita" },
  ],
  outro: "La qualità non è quanto è grande il cornicione. È ciò che abbiamo deciso di metterci dentro.",
};

export const chapterTwo = {
  number: "02",
  title: "Il tempo non è un ingrediente",
  manifesto: ["Matura mentre lievita.", "Lievita mentre matura."],
  paragraphs: [
    "Per anni abbiamo sentito parlare di impasti lasciati 24, 48 o 72 ore in frigorifero come sinonimo di maturazione e, di conseguenza, di maggiore qualità e digeribilità.",
  ],
  pullOne: "Ma il tempo, da solo, non rende migliore un impasto.",
  paragraphsTwo: [
    "In frigorifero non avviene una misteriosa trasformazione chiamata maturazione. Il freddo rallenta l'attività del lievito e modifica la velocità di processi fermentativi, enzimatici e strutturali già presenti nell'impasto.",
    "La lievitazione riguarda i gas che fanno aumentare il volume. Quella che chiamiamo maturazione, invece, comprende un insieme molto più complesso di trasformazioni che avvengono durante il riposo.",
    "E soprattutto: più ore non significano automaticamente un impasto migliore. Farina, quantità di lievito, temperatura, idratazione e tempo devono essere pensati insieme. Ogni impasto ha il suo equilibrio.",
  ],
  pullTwo: "Il frigorifero non è un ingrediente.",
  pullTwoSub: "E il numero di ore non è un marchio di qualità.",
  finale: ["Il tempo serve", "quando sappiamo perché", "lo stiamo usando."],
};

export const chapterThree = {
  number: "03",
  title: "Ciò che inforni, sforni",
  quoteIntro: "Un grande pizzaiolo una volta disse:",
  quote: "“Ciò che inforni, sforni.”",
  paragraphs: [
    "Ed è proprio così che intendiamo la pizza. Il forno può completare il lavoro, ma la qualità nasce prima: nell'acqua, nella farina, nel pomodoro, nella mozzarella e in ogni ingrediente che scegliamo di mettere sulla pizza.",
  ],
  closing: "Perché alla fine, dal forno, può uscire solo la qualità che abbiamo deciso di metterci dentro.",
};

export const bufalina: PizzaMoment = {
  name: "A Bufalina",
  image: "/images/menu-story/bufalina.jpeg",
  alt: "Pizza A Bufalina di Timilia: salsa di pomodorino siccagno, bufala DOP, pomodorino confit, olio EVO e basilico",
  eyebrow: "La materia prima, senza nascondigli",
  composition: [
    { ingredient: "Salsa di pomodorino siccagno NP", role: "il pomodoro, scelto prima del forno" },
    { ingredient: "Bufala DOP", role: "la mozzarella, senza compromessi" },
    { ingredient: "Pomodorino confit", role: "la concentrazione" },
    { ingredient: "Olio EVO · basilico", role: "il finale, semplice" },
  ],
};

export const camurria: PizzaMoment = {
  name: "Camurria",
  image: "/images/menu-story/camurria.jpeg",
  alt: "Pizza Camurria di Timilia: fiordilatte belmontese e, in uscita, prosciutto crudo 30 mesi, burrata, pomodorini confit, basilico cristallizzato e miele di acacia",
  eyebrow: "La qualità decisa prima, arriva anche dopo",
  composition: [
    { ingredient: "Fiordilatte belmontese", role: "ciò che entra in forno" },
    { ingredient: "Prosciutto crudo 30 mesi", role: "in uscita — il tempo, quello giusto" },
    { ingredient: "Burrata", role: "in uscita — la morbidezza" },
    { ingredient: "Pomodorini confit", role: "in uscita — la dolcezza" },
    { ingredient: "Basilico cristallizzato · miele di acacia", role: "in uscita — il contrappunto" },
  ],
};

export const chapterFour = {
  number: "04",
  title: "Ogni giorno, un impasto diverso",
  paragraphs: [
    "La panificazione ha regole, tecnica, conoscenza. Ma non sarà mai una formula da applicare alla cieca. Perché lavoriamo con qualcosa che cambia.",
    "La farina nasce dalla terra e ogni raccolto porta con sé una storia diversa: il terreno, il clima, il caldo, la pioggia, il grano. Poi arrivano l'acqua, il lievito, le temperature, i tempi, la fermentazione.",
    "Possiamo conoscere i processi, misurare temperature, stabilire tempi e costruire linee guida precise. Ed è giusto farlo.",
  ],
  gestureIntro: "Ma un impasto bisogna anche",
  gestures: ["guardarlo,", "toccarlo,", "sentirlo."],
  paragraphsTwo: [
    "Perché arriva un momento in cui non è più il numero scritto su una ricetta a dirti cosa fare. È quello che hai davanti.",
    "Ed è forse questa la parte più bella del nostro lavoro. Dopo tanti anni continuiamo ad avere qualcosa da imparare da una farina, da un impasto, da una giornata che non è uguale a quella precedente.",
  ],
  pull: "Non sappiamo mai tutto. E non vogliamo raccontare di saperlo.",
  paragraphsThree: [
    "Preferiamo continuare a osservare, provare, capire e, quando serve, cambiare.",
  ],
  finale: "La pizza possiamo studiarla, misurarla e raccontarla. Ma non possiamo chiuderla dentro un libro.",
  finaleSub: "Ed è proprio questa sua imprevedibilità che, ancora oggi, ci fa amare quello che facciamo.",
};

export const epilogue = {
  lines: ["Buon appetito.", "Noi continuiamo ad imparare."],
  brand: "TIMILIA",
  ctaLabel: "Vieni a trovarci",
  ctaHref: "https://maps.google.com/?q=Via+Maqueda+221+Palermo",
};
