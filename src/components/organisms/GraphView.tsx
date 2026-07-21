import { categoryClass } from "@/components/molecules/TechniqueRow";
import type { Language, Movement, Stance } from "@/lib/types";

type TechniqueNode = Movement & { numbers: number[] };

function textFor(item: Pick<Movement, "coreano" | "espanol">, language: Language) {
  return language === "korean" ? item.coreano : language === "spanish" ? item.espanol : `${item.coreano} — ${item.espanol}`;
}

function wrap(value: string, width: number) {
  const lines: string[] = [];
  let line = "";
  value.split(/\s+/).forEach((word) => {
    const next = `${line} ${word}`.trim();
    if (line && next.length > width) { lines.push(line); line = word; } else { line = next; }
  });
  if (line) lines.push(line);
  return lines;
}

function SvgText({ value, x, y, width, className = "" }: { value: string; x: number; y: number; width: number; className?: string }) {
  const lines = wrap(value, width);
  const first = y - ((lines.length - 1) * 7);
  return <text className={className} x={x} y={first} textAnchor="middle">{lines.map((line, index) => <tspan key={`${line}-${index}`} x={x} dy={index ? 14 : 0}>{line}</tspan>)}</text>;
}

export function GraphView({ tul, movements, stance, language }: { tul: string; movements: Movement[]; stance: Stance; language: Language }) {
  const nodes = Object.values(movements.reduce<Record<string, TechniqueNode>>((result, movement) => {
    const key = `${movement.coreano}\u0000${movement.espanol}`;
    if (!result[key]) result[key] = { ...movement, numbers: [] };
    result[key].numbers.push(movement.movimiento);
    return result;
  }, {}));
  const height = Math.max(410, nodes.length * 92 + 90);
  const centerY = height / 2;
  const finalX = 1015;

  return <section className="graph-panel" aria-label={`Grafo de relaciones de ${tul}`}>
    <div className="graph-intro"><div><span className="eyebrow">Vista de grafo</span><h3>Relaciones técnicas de {tul}</h3></div><span>Un nodo por técnica; las conexiones indican los movimientos que la ejecutan.</span></div>
    <div className="graph-scroll"><svg className="technique-graph" viewBox={`0 0 1180 ${height}`} role="img" aria-label={`Relaciones entre ${tul}, sus posturas y técnicas`}>
      <defs><marker id="graph-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#697991" /></marker></defs>
      <path className="graph-edge graph-edge--stance" d={`M 205 ${centerY} L 280 ${centerY}`} markerEnd="url(#graph-arrow)" />
      <path className="graph-edge graph-edge--stance" d={`M 405 ${centerY} C 620 ${centerY}, 810 ${centerY}, 895 ${centerY}`} markerEnd="url(#graph-arrow)" />
      <g className="graph-stance"><rect x="20" y={centerY - 54} width="185" height="108" rx="12" /><SvgText value={`Inicio: ${stance.inicio_detalle}`} x={112} y={centerY} width={27} /></g>
      <g className="graph-tul"><rect x="280" y={centerY - 34} width="125" height="68" rx="34" /><SvgText value={tul} x={342} y={centerY} width={18} className="graph-tul-label" /></g>
      {nodes.map((node, index) => {
        const y = 50 + index * ((height - 100) / Math.max(nodes.length - 1, 1));
        const tone = categoryClass(node.categoria);
        return <g key={`${node.coreano}-${node.espanol}`}><path className={`graph-edge graph-edge--${tone}`} d={`M 405 ${centerY} C 485 ${centerY}, 520 ${y}, 570 ${y}`} markerEnd="url(#graph-arrow)"><title>Movimientos: {node.numbers.join(", ")}</title></path><g className={`graph-tech graph-tech--${tone}`}><rect x="570" y={y - 32} width="330" height="64" rx="12"><title>{`${textFor(node, language)} · movimientos ${node.numbers.join(", ")}`}</title></rect><SvgText value={textFor(node, language)} x={735} y={y - 7} width={47} /><text className="graph-moves" x="735" y={y + 17} textAnchor="middle">Movimientos {node.numbers.join(", ")}</text></g></g>;
      })}
      <g className="graph-stance"><rect x={finalX - 120} y={centerY - 54} width="265" height="108" rx="12" /><SvgText value={`Finalización: ${stance.final_detalle}`} x={finalX + 12} y={centerY} width={38} /></g>
      <text className="graph-edge-label" x="850" y={centerY - 14} textAnchor="middle">Finaliza en</text>
    </svg></div>
  </section>;
}
