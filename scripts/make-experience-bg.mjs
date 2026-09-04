/* Rigenera i fondali WebP della sezione "L'esperienza Timilia" da un'immagine sorgente.
   Uso: node scripts/make-experience-bg.mjs "percorso/immagine.png" */
import sharp from "sharp";

const SRC = process.argv[2];
if (!SRC) {
  console.error("Indica il percorso dell'immagine sorgente.");
  process.exit(1);
}

const variants = [
  { out: "public/images/experience-bg-desktop.webp", width: 1920, height: 1080, focusX: 0.5, brightness: 0.82 },
  /* In verticale il ritaglio sta tra la parete e l'impasto: atmosfera, non soggetto */
  { out: "public/images/experience-bg-mobile.webp", width: 900, height: 1600, focusX: 0.6, brightness: 0.72 },
];

for (const v of variants) {
  const src = sharp(SRC);
  const { width: sw, height: sh } = await src.metadata();
  /* scala per coprire l'altezza, poi ritaglia una fascia centrata su focusX */
  const scale = Math.max(v.width / sw, v.height / sh);
  const scaledW = Math.round(sw * scale);
  const scaledH = Math.round(sh * scale);
  const left = Math.min(Math.max(Math.round(scaledW * v.focusX - v.width / 2), 0), scaledW - v.width);
  const top = Math.max(Math.round((scaledH - v.height) / 2), 0);

  await src
    .resize(scaledW, scaledH)
    .extract({ left, top, width: v.width, height: v.height })
    .modulate({ brightness: v.brightness })
    .webp({ quality: 68, effort: 6 })
    .toFile(v.out);
  const meta = await sharp(v.out).metadata();
  console.log(v.out, meta.width, meta.height);
}
