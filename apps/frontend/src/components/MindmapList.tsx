import { GetMindmapListEndpointResponse } from "my-types";
import MindmapListItem from "./MindmapListItem";

export default function MindmapList({
  items,
}: {
  items: GetMindmapListEndpointResponse["data"]["mindmapList"];
}) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <MindmapListItem key={item.id} mindmapItem={item} />
      ))}
    </div>
  );
}
