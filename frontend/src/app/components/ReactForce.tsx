"use client";

import ForceGraph2D from "react-force-graph-2d";

const dataset = {
  nodes: [
    {
      id: "id1",
      name: "name1",
      val: 1,
    },
    {
      id: "id2",
      name: "name2",
      label: "test",
      val: 10,
    },
    {
      id: "id3",
      name: "name3",
      val: 1,
    },
  ],
  links: [
    {
      source: "id1",
      target: "id2",
      value: 20,
      strength: 0.5,
      distance: 200,
    },
    {
      source: "id2",
      target: "id3",
    },
  ],
};

export default function Graph() {
  return (
    <ForceGraph2D
      nodeCanvasObject={(node, ctx, globalScale) => {
        const label = node.id;
        const fontSize = 12 / globalScale;
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2
        ); // some padding

        ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        ctx.fillRect(
          node.x - bckgDimensions[0] / 2,
          node.y - bckgDimensions[1] / 2,
          ...bckgDimensions
        );

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = node.color;
        ctx.fillText(label, node.x, node.y);

        node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
      }}
      graphData={dataset}
    />
  );
}
