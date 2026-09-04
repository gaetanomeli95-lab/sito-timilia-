/* Grana materica: carta, pietra, farina. Condivisa tra la pagina TERA e la Home. */
export const NOISE =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.9 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function Grain({ light = false }: { light?: boolean }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 ${
        light ? "opacity-[0.05] mix-blend-screen" : "opacity-[0.07] mix-blend-multiply"
      }`}
      style={{ backgroundImage: NOISE, backgroundSize: "220px 220px" }}
    />
  );
}
