"use client";

import { QueryClient, QueryClientProvider } from "react-query";
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
