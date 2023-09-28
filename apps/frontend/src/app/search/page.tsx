"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_URL } from "@/constants";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchPage() {
  const [val, setVal] = useState("");
  const router = useRouter();

  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2">
        <Input value={val} onChange={(e) => setVal(e.target.value)} />
        <Button
          onClick={async () => {
            const res = await fetch(`${API_URL}mindmap`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                videoId: val,
              }),
            });
            const {
              data: { mindmapId },
            } = (await res.json()) as {
              data: { mindmapId: string };
            };

            router.push(`/video/${mindmapId}`);
          }}
        >
          <MagnifyingGlassIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
