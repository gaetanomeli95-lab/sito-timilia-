type IconProps = { className?: string; size?: number };

export function GlutenFreeIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Wheat stalk */}
      <path d="M12 22V8" />
      <path d="M12 8c0-2 1-4 3-5-0.5 2-1.5 3.5-3 4z" />
      <path d="M12 8c0-2-1-4-3-5 0.5 2 1.5 3.5 3 4z" />
      <path d="M12 13c0-1.5 1-3 3-3.5-0.3 1.8-1.3 3-3 3.2z" />
      <path d="M12 13c0-1.5-1-3-3-3.5 0.3 1.8 1.3 3 3 3.2z" />
      <path d="M12 18c0-1.5 1-3 3-3.5-0.3 1.8-1.3 3-3 3.2z" />
      <path d="M12 18c0-1.5-1-3-3-3.5 0.3 1.8 1.3 3 3 3.2z" />
      {/* Slash */}
      <line x1="5" y1="3" x2="19" y2="21" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

export function GlutenOptionIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Wheat stalk */}
      <path d="M12 21V7" />
      <path d="M12 7c0-2 1-4 3-5-0.5 2-1.5 3.5-3 4z" />
      <path d="M12 7c0-2-1-4-3-5 0.5 2 1.5 3.5 3 4z" />
      <path d="M12 12c0-1.5 1-3 3-3.5-0.3 1.8-1.3 3-3 3.2z" />
      <path d="M12 12c0-1.5-1-3-3-3.5 0.3 1.8 1.3 3 3 3.2z" />
      <path d="M12 17c0-1.5 1-3 3-3.5-0.3 1.8-1.3 3-3 3.2z" />
      <path d="M12 17c0-1.5-1-3-3-3.5 0.3 1.8 1.3 3 3 3.2z" />
      {/* Small + badge */}
      <circle cx="18.5" cy="6.5" r="3.5" fill="currentColor" stroke="none" opacity={0.9} />
      <path d="M18.5 5v3M17 6.5h3" stroke="#0c0a08" strokeWidth={1.4} />
    </svg>
  );
}

export function LactoseFreeIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Milk carton / drop shape */}
      <path d="M8 3h8l-1 3v14a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V6L8 3z" />
      <path d="M8 3h8" />
      <path d="M10 9h4" />
      {/* Slash */}
      <line x1="5" y1="3" x2="19" y2="21" stroke="currentColor" strokeWidth={2} />
    </svg>
  );
}

export function LactoseOptionIcon({ className = "", size = 16 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Milk carton */}
      <path d="M8 3h8l-1 3v14a1 1 0 0 1-1 1H10a1 1 0 0 1-1-1V6L8 3z" />
      <path d="M8 3h8" />
      <path d="M10 9h4" />
      {/* Small + badge */}
      <circle cx="18.5" cy="6.5" r="3.5" fill="currentColor" stroke="none" opacity={0.9} />
      <path d="M18.5 5v3M17 6.5h3" stroke="#0c0a08" strokeWidth={1.4} />
    </svg>
  );
}

type DietaryType = "gf" | "gf-option" | "lf" | "lf-option" | "bread-gf";

export function DietaryIcon({ type, className, size }: { type: DietaryType; className?: string; size?: number }) {
  switch (type) {
    case "gf":
      return <GlutenFreeIcon className={className} size={size} />;
    case "gf-option":
      return <GlutenOptionIcon className={className} size={size} />;
    case "lf":
      return <LactoseFreeIcon className={className} size={size} />;
    case "lf-option":
      return <LactoseOptionIcon className={className} size={size} />;
    case "bread-gf":
      return <GlutenFreeIcon className={className} size={size} />;
    default:
      return null;
  }
}
