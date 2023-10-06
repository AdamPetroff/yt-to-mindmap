import { GetMindmapListEndpointResponse } from "my-types";
import YTVideoThumbprint from "./YTVideoThumbprint";

export default function MindmapListItem({
  mindmapItem,
}: {
  mindmapItem: GetMindmapListEndpointResponse["data"]["mindmapList"][number];
}) {
  return (
    <a
      href={`/mindmap/${mindmapItem.id}`}
      className="flex w-full cursor-pointer items-stretch gap-4 border p-2 hover:bg-slate-200"
    >
      <YTVideoThumbprint
        width={100}
        height={60}
        quality="low"
        vidId={mindmapItem.videoId}
      />
      <div className="flex flex-col items-start gap-1">
        <span className="font-roboto text-xl text-slate-800">
          {mindmapItem.title}
        </span>
        <span className="text-slate-500">{mindmapItem.description}</span>
      </div>
    </a>
  );
}
