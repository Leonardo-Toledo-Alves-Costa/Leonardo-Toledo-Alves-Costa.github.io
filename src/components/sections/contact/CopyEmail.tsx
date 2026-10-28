"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

/**
 * Copia o e-mail e confirma por 2s. Exige JS (fica oculto sem ele — data-requires-js);
 * se o clipboard falhar, abre o cliente de e-mail. O link mailto ao lado sempre funciona.
 */
export function CopyEmail({ email, labels }: { email: string; labels: { copy: string; copied: string } }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  };

  return (
    <>
      <Button variant="signal" data-testid="copy-email" data-requires-js="" onClick={onClick} className="px-4">
        <span aria-hidden>{copied ? "✓" : ">"}</span> {copied ? labels.copied : labels.copy}
      </Button>
      {/* Fora do botão: anuncia só a confirmação, sem duplicar o nome acessível do botão. */}
      <span className="sr-only" aria-live="polite">
        {copied ? labels.copied : ""}
      </span>
    </>
  );
}
