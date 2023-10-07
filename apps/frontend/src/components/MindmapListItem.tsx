import { GetMindmapListEndpointResponse } from "my-types";
import YTVideoThumbprint, {
  getYTVideoThumbprintSrc,
} from "./YTVideoThumbprint";
import Image from "next/image";

export default function MindmapListItem({
  mindmapItem,
}: {
  mindmapItem: GetMindmapListEndpointResponse["data"]["mindmapList"][number];
}) {
  return (
    <a
      href={`/mindmap/${mindmapItem.id}`}
      className="flex w-full cursor-pointer items-stretch rounded border hover:bg-slate-200 active:bg-slate-300"
    >
      <Image
        width={140}
        height={80}
        alt={mindmapItem.title}
        src={getYTVideoThumbprintSrc({
          vidId: mindmapItem.videoId,
          quality: "low",
        })}
        className="rounded-s"
      />
      <div className="flex flex-col items-start gap-1 p-2">
        <span className="font-roboto text-xl text-slate-800">
          {mindmapItem.title}
        </span>
        <span className="text-slate-500">{mindmapItem.description}</span>
      </div>
    </a>
  );
}
