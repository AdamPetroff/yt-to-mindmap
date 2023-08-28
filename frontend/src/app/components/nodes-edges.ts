"use client";
const position = { x: 0, y: 0 };
const edgeType = "smoothstep";

export const initialNodes = [
  {
    id: "2",
    data: { label: "node 2" },
    position,
  },
  {
    id: "2a",
    data: { label: "node 2a" },
    position,
  },
  {
    id: "2b",
    data: { label: "node 2b" },
    position,
  },
  {
    id: "2c",
    data: { label: "node 2c" },
    position,
  },
  {
    id: "2d",
    data: { label: "node 2d" },
    position,
  },
];

export const initialEdges = [
  { id: "e12", source: "2", target: "2a", type: edgeType, animated: true },
  { id: "e13", source: "2", target: "2b", type: edgeType, animated: true },
  { id: "e22a", source: "2", target: "2c", type: edgeType, animated: true },
  { id: "e22b", source: "2", target: "2d", type: edgeType, animated: true },
];
