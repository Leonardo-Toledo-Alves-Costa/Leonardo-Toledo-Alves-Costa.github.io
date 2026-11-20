"use client";

import { useState } from "react";
import { Pill } from "@/components/ui/Pill";
import type { SkillLevel } from "@/content/types";

type Item = { id: string; label: string; level: SkillLevel; levelLabel: string };

/** Demonstração da pílula-botão (o mesmo comportamento das pílulas de /projetos). */
export function PillToggle({ items }: { items: Item[] }) {
  const [selected, setSelected] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Pill
          key={item.id}
          as="button"
          level={item.level}
          levelLabel={item.levelLabel}
          pressed={selected === item.id}
          onClick={() => setSelected((current) => (current === item.id ? null : item.id))}
        >
          {item.label}
        </Pill>
      ))}
    </div>
  );
}
