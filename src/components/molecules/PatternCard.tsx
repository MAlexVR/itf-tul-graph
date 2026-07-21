import { Badge } from "@/components/atoms/Badge";

export function PatternCard({ name, movements, active, onClick }: { name: string; movements: number; active: boolean; onClick: () => void }) {
  return <button className={`pattern-card ${active ? "pattern-card--active" : ""}`} onClick={onClick}><span>{name}</span><Badge tone={active ? "gold" : "slate"}>{movements} mov.</Badge></button>;
}
