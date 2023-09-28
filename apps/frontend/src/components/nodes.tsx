"use client";
export const nodes = [
  {
    id: "1",
    type: "default",
    data: {
      label: "1",
    },
    style: {
      backgroundColor: "#076b57",
    },
    // source: "0",
    position: { x: 0, y: 0 },
    targetPosition: "top",
    sourcePosition: "bottom",
  },
  {
    id: "1-1",
    type: "default",
    data: {
      label: "1-1",
    },
    style: {
      backgroundColor: "#076b57",
    },
    // source: "1",
    position: { x: 100, y: 0 },
    targetPosition: "top",
    sourcePosition: "bottom",
  },
  {
    id: "1-2",
    type: "default",
    data: {
      label: "1-2",
    },
    style: {
      backgroundColor: "#076b57",
    },
    // source: "1",
    position: { x: 200, y: 0 },
    targetPosition: "top",
    sourcePosition: "bottom",
  },
  {
    id: "1-3",
    type: "default",
    data: {
      label: "1-3",
    },
    style: {
      backgroundColor: "#076b57",
    },
    // source: "1",
    position: { x: 300, y: 0 },
    targetPosition: "top",
    sourcePosition: "bottom",
  },
  {
    id: "arrow-1",
    source: "1",
    target: "1-1",
    animated: false,
    arrowHeadType: "arrowclosed",
  },
  {
    id: "arrow-2",
    source: "1",
    target: "1-2",
    animated: false,
    arrowHeadType: "arrowclosed",
  },
  {
    id: "arrow-3",
    source: "1",
    target: "1-3",
    animated: false,
    arrowHeadType: "arrowclosed",
  },
];

// export const edges = [
//   { id: "e1-2", source: "1", target: "2", label: "this is an edge label" },
//   { id: "e1-3", source: "1", target: "3", animated: true },
//   {
//     id: "e4-5",
//     source: "4",
//     target: "5",
//     type: "smoothstep",
//     sourceHandle: "handle-0",
//     data: {
//       selectIndex: 0,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
//   {
//     id: "e4-6",
//     source: "4",
//     target: "6",
//     type: "smoothstep",
//     sourceHandle: "handle-1",
//     data: {
//       selectIndex: 1,
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed,
//     },
//   },
// ];
