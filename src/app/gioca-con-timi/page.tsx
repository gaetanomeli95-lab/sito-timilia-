import type { Metadata } from "next";
import TimiGame from "./TimiGame";

export const metadata: Metadata = {
  title: "Impasta con Timì | TIMILIA",
  description: "Materia, equilibrio e tempo. Scopri se hai la mano da pizzaiolo con Timì.",
  robots: { index: false, follow: false },
};

export default function TimiGamePage() {
  return <TimiGame />;
}
