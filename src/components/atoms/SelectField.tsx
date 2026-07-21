import type { ChangeEventHandler, ReactNode } from "react";

export function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: ChangeEventHandler<HTMLSelectElement>; children: ReactNode }) {
  return <label className="select-field"><span>{label}</span><select value={value} onChange={onChange}>{children}</select></label>;
}
