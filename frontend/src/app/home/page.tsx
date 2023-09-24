"use client";
import { Button, ButtonLoader } from "@/components/ui/button";
import { Input, InputWithEndAddition } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { MindmapData } from "../../../../types";
import { API_URL } from "@/constants";
import { sleep } from "@/lib/utils";
import { setModal } from "@/components/Modal";

export default function Home() {
  const [videoId, setVideoId] = useState<string>();

  async function getMindmap() {
    setModal({
      title: "Generating Mindmap",
      content: () => (
        <div className="flex flex-col items-center">
          <div className="h-20 w-20">
            <ButtonLoader />
          </div>
        </div>
      ),
    });
    return;
    const res = await fetch(`${API_URL}make-mindmap-data/${videoId}`, {
      method: "post",
    });
    const data = (await res.json()) as MindmapData;
    console.log("--", data);
    setRes(data);
  }

  const [res, setRes] = useState<MindmapData>();

  return (
    <div className="flex flex-col items-center">
      <InputWithEndAddition
        wrapperClassName="mt-4 w-full max-w-[30rem]"
        className="w-full"
        placeholder="YouTube Video ID"
        onChange={(e) => setVideoId(e.target.value)}
        value={videoId}
      >
        <Button onClick={getMindmap} className="flex gap-2">
          <MagnifyingGlassIcon className="" />{" "}
          <span className="hidden md:block">Generate</span>
        </Button>
      </InputWithEndAddition>
    </div>
  );
}
