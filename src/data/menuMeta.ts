export const previewImages: Record<string, string> = {
  impasti: "/images/menu/classiche-MARGHERITA.jpg",
  antipasti: "/images/menu/nuovo-antipasti-stritti-fuddi.png",
  "passi-dautore": "/images/menu/passi-CAMURRIA.jpg",
  "le-storiche": "/images/menu/storiche-PANORMUS.jpg",
  "le-classiche": "/images/menu/nuovo-classiche-caprese.png",
  buffalotti: "/images/menu/buffalotti-CU_CRUDU.jpg",
  crusta: "/images/menu/nuovo-crusta-timpulata.png",
  "le-vegane": "/images/menu/vegane-PATAT.jpg",
  "rotundi-casseruola": "/images/menu/classiche-CALZONE.jpg",
  insalate: "/images/menu/nuovo-insalate-caprese.png",
  hamburger: "/images/menu/classiche-DIAVOLA.jpg",
  dolci: "/images/logo-timilia-original.jpg",
  bevande: "/images/logo-timilia-original.jpg",
  birre: "/images/logo-timilia-original.jpg",
  "birre-sg": "/images/logo-timilia-original.jpg",
  vini: "/images/logo-timilia-original.jpg",
  cocktail: "/images/logo-timilia-original.jpg",
  aggiunzioni: "/images/logo-timilia-original.jpg",
};

export const categoryEmojis: Record<string, string> = {
  impasti: "🫧",
  antipasti: "🧆",
  "passi-dautore": "✨",
  "le-storiche": "📜",
  "le-classiche": "🍕",
  buffalotti: "🧀",
  crusta: "🫓",
  "le-vegane": "🌿",
  "rotundi-casseruola": "🍞",
  insalate: "🥗",
  hamburger: "🍔",
  dolci: "🍰",
  bevande: "🥤",
  birre: "🍺",
  "birre-sg": "🌾",
  vini: "🍷",
  cocktail: "🍸",
  aggiunzioni: "➕",
};

export const categoryDescriptions: Record<string, string> = {
  impasti: "I nostri impasti: contemporaneo, senza glutine, rotundo in casseruola e crusta.",
  antipasti: "Street food siciliano, rielaborato con materie prime d'eccellenza.",
  "passi-dautore": "Ricerca, equilibrio e creatività. Ogni pizza è un'opera unica.",
  "le-storiche": "Le ricette che hanno scritto la storia della pizza napoletana.",
  "le-classiche": "I grandi classici, eseguiti con maestria e ingredienti selezionati.",
  buffalotti: "Calzoni dal gusto ricco, doppia farcitura interna ed esterna.",
  crusta: "Base sottile e croccante. Leggerezza e fragranza in ogni morso.",
  "le-vegane": "Proposte vegetali che rispettano la qualità senza compromessi.",
  "rotundi-casseruola": "Pane soffice e morbido, farcito con ingredienti di qualità.",
  insalate: "Freschezza e colore. Insalate gourmet con ingredienti di stagione.",
  hamburger: "Burger d'autore, carne Scottona e combinazioni gourmet.",
  dolci: "Dolci senza glutine e senza lattosio (eccetto il cannolo).",
  bevande: "Acque, bibite, caffè e digestivi.",
  birre: "Birre artigianali siciliane e nazionali.",
  "birre-sg": "Birre artigianali senza glutine.",
  vini: "Vini al calice, selezione siciliana.",
  cocktail: "Spritz, cocktail classici e signature.",
  aggiunzioni: "Aggiunte e personalizzazioni per la tua pizza.",
};

export type DietaryBadge = {
  label: string;
  type: "gf" | "gf-option" | "lf" | "lf-option" | "bread-gf";
};

export const categoryDietary: Record<string, DietaryBadge[]> = {
  antipasti: [
    { label: "Senza Glutine", type: "gf" },
    { label: "Senza Lattosio", type: "lf" },
  ],
  "passi-dautore": [
    { label: "Anche senza glutine", type: "gf-option" },
    { label: "Anche senza lattosio", type: "lf-option" },
  ],
  "le-storiche": [
    { label: "Anche senza glutine", type: "gf-option" },
    { label: "Anche senza lattosio", type: "lf-option" },
  ],
  "le-classiche": [
    { label: "Anche senza glutine", type: "gf-option" },
    { label: "Anche senza lattosio", type: "lf-option" },
  ],
  buffalotti: [
    { label: "Anche senza glutine", type: "gf-option" },
    { label: "Anche senza lattosio", type: "lf-option" },
  ],
  crusta: [
    { label: "Anche senza glutine", type: "gf-option" },
    { label: "Anche senza lattosio", type: "lf-option" },
  ],
  "le-vegane": [
    { label: "Anche senza glutine", type: "gf-option" },
    { label: "Anche senza lattosio", type: "lf-option" },
  ],
  "rotundi-casseruola": [
    { label: "Anche senza glutine", type: "gf-option" },
    { label: "Anche senza lattosio", type: "lf-option" },
  ],
  insalate: [
    { label: "Senza Glutine", type: "gf" },
    { label: "Pane anche senza glutine", type: "bread-gf" },
  ],
  hamburger: [
    { label: "Anche senza glutine", type: "gf-option" },
    { label: "Anche senza lattosio", type: "lf-option" },
  ],
  dolci: [
    { label: "Senza Glutine", type: "gf" },
    { label: "Senza Lattosio", type: "lf" },
  ],
  "birre-sg": [{ label: "Senza Glutine", type: "gf" }],
};
