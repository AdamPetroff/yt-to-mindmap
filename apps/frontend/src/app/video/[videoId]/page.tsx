import Mindmap from "@/components/Mindmap";
import Result from "@/components/Result";
import { API_URL } from "@/constants";
import { MindmapItem } from "my-types";

export default async function ResultPage({
  params: { videoId },
}: {
  params: { videoId: string };
}) {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex w-full items-center gap-2">
        {/* <Mindmap mindmap={data} videoId={"2NZMaI-HeNU"} /> */}
        {/* {params} */}
        <Result identifier={["videoId", videoId]} initData={undefined} />
      </div>
    </div>
  );
}
