"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";
import type { SkillLevel } from "@/content/types";

/** Demonstração do Chip clicável (o mesmo comportamento da placa de stack). */
export function ChipToggle({ items }: { items: { id: string; label: string; level: SkillLevel }[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <Chip
          key={item.id}
          level={item.level}
          selected={selected === item.id}
          onClick={() => setSelected((current) => (current === item.id ? null : item.id))}
        >
          {item.label}
        </Chip>
      ))}
    </div>
  );
}
