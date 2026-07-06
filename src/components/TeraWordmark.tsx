import Image from "next/image";

type TeraWordmarkProps = {
  className?: string;
  compact?: boolean;
  priority?: boolean;
};

export default function TeraWordmark({ className = "", compact = false, priority = false }: TeraWordmarkProps) {
  return (
    <div className={`relative ${compact ? "h-[clamp(4rem,12vw,7rem)]" : "h-[clamp(5.2rem,18vw,10rem)]"} ${className}`} aria-label="TERA Pura Natura">
      <Image
        src="/images/tera-logo-transparent.png"
        alt="Logo TERA Pura Natura"
        fill
        priority={priority}
        className="object-contain object-left drop-shadow-[0_24px_80px_rgba(0,0,0,0.28)]"
        sizes={compact ? "(max-width: 1024px) 88vw, 512px" : "(max-width: 768px) 88vw, 736px"}
      />
    </div>
  );
}
