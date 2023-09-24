import { BeatLoader } from "react-spinners";

export default function Processing() {
  return (
    <div className="flex items-center justify-center py-4">
      <div className="flex items-center gap-2">
        <BeatLoader size={"10px"} loading={true} color={"#000"} />
      </div>
    </div>
  );
}
