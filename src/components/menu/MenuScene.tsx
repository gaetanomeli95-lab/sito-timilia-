import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { menuCategories, type MenuCategory, type MenuItem } from "@/data/menuData";
import { previewImages, categoryDescriptions } from "@/data/menuMeta";

const FULL_MENU_URL = "https://www.leggimenu.it/menu/7hp45fal81p1";

function normalizeMenuText(value?: string) {
  if (!value) return value ?? "";
  return value
    .replace(/ROTUNDO/g, "ROTONDO")
    .replace(/Rotundo/g, "Rotondo")
    .replace(/rotundo/g, "rotondo")
    .replace(/ROTUNDI/g, "ROTONDI")
    .replace(/Rotundi/g, "Rotondi")
    .replace(/rotundi/g, "rotondi");
}

function getCategory(id: string) {
  const category = menuCategories.find((item) => item.id === id);
  if (!category) return undefined;

  return {
    ...category,
    title: normalizeMenuText(category.title),
    subtitle: normalizeMenuText(category.subtitle),
    items: category.items.map((item) => ({
      ...item,
      name: normalizeMenuText(item.name),
      description: normalizeMenuText(item.description),
      note: normalizeMenuText(item.note),
    })),
  } satisfies MenuCategory;
}

const impasti = getCategory("impasti");
const passi = getCategory("passi-dautore");
const classiche = getCategory("le-classiche");

const impastoImages: Record<string, string> = {
  CONTEMPORANEO: "/images/menu-hero.jpg",
  "SENZA GLUTINE": "/images/tera-experience.png",
  "ROTONDO IN CASSERUOLA": "/images/ambient-experience-2.png",
  CRUSTA: "/images/menu/nuovo-crusta-timpulata.png",
};

const showcaseCategoryIds = [
  "antipasti",
  "buffalotti",
  "le-vegane",
  "rotundi-casseruola",
  "insalate",
  "hamburger",
  "dolci",
  "bevande",
];

const showcaseCategories = showcaseCategoryIds
  .map(getCategory)
  .filter((category): category is MenuCategory => Boolean(category));

function SectionHeading({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy?: string;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.34em] text-gold/80 sm:text-xs">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-light tracking-[-0.02em] text-[#f5f0e8] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {copy && (
        <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-7 text-[#f5f0e8]/55 sm:text-base sm:leading-8">
          {copy}
        </p>
      )}
    </div>
  );
}

function PlaceholderVisual({ label }: { label: string }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_25%,rgba(200,169,126,0.2),transparent_35%),linear-gradient(145deg,#17120d,#0a0907)]">
      <div className="text-center">
        <div className="mx-auto mb-4 h-px w-14 bg-gold/35" />
        <span className="text-[10px] uppercase tracking-[0.28em] text-[#f5f0e8]/35">
          {label}
        </span>
      </div>
    </div>
  );
}

function PizzaCard({ item, index }: { item: MenuItem; index: number }) {
  const image = item.image || item.images?.[0];

  return (
    <article className="group overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-white/[0.025] shadow-[0_24px_80px_rgba(0,0,0,0.2)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <PlaceholderVisual label="Scatto in arrivo" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907]/88 via-transparent to-transparent" />
        <span className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[9px] uppercase tracking-[0.24em] text-white/55 backdrop-blur-md">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="p-5 sm:p-6">
        <h3 className="text-xl font-light tracking-wide text-[#f5f0e8]">{item.name}</h3>
        {item.description && (
          <p className="mt-3 text-sm font-light leading-6 text-[#f5f0e8]/52">
            {item.description}
          </p>
        )}
      </div>
    </article>
  );
}

function ShowcaseCard({ category, index }: { category: MenuCategory; index: number }) {
  const image = previewImages[category.id] || category.items.find((item) => item.image)?.image;
  const description = normalizeMenuText(
    categoryDescriptions[category.id] || category.subtitle || "Una delle anime del menu Timilia."
  );
  const names = category.items.slice(0, 4).map((item) => normalizeMenuText(item.name));

  return (
    <article className="group relative min-h-[380px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#100d0a] sm:min-h-[440px]">
      {image ? (
        <Image
          src={image}
          alt={category.title}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      ) : (
        <PlaceholderVisual label="Immagine categoria in arrivo" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080706] via-[#080706]/58 to-black/5" />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
        <div className="mb-4 flex items-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.3em] text-gold/75">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="h-px w-10 bg-gold/30" />
        </div>
        <h3 className="text-2xl font-light text-[#f5f0e8] sm:text-3xl">{category.title}</h3>
        <p className="mt-3 max-w-xl text-sm font-light leading-6 text-[#f5f0e8]/58">
          {description}
        </p>
        {names.length > 0 && (
          <p className="mt-5 text-xs font-light leading-6 text-[#f5f0e8]/38">
            {names.join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}

export default function MenuScene() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#0b0907] text-[#f5f0e8]">
      <section className="relative min-h-[88svh] overflow-hidden">
        <Image
          src="/images/menu-hero.jpg"
          alt="Timilia, pizza contemporanea a Palermo"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090705]/94 via-[#090705]/58 to-[#090705]/16" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0907] via-transparent to-black/25" />

        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl flex-col px-5 pb-14 pt-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-white/55 transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Torna a Timilia
            </Link>
            <span className="text-[10px] uppercase tracking-[0.38em] text-gold/75">Menu · Vetrina</span>
          </div>

          <div className="mt-auto max-w-4xl pb-8 sm:pb-14">
            <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.36em] text-gold/85 sm:text-xs">
              Timilia · Via Maqueda · Palermo
            </p>
            <h1 className="max-w-4xl text-5xl font-light leading-[0.96] tracking-[-0.04em] sm:text-7xl lg:text-[7.4rem]">
              Il menu Timilia.
              <span className="mt-2 block text-gold">Non un listino.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base font-light leading-8 text-white/62 sm:text-lg">
              Una selezione editoriale per raccontare impasti, pizze e identità. Per prezzi, allergeni e disponibilità aggiornate trovi sempre il menu digitale completo.
            </p>
            <a
              href={FULL_MENU_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-gold/10 px-6 py-3 text-[10px] font-medium uppercase tracking-[0.24em] text-gold transition-all hover:bg-gold hover:text-[#0b0907]"
            >
              Menu completo
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      <section className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="01 · La scelta prima della pizza"
            title="Quattro modi di vivere l’impasto."
            copy="Contemporaneo, Crusta, Rotondo in casseruola e senza glutine: non semplici varianti, ma quattro identità diverse da cui comincia l’esperienza Timilia."
          />

          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:mt-20">
            {impasti?.items.map((item, index) => {
              const image = impastoImages[item.name];
              return (
                <article
                  key={item.name}
                  className="group relative min-h-[430px] overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#11100d] sm:min-h-[500px]"
                >
                  {image ? (
                    <Image
                      src={image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-[1.035]"
                      sizes="(max-width: 900px) 100vw, 50vw"
                    />
                  ) : (
                    <PlaceholderVisual label="Immagine impasto in arrivo" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090705]/96 via-[#090705]/42 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                    <span className="text-[9px] uppercase tracking-[0.3em] text-gold/75">
                      Impasto {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 text-3xl font-light sm:text-4xl">{item.name}</h3>
                    <p className="mt-4 max-w-xl text-sm font-light leading-7 text-white/58">
                      {item.description}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y border-white/[0.06] bg-white/[0.018] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="02 · Ricerca"
            title="Passi d’Autore. Tutti."
            copy="Le pizze in cui Timilia alza il volume della ricerca: ingredienti, equilibrio e costruzione. Qui le mostriamo tutte, senza trasformarle in un listino prezzi."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3 lg:mt-20">
            {passi?.items.map((item, index) => (
              <PizzaCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="03 · Memoria"
            title="Le Classiche, secondo Timilia."
            copy="I nomi che conosciamo da sempre restano tutti presenti. La differenza sta nell’impasto, nella materia prima e nel modo in cui arrivano al tavolo."
          />
          <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3 lg:mt-20">
            {classiche?.items.map((item, index) => (
              <PizzaCard key={item.name} item={item} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-5 py-24 sm:px-8 sm:py-32 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="04 · Oltre la pizza"
            title="Le altre anime di Timilia."
            copy="Una sola immagine per categoria, pochi indizi e nessun prezzo. Il resto si scopre al tavolo — oppure nel menu digitale completo."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-2 lg:mt-20">
            {showcaseCategories.map((category, index) => (
              <ShowcaseCard key={category.id} category={category} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden border-t border-white/[0.06] px-5 py-28 sm:px-8 sm:py-36 lg:px-12">
        <Image
          src="/images/ambient-experience.png"
          alt="L'atmosfera Timilia"
          fill
          className="object-cover opacity-28"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#0b0907]/82" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(200,169,126,0.16),transparent_42%)]" />

        <div className="relative z-10 mx-auto max-w-4xl text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.34em] text-gold/80 sm:text-xs">
            Il menu vivo è altrove
          </p>
          <h2 className="mt-5 text-4xl font-light tracking-[-0.03em] sm:text-6xl lg:text-7xl">
            Qui raccontiamo Timilia.
            <span className="mt-2 block text-gold">Lì trovi tutto.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm font-light leading-7 text-white/55 sm:text-base sm:leading-8">
            Prezzi, allergeni, disponibilità e l’intera carta sono sempre aggiornati sul menu digitale ufficiale.
          </p>
          <a
            href={FULL_MENU_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-9 inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#0b0907] transition-transform hover:scale-[1.025]"
          >
            Apri il menu completo
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
