import Image from "next/image";

const thumbprintFile = {
  low: "mqdefault.jpg",
  medium: "hqdefault.jpg",
  high: "sddefault.jpg",
};

export default function YTVideoThumbprint({
  vidId,
  quality,
  width = 300,
  height = 200,
}: {
  vidId: string;
  quality: "low" | "medium" | "high";
  width?: number;
  height?: number;
}) {
  const thumbprintUrl = `https://i.ytimg.com/vi/${vidId}/${thumbprintFile[quality]}`;

  return (
    <div>
      <Image width={width} height={height} src={thumbprintUrl} alt={vidId} />
    </div>
  );
}
