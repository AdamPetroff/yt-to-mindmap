import Image from "next/image";

const thumbprintFile = {
  low: "mqdefault.jpg",
  medium: "hqdefault.jpg",
  high: "sddefault.jpg",
};

export function getYTVideoThumbprintSrc({
  vidId,
  quality,
}: {
  vidId: string;
  quality: "low" | "medium" | "high";
}) {
  return `https://i.ytimg.com/vi/${vidId}/${thumbprintFile[quality]}`;
}

export default function YTVideoThumbprint({
  vidId,
  quality,
  width = 300,
  height = 200,
  className,
}: {
  width?: number;
  height?: number;
  className?: string;
} & Parameters<typeof getYTVideoThumbprintSrc>[0]) {
  return (
    <Image
      width={width}
      height={height}
      src={getYTVideoThumbprintSrc({ quality, vidId })}
      alt={vidId}
      className={className}
    />
  );
}
