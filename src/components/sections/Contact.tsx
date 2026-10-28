import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Terminal } from "@/components/ui/Terminal";
import { profile } from "@/content/profile";
import { CopyEmail } from "./contact/CopyEmail";
import { Section } from "./Section";
import type { SectionProps } from "./types";

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Uma linha do "handshake": status ✓, canal e destino. */
function Line({ label, children }: { label: string; children: ReactNode }) {
  return (
    <li className="grid grid-cols-[auto_1fr] items-center gap-x-3 sm:grid-cols-[auto_7rem_1fr]">
      <span aria-hidden className="text-signal">
        ✓
      </span>
      <span className="text-text-2">
        {label}
        <span className="sr-only">: </span>
      </span>
      <span className="col-start-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 sm:col-start-auto">{children}</span>
    </li>
  );
}

// Quebra nos separadores (/ e -), nunca no meio de uma palavra.
const link = "inline-flex min-h-11 items-center text-text underline decoration-text-2/60 underline-offset-4 [overflow-wrap:anywhere] hover:decoration-signal";

/** Contato como terminal: e-mail (copiar ou abrir), LinkedIn, GitHub e currículo quando houver. Sem telefone. */
export function Contact({ locale, dict }: SectionProps) {
  const t = dict.contact;
  const cv = profile.cv?.[locale];

  return (
    <Section id="contact" index="07" label={dict.nav.contact} title={dict.sections.contact}>
      <p className="mt-6 max-w-[60ch] text-lg text-text-2">{t.intro}</p>
      <Reveal className="mt-10 max-w-3xl">
        <Terminal command={t.command} className="rounded-panel p-5 sm:p-7">
          {/* Canais bem separados entre si no celular; juntos no desktop, onde ficam em colunas. */}
          <ul className="mt-5 grid gap-5 sm:gap-3">
            <Line label={t.email}>
              <a href={`mailto:${profile.email}`} className={link}>
                {profile.email}
              </a>
              <CopyEmail email={profile.email} labels={{ copy: t.copy, copied: t.copied }} />
            </Line>
            <Line label="linkedin">
              <a href={profile.links.linkedin} {...external} className={link}>
                {profile.links.linkedin.replace(/^https?:\/\//, "")}
              </a>
            </Line>
            <Line label="github">
              <a href={profile.links.github} {...external} className={link}>
                {profile.links.github.replace(/^https?:\/\//, "")}
              </a>
            </Line>
            {cv && (
              <Line label={t.cv}>
                <a href={cv} download className={link}>
                  {cv.split("/").pop()}
                </a>
              </Line>
            )}
          </ul>
        </Terminal>
      </Reveal>
    </Section>
  );
}
