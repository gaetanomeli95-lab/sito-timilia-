export interface MenuItem {
  name: string;
  description: string;
  price: number;
  note?: string;
}

export interface MenuCategory {
  id: string;
  title: string;
  subtitle?: string;
  items: MenuItem[];
}

export const menuCategories: MenuCategory[] = [
  {
    id: "antipasti",
    title: "Antipasti",
    subtitle: 'Con il nostro "Stritti Fuddi" potrai gustare la vera essenza dello street food siciliano.',
    items: [
      { name: "Arancine, Panelle e Crocchè", description: "Arancine carne e burro, panelle*, crocchè*", price: 9.0, note: "Allergeni 6-7-9" },
      { name: "Focaccine Farcite", description: "Focaccine farcite con ingredienti scelti e particolarmente golosi", price: 11.5, note: "Allergene 1" },
      { name: "Tagliere di Mortadella e Stracciatella", description: "Mortadella Favola Gran Riserva IGP, stracciatella, pesto di pistacchio NP / Stracciatella, acciughe del Cantabrico, pomodorini confit, olio aromatizzato al limone", price: 14.0, note: "Allergeni 1-4-5-7-8" },
      { name: "Mozzarella in Carrozza", description: "La panatura croccante e dorata racchiude un cuore di mozzarella filante. Servita con vellutata di pomodoro arrosto leggermente profumata al basilico", price: 9.0, note: "Allergeni 1-7" },
      { name: "Ravioli Fritti al Ragù Bianco", description: "Scrigno croccante di pasta avvolta in una dorata panatura, farcito con un cremoso ragù bianco di carne e besciamella, piselli e provola affumicata", price: 7.0, note: "Allergeni 1-7-9" },
      { name: "Ravioli Fritti alla Norma", description: "Scrigno croccante di pasta avvolta in una dorata panatura, farcito con salsa di pomodoro, melanzane, basilico, besciamella, ricotta salata e mozzarella", price: 7.0, note: "Allergeni 1-7" },
      { name: "Crocchette di Patate e Scamorza", description: "La panatura croccante e dorata racchiude un morbido impasto di patate, cuore filante di scamorza affumicata servito con crema ai formaggi", price: 8.5, note: "Allergeni 1-7" },
      { name: "Crocchette di Patate, Speck e Tartufo", description: "La panatura croccante e dorata racchiude un morbido impasto di patate, cuore filante di scamorza affumicata servito con speck IGP, crema ai formaggi e tartufo all'esterno", price: 10.5, note: "Allergeni 1-7" },
      { name: "Tagliere del Fondatore", description: "Pecorino maremmano, scamorza affumicata di Agerola, bufala DOP, Riserva del Fondatore DOP, burrata, prosciutto crudo di Parma Gran Riserva 30 mesi, finocchiona, coppa suino dei Nebrodi, mortadella Favola Gran Riserva IGP, cotto scelto lenta cottura. Accompagnato da confettura di fichi e confettura di arance", price: 28.0, note: "Allergeni 1-7" },
      { name: "Tris di Bruschette", description: "3 bruschette: pesto di pomodoro secco, Grana Padano 24 mesi, noci, lardo di Patanegra / ricotta, coppata dei Nebrodi, miele / vastedda palermitana, salame rustico", price: 10.0, note: "Allergeni 1-3-7-8-12" },
      { name: "Bruschette al Pomodoro", description: "3 bruschette con pomodoro, aglio, olio EVO, origano di Pantelleria", price: 7.5 },
      { name: "Patate Crispers", description: "Patata crispers*, fonduta di formaggio, bacon croccante", price: 8.0, note: "Allergeni 7" },
      { name: "Prosciutto e Bufala", description: "Prosciutto crudo di Parma Gran Riserva 30 mesi, bufala DOP, crostini di pane", price: 14.0, note: "Allergeni 1-7" },
    ],
  },
  {
    id: "passi-dautore",
    title: "Passi d'Autore",
    subtitle: "Abbiamo studiato con cura ogni ingrediente, cercando l'equilibrio perfetto tra qualità e gusto.",
    items: [
      { name: "Burrata e Prosciutto Crudo", description: "Fiordilatte belmontese. In uscita: prosciutto crudo di Parma Gran Riserva 30 mesi, burrata, pomodorini confit, basilico cristallizzato, miele di acacia", price: 15.5, note: "Allergeni 1-7" },
      { name: "Bufala e Datterino", description: "Datterino giallo e rosso in salsa di basilico. In uscita: bufala DOP a stracci, prosciutto crudo di Parma Gran Riserva 30 mesi, scaglie di pecorino maremmano", price: 15.0, note: "Allergeni 1-7" },
      { name: "Pomodoro e Grana Padano", description: "Crema di pomodoro (passata ristretta aromatizzata all'aglio), pomodorini confit, pomodori secchi, gratinatura con cipollotto, Grana Padano 24 mesi, prezzemolo, mollica tostata, olio EVO", price: 14.5, note: "Allergeni 1-3-7" },
      { name: "Nduja e Stracciatella", description: "Salsa di datterino, 'nduja, stracciatella, pomodorini confit, tarallo sbriciolato, olio EVO al bergamotto", price: 14.5, note: "Allergeni 1-7-12" },
      { name: "Patate e Culatello", description: "Provola di Agerola, patata rustica, tuma, culatello in cottura, cipolla caramellata, origano di Pantelleria", price: 14.0, note: "Allergeni 1-7" },
      { name: "Bufala e Fichi", description: "Provola affumicata. In uscita: bufala DOP, prosciutto crudo di Parma Gran Riserva 30 mesi, gocce di confettura di fichi, timo fresco, olio EVO", price: 15.5, note: "Allergeni 1-7" },
      { name: "Spianata e Cipolla", description: "Fiordilatte belmontese, pomodoro siccagno, cipolla stracotta, olive nostrane. In uscita: spianata calabrese, pecorino dolce DOP", price: 12.5, note: "Allergeni 1-7" },
      { name: "Funghi Porcini e Tartufo", description: "Fiordilatte belmontese, fungo porcino. In uscita: stracciatella al tartufo, brunoise di pomodoro semi-secco, coppata dei Nebrodi", price: 15.0, note: "Allergeni 1-7" },
      { name: "Zucchine e Salsiccia", description: "Crema di zucchine, ricotta fresca, salsiccia, tuma. In uscita: chips di zucchine fritte", price: 13.5, note: "Allergeni 1-7" },
      { name: "Alici del Cantabrico", description: "Pomodoro, alici (filetti di alici del Mar Cantabrico lavorati a mano e rifilati a forbice servita a parte), capperi, polvere di olive, pomodorini confit. Linea Gold Sardina Fish", price: 16.0, note: "Allergeni 1-4" },
      { name: "Melanzane e Bufala", description: "Bufala DOP. In uscita: melanzane fritte a fette, salsa di basilico, salsa di pomodorino, ricotta salata", price: 13.0, note: "Allergeni 1-7-8" },
      { name: "Tartufo e Lardo di Patanegra", description: "Crema di melanzane, fungo porcino, pomodorini gialli confit, carpaccio di tartufo, lardo di Patanegra, crumble di speck", price: 18.0, note: "Allergeni 1" },
    ],
  },
  {
    id: "le-storiche",
    title: "Le Storiche",
    subtitle: "Le pizze che hanno scritto la nostra storia: intramontabili, riconoscibili, amate da sempre.",
    items: [
      { name: "Patate e Pesto di Pistacchio", description: "Fiordilatte belmontese, provola Valpadana DOP, patate novelle cotte al forno, pesto di pistacchio NP", price: 12.0, note: "Allergeni 1-5-7-8" },
      { name: "Zucca e Burrata", description: "Fiordilatte belmontese, zucca rossa agrodolce, cipolla di Giarratana. In uscita: burrata, prosciutto crudo di Parma Gran Riserva 30 mesi", price: 13.5, note: "Allergeni 1-7-12" },
      { name: "Brie, Funghi e Speck", description: "Mozzarella di bufala, brie, funghi porcini. In uscita: speck IGP, timo", price: 14.5, note: "Allergeni 1-7" },
      { name: "Tartufo e Funghi", description: "Fiordilatte belmontese, crema tartufata, pomodorini, funghi porcini. In uscita: speck IGP, Grana Padano 24 mesi", price: 14.5, note: "Allergeni 1-3-7" },
      { name: "Patate e Salame Piccante", description: "Fiordilatte belmontese, cipolla di Giarratana, patate novelle cotte al forno, provola Valpadana DOP, salame piccante Villani. In uscita: pomodoro secco", price: 12.5, note: "Allergeni 1-7-12" },
      { name: "Mortadella e Burrata", description: "Fiordilatte belmontese. In uscita: mortadella Favola Gran Riserva IGP, burrata, pesto di pistacchio NP", price: 14.5, note: "Allergeni 1-5-7-8" },
      { name: "Bufala e Prosciutto Crudo", description: "Bufala, patate novelle cotte al forno. In uscita: rucola, pesto di pistacchio NP, burrata, prosciutto crudo di Parma Gran Riserva 30 mesi", price: 18.5, note: "Allergeni 1-5-7-8-12" },
      { name: "Zucchine e Guanciale", description: "Fiordilatte belmontese, crema di zucchine. In uscita: burrata, guanciale, chips di zucchine, Grana Padano 24 mesi", price: 15.0, note: "Allergeni 1-3-7" },
      { name: "Acciughe e Burrata", description: "Salsa di pomodorino, pomodorini confit. In uscita: burrata, filetti di acciughe di Sciacca, basilico, olio EVO, origano di Pantelleria", price: 14.5, note: "Allergeni 1-4-7" },
    ],
  },
  {
    id: "le-classiche",
    title: "Le Classiche",
    items: [
      { name: "Marinara con Acciughe", description: "Pomodoro pelato siccagno, filetti di acciughe di Sciacca, aglio, olio EVO, origano", price: 9.0, note: "Allergeni 1-4" },
      { name: "Margherita", description: "Fiordilatte belmontese, pomodoro pelato siccagno, basilico", price: 9.0, note: "Allergeni 1-7" },
      { name: "Margherita con Acciughe", description: "Fiordilatte belmontese, pomodoro pelato siccagno, filetti di acciughe di Sciacca, origano di Pantelleria", price: 9.5, note: "Allergeni 1-4-7" },
      { name: "Prosciutto Cotto", description: "Fiordilatte belmontese, pomodoro pelato siccagno, prosciutto cotto scelto lenta cottura", price: 10.0, note: "Allergeni 1-7" },
      { name: "Diavola", description: "Fiordilatte belmontese, pomodoro pelato siccagno, salame piccanti Villani, cipolla di Giarratana, 'nduja", price: 11.0, note: "Allergeni 1-7" },
      { name: "Prosciutto e Origano", description: "Fiordilatte belmontese, pomodoro pelato siccagno, prosciutto cotto scelto lenta cottura, olio EVO, origano di Pantelleria", price: 11.5, note: "Allergeni 1-7" },
      { name: "Capricciosa", description: "Fiordilatte belmontese, pomodoro pelato Siccagno, prosciutto cotto scelto lenta cottura, funghi freschi prataioli, wurstel, olive nere Giarraffa", price: 14.0, note: "Allergeni 1-7" },
      { name: "Quattro Formaggi", description: "Fiordilatte belmontese, gorgonzola DOP, emmental, Grana Padano 24 mesi", price: 11.5, note: "Allergeni 1-3-7" },
      { name: "Bufala e Pomodorini", description: "Fiordilatte belmontese. In uscita: bufala DOP, pomodorini, basilico, origano di Pantelleria", price: 12.0, note: "Allergeni 1-7" },
      { name: "Parmigiana", description: "Fiordilatte belmontese, pomodoro pelato siccagno, melanzane fritte, basilico, Grana Padano 24 mesi", price: 12.0, note: "Allergeni 1-3-7" },
    ],
  },
  {
    id: "calzoni-fritti",
    title: "Calzoni Fritti",
    subtitle: "Calzone fritto artigianale, dorato e fragrante, preparato al momento con ingredienti selezionati.",
    items: [
      { name: "Calzone al Salame", description: "Ricotta, pomodoro pelato siccagno, salame rustico Villani, provola di Agerola, pepe", price: 12.5, note: "Allergeni 1-7" },
      { name: "Calzone al Prosciutto", description: "Provola di Agerola, prosciutto cotto scelto lenta cottura, pomodoro pelato siccagno, Grana Padano 24 mesi, basilico", price: 13.5, note: "Allergeni 1-3-7" },
      { name: "Calzone alla Salsiccia", description: "Lattuga marulla, salsiccia fresca sfumata al vino bianco, provola affumicata, olio EVO aromatizzato all'aglio, pepe", price: 14.5, note: "Allergeni 1-7-12" },
    ],
  },
  {
    id: "crusta",
    title: "Crusta",
    subtitle: "La pizza crusta, con la sua base croccante e leggera, e una reinterpretazione moderna della tradizione.",
    items: [
      { name: "Coppata e Fichi", description: "Provola di Agerola. In uscita: coppata dei Nebrodi, pomodorini confit, Riserva del Fondatore DOP, confettura di fichi", price: 15.0, note: "Allergeni 1-7" },
      { name: "Tartufo e Melanzane", description: "Fiordilatte, crema di melanzane. In uscita: coppata, fonduta di Grana Padano 24 mesi, scaglie di tartufo", price: 19.0, note: "Allergeni 1-3-7" },
      { name: "Pesto di Pomodoro Secco", description: "Pesto di pomodoro secco (con noci), Grana Padano 24 mesi, ricotta al miele, guanciale di Patanegra, pomodorini arrosto", price: 16.0, note: "Allergeni 1-3-7-8-12" },
      { name: "Cipolla e Acciughe", description: "Cipolla di Giarratana, filetti di acciughe di Sciacca, tuma, ricotta fresca, pangrattato, pepe", price: 13.0, note: "Allergeni 1-4-7" },
    ],
  },
  {
    id: "le-vegane",
    title: "Le Vegane",
    subtitle: "Pizze che rispettano le diverse esigenze alimentari, senza rinunciare alla qualita e al piacere della tavola.",
    items: [
      { name: "Funghi e Noci", description: "Salsa di noci, besciamella vegetale, funghi champignon e porcini, aglio, olio al tartufo a fine cottura", price: 15.0, note: "Allergeni 1-8" },
      { name: "Patate e Pesto di Pistacchio", description: "Patate novelle cotte al forno. In uscita: pesto di pistacchio NP", price: 9.5, note: "Allergeni 1-5-8-12" },
      { name: "Tartufo e Funghi", description: "Salsa tartufata, pomodorini, funghi freschi prataioli, funghi porcini. In uscita: rucola", price: 13.5, note: "Allergeni 1" },
    ],
  },
  {
    id: "rotundi-casseruola",
    title: "I Rotundi in Casseruola",
    items: [
      { name: "Prosciutto e Provola", description: "Prosciutto cotto scelto lenta cottura, provola di Agerola, burro fresco", price: 9.5, note: "Allergeni 1-7" },
      { name: "Pollo Grigliato", description: "Pollo grigliato, caciotta fresca di vaccino, iceberg, pomodoro a fette, maionese", price: 10.5, note: "Allergeni 1-3-7-12" },
      { name: "Melanzane e Speck", description: "Melanzane arrosto, scamorza di Agerola, speck, pomodorini confit", price: 10.5, note: "Allergeni 1-7" },
    ],
  },
  {
    id: "insalate",
    title: "Insalate",
    items: [
      { name: "Insalata di Pollo e Bufala", description: "Iceberg, pomodorini confit, bufala DOP, pollo arrosto, crostini di pane tostato al burro, scaglie di pecorino maremmano", price: 14.5, note: "Allergeni 1-7" },
      { name: "Patate e Fonduta di Pistacchio", description: "Patate novelle dorate al forno, olive nere denocciolate, straccetti di pomodoro semi-secco, chips fritte di zucchine genovesi, letto di fonduta di pistacchio NP", price: 13.5, note: "Allergeni 5-8-12" },
      { name: "Insalata al Pesto e Bufala", description: "Fonduta di pesto di basilico NP, bufala DOP, Iceberg, mix di datterino, pomodorini arrosto, basilico fresco", price: 12.5, note: "Allergeni 7-8" },
    ],
  },
  {
    id: "hamburger",
    title: "Hamburger d'Autore",
    items: [
      { name: "Classic Burger", description: "Hamburger di Scottona 180g, provola di Agerola, bacon croccante, pomodoro a fette, lattuga, maionese", price: 11.0, note: "Allergeni 1-3-7-12" },
      { name: "Coppata Burger", description: "Hamburger di Scottona 180g, scamorza affumicata, coppata dei Nebrodi, cipolla caramellata, miele di acacia", price: 12.0, note: "Allergeni 1-7" },
      { name: "Guanciale Burger", description: "Hamburger di Scottona 180g, guanciale di Patanegra, pomodorini confit, chips di zucchine fritte, confettura di fichi", price: 13.0, note: "Allergeni 1" },
    ],
  },
  {
    id: "dolci",
    title: "Dolci",
    items: [
      { name: "Tiramisu", description: "Classico tiramisu artigianale", price: 6.0, note: "Allergeni 1-3-7-12" },
      { name: "Cheesecake", description: "Cheesecake cremosa con base di biscotto", price: 8.0, note: "Allergeni 1-3-7-12" },
      { name: "Cannolo Moderno", description: "Con crema di ricotta, confettura di fichi, riduzione di menta, noci tostate, scaglie di cioccolato fondente di Modica", price: 9.0, note: "Allergeni 1-7-8" },
      { name: "Cheesecake al Caffe", description: "Morbida crema al formaggio su base croccante di biscotto, impreziosita da una vellutata marmellata al caffe. Opzioni: marmellata di fichi, marmellata al caffe, confettura artigianale di arance, caramello salato", price: 8.0, note: "Allergeni 1-3-7" },
    ],
  },
  {
    id: "birre",
    title: "Birre",
    items: [
      { name: "Bionda Leggera", description: "Birra dal colore giallo dorato, corpo esile, finale intenso. Molto beverina e dissetante. 5.5% Vol.", price: 7.0 },
      { name: "Biologica Chiara", description: "Birra chiara biologica, fruttata e speziata con schiuma bianca e persistente. Frizzante, secca con leggera nota acidula. 5.0% Vol.", price: 7.0 },
      { name: "IPA Agrumata", description: "Birra ambrata con note intense agrumate e di frutta esotica. Amaro marcato ma bilanciato dalla pienezza dei malti caramellati. 6.5% Vol.", price: 7.0 },
      { name: "Stout al Cacao", description: "Birra nero intenso con note di cacao, caffe, liquirizia, cocco e vaniglia. Morbida e vellutata grazie all'avena. 7.5% Vol.", price: 7.0 },
      { name: "Siciliana al Mandarino", description: "Birra siciliana artigianale con grano Biancolilla siciliano, malto d'orzo del Belgio e bucce di mandarino di Ciaculli. 6% Vol.", price: 8.0 },
      { name: "Siciliana agli Agrumi", description: "Birra siciliana artigianale con grano perciasacchi, bucce di agrumi di Sicilia, bacche di sommacco e pepe rosa. 6.5% Vol.", price: 8.0 },
      { name: "IPA Siciliana", description: "IPA dall'amaro deciso, prodotta con grano biondo, luppolo americano e foglie di agrumi di Sicilia. 6.5% Vol.", price: 8.0 },
      { name: "Grani Antichi di Sicilia", description: "Prodotta con grani antichi Timilia, Russello e Perciasacchi. Leggera e dissetante. 5% Vol.", price: 8.0 },
      { name: "Artigianale Chiara", description: "Birra chiara puro malto 100%, non pastorizzata e non filtrata, rifermentata in bottiglia. 5.2% Vol.", price: 12.0 },
      { name: "Artigianale Rossa", description: "Birra rossa tradizionale doppio malto, ambrata, non pastorizzata e non filtrata. 5.9% Vol.", price: 12.0 },
      { name: "Artigianale di Frumento", description: "Birra chiara con malto d'orzo e frumento, non pastorizzata e non filtrata. 5% Vol.", price: 12.0 },
      { name: "Artigianale Ambrata", description: "Birra chiara puro malto d'orzo 100%, non pastorizzata e non filtrata. Tendenzialmente amara con retrogusto erbaceo. 5.9% Vol.", price: 12.0 },
    ],
  },
  {
    id: "birre-sg",
    title: "Birre Senza Glutine",
    items: [
      { name: "Senza Glutine al Mandarino", description: "Prodotta con grano Biancolilla siciliano, malto d'orzo del Belgio e bucce di mandarino di Ciaculli. 6% Vol.", price: 8.0 },
      { name: "Senza Glutine Biologica", description: "Birra speciale senza glutine artigianale biologica, bassa fermentazione, non filtrata e non pastorizzata, rifermentata in bottiglia. 5% Vol.", price: 7.0 },
      { name: "Senza Glutine Fruttata", description: "Birra giallo paglierino senza glutine, secca, fruttata, amaro ben bilanciato. Non filtrata, non pastorizzata. 4.9% Vol.", price: 8.0 },
    ],
  },
  {
    id: "vini",
    title: "Vini al Calice",
    items: [
      { name: "Altavilla della Corte", description: "Firriato — 13% Vol.", price: 7.5 },
      { name: "Donna di Coppe", description: "12.5% Vol.", price: 8.0 },
      { name: "Vino Bianco", description: "12.5% Vol.", price: 8.0 },
      { name: "Firriato Rosso", description: "Firriato — 13.5% Vol.", price: 7.5 },
      { name: "Firriato Bianco", description: "Firriato — 13.5% Vol.", price: 8.0 },
    ],
  },
  {
    id: "cocktail",
    title: "Cocktail",
    items: [
      { name: "Spritz", description: "Aperol, prosecco, soda, fetta d'arancia", price: 8.5 },
      { name: "Campari Spritz", description: "Campari, prosecco, soda, fetta d'arancia", price: 9.5 },
      { name: "Limoncello Spritz", description: "Limoncello, prosecco, soda, fetta di limone", price: 9.5 },
      { name: "Mandarino Spritz", description: "Sciroppo al mandarino, prosecco, soda, fetta d'arancia", price: 9.5 },
      { name: "Sambuco Spritz", description: "Sciroppo ai fiori di sambuco, prosecco, soda, menta, fetta di limone", price: 9.5 },
      { name: "Negroni", description: "Gin, vermouth rosso, campari, fetta d'arancia", price: 9.5 },
      { name: "Americano", description: "Prosecco, vermouth rosso, campari, fetta d'arancia", price: 9.5 },
      { name: "Gin Tonic", description: "Gin, acqua tonica/lemon, fetta di limone", price: 9.5 },
      { name: "Moscow Mule Gin", description: "Gin, ginger beer, succo di limone, zenzero", price: 9.5 },
      { name: "Vodka Tonic", description: "Vodka, acqua tonica/lemon, fetta d'arancia", price: 9.5 },
      { name: "Moscow Mule", description: "Vodka, ginger beer, succo di limone, zenzero", price: 9.5 },
      { name: "Mojito", description: "Rum cubano bianco, succo di lime, foglie di menta, zucchero di canna bianco, soda", price: 9.5 },
      { name: "Cuba Libre", description: "Rum cubano bianco, coca cola, succo di lime, fetta di limone", price: 9.5 },
    ],
  },
  {
    id: "aggiunzioni",
    title: "Aggiunzioni",
    items: [
      { name: "Aggiunta di Formaggio", description: "", price: 4.0, note: "Allergene 5-8" },
    ],
  },
];
