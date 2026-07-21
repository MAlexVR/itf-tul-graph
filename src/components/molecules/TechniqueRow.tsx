import type { Language, Movement } from "@/lib/types";

const categoryTone: Record<string, string> = {
  "Makgi / bloqueo o defensa": "defense",
  "Jirugi / puñetazo o ataque de puño": "punch",
  "Taerigi / golpe": "strike",
  "Tulgi / estocada": "thrust",
  "Chagi / patada": "kick",
};

export function categoryClass(category: string) { return categoryTone[category] ?? "other"; }

export function TechniqueRow({ movement, language }: { movement: Movement; language: Language }) {
  const text = language === "korean" ? movement.coreano : language === "spanish" ? movement.espanol : `${movement.coreano} — ${movement.espanol}`;
  return <li className={`technique-row technique-row--${categoryClass(movement.categoria)}`}><span className="movement-number">{movement.movimiento}</span><span className="technique-copy"><strong>{text}</strong><small>{movement.categoria}</small></span></li>;
}
