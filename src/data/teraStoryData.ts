/* ------------------------------------------------------------------ */
/* TERA — contenuti della pagina                                       */
/* Nessun claim tecnico, nutrizionale o salutistico.                   */
/* La composizione del blend non viene dichiarata: nel sito esistono   */
/* versioni discordanti, quindi qui si parla solo di equilibrio.       */
/* ------------------------------------------------------------------ */

export type TeraPhoto = {
  src: string;
  alt: string;
  /** rapporto larghezza/altezza dell'originale */
  ratio: number;
};

export const heroImages = {
  stillLife: {
    src: "/images/tera-hero-1.png",
    alt: "Farina, impasto e ciotole su un tavolo di legno davanti a una parete verde salvia",
  },
  hands: {
    src: "/images/tera-hero-2.png",
    alt: "Mani che lavorano la farina sopra una ciotola: l'impasto TERA prende forma",
  },
};

export const hero = {
  kicker: "Il progetto senza glutine di Timilia",
  headline: ["Quando cambia la materia,", "ricomincia la ricerca."],
  sub: "TERA non racconta ciò che manca. Racconta ciò che abbiamo dovuto imparare per costruire qualcosa di nuovo.",
  scrollHint: "Scorri",
};

export const origin = {
  id: "punto-di-partenza",
  number: "01",
  title: "Il punto di partenza",
  headline: ["Non volevamo fare", "la versione senza glutine", "di un'altra pizza."],
  paragraphs: [
    "TERA non nasce per togliere qualcosa. Nasce per costruire un impasto con una propria identità: una struttura, un profumo, un carattere che non chiede confronti.",
    "Per farlo non bastava una ricetta. Bisognava tornare all'inizio: alla materia, e a quello che la materia permette di fare.",
  ],
  photo: {
    src: "/images/tera-creazioni/creazione-3.png",
    alt: "Pizzette TERA con pomodoro, mozzarella e basilico appena sfornate",
    ratio: 1086 / 1448,
  } satisfies TeraPhoto,
  caption: "Non un'alternativa. Un impasto con la sua identità.",
};

export const matter = {
  id: "materia",
  number: "02",
  title: "La materia",
  headline: ["Cambia la materia.", "Non cambia il modo in cui la trattiamo."],
  paragraphs: [
    "Quando cambia la materia, cambiano gli equilibri. Non basta sostituire una farina: cambia il modo in cui l'impasto assorbe l'acqua, il modo in cui tiene, i tempi che chiede, i gesti che servono.",
    "Ogni cosa va reimparata. Con la stessa attenzione che mettiamo in tutto il resto.",
  ],
  words: ["Acqua", "Tempo", "Mani"],
};

export const research = {
  id: "ricerca",
  number: "03",
  title: "La ricerca",
  /** ogni frase è divisa nei due segmenti che vanno a capo su desktop */
  bigQuote: [
    ["La difficoltà", "non era eliminare il glutine."],
    ["Era capire cosa costruire", "al suo posto."],
  ],
  headline: ["Una ricetta si scrive.", "Un impasto si osserva."],
  paragraphs: [
    "TERA nasce da prove, osservazione e correzione. Sette anni in cui ogni impasto è stato guardato, toccato, messo in discussione e rifatto.",
    "Non cercavamo una scorciatoia. Cercavamo di capire.",
  ],
  ledger: [
    { verb: "Provare", note: "Ogni impasto è un'ipotesi." },
    { verb: "Osservare", note: "Come assorbe, come tiene, come cresce." },
    { verb: "Correggere", note: "Un dettaglio per volta." },
    { verb: "Ricominciare", note: "Finché il risultato non ha una sua identità." },
  ],
  photos: [
    {
      src: "/images/tera-creazioni/creazione-10.png",
      alt: "Croissant TERA tagliato a metà: la sfogliatura interna",
      ratio: 1122 / 1402,
    },
    {
      src: "/images/tera-creazioni/creazione-4.png",
      alt: "Panini tondi TERA appena sfornati su una teglia scura",
      ratio: 1448 / 1086,
    },
  ] satisfies TeraPhoto[],
  photosCaption: "Sette anni di prove, osservazioni e correzioni.",
};

export const blend = {
  id: "blend",
  number: "04",
  title: "Il blend",
  headline: ["Non una farina.", "Un equilibrio tra materie diverse."],
  paragraphs: [
    "TERA non nasce da una sola farina, ma da un equilibrio tra cereali, pseudocereali e farine proteiche naturalmente senza glutine. Ognuna porta qualcosa che le altre non hanno. Nessuna basta da sola.",
    "È un equilibrio che non consideriamo definitivo. Continuiamo a metterlo alla prova, perché la formula migliore è quella che siamo ancora disposti a cambiare.",
  ],
  words: ["Struttura", "Aroma", "Tenuta", "Colore"],
  photo: {
    src: "/images/tera-creazioni/creazione-8.png",
    alt: "Filoni di pane TERA con crosta dorata su una griglia",
    ratio: 1086 / 1448,
  } satisfies TeraPhoto,
};

export const arrival = {
  id: "pizza",
  number: "05",
  title: "La pizza",
  headline: ["Non imitare.", "Costruire una propria identità."],
  hero: {
    src: "/images/tera-creazioni/creazione-2.png",
    alt: "Pizza TERA con pomodoro e fiordilatte appena uscita dal forno",
    ratio: 1448 / 1086,
  } satisfies TeraPhoto,
  quote: ["Non chiediamo alla pizza senza glutine di assomigliare a un'altra pizza.", "Le chiediamo di essere buona."],
  paragraphs: [
    "Il bordo, la struttura, il colore della cottura: tutto nasce da un impasto pensato per essere se stesso.",
    "Si mangia senza pensare a cosa manca. È questo il punto di arrivo.",
  ],
  detail: {
    src: "/images/tera-creazioni/creazione-1.png",
    alt: "Dettaglio di una pizza TERA con melanzane, basilico e formaggio grattugiato",
    ratio: 1448 / 1086,
  } satisfies TeraPhoto,
};

/* Indice dei capitoli: usato dalla Home come anteprima della pagina.
   Ogni voce porta direttamente al capitolo corrispondente. */
export type TeraChapter = {
  id: string;
  number: string;
  title: string;
  teaser: string;
  href: string;
  photo: TeraPhoto;
  /** posizione del soggetto quando la foto è ritagliata in orizzontale */
  position?: string;
};

export const chapters: TeraChapter[] = [
  {
    id: origin.id,
    number: origin.number,
    title: origin.title,
    teaser: "Non la versione senza glutine di un'altra pizza.",
    href: `/tera#${origin.id}`,
    photo: origin.photo,
  },
  {
    id: matter.id,
    number: matter.number,
    title: matter.title,
    teaser: "Cambia la materia. Non cambia il modo in cui la trattiamo.",
    href: `/tera#${matter.id}`,
    photo: { src: heroImages.hands.src, alt: heroImages.hands.alt, ratio: 16 / 9 },
    position: "50% 50%",
  },
  {
    id: research.id,
    number: research.number,
    title: research.title,
    teaser: "Sette anni di prove, osservazioni e correzioni.",
    href: `/tera#${research.id}`,
    photo: research.photos[1],
  },
  {
    id: blend.id,
    number: blend.number,
    title: blend.title,
    teaser: "Non una farina. Un equilibrio tra materie diverse.",
    href: `/tera#${blend.id}`,
    photo: blend.photo,
    position: "50% 40%",
  },
  {
    id: arrival.id,
    number: arrival.number,
    title: arrival.title,
    teaser: "Non imitare. Costruire una propria identità.",
    href: `/tera#${arrival.id}`,
    photo: arrival.hero,
    position: "50% 48%",
  },
];

export const strip = {
  title: "Dallo stesso impasto",
  headline: "Quello che abbiamo imparato a fare.",
  sub: "La ricerca è nata per la pizza. Poi l'impasto ha cominciato a chiedere altro: pane, panini, lievitati.",
  photos: [
    { src: "/images/tera-creazioni/creazione-9.png", alt: "Sezione di un pane TERA: l'alveolatura interna dell'impasto", ratio: 1420 / 1108 },
    { src: "/images/tera-creazioni/creazione-5.png", alt: "Panino TERA con semi di sesamo nero", ratio: 1448 / 1086 },
    { src: "/images/tera-creazioni/creazione-13.png", alt: "Pagnotta TERA con crosta screpolata appena sfornata", ratio: 1402 / 1122 },
    { src: "/images/tera-creazioni/creazione-6.png", alt: "Piccoli lievitati salati TERA con sesamo", ratio: 1448 / 1086 },
    { src: "/images/tera-creazioni/creazione-7.png", alt: "Bocconi fritti TERA con guarnizioni fresche", ratio: 1448 / 1086 },
    { src: "/images/tera-creazioni/creazione-11.png", alt: "Croissant TERA con granella di pistacchio", ratio: 1536 / 1024 },
    { src: "/images/tera-creazioni/creazione-12.png", alt: "Panino rustico TERA farcito", ratio: 1510 / 1042 },
    { src: "/images/tera-creazioni/creazione-14.png", alt: "Pagnotte TERA in raffreddamento sulla griglia", ratio: 1448 / 1086 },
  ] satisfies TeraPhoto[],
};

/* Le persone: un passaggio breve, verso la fine, senza biografia istituzionale */
export const people = {
  title: "Dietro la ricerca",
  name: "Giuseppe D'Angelo",
  role: "Maestro pizzaiolo e tecnico di panificazione, ideatore di blend di farine e impasti alternativi. Il blend TERA nasce dal suo lavoro.",
  photo: {
    src: "/images/giuseppe-dangelo-color.png",
    alt: "Giuseppe D'Angelo osserva e annusa un impasto appena formato",
    ratio: 1354 / 1162,
  } satisfies TeraPhoto,
};

export const closing = {
  lines: ["Conosciamo la terra.", "Lavoriamo la materia.", "Facciamo pizza."],
  links: [
    { label: "La nostra pizza", href: "/la-nostra-pizza" },
    { label: "Dove trovarci", href: "/#contatti" },
  ],
};
