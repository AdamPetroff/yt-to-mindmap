"use client";

import { useState } from "react";
import { MindmapData, MindmapItem } from "../../../types";
import YTBox from "./YTBox";
import { Button } from "./ui/button";

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
    <div className="flex w-full flex-col gap-4">
      {item.belongsTo && (
        <Button
          onClick={() => {
            setCurrentItem(data.items[item.belongsTo!]);
          }}
        >
          UP
        </Button>
      )}
      <div
        id={item.id}
        className="flex min-h-[6rem] min-w-[6rem] flex-col gap-4 rounded-md border bg-slate-800 p-4 text-white"
      >
        <span className="font-roboto text-xl">{item.label}</span>
        <span className="text-lg text-slate-200">{item.description}</span>
        <div className="flex justify-center">
          <YTBox key={item.t} vidId={videoId} start={item.t} />
        </div>
      </div>
      <div className="flex justify-between gap-4">
        {item.children.map((childId) => {
          const child = data.items[childId];
          if (!child) {
            throw new Error("Child not found");
          }

          return (
            <div
              key={child.id}
              id={child.id}
              className="flex min-h-[4rem] w-full min-w-[4rem] cursor-pointer flex-col items-center justify-center gap-4 rounded-sm border bg-slate-800 p-2 font-roboto text-lg text-white opacity-75 transition-all hover:bg-slate-900"
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

export default function Mindmap({
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
