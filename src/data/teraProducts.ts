export interface TeraProduct {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  price: number;
  weight: string;
  image: string;
  features: string[];
}

export const teraProducts: TeraProduct[] = [
  {
    id: "tera-blend-1kg",
    name: "Blend TERA Senza Glutine — 1kg",
    description: "Il nostro blend esclusivo di farine naturali senza glutine, pronto da usare.",
    longDescription:
      "Il blend TERA in formato pratico da 1kg: sorgo, saraceno, miglio e farina di piselli. Un mix studiato da Giuseppe D'Angelo per ottenere un impasto leggero, digeribile e gustoso. Pronto da utilizzare per le tue ricette gluten free a casa.",
    price: 15.00,
    weight: "1 kg",
    image: "/images/tera-flour-package.png",
    features: [
      "100% senza glutine",
      "Farine naturali: sorgo, saraceno, miglio, piselli",
      "Alto apporto di fibre e proteine",
      "Basso indice glicemico",
      "Senza additivi artificiali",
    ],
  },
];
