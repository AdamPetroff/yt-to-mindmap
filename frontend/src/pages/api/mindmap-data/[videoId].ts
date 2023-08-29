import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const vidId = req.query.videoId as string;

  // console.log("0000", vidId);
  const result = await fetch(`http://backend:3001/mindmap-data/${vidId}`);
  res.status(200).json(await result.json());
  // res.status(200).json({ message: "ok" });
}
