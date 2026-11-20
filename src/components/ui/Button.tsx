import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "glass" | "signal";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-pill px-5 text-sm font-medium " +
  "transition-[transform,box-shadow,background-color] duration-200 ease-abissal active:scale-[0.97] " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-accent-hi";

const variants: Record<Variant, string> = {
  // Branco sobre preto, como o CTA da Apple: a ação principal da tela.
  primary: "bg-ink text-bg-abyss hover:shadow-[0_0_0_4px_rgb(245_245_247/0.12)]",
  // Ação secundária, em vidro.
  glass: "glass text-ink hover:bg-white/12",
  // Ação "de terminal": mono, borda de sinal, brilho ao passar o mouse.
  signal:
    "border border-accent-hi/50 bg-transparent font-mono text-xs text-accent-hi hover:shadow-[0_0_20px_rgb(156_196_255/0.3)]",
};

type Common = { variant?: Variant; className?: string; children: ReactNode };
type AsLink = Common & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "children">;
type AsButton = Common & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

/** Botão em pílula; com `href` vira link (<a>), sem `href` é <button>. */
export function Button(props: AsLink | AsButton) {
  if (props.href !== undefined) {
    const { variant = "primary", className, children, ...rest } = props;
    return (
      <a className={cn(base, variants[variant], className)} {...rest}>
        {children}
      </a>
    );
  }
  const { variant = "primary", className, children, type = "button", ...rest } = props;
  return (
    <button type={type} className={cn(base, variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
