"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/atoms/Badge";
import { SelectField } from "@/components/atoms/SelectField";
import { StatCard } from "@/components/atoms/StatCard";
import { CategoryCard } from "@/components/molecules/CategoryCard";
import { PatternCard } from "@/components/molecules/PatternCard";
import { TechniqueRow } from "@/components/molecules/TechniqueRow";
import { patternDetails } from "@/lib/pattern-details";
import type { GraphData, Language, Movement } from "@/lib/types";

const all = "__all__";
const other = "__other__";
const categoryGroups = [
  { value: "Makgi / bloqueo o defensa", label: "Makgi / defensa", tone: "defense" },
  { value: "Jirugi / puñetazo o ataque de puño", label: "Jirugi / ataque de puño", tone: "punch" },
  { value: "Taerigi / golpe", label: "Taerigi / golpe", tone: "strike" },
  { value: "Tulgi / estocada", label: "Tulgi / estocada", tone: "thrust" },
  { value: "Chagi / patada", label: "Chagi / patada", tone: "kick" },
  { value: other, label: "Otra técnica o transición", tone: "other" },
] as const;
function techniqueKey(item: Pick<Movement, "coreano" | "espanol">) { return `${item.coreano}\u0000${item.espanol}`; }
function display(item: Pick<Movement, "coreano" | "espanol">, language: Language) { return language === "korean" ? item.coreano : language === "spanish" ? item.espanol : `${item.coreano} — ${item.espanol}`; }
function matchesCategory(item: Pick<Movement, "categoria">, value: string) { return value === all || (value === other ? !categoryGroups.slice(0, 5).some((group) => group.value === item.categoria) : item.categoria === value); }

export function Explorer({ data }: { data: GraphData }) {
  const [tul, setTul] = useState("Chon-Ji");
  const [category, setCategory] = useState(all);
  const [technique, setTechnique] = useState(all);
  const [language, setLanguage] = useState<Language>("both");
  const categoryCounts = useMemo(() => Object.fromEntries(categoryGroups.map((group) => [group.value, data.techniques.filter((item) => matchesCategory(item, group.value)).length])), [data]);
  const basicCount = data.tules.filter((name) => name.startsWith("Saju ")).length;
  const tulCount = data.tules.length - basicCount;
  const movementCount = Object.values(data.sequences).flat().length;
  const selected = data.sequences[tul] ?? [];
  const visible = selected.filter((item) => matchesCategory(item, category) && (technique === all || techniqueKey(item) === technique));
  const detail = patternDetails[tul];
  const stance = data.stances[tul];
  const clear = () => { setCategory(all); setTechnique(all); };

  return <main className="shell">
    <section className="hero" aria-labelledby="title">
      <div><Badge tone="gold">Explorador técnico ITF</Badge><h1 id="title">De la figura al detalle, sin perder el contexto.</h1><p>Consulta las figuras básicas y los tules con su secuencia, posturas, significado y terminología en coreano y español.</p></div>
      <aside className="source-note"><strong>Fuente editorial</strong><span>Manual de Teoría y Programa Técnico de Taekwon-Do ITF · ACITF · cuaderno de NotebookLM</span></aside>
    </section>

    <section className="stats-grid" aria-label="Cobertura del inventario"><StatCard value={basicCount} label="figuras básicas (Saju)" /><StatCard value={tulCount} label="tules" /><StatCard value={movementCount} label="movimientos" /><StatCard value={data.techniques.length} label="técnicas canónicas" /></section>

    <section className="filter-panel" aria-label="Filtros de exploración">
      <div className="filter-heading"><strong>Explora paso a paso</strong><span>Elige opciones de las listas; el contenido se adapta automáticamente.</span></div>
      <div className="filter-grid">
        <SelectField label="Figura o tul" value={tul} onChange={(event) => { setTul(event.target.value); clear(); }}>{data.tules.map((name) => <option key={name}>{name}</option>)}</SelectField>
        <SelectField label="Tipo técnico" value={category} onChange={(event) => { setCategory(event.target.value); setTechnique(all); }}><option value={all}>Todos los tipos</option>{categoryGroups.map((group) => <option key={group.value} value={group.value}>{group.label}</option>)}</SelectField>
        <SelectField label="Técnica" value={technique} onChange={(event) => setTechnique(event.target.value)}><option value={all}>Todas las técnicas</option>{data.techniques.filter((item) => matchesCategory(item, category)).map((item) => <option key={techniqueKey(item)} value={techniqueKey(item)}>{display(item, language)}</option>)}</SelectField>
        <SelectField label="Terminología" value={language} onChange={(event) => setLanguage(event.target.value as Language)}><option value="both">Coreano y español</option><option value="korean">Solo coreano</option><option value="spanish">Solo español</option></SelectField>
      </div>
      <button className="clear-button" onClick={clear}>Restablecer filtros</button>
    </section>

    <section className="category-cards" aria-label="Resumen por tipo técnico">
      {categoryGroups.map((group) => <CategoryCard key={group.value} label={group.label} count={categoryCounts[group.value]} tone={group.tone} active={category === group.value} onClick={() => { setCategory(group.value); setTechnique(all); }} />)}
    </section>

    <section className="workspace">
      <nav className="pattern-nav" aria-label="Figuras y tules"><div className="section-label">Ruta pedagógica</div>{data.tules.map((name) => <PatternCard key={name} name={name} movements={data.sequences[name].length} active={name === tul} onClick={() => { setTul(name); clear(); }} />)}</nav>
      <article className="detail-panel">
        <header className="pattern-header"><div><Badge tone={detail?.kind === "Figura básica" ? "blue" : "gold"}>{detail?.kind ?? "Tul"}</Badge><h2>{tul}</h2></div><span className="visible-count">{visible.length} de {selected.length} movimientos visibles</span></header>
        <div className="meaning-card"><span className="eyebrow">Significado oficial</span><p>{detail?.meaning}</p><small>{detail?.historicalNote}</small></div>
        <div className="stance-flow"><div><span>Inicio</span><strong>{stance.inicio_detalle}</strong></div><i aria-hidden="true">↓</i><div><span>Finalización</span><strong>{stance.final_detalle}</strong></div></div>
        <div className="legend"><span className="legend-item legend-item--defense">Defensa</span><span className="legend-item legend-item--punch">Puñetazo</span><span className="legend-item legend-item--strike">Golpe</span><span className="legend-item legend-item--thrust">Estocada</span><span className="legend-item legend-item--kick">Patada</span><span className="legend-item legend-item--other">Otra</span></div>
        <section><div className="sequence-heading"><div><span className="eyebrow">Secuencia</span><h3>Movimientos en orden</h3></div><span>Los números conservan el orden original aun al filtrar.</span></div>{visible.length ? <ol className="technique-list">{visible.map((movement) => <TechniqueRow key={`${movement.movimiento}-${movement.coreano}`} movement={movement} language={language} />)}</ol> : <div className="empty-state">No hay movimientos que correspondan a esta combinación de filtros. <button onClick={clear}>Ver todos</button></div>}</section>
      </article>
    </section>
    <footer>Datos técnicos de consulta académica. La terminología y los significados deben contrastarse con el manual institucional antes de publicación editorial.</footer>
  </main>;
}
