"use client";

import { useState } from "react";
import { MindmapData, MindmapItem } from "../../../types";
import YTBox from "./YTBox";

function MindmapCardView({
  item,
  data,
  setCurrentItem,
  videoId,
}: {
  item: MindmapItem;
  data: MindmapData;
  setCurrentItem: (item: MindmapItem) => void;
  videoId: string;
}) {
  return (
    <div className="flex flex-col gap-8">
      {item.belongsTo && (
        <button
          onClick={() => {
            setCurrentItem(data.items[item.belongsTo!]);
          }}
        >
          UP
        </button>
      )}
      <div
        id={item.id}
        className="min-w-[6rem], min-h-[6rem] bg-yellow-800 text-white border rounded-md flex flex-col gap-4 p-4"
      >
        <span className="text-xl">{item.label}</span>
        <span className="text-slate-200 text-lg">{item.description}</span>
        <span>test</span>
        <div>
          <YTBox key={item.t} vidId={videoId} start={item.t} />
        </div>
      </div>
      <div className="flex gap-8">
        {item.children.map((childId) => {
          const child = data.items[childId];
          if (!child) {
            throw new Error("Child not found");
          }

          return (
            <div
              key={child.id}
              id={child.id}
              className="p-2 min-w-[4rem], min-h-[4rem] bg-yellow-800 text-white opacity-75 text-lg border rounded-sm flex flex-col gap-4"
              onClick={() => setCurrentItem(child)}
            >
              <span>{child.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function NewMindmap({
  mindmap,
  videoId,
}: {
  mindmap: MindmapData;
  videoId: string;
}) {
  const rootItem = mindmap.items[mindmap.root];
  const [currentItem, setCurrentItem] = useState(rootItem);

  console.log(mindmap);
  return (
    <MindmapCardView
      item={currentItem}
      data={mindmap}
      setCurrentItem={setCurrentItem}
      videoId={videoId}
    />
  );
}
