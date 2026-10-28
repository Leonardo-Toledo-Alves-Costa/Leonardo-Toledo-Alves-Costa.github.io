import { profile } from "@/content/profile";
import { Section } from "./Section";
import type { SectionProps } from "./types";

// Estrutura inicial (Task 7); o terminal de contato vem na Task 13.
export function Contact({ dict }: SectionProps) {
  return (
    <Section id="contact" index="07" label={dict.nav.contact} title={dict.sections.contact}>
      <p className="mt-6">
        <a href={`mailto:${profile.email}`} className="text-signal hover:underline">
          {profile.email}
        </a>
      </p>
    </Section>
  );
}
