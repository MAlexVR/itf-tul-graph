export function CategoryCard({ label, count, tone, active, onClick }: { label: string; count: number; tone: string; active: boolean; onClick: () => void }) {
  return <button className={`category-chip category-chip--${tone} ${active ? "category-chip--active" : ""}`} onClick={onClick} aria-pressed={active} aria-label={`${label}: ${count} técnicas`}><span>{label}</span><strong>{count}</strong></button>;
}
