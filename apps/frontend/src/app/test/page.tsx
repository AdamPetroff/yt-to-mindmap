"use client";

import ResizablePanel3, {
  ResizablePanelSimple,
} from "@/components/ResizableBox";
import { useState } from "react";

export default function Test() {
  const [big, setBig] = useState(false);
  return (
    <div className="flex">
      <ResizablePanelSimple className="bg-red-500" onClick={() => setBig(!big)}>
        <div className="flex w-fit flex-col">
          <span>title</span>
          {big && <span>content</span>}
        </div>
      </ResizablePanelSimple>
    </div>
  );
}
