import { useState } from "react";
import VideoInput from "./VideoInput";
import Wrapper from "./Wrapper";
import Flow from "./Flow";

type Result = { nodes: any[]; edges: any[] };

export default function Control() {
  async function getMindmap(vidId: string) {
    console.log("geee");
    const res = await fetch(`/api/make-mindmap/${vidId}`, { method: "post" });
    const data = (await res.json()) as Result;
    setRes(data);
  }

  const [res, setRes] = useState<Result>();

  return (
    <div className="flex flex-col gap-4">
      {res ? (
        <>
          <button onClick={() => setRes(undefined)}>Reset</button>
          <div className="w-[100vw] h-[90vh]">
            <Flow initNodes={res.nodes} initEdges={res.edges} />
          </div>
        </>
      ) : (
        <>
          <VideoInput onConfirm={(vidId) => getMindmap(vidId)} />
        </>
      )}
    </div>
  );
}
