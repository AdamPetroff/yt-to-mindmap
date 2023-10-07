import YouTube from "react-youtube";

export default function YTBox({
  vidId,
  start,
}: {
  vidId: string;
  start: number;
}) {
  const opts = {
    // height: "390",
    // width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
      start: String(Math.floor(start)),
    },
  };

  console.log(start);

  return <YouTube videoId={vidId} opts={opts} />;
}
