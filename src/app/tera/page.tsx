import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TeraStory from "@/components/tera/TeraStory";
import ExplodedPizzaShowcase from "@/components/experiments/ExplodedPizzaShowcase";

export default function TeraPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f1ea]">
      <Navbar />
      <main className="flex-1">
        <TeraStory />
        <ExplodedPizzaShowcase
          tone="tera"
          eyebrow="Quando cambia la materia, ricomincia la ricerca"
          title="Creazione TERA"
          subtitle="Qui l'effetto 3D è più lento e materico: la pizza si apre in livelli senza perdere l'eleganza editoriale di TERA. È una prima prova visiva costruita su una delle fotografie reali già presenti nella galleria senza glutine."
          image="/images/tera-creazioni/creazione-14.png"
          imageAlt="Creazione senza glutine TERA di Timilia"
          notes={[
            { label: "Impasto TERA", detail: "Una struttura costruita da zero, non la copia di un impasto tradizionale." },
            { label: "Materia", detail: "Farine e componenti lavorati per equilibrio, consistenza e identità." },
            { label: "Ricerca", detail: "Tecnica, prove e correzioni continue prima di arrivare al forno." },
            { label: "Identità", detail: "Senza glutine, ma con un linguaggio proprio e riconoscibile." },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
