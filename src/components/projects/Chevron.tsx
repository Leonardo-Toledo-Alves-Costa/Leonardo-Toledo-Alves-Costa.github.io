import { cn } from "@/lib/cn";

/** Seta pequena em SVG (tamanho fixo, independente da fonte): "esta pílula abre algo". */
export function Chevron({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 10 6"
      className={cn("inline-block size-2.5 shrink-0", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 1l4 4 4-4" />
    </svg>
  );
}
