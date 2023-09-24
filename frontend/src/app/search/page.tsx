import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function SearchPage() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2">
        <Input />
        <Button>
          <MagnifyingGlassIcon className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
