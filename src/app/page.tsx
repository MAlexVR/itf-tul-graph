import { Explorer } from "@/components/organisms/Explorer";
import graphData from "@/data/graph-data.json";
import type { GraphData } from "@/lib/types";

export default function Home() {
  return <Explorer data={graphData as unknown as GraphData} />;
}
