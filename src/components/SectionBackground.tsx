import Image from "next/image";

type SectionBackgroundProps = {
  src: string;
  alt?: string;
};

export default function SectionBackground({
  src,
  alt = "Sfondo",
}: SectionBackgroundProps) {
  return (
    <div
      className="absolute inset-0"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.5) 12%, rgba(5,5,5,0.5) 88%, rgba(5,5,5,0.92) 100%)",
        }}
      />
      <div className="section-glow" />
    </div>
  );
}
