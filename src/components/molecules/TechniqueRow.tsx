import { categoryClass } from "@/lib/categories";
import type { Language, Movement, MovementTechnique } from "@/lib/types";

export function TechniqueRow({ movement, language, techniques }: { movement: Movement; language: Language; techniques?: MovementTechnique[] }) {
  const entries = techniques?.length ? techniques : movement.tecnicas?.length ? movement.tecnicas : [movement];
  return <li className={`technique-row technique-row--${categoryClass(entries[0].categoria)}`}><span className="movement-number">{movement.movimiento}</span><span className="technique-copy">{entries.map((entry) => {
    const text = language === "korean" ? entry.coreano : language === "spanish" ? entry.espanol : `${entry.coreano} — ${entry.espanol}`;
    return <span className="technique-entry" key={`${entry.coreano}-${entry.espanol}`}><strong>{text}</strong><small>{entry.categoria}</small></span>;
  })}</span></li>;
}
