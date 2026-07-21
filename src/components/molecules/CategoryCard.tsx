export function CategoryCard({ label, count, tone, active, onClick }: { label: string; count: number; tone: string; active: boolean; onClick: () => void }) {
  return <button className={`category-card category-card--${tone} ${active ? "category-card--active" : ""}`} onClick={onClick} aria-pressed={active}><span>{label}</span><strong>{count}</strong><small>técnicas</small></button>;
}
