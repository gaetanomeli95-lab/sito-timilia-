import type { Metadata } from "next";
import { ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: "FAQ – Domande Frequenti | TIMILIA Palermo",
  description: "Risposte alle domande più frequenti su TIMILIA: orari, allergeni, senza glutine, parcheggio, prenotazioni e altro. Via Maqueda 221, Palermo.",
};

const faqs = [
  {
    q: "Quali sono gli orari di apertura?",
    a: "Siamo aperti tutti i giorni. Da lunedì a giovedì e domenica: 11:30 – 00:00. Venerdì e sabato: 11:30 – 01:00. Turno unico.",
  },
  {
    q: "Si può prenotare un tavolo?",
    a: "Non accettiamo prenotazioni. Il turno è unico e i posti sono limiti, vi consigliamo di arrivare con un po' di anticipo soprattutto nei weekend.",
  },
  {
    q: "Avete opzioni senza glutine?",
    a: "Assolutamente sì. Il nostro progetto TERA utilizza un blend di grani antichi siciliani per un impasto senza glutine leggero e digeribile. Tutte le nostre pizze sono disponibili anche senza glutine. Gli antipasti e i dolci sono senza glutine di base.",
  },
  {
    q: "E senza lattosio?",
    a: "Tutte le pizze sono disponibili anche senza lattosio. Gli antipasti e i dolci sono già senza lattosio di base. Basta richiederlo al momento dell'ordine.",
  },
  {
    q: "Dove siete located?",
    a: "In Via Maqueda 221, nel cuore del centro storico di Palermo, a due passi dai Quattro Canti.",
  },
  {
    q: "C'è un parcheggio vicino?",
    a: "Non abbiamo parcheggio privato, ma ci sono diversi parcheggi a pagamento nelle vicinanze. Il più vicino è il parcheggio di Piazza Casa Professa, a circa 5 minuti a piedi. Consigliamo anche i parcheggi di Via Cavour e Piazza Indipendenza.",
  },
  {
    q: "Cos'è il progetto TERA?",
    a: "TERA è il nostro progetto di ricerca sugli impasti. Un blend unico di grani antichi siciliani — teff, miglio e piselli — che garantisce un alto apporto nutritivo, fibre e un basso indice glicemico, mantenendo leggerezza e digeribilità.",
  },
  {
    q: "Avete opzioni vegane?",
    a: "Sì, abbiamo una sezione dedicata 'Le Vegane' con pizze completamente vegetali, disponibili anche senza glutine e senza lattosio.",
  },
  {
    q: "Posso ordinare online?",
    a: "Lo shop online sarà disponibile a breve. Restate aggiornati seguendoci sui social o iscrivendovi alla newsletter.",
  },
  {
    q: "Organizzate eventi o cene private?",
    a: "Per eventi e cene private, contattateci direttamente al +39 379 248 3597 o via WhatsApp. Valuteremo insieme le vostre esigenze.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <span className="text-gold/70 text-[10px] tracking-[0.3em] uppercase font-medium block mb-3">
            Assistenza
          </span>
          <h1 className="text-foreground text-3xl md:text-4xl font-light tracking-wide mb-4">
            Domande Frequenti
          </h1>
          <div className="w-12 h-[1px] bg-gold/30 mb-6" />
          <p className="text-foreground/50 text-sm font-light leading-relaxed">
            Tutto quello che devi sapere su TIMILIA. Non trovi quello che cerchi?
            Scrivici su WhatsApp al <a href="https://wa.me/393792483597" className="text-gold hover:text-gold-light transition-colors">+39 379 248 3597</a>.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="group bg-white/[0.02] border border-white/[0.06] rounded-lg overflow-hidden transition-all hover:border-gold/20"
            >
              <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none">
                <span className="text-foreground/80 text-sm md:text-base font-light tracking-wide">
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className="text-gold/50 shrink-0 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <div className="px-5 pb-5 pt-0">
                <p className="text-foreground/45 text-sm font-light leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <p className="text-foreground/30 text-xs font-light text-center">
            © {new Date().getFullYear()} TIMILIA – Pizza di Sicilia. Via Maqueda 221, Palermo.
          </p>
        </div>
      </div>
    </div>
  );
}
