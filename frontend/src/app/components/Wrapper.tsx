"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import Mindmap from "./Mindmap";
import Graph from "./ReactForce";
import ReactGraphVis from "./ReactGraphVis";
import { D3Wrapper, ForceGraph } from "./D3";
import Control from "./Control";

const queryClient = new QueryClient();

export default function Wrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <Control />
      {/* <Mindmap /> */}
      {/* <Graph /> */}
      {/* <ReactGraphVis /> */}
      {/* <D3Wrapper /> */}
    </QueryClientProvider>
  );
}
