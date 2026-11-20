"use client";

import { motion, type MotionValue, useTransform } from "motion/react";
import { ScrollStage } from "@/components/motion/ScrollStage";
import { Container } from "@/components/ui/Container";
import { SerifStatement } from "@/components/ui/SerifStatement";

/** A frase surge entre 25% e 60% do palco, enquanto o orbe vira eclipse atrás dela. */
function Statement({ progress, text }: { progress: MotionValue<number>; text: string }) {
  const opacity = useTransform(progress, [0.25, 0.6], [0, 1]);
  const y = useTransform(progress, [0.25, 0.6], [24, 0]);
  return (
    <motion.div style={{ opacity, y }}>
      <SerifStatement text={text} className="mx-auto max-w-[18ch] text-center" />
    </motion.div>
  );
}

/** Expansão (spec §5.2): palco de 160vh (120vh no celular) com a frase F1 no centro do eclipse. */
export function Expansion({ text }: { text: string }) {
  return (
    <ScrollStage data-expansion="" heightVh={160} mobileHeightVh={120}>
      {(progress) => (
        <Container>
          <Statement progress={progress} text={text} />
        </Container>
      )}
    </ScrollStage>
  );
}
