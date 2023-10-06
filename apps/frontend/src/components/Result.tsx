"use client";

import { API_URL } from "@/constants";
import { useQuery } from "react-query";
import { GetMindmapEndpointResponse, MindmapItem } from "my-types";
import { notFound } from "next/navigation";
import Mindmap from "./Mindmap";

export default function Result({
  identifier,
}: {
  identifier: ["videoId", string] | ["mindmapId", string];
  initData?: MindmapItem;
}) {
  const { status, data } = useQuery(
    ["result", identifier[1]],
    async () => {
      try {
        const result =
          identifier[0] === "mindmapId"
            ? await fetch(`${API_URL}mindmap/${identifier[1]}`)
            : await fetch(`${API_URL}mindmap/video/${identifier[1]}`);

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
        return 3000;
      },
    },
  );

  console.log(data);

  if (data === "not found") {
    notFound();
  }

  if (data?.data.status === "ok") {
    return (
      <Mindmap mindmap={data.data.mindmapData} videoId={data.data.videoId} />
    );
  }

  return <div>{data?.data?.status}</div>;
}
