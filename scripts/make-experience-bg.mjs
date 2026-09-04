/* Rigenera i fondali WebP della sezione "L'esperienza Timilia" dalla foto della facciata.
   Uso: node scripts/make-experience-bg.mjs */
import sharp from "sharp";

const SRC = "public/images/ambient-experience.jpg";

const variants = [
  { out: "public/images/experience-bg-desktop.webp", width: 1600, height: 900, position: "centre" },
  { out: "public/images/experience-bg-mobile.webp", width: 900, height: 1600, position: "centre" },
];

for (const v of variants) {
  await sharp(SRC)
    .resize(v.width, v.height, { fit: "cover", position: v.position })
    .blur(2.2)
    .modulate({ brightness: 0.62, saturation: 0.85 })
    .webp({ quality: 62, effort: 6 })
    .toFile(v.out);
  const meta = await sharp(v.out).metadata();
  console.log(v.out, meta.width, meta.height, meta.size, "bytes");
}
