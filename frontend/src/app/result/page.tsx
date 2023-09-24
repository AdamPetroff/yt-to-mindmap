import Mindmap from "@/components/Mindmap";
import { API_URL } from "@/constants";

export default async function ResultPage() {
  const result = await fetch(`${API_URL}make-mindmap-data/${"2NZMaI-HeNU"}`, {
    method: "post",
  });

  const data = await result.json();

  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex w-full items-center gap-2">
        <Mindmap mindmap={data} videoId={"2NZMaI-HeNU"} />
      </div>
    </div>
  );
}
