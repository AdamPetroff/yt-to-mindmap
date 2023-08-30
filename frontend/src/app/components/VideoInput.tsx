import { useState } from "react";

export default function VideoInput({
  onConfirm,
}: {
  onConfirm: (val: string) => void;
}) {
  const [val, setVal] = useState("");

  return (
    <div>
      <input
        className="text-black"
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
        }}
      />

      <button
        onClick={() => {
          onConfirm(val);
        }}
      >
        Confirm
      </button>
    </div>
  );
}
