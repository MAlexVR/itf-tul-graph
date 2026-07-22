export const ALL_CATEGORIES = "__all__";
export const OTHER_CATEGORY = "__other__";

export const categoryGroups = [
  { value: "Makgi / bloqueo o defensa", label: "Makgi / defensa", tone: "defense" },
  { value: "Jirugi / puñetazo o ataque de puño", label: "Jirugi / ataque de puño", tone: "punch" },
  { value: "Taerigi / golpe", label: "Taerigi / golpe", tone: "strike" },
  { value: "Tulgi / estocada", label: "Tulgi / estocada", tone: "thrust" },
  { value: "Chagi / patada", label: "Chagi / patada", tone: "kick" },
] as const;

export const otherCategoryGroup = { value: OTHER_CATEGORY, label: "Otra técnica o transición", tone: "other" } as const;

const toneByCategory = new Map<string, string>(categoryGroups.map((group) => [group.value, group.tone]));

export function categoryClass(category: string) {
  return toneByCategory.get(category) ?? "other";
}

export function categoryMatchesFilter(category: string, filter: string) {
  if (filter === ALL_CATEGORIES) return true;
  if (filter === OTHER_CATEGORY) return !toneByCategory.has(category);
  return category === filter;
}
