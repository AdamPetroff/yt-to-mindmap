import Image from "next/image";

const thumbprintFile = {
  low: "mqdefault.jpg",
  medium: "hqdefault.jpg",
  high: "sddefault.jpg",
};

export default function YTVideoThumbprint({
  vidId,
  quality,
}: {
  vidId: string;
  quality: "low" | "medium" | "high";
}) {
  const thumbprintUrl = `https://i.ytimg.com/vi/${vidId}/${thumbprintFile[quality]}`;

  return (
    <div>
      <Image width={300} height={200} src={thumbprintUrl} alt={vidId} />
    </div>
  );
}
