import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "ghost";

const base =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-3 rounded-pill text-sm font-medium " +
  "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-abissal active:scale-[0.97]";

const variants: Record<ButtonVariant, string> = {
  // Pílula clara (insp. Lunetra/Obelisk): a ação principal da tela.
  primary: "bg-ink text-bg-abyss hover:shadow-[0_0_0_4px_rgb(238_243_250/0.14),0_0_32px_rgb(47_123_255/0.35)]",
  // Contorno fino sobre o escuro: ações secundárias.
  ghost: "border border-line bg-transparent text-ink hover:border-ink-dim hover:bg-ink/5",
};

/** Seta dentro de um círculo, do lado direito do texto. */
function ArrowIcon({ variant }: { variant: ButtonVariant }) {
  return (
    <span
      data-icon=""
      aria-hidden
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full",
        variant === "primary" ? "bg-bg-abyss text-ink" : "border border-line text-ink",
      )}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3.5 8h9M8.5 4l4 4-4 4" />
      </svg>
    </span>
  );
}

type Common = { variant?: ButtonVariant; icon?: "arrow" | "none"; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

/** Botão em pílula; com `href` vira link (<a>), sem `href` é <button>. Com ícone, o padding direito encolhe para o círculo. */
export function Button(props: AsLink | AsButton) {
  const look = (variant: ButtonVariant, icon: "arrow" | "none", className: string | undefined) =>
    cn(base, variants[variant], icon === "arrow" ? "py-1.5 pr-1.5 pl-5" : "px-5", className);
  const inner = (variant: ButtonVariant, icon: "arrow" | "none", children: ReactNode) => (
    <>
      <span>{children}</span>
      {icon === "arrow" && <ArrowIcon variant={variant} />}
    </>
  );
  if (props.href !== undefined) {
    const { variant = "primary", icon = "none", className, children, ...rest } = props;
    return (
      <a data-variant={variant} className={look(variant, icon, className)} {...rest}>
        {inner(variant, icon, children)}
      </a>
    );
  }
  const { variant = "primary", icon = "none", className, children, type = "button", ...rest } = props;
  return (
    <button data-variant={variant} type={type} className={look(variant, icon, className)} {...rest}>
      {inner(variant, icon, children)}
    </button>
  );
}
