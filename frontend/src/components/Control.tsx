"use client";

import { useState } from "react";
import VideoInput from "./VideoInput";
import Wrapper from "./Wrapper";
import Flow from "./Flow";
import NewMindmap from "./NewMindmap";
import { MindmapData, MindmapNode } from "../../../types";

export default function Control() {
  const [videoId, setVideoId] = useState<string>();

  async function getMindmap(vidId: string) {
    const res = await fetch(
      `http://localhost:3001/make-mindmap-data/${vidId}`,
      {
        method: "post",
      }
    );
    const data = (await res.json()) as MindmapData;
    console.log("--", data);
    setVideoId(vidId);
    setRes(data);
  }

  const [res, setRes] = useState<MindmapData>();

  return (
    <div className="flex flex-col gap-4">
      {res && videoId ? (
        <>
          <button onClick={() => setRes(undefined)}>Reset</button>
          <NewMindmap mindmap={res} videoId={videoId} />
          {/* <div className="w-[100vw] h-[90vh]">
            <Flow initNodes={res.nodes} initEdges={res.edges} />
          </div> */}
        </>
      ) : (
        <>
          <VideoInput onConfirm={(vidId) => getMindmap(vidId)} />
        </>
      )}
    </div>
  );
}
