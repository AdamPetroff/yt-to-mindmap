"use client";

import { useQuery } from "react-query";
import Flow from "./Flow";
import { Node, Edge } from "reactflow";

export default function Mindmap() {
  const vidId = "2NZMaI-HeNU";

  const { data } = useQuery(["getFlow", vidId], async () => {
    console.log(vidId);
    const res = await fetch(`http://backend:3001/mindmap-data/${vidId}`);
    return (await res.json()) as { nodes: Node[]; edges: Edge[] };
  });

  console.log(data);
  if (!data) {
    return <div>Loading...</div>;
  }

  console.log(data);
  return (
    <div className="w-[100vw] h-[100vh]">
      <Flow initNodes={data.nodes} initEdges={data.edges} />
    </div>
  );
}
