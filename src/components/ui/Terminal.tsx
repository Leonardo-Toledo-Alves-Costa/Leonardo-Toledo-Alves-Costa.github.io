import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type TerminalProps = {
  prompt?: string;
  /** Com `command`, o terminal mostra a linha do comando e o conteúdo (saída) abaixo. */
  command?: string;
  className?: string;
  children: ReactNode;
};

/** Bloco de terminal: prompt em verde e conteúdo em mono. */
export function Terminal({ prompt = ">", command, className, children }: TerminalProps) {
  const promptEl = (
    <span aria-hidden className="mr-2 select-none text-accent-hi">
      {prompt}
    </span>
  );
  return (
    <div
      data-terminal=""
      className={cn(
        "border border-accent-hi/25 bg-bg-deep font-mono text-sm leading-relaxed text-ink",
        // Raio e espaçamento padrão só se quem usa não definir outros.
        !/\brounded-/.test(className ?? "") && "rounded-xl",
        !/\bp-/.test(className ?? "") && "p-4",
        className,
      )}
    >
      {command ? (
        <>
          <p>
            {promptEl}
            {command}
          </p>
          {children}
        </>
      ) : (
        <>
          {promptEl}
          {children}
        </>
      )}
    </div>
  );
}
