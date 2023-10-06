"use client";
import { useQuery } from "react-query";
import Wrapper from "../components/Wrapper";
import { API_URL } from "@/constants";
import { GetMindmapListEndpointResponse } from "my-types";
import MindmapList from "@/components/MindmapList";
import { ButtonLoader } from "@/components/ui/button";

export default function Home() {
  const { status, data } = useQuery(
    ["mindmapList"],
    async () => {
      try {
        const result = await fetch(`${API_URL}mindmap`);

        const data = (await result.json()) as GetMindmapListEndpointResponse;

        return data.data.mindmapList;
      } catch (e) {
        console.log(e);

        return "not found";
      }
    },
    {
      retry: 2,
    },
  );

  if (!data) {
    return <ButtonLoader />;
  }

  if (data === "not found") {
    return <div>not found</div>;
  }

  return (
    <main className="flex min-h-screen flex-col justify-between pt-4">
      <MindmapList items={data} />
    </main>
  );
}
