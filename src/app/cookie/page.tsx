import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — TIMILIA",
  description: "Informativa sui cookie utilizzati dal sito pizzeriatimilia.com",
};

export default function CookiePage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-foreground text-3xl md:text-4xl font-light tracking-wide mb-2">
          Cookie Policy
        </h1>
        <p className="text-foreground/40 text-sm mb-12">Ultimo aggiornamento: 15 luglio 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground/60 text-sm font-light leading-relaxed">
          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">1. Cosa sono i cookie</h2>
            <p>
              I cookie sono piccoli file di testo che i siti visitati salvano sul dispositivo dell'utente
              per memorizzare informazioni relative alla navigazione. Sono utilizzati per garantire il
              corretto funzionamento del sito e per migliorare l'esperienza dell'utente.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">2. Cookie utilizzati</h2>
            <p>Il sito pizzeriatimilia.com utilizza i seguenti cookie:</p>

            <h3 className="text-foreground/80 text-sm font-medium mt-6 mb-2">Cookie tecnici (necessari)</h3>
            <p>Non richiedono consenso ai sensi dell'art. 122 del Codice della Privacy.</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li><strong className="text-foreground/80">supabase.auth.token</strong> — mantiene la sessione di autenticazione dell'utente. Durata: sessione.</li>
              <li><strong className="text-foreground/80">tera_cart</strong> — memorizza il contenuto del carrello tramite localStorage. Durata: persistente.</li>
              <li><strong className="text-foreground/80">timilia_intro_seen</strong> — ricorda se l'utente ha già visto l'intro animato. Durata: sessione.</li>
              <li><strong className="text-foreground/80">maintenance_bypass</strong> — permette all'admin di bypassare la manutenzione. Durata: 24 ore.</li>
            </ul>

            <h3 className="text-foreground/80 text-sm font-medium mt-6 mb-2">Cookie di terze parti</h3>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li><strong className="text-foreground/80">Stripe</strong> — cookie tecnici per il funzionamento del checkout. <a href="https://stripe.com/cookies" className="text-gold hover:underline">Maggiori info</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">3. Gestione dei cookie</h2>
            <p>
              Puoi gestire o disabilitare i cookie tramite le impostazioni del tuo browser. Tieni presente
              che la disabilitazione dei cookie tecnici potrebbe compromettere il funzionamento del sito
              (login, carrello, ecc.).
            </p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li><a href="https://support.google.com/chrome/answer/95647" className="text-gold hover:underline">Chrome</a></li>
              <li><a href="https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie" className="text-gold hover:underline">Firefox</a></li>
              <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" className="text-gold hover:underline">Safari</a></li>
              <li><a href="https://support.microsoft.com/it-it/microsoft-edge/ab7f0d1a-2c35-4e2e-82ec-2e7ec5c3c017" className="text-gold hover:underline">Edge</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">4. Cookie analitici</h2>
            <p>
              Al momento il sito non utilizza cookie analitici o di profilazione (Google Analytics, Meta Pixel, ecc.).
              In caso di futura attivazione, verrà richiesto il consenso esplicito tramite banner.
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
