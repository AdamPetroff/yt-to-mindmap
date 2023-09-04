"use client";

import { QueryClient, QueryClientProvider } from "react-query";
import Control from "./Control";
import YTVideoThumbprint from "./YTVideoThumbprint";

const queryClient = new QueryClient();

export default function Wrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <Control />
      <YTVideoThumbprint vidId={"2NZMaI-HeNU"} quality="high" />
      {/* <Mindmap /> */}
      {/* <Graph /> */}
      {/* <ReactGraphVis /> */}
      {/* <D3Wrapper /> */}
    </QueryClientProvider>
  );
}
