"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import Mindmap from "./Mindmap";
import Graph from "./ReactForce";
import ReactGraphVis from "./ReactGraphVis";
import { D3Wrapper, ForceGraph } from "./D3";

const queryClient = new QueryClient();

export default function Wrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* <Mindmap /> */}
      {/* <Graph /> */}
      {/* <ReactGraphVis /> */}
      <D3Wrapper />
    </QueryClientProvider>
  );
}
