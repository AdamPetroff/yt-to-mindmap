import express from "express";
import { makeMindmap, runPy } from "./functions";
import cors from "cors";
import { MindmapNode } from "../../types";
import { db } from "./db";
import { z } from "zod";
import { parseRequest } from "./utils";
import { eq } from "drizzle-orm";
import { mindmaps } from "./schema";
require("dotenv").config();

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.post("/get-video-transcript", (req, res) => {
  const videoId = req.body.videoId;

  runPy(videoId);

  res.send("ok");
});

const makeMindmapSchema = z.object({ body: z.object({ videoId: z.string() }) });

app.post("/mindmap", async (req, res) => {
  const {
    body: { videoId },
  } = parseRequest(makeMindmapSchema, req);

  let mindmap = await db.query.mindmaps.findFirst({
    where: eq(mindmaps.videoId, videoId),
  });

  if (mindmap) {
    return res.json({ status: "ok", data: { mindmapId: mindmap.id } });
  }

  const created = await db
    .insert(mindmaps)
    .values({
      videoId,
      title: "title",
      status: "fetchingTranscript",
    })
    .returning();
  const mindmapId = created[0].id;

  res.json({ status: "ok", data: { mindmapId: mindmapId } });

  // make mindmap
  makeMindmap(mindmapId);

  return;
});

// make one for fetching by videoId as well
app.get("/mindmap/:mindmapId", async (req, res) => {
  const mindmapId = req.params.mindmapId;
  let mindmap = await db.query.mindmaps.findFirst({
    where: eq(mindmaps.videoId, mindmapId),
  });

  if (mindmap) {
    if (mindmap.status !== "ok") {
      return res.json({ status: "ok", data: { status: mindmap.status } });
    } else {
      return res.json({
        status: "ok",
        data: { status: mindmap.status, mindmapData: mindmap.structure },
      });
    }
  } else {
    return res.status(404).json({ status: "error", data: { mindmapId: null } });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
