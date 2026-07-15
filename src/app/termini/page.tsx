import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termini e Condizioni — TIMILIA",
  description: "Termini e condizioni di vendita del sito pizzeriatimilia.com",
};

export default function TerminiPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-foreground text-3xl md:text-4xl font-light tracking-wide mb-2">
          Termini e Condizioni
        </h1>
        <p className="text-foreground/40 text-sm mb-12">Ultimo aggiornamento: 15 luglio 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground/60 text-sm font-light leading-relaxed">
          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">1. Premessa</h2>
            <p>
              I presenti Termini e Condizioni regolano l'utilizzo del sito <strong className="text-foreground/80">pizzeriatimilia.com</strong>
              e la vendita dei prodotti offerti da <strong className="text-foreground/80">TIMILIA</strong>, con sede in
              Via Maqueda 221, 90133 Palermo (PA). L'acquisto di prodotti implica l'accettazione integrale
              dei presenti termini.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">2. Account e registrazione</h2>
            <p>
              Per effettuare acquisti è necessaria la registrazione. L'utente è responsabile della veridicità
              dei dati forniti e della custodia delle credenziali di accesso. È vietato creare account falsi
              o utilizzare dati di terzi senza autorizzazione.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">3. Ordini e pagamenti</h2>
            <p>
              Gli ordini sono effettuati tramite il modulo di checkout del sito. Il pagamento è elaborato
              da <strong className="text-foreground/80">Stripe</strong> in ambiente sicuro. I dati della carta
              di credito non sono mai archiviati sui nostri server. L'ordine è confermato solo dopo
              l'avvenuto pagamento e l'invio dell'email di conferma.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">4. Prezzi e disponibilità</h2>
            <p>
              Tutti i prezzi sono espressi in Euro (€) e includono l'IVA ove applicabile. Le spese di
              spedizione sono calcolate al momento del checkout. Ci riserviamo il diritto di modificare
              prezzi e disponibilità dei prodotti senza preavviso. In caso di indisponibilità di un prodotto
              già pagato, provvederemo al rimborso completo.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">5. Spedizioni</h2>
            <p>
              Le spedizioni avvengono nei territori indicati al momento del checkout. I tempi di consegna
              sono indicativi e dipendono dal corriere. Non ci assumiamo responsabilità per ritardi
              imputabili a cause di forza maggiore o al corriere.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">6. Diritto di recesso</h2>
            <p>
              Ai sensi del D.Lgs. 206/2005 (Codice del Consumo), il consumatore ha diritto di recedere
              dall'acquisto entro <strong className="text-foreground/80">14 giorni</strong> dalla ricezione del prodotto.
              Il recesso deve essere comunicato via email a <strong className="text-foreground/80">gaetano.meli95@gmail.com</strong>.
              Il prodotto deve essere restituito integro e nelle condizioni originali. Le spese di restituzione
              sono a carico del consumatore. Il rimborso sarà effettuato entro 14 giorni dalla ricezione
              della merce.
            </p>
            <p className="mt-3">
              <strong className="text-foreground/80">Eccezioni</strong>: i prodotti deperibili o personalizzati
              non sono soggetti al diritto di recesso, salvo difetti o non conformità.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">7. Garanzie</h2>
            <p>
              I prodotti sono coperti dalla garanzia legale di conformità (D.Lgs. 206/2005) per 24 mesi
              dalla consegna. Per eventuali difetti, scrivere a <strong className="text-foreground/80">gaetano.meli95@gmail.com</strong>
              con descrizione del problema e prova d'acquisto.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">8. Recensioni</h2>
            <p>
              Gli utenti registrati possono lasciare recensioni. Le recensioni sono soggette a moderazione.
              È vietato pubblicare contenuti diffamatori, falsi o che violano i diritti di terzi. Ci riserviamo
              il diritto di rimuovere recensioni non conformi.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">9. Proprietà intellettuale</h2>
            <p>
              Tutti i contenuti del sito (testi, immagini, loghi, marchi) sono di proprietà di TIMILIA o dei
              rispettivi titolari. È vietata la riproduzione, anche parziale, senza autorizzazione scritta.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">10. Risoluzione delle controversie</h2>
            <p>
              Per eventuali controversie, è possibile ricorrere alla piattaforma europea di risoluzione
              online delle controversie (ODR) all'indirizzo <a href="https://ec.europa.eu/consumers/odr" className="text-gold hover:underline">ec.europa.eu/consumers/odr</a>.
              La giurisdizione competente è quella del Foro di Palermo.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">11. Modifiche</h2>
            <p>
              Ci riserviamo il diritto di modificare i presenti Termini e Condizioni in qualsiasi momento.
              Le modifiche entrano in vigore dalla pubblicazione sul sito.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <a href="/" className="text-gold/70 hover:text-gold text-sm font-light transition-colors">
            ← Torna alla home
          </a>
        </div>
      </div>
    </div>
  );
}
