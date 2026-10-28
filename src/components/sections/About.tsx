import { profile } from "@/content/profile";
import { Section } from "./Section";
import type { SectionProps } from "./types";

export function About({ locale, dict }: SectionProps) {
  return (
    <Section tone="raised" id="about" index="02" label={dict.nav.about} title={dict.sections.about}>
      <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-text-2">{profile.bio[locale]}</p>
    </Section>
  );
}
