import React from "react";
import ReactDOM from "react-dom";
//@ts-ignore
import Graph from "react-graph-vis";
import { useQuery } from "react-query";

// import "./styles.css";
// // need to import the vis network css in order to show tooltip
// import "./network.css";

export default function App() {
  const graph = {
    nodes: [
      { id: 1, label: "Node 1", title: "node 1 tootip text" },
      { id: 2, label: "Node 2", title: "node 2 tootip text" },
      { id: 3, label: "Node 3", title: "node 3 tootip text" },
      { id: 4, label: "Node 4", title: "node 4 tootip text" },
      { id: 5, label: "Node 5", title: "node 5 tootip text" },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
    ],
  };

  const options = {
    layout: {
      hierarchical: false,
    },
    edges: {
      color: "#000000",
    },
    height: "700px",
  };

  const events = {
    // select: function (event) {
    //   var { nodes, edges } = event;
    // },
  };

  const vidId = "2NZMaI-HeNU";

  const { data } = useQuery(["getFlow", vidId], async () => {
    console.log(vidId);
    const res = await fetch(`/api/mindmap-data/${vidId}`);
    return (await res.json()) as { nodes: any[]; edges: any[] };
  });

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <Graph
      graph={data}
      options={options}
      events={events}
      // getNetwork={(network) => {
      //   //  if you want access to vis.js network api you can set the state in a parent component using this property
      // }}
    />
  );
}
