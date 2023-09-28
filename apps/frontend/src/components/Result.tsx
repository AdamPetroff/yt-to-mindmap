"use client";

import { API_URL } from "@/constants";
import { useQuery } from "react-query";
import { GetMindmapEndpointResponse, MindmapItem } from "my-types";
import { notFound } from "next/navigation";

export default function Result({
  mindmapId,
}: {
  mindmapId: string;
  initData?: MindmapItem;
}) {
  const { status, data } = useQuery(
    "result",
    async () => {
      try {
        const result = await fetch(`${API_URL}mindmap/video/${mindmapId}`);

        const data = (await result.json()) as GetMindmapEndpointResponse;

        return data;
      } catch (e) {
        console.log(e);

        return "not found";
      }
    },
    {
      retry: 2,
      refetchInterval: (data) => {
        if (typeof data === "object" && data.data.status === "ok") {
          return false;
        }
        return 1000;
      },
    },
  );

  console.log(data);

  if (data === "not found") {
    notFound();
  }

  return <div>{status}</div>;
}
