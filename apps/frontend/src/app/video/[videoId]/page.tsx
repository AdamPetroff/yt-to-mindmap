import Mindmap from "@/components/Mindmap";
import Result from "@/components/Result";
import { API_URL } from "@/constants";
import { MindmapItem } from "my-types";

export default async function ResultPage({
  params,
}: {
  params: { mindmapId: string };
}) {
  console.log(params);
  return <div></div>;
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex w-full items-center gap-2">
        {/* <Mindmap mindmap={data} videoId={"2NZMaI-HeNU"} /> */}
        {/* {params} */}
        {/* <Result mindmapId={mindmapId} initData={undefined} /> */}
      </div>
    </div>
  );
}
