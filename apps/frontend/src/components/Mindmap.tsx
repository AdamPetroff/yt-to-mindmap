"use client";

import { useState } from "react";
import { MindmapData, MindmapItem } from "my-types";
import YTBox from "./YTBox";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import ResizableBox, { ResizablePanelSimple } from "./ResizableBox";

function MindmapCardView({
  item,
  data,
  setCurrentItem,
  videoId,
  currentItemId,
}: {
  item: MindmapItem;
  data: MindmapData;
  setCurrentItem: (item: MindmapItem) => void;
  videoId: string;
  currentItemId: string;
}) {
  const isCurrentItem = item.id === currentItemId;

  const [isBigVersion, setIsBigVersion] = useState(false);

  return (
    <div>
      <ResizablePanelSimple
        className="rounded-md bg-slate-800"
        onClick={() => setIsBigVersion(!isBigVersion)}
        // className="flex-col gap-4"
      >
        <div>
          <div
            id={item.id}
            className={cn(
              "flex min-w-[6rem] flex-col gap-4 p-4 text-white",
              // isBigVersion ? "min-h-[6rem]" : "min-h-[4rem]",
            )}
          >
            <span className="font-roboto text-xl">{item.label}</span>
            <AnimatePresence mode="sync">
              {isBigVersion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  // exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-lg text-slate-200">
                    {item.description}
                  </span>
                  <div className="flex justify-center">
                    {/* <div className="h-36 w-52 bg-red-500"></div> */}
                    <YTBox key={item.t} vidId={videoId} start={item.t} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </ResizablePanelSimple>
      {isBigVersion && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-between gap-4"
        >
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
        </motion.div>
      )}
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
    <div className="w-auto">
      {currentItem.belongsTo && (
        <Button
          onClick={() => {
            setCurrentItem(mindmap.items[currentItem.belongsTo!]);
          }}
        >
          UP
        </Button>
      )}
      <MindmapCardView
        item={currentItem}
        currentItemId={currentItem.id}
        data={mindmap}
        setCurrentItem={setCurrentItem}
        videoId={videoId}
      />
    </div>
  );
}
