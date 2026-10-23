/* A cached tile preserves the paper texture without SVG filters or blending
   entire sections into offscreen surfaces while the page scrolls. */
export default function Grain({ light = false }: { light?: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.07]"
      style={{ backgroundImage: `url(/images/tera-grain${light ? "-light" : ""}.png)`, backgroundSize: "128px 128px" }}
    />
  );
}
