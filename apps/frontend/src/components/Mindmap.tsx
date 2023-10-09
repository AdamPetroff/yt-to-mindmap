"use client";

import { ReactElement, useRef, useState } from "react";
import { MindmapData, MindmapItem } from "my-types";
import YTBox from "./YTBox";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, Variants, motion } from "framer-motion";
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

  const isBigVersion = isCurrentItem;

  const ref = useRef<HTMLDivElement | null>(null);

  const variants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  return (
    <motion.div
      className={cn(
        isCurrentItem ? "absolute w-min" : "relative",
        "flex cursor-pointer flex-col gap-4",
      )}
      ref={ref}
      layout="position"
      transition={{ duration: 1 }}
      layoutId={item.id}
      variants={variants}
      initial={"initial"}
      animate={"animate"}
      exit={"exit"}
    >
      <ResizablePanelSimple
        duration={0.5}
        className={cn(
          "rounded-md",
          isCurrentItem ? "bg-slate-800" : "bg-slate-500",
        )}
        onClick={() => {
          if (!isCurrentItem) {
            setCurrentItem(item);
          }
        }}
      >
        <div>
          <div
            id={item.id}
            className={cn(
              "flex min-w-[6rem] flex-col gap-4 p-4 text-white",
              // isBigVersion ? "min-h-[6rem]" : "min-h-[4rem]",
            )}
          >
            <div className="flex items-center gap-2">
              {isBigVersion && item.belongsTo && (
                <Button
                  onClick={() => {
                    setCurrentItem(data.items[item.belongsTo!]);
                  }}
                >
                  UP
                </Button>
              )}
              <span className="whitespace-nowrap font-roboto text-xl ">
                {item.label}
              </span>
            </div>
            <AnimatePresence>
              {isBigVersion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="flex flex-col gap-4"
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
          variants={variants}
          initial={"initial"}
          animate={"animate"}
          transition={{ delay: 1 }}
          className="flex flex-wrap justify-center gap-4"
        >
          {item.children.map((childId) => (
            <MindmapCardView
              key={childId}
              item={data.items[childId]}
              data={data}
              setCurrentItem={setCurrentItem}
              videoId={videoId}
              currentItemId={currentItemId}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
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

  const cards = Object.values(mindmap.items).reduce<
    Record<string, ReactElement>
  >((acc, item) => {
    return {
      ...acc,
      [item.id]: (
        <MindmapCardView
          key={item.id}
          item={item}
          currentItemId={currentItem.id}
          data={mindmap}
          setCurrentItem={setCurrentItem}
          videoId={videoId}
        />
      ),
    };
  }, {});

  return (
    <div className="w-auto">
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>{cards[currentItem.id]}</AnimatePresence>
      </div>
    </div>
  );
}
