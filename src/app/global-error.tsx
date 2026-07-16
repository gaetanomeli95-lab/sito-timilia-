"use client";

import { motion } from "framer-motion";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body style={{ backgroundColor: "#0a0a0a", color: "#fff", fontFamily: "Georgia, serif" }}>
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ textAlign: "center", maxWidth: "400px" }}
          >
            <h1 style={{ color: "#c8a97e", fontSize: "28px", fontWeight: 300, letterSpacing: "0.3em", marginBottom: "16px" }}>
              TIMILIA
            </h1>
            <div style={{ height: "1px", width: "60px", background: "rgba(200,169,126,0.3)", margin: "0 auto 24px" }} />
            <h2 style={{ fontSize: "20px", fontWeight: 300, marginBottom: "12px" }}>
              Errore di sistema
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", fontWeight: 300, marginBottom: "32px" }}>
              Si è verificato un errore. Riprova o torna più tardi.
            </p>
            <button
              onClick={reset}
              style={{
                padding: "10px 24px",
                borderRadius: "9999px",
                background: "rgba(200,169,126,0.15)",
                border: "1px solid rgba(200,169,126,0.3)",
                color: "#c8a97e",
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Riprova
            </button>
          </motion.div>
        </div>
      </body>
    </html>
  );
}
