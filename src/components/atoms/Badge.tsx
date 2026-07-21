import type { ReactNode } from "react";

export function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "blue" | "gold" }) {
  return <span className={`badge badge--${tone}`}>{children}</span>;
}
