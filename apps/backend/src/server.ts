import express from "express";
import { makeMindmap, runPy } from "./functions";
import cors from "cors";
import { db } from "./db";
import { z } from "zod";
import { parseRequest } from "./utils";
import { eq, and, isNotNull } from "drizzle-orm";
import { mindmaps } from "./schema";
import testTemperatures from "./testTemperature";
import { GetMindmapListEndpointResponse } from "my-types";
require("dotenv").config();

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get("/hello-world", (req, res) => {
  res.send("Hello World!");
});

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
    makeMindmap(mindmap.id);
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

app.get("/mindmap", async (req, res) => {
  const mindmapList = await db
    .select({
      title: mindmaps.title,
      description: mindmaps.description,
      id: mindmaps.id,
      videoId: mindmaps.videoId,
      spentTokens: mindmaps.spentTokens,
      nOfNodes: mindmaps.nOfNodes,
      createdAt: mindmaps.createdAt,
      status: mindmaps.status,
    })
    .from(mindmaps)
    .where(and(eq(mindmaps.status, "ok"), isNotNull(mindmaps.description)));

  res.json({
    status: "ok",
    data: { mindmapList },
  } satisfies GetMindmapListEndpointResponse);
});

app.get("/mindmap/:mindmapId", async (req, res) => {
  const mindmapId = Number(req.params.mindmapId);
  if (isNaN(mindmapId)) {
    return res.status(400).json({ status: "error", data: { mindmapId: null } });
  }
  let mindmap = await db.query.mindmaps.findFirst({
    where: eq(mindmaps.id, mindmapId),
  });

  if (mindmap) {
    if (mindmap.status !== "ok") {
      return res.json({ status: "ok", data: { status: mindmap.status } });
    } else {
      return res.json({
        status: "ok",
        data: {
          status: mindmap.status,
          mindmapData: mindmap.structure,
          videoId: mindmap.videoId,
        },
      });
    }
  } else {
    return res.status(404).json({ status: "error", data: { mindmapId: null } });
  }
});

app.get("/mindmap/video/:videoId", async (req, res) => {
  const videoId = req.params.videoId;
  let mindmap = await db.query.mindmaps.findFirst({
    where: eq(mindmaps.videoId, videoId),
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

app.post("/test", (req, res) => {
  testTemperatures();
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
