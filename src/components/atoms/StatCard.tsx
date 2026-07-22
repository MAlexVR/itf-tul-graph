export function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <article className="stat">
      <strong>{value}</strong>
      <span>{label}</span>
    </article>
  );
}
