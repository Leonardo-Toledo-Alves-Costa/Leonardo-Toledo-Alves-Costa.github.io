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
    <span aria-hidden className="mr-2 select-none text-signal">
      {prompt}
    </span>
  );
  return (
    <div
      data-terminal=""
      className={cn(
        "border border-signal/25 bg-surface-1 font-mono text-sm leading-relaxed text-text",
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
