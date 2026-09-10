import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeraStory from "@/components/tera/TeraStory";
import TruePizza3DShowcase from "@/components/experiments/TruePizza3DShowcase";

export default function TeraPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ea]">
      <Navbar />
      <main className="flex-1">
        <TeraStory />
        <TruePizza3DShowcase
          variant="tera"
          eyebrow="Quando cambia la materia"
          title="TERA"
          lead="Quando cambia la materia, ricomincia la ricerca."
          body="Non ci interessava imitare. Ci interessava capire, studiare, riequilibrare e trovare un linguaggio nuovo. TERA nasce da una domanda precisa: come si costruisce un'esperienza autentica quando cambia tutto ciò da cui si parte?"
          closing="Non volevamo semplicemente togliere qualcosa. Volevamo costruire un nuovo equilibrio."
          notes={[
            { label: "Impasto", detail: "Un nuovo punto di partenza." },
            { label: "Equilibrio", detail: "Ogni scelta cambia il risultato." },
            { label: "Ricerca", detail: "Nulla è lasciato all'automatismo." },
            { label: "Sensibilità", detail: "La tecnica da sola non basta." },
            { label: "Identità TERA", detail: "Non un'alternativa. Una visione." },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
