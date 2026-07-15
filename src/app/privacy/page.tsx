import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — TIMILIA",
  description: "Informativa sul trattamento dei dati personali ai sensi del GDPR (Reg. UE 2016/679).",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-foreground text-3xl md:text-4xl font-light tracking-wide mb-2">
          Privacy Policy
        </h1>
        <p className="text-foreground/40 text-sm mb-12">Ultimo aggiornamento: 15 luglio 2026</p>

        <div className="prose prose-invert max-w-none space-y-8 text-foreground/60 text-sm font-light leading-relaxed">
          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">1. Titolare del trattamento</h2>
            <p>
              Il titolare del trattamento dei dati è <strong className="text-foreground/80">TIMILIA</strong>,
              con sede in Via Maqueda 221, 90133 Palermo (PA). Per qualsiasi richiesta relativa alla
              protezione dei dati, è possibile scrivere a <strong className="text-foreground/80">gaetano.meli95@gmail.com</strong>.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">2. Tipologia di dati raccolti</h2>
            <p>Raccogliamo i seguenti dati personali:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li><strong className="text-foreground/80">Dati di registrazione</strong>: nome, email, telefono</li>
              <li><strong className="text-foreground/80">Dati di spedizione</strong>: nome, indirizzo, città, CAP, telefono</li>
              <li><strong className="text-foreground/80">Dati di pagamento</strong>: gestiti direttamente da Stripe (non archiviamo i dati della carta)</li>
              <li><strong className="text-foreground/80">Dati di navigazione</strong>: cookie tecnici, indirizzo IP (anonimizzato)</li>
              <li><strong className="text-foreground/80">Recensioni</strong>: testo, valutazione, nome</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">3. Finalità del trattamento</h2>
            <p>I dati sono trattati per:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Erogazione del servizio di e-commerce e gestione ordini</li>
              <li>Elaborazione dei pagamenti tramite Stripe</li>
              <li>Spedizione dei prodotti</li>
              <li>Invio di email transazionali (conferma ordine, aggiornamenti stato)</li>
              <li>Gestione delle recensioni dei clienti</li>
              <li>Newsletter (solo con consenso esplicito)</li>
              <li>Adempimenti legali e fiscali</li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">4. Base giuridica</h2>
            <p>
              Il trattamento si basa sul <strong className="text-foreground/80">consenso</strong> dell'interessato
              (art. 6 lett. a GDPR) per registrazione, newsletter e recensioni; sull'<strong className="text-foreground/80">esecuzione
              di un contratto</strong> (art. 6 lett. b GDPR) per ordini e spedizioni; sull'<strong className="text-foreground/80">obbligo
              legale</strong> (art. 6 lett. c GDPR) per gli adempimenti fiscali.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">5. Terzi che trattano i dati</h2>
            <p>I dati sono condivisi con i seguenti responsabili esterni del trattamento:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li><strong className="text-foreground/80">Stripe</strong> — elaborazione pagamenti (USA) — <a href="https://stripe.com/privacy" className="text-gold hover:underline">Privacy Policy Stripe</a></li>
              <li><strong className="text-foreground/80">Supabase</strong> — database e autenticazione (USA/EU) — <a href="https://supabase.com/privacy" className="text-gold hover:underline">Privacy Policy Supabase</a></li>
              <li><strong className="text-foreground/80">Resend</strong> — invio email transazionali (USA) — <a href="https://resend.com/legal/privacy-policy" className="text-gold hover:underline">Privacy Policy Resend</a></li>
              <li><strong className="text-foreground/80">Vercel</strong> — hosting del sito (USA) — <a href="https://vercel.com/legal/privacy-policy" className="text-gold hover:underline">Privacy Policy Vercel</a></li>
            </ul>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">6. Periodo di conservazione</h2>
            <p>
              I dati di registrazione e account sono conservati fino alla richiesta di cancellazione.
              I dati degli ordini sono conservati per 10 anni per obblighi fiscali. I dati della newsletter
              sono conservati fino al disiscrizione.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">7. Diritti dell'interessato</h2>
            <p>Hai diritto a:</p>
            <ul className="list-disc pl-6 mt-3 space-y-1.5">
              <li>Accesso ai tuoi dati (art. 15 GDPR)</li>
              <li>Rettifica dei dati inesatti (art. 16 GDPR)</li>
              <li>Cancellazione dei dati ("diritto all'oblio", art. 17 GDPR)</li>
              <li>Limitazione del trattamento (art. 18 GDPR)</li>
              <li>Portabilità dei dati (art. 20 GDPR)</li>
              <li>Opposizione al trattamento (art. 21 GDPR)</li>
              <li>Revoca del consenso in qualsiasi momento</li>
            </ul>
            <p className="mt-3">
              Per esercitare questi diritti, scrivi a <strong className="text-foreground/80">gaetano.meli95@gmail.com</strong>.
              Hai inoltre diritto di proporre reclamo al <strong className="text-foreground/80">Garante per la Protezione
              dei Dati Personali</strong> (<a href="https://www.garanteprivacy.it" className="text-gold hover:underline">www.garanteprivacy.it</a>).
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">8. Sicurezza dei dati</h2>
            <p>
              Adottiamo misure tecniche e organizzative adeguate a proteggere i dati personali, tra cui
              crittografia in transito (HTTPS/TLS), autenticazione JWT, e accesso limitato ai dati da parte
              del solo titolare. I dati di pagamento non sono mai archiviati sui nostri server.
            </p>
          </section>

          <section>
            <h2 className="text-foreground text-lg font-medium mb-3">9. Trasferimenti extra-UE</h2>
            <p>
              Alcuni dei nostri fornitori (Stripe, Supabase, Resend, Vercel) trattano dati al di fuori dell'Unione
              Europea. Tali trasferimenti avvengono sulla base delle clausole contrattuali standard adottate
              dai fornitori, in conformità al GDPR.
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
