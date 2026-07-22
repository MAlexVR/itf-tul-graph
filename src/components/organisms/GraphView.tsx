import { useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type ReactNode, type WheelEvent } from "react";
import { ALL_CATEGORIES as all, categoryClass, categoryMatchesFilter } from "@/lib/categories";
import type { GraphData, Language, Movement, Stance, Technique } from "@/lib/types";

type TechniqueNode = Movement & { numbers: number[] };
type GraphFilters = { category: string; technique: string };
type Point = { x: number; y: number };
const palette = ["#2d2d83", "#e0a01a", "#008c36", "#e10c1b", "#4a3aa7", "#0e7490", "#65a30d", "#be185d", "#4444ab", "#c2410c", "#0f766e"];

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

function matches(technique: Pick<Technique, "categoria" | "coreano" | "espanol">, filters: GraphFilters) {
  const categoryMatches = categoryMatchesFilter(technique.categoria, filters.category);
  return categoryMatches && (filters.technique === all || filters.technique === `${technique.coreano}\u0000${technique.espanol}`);
}

function InteractiveGraph({ id, label, children }: { id: string; label: string; children: ReactNode }) {
  return <InteractiveGraphCanvas key={id} label={label}>{children}</InteractiveGraphCanvas>;
}

function InteractiveGraphCanvas({ label, children }: { label: string; children: ReactNode }) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [baseScale, setBaseScale] = useState(1);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number; y: number; panX: number; panY: number } | null>(null);
  const pointers = useRef(new Map<number, Point>());
  const pinchStart = useRef<{ distance: number; zoom: number } | null>(null);

  // Fits the graph's natural width (unaffected by the current transform) to the
  // viewport and centers it horizontally, so "100%" always shows the graph
  // centered instead of a native-scale slice cut off to one side. Graphs taller
  // than the viewport still need vertical panning (by design, via drag/pinch) —
  // fitting the full height too would shrink tall graphs to an unreadable size.
  const fitToView = () => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas || !canvas.offsetWidth || !canvas.offsetHeight) return null;
    const scale = Math.min(viewport.clientWidth / canvas.offsetWidth, 1);
    const x = (viewport.clientWidth - canvas.offsetWidth * scale) / 2;
    const scaledHeight = canvas.offsetHeight * scale;
    const y = scaledHeight <= viewport.clientHeight ? (viewport.clientHeight - scaledHeight) / 2 : 0;
    return { scale, pan: { x, y } };
  };
  const applyFit = () => {
    const fit = fitToView();
    if (fit) { setBaseScale(fit.scale); setPan(fit.pan); }
  };
  const reset = () => { setZoom(1); applyFit(); };

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const observer = new ResizeObserver(() => applyFit());
    observer.observe(viewport);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const limitZoom = (value: number) => Math.min(2.4, Math.max(0.3, Number(value.toFixed(2))));
  const pointerDistance = () => {
    const [first, second] = Array.from(pointers.current.values());
    return first && second ? Math.hypot(second.x - first.x, second.y - first.y) : 0;
  };
  const zoomBy = (amount: number) => setZoom((current) => limitZoom(current + amount));
  const startPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    event.currentTarget.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      pinchStart.current = { distance: pointerDistance(), zoom };
      dragStart.current = null;
      return;
    }
    dragStart.current = { x: event.clientX, y: event.clientY, panX: pan.x, panY: pan.y };
  };
  const movePan = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (pointers.current.has(event.pointerId)) pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pinchStart.current && pointers.current.size >= 2) {
      const distance = pointerDistance();
      if (distance > 0) setZoom(limitZoom(pinchStart.current.zoom * distance / pinchStart.current.distance));
      return;
    }
    if (!dragStart.current) return;
    setPan({ x: dragStart.current.panX + event.clientX - dragStart.current.x, y: dragStart.current.panY + event.clientY - dragStart.current.y });
  };
  const stopPan = (event: ReactPointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    pinchStart.current = null;
    const remaining = Array.from(pointers.current.values())[0];
    dragStart.current = remaining ? { x: remaining.x, y: remaining.y, panX: pan.x, panY: pan.y } : null;
  };
  const zoomWithWheel = (event: WheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 0.1 : -0.1);
  };

  return <div className="graph-interaction">
    <div className="graph-controls" aria-label={`Controles de ${label}`}>
      <button type="button" onClick={() => zoomBy(-0.15)} aria-label="Alejar">−</button>
      <output aria-label="Nivel de zoom">{Math.round(zoom * 100)}%</output>
      <button type="button" onClick={() => zoomBy(0.15)} aria-label="Acercar">+</button>
      <button type="button" className="graph-reset" onClick={reset}>Restaurar</button>
    </div>
    <div className="graph-viewport" ref={viewportRef} role="region" aria-label={`${label}. Arrastra con un dedo para desplazarte; usa dos dedos para acercar o alejar, o la rueda y los controles para restaurar.`} onPointerDown={startPan} onPointerMove={movePan} onPointerUp={stopPan} onPointerCancel={stopPan} onWheel={zoomWithWheel}>
      <div className="graph-canvas" ref={canvasRef} style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom * baseScale})` }}>{children}</div>
    </div>
  </div>;
}

export function GraphView({ tul, movements, stance, language }: { tul: string; movements: Movement[]; stance: Stance; language: Language }) {
  const nodes = Object.values(movements.reduce<Record<string, TechniqueNode>>((result, movement) => {
    const key = `${movement.coreano}\u0000${movement.espanol}`;
    if (!result[key]) result[key] = { ...movement, numbers: [] };
    result[key].numbers.push(movement.movimiento);
    return result;
  }, {}));
  const techniqueX = 445;
  const techniqueWidth = 530;
  const startY = 72;
  const firstTechniqueY = 178;
  const techniqueGap = 104;
  const endY = firstTechniqueY + Math.max(nodes.length - 1, 0) * techniqueGap + 112;
  const height = Math.max(410, endY + 70);
  const centerY = height / 2;

  return <section className="graph-panel" aria-label={`Grafo de relaciones de ${tul}`}>
    <div className="graph-intro"><div><span className="eyebrow">Grafo de una figura</span><h3>Relaciones técnicas de {tul}</h3></div><span>Inicio y finalización son contexto: se muestran aquí, pero no son movimientos ni nodos técnicos.</span></div>
    <InteractiveGraph id={`${tul}-${nodes.length}`} label={`Grafo de relaciones de ${tul}`}><svg className="technique-graph" viewBox={`0 0 1020 ${height}`} role="img" aria-label={`Relaciones entre ${tul}, sus posturas y técnicas`}>
      <defs><marker id="graph-arrow" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto"><path d="M0,0 L9,4.5 L0,9 z" fill="#697991" /></marker></defs>
      <g className="graph-stance graph-stance--context"><rect x={techniqueX} y={startY - 38} width={techniqueWidth} height="76" rx="12" /><SvgText value={`Inicio: ${stance.inicio_detalle}`} x={techniqueX + techniqueWidth / 2} y={startY} width={72} /></g>
      <g className="graph-tul"><rect x="120" y={centerY - 34} width="180" height="68" rx="34" /><SvgText value={tul} x={210} y={centerY} width={24} className="graph-tul-label" /></g>
      {nodes.map((node, index) => {
        const y = firstTechniqueY + index * techniqueGap;
        const tone = categoryClass(node.categoria);
        const movementLabel = node.numbers.length === 1 ? "Movimiento" : "Movimientos";
        return <g key={`${node.coreano}-${node.espanol}`}><path className={`graph-edge graph-edge--${tone}`} d={`M 300 ${centerY} C 352 ${centerY}, 374 ${y}, ${techniqueX} ${y}`} markerEnd="url(#graph-arrow)"><title>{`${movementLabel}: ${node.numbers.join(", ")}`}</title></path><g className={`graph-tech graph-tech--${tone}`}><rect x={techniqueX} y={y - 38} width={techniqueWidth} height="76" rx="12"><title>{`${textFor(node, language)} · ${movementLabel.toLocaleLowerCase()} ${node.numbers.join(", ")}`}</title></rect><SvgText value={textFor(node, language)} x={techniqueX + techniqueWidth / 2} y={y - 8} width={76} /><text className="graph-moves" x={techniqueX + techniqueWidth / 2} y={y + 23} textAnchor="middle">{movementLabel} {node.numbers.join(", ")}</text></g></g>;
      })}
      <g className="graph-stance graph-stance--context"><rect x={techniqueX} y={endY - 38} width={techniqueWidth} height="76" rx="12" /><SvgText value={`Finalización: ${stance.final_detalle}`} x={techniqueX + techniqueWidth / 2} y={endY} width={72} /></g>
    </svg></InteractiveGraph>
  </section>;
}

export function GlobalGraphView({ data, filters, language }: { data: GraphData; filters: GraphFilters; language: Language }) {
  const techniques = data.techniques.filter((item) => matches(item, filters));
  const tulY = Object.fromEntries(data.tules.map((tul, index) => [tul, 82 + index * 88]));
  const techniqueY = Object.fromEntries(techniques.map((technique, index) => [`${technique.coreano}\u0000${technique.espanol}`, 62 + index * 76]));
  const height = Math.max(data.tules.length * 88 + 90, techniques.length * 76 + 90, 520);

  return <section className="graph-panel" aria-label="Grafo global de figuras, tules y técnicas">
    <div className="graph-intro"><div><span className="eyebrow">Grafo global</span><h3>Figuras/tules y técnicas compartidas</h3></div><span>{techniques.length} técnicas visibles. Los filtros reajustan nodos y relaciones; abre una figura para ver inicio y finalización.</span></div>
    <InteractiveGraph id={`global-${filters.category}-${filters.technique}-${language}`} label="Grafo global de figuras, tules y técnicas"><svg className="global-graph" viewBox={`0 0 1380 ${height}`} role="img" aria-label="Grafo global de figuras, tules y técnicas ITF">
      <defs><marker id="global-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" fill="#64748b" /></marker></defs>
      {techniques.flatMap((technique) => Object.entries(technique.tules).map(([tul, numbers]) => {
        const y1 = tulY[tul]; const y2 = techniqueY[`${technique.coreano}\u0000${technique.espanol}`]; const colour = palette[data.tules.indexOf(tul) % palette.length];
        return <path key={`${tul}-${technique.coreano}`} className="global-edge" stroke={colour} d={`M 355 ${y1} C 625 ${y1}, 760 ${y2}, 960 ${y2}`} markerEnd="url(#global-arrow)"><title>{`${tul}: movimientos ${numbers.join(", ")}`}</title></path>;
      }))}
      {data.tules.map((tul, index) => <g key={tul} className="global-tul"><rect x="82" y={tulY[tul] - 27} width="273" height="54" rx="27" fill={palette[index]} /><SvgText value={tul} x={218} y={tulY[tul]} width={28} className="global-tul-label" /><text className="global-tul-context" x="218" y={tulY[tul] + 45} textAnchor="middle">inicio y final en vista individual</text></g>)}
      {techniques.map((technique) => { const y = techniqueY[`${technique.coreano}\u0000${technique.espanol}`]; const tone = categoryClass(technique.categoria); return <g key={`${technique.coreano}-${technique.espanol}`} className={`global-tech global-tech--${tone}`}><circle cx="984" cy={y} r="15"><title>{textFor(technique, language)}</title></circle><SvgText value={textFor(technique, language)} x={1170} y={y} width={42} /></g>; })}
      {!techniques.length && <text className="global-empty" x="720" y={height / 2} textAnchor="middle">No hay técnicas que coincidan con los filtros.</text>}
    </svg></InteractiveGraph>
  </section>;
}
