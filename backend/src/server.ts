import express from "express";
import {
  readCaptionsFile,
  runPy,
  createStructure,
  ytCaptionsScriptResultToText,
  openAiStructureToMindmapData,
} from "./functions";
import fs from "fs";
import path from "path";
import { openAiStructureToReactVisMindmapData } from "./reactVis";
// const cors = require("cors");

const app = express();
const port = 3001;

app.use(express.json());
// app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/get-video-transcript", (req, res) => {
  const videoId = req.body.videoId;

  runPy(videoId);

  res.send("ok");
});

app.post("/transcript-to-text", (req, res) => {
  const videoId = req.body.videoId;

  const text = ytCaptionsScriptResultToText(readCaptionsFile(videoId));

  // Check if the directory exists
  if (!fs.existsSync(videoId)) {
    // Create the directory if it doesn't
    fs.mkdirSync(videoId, { recursive: true }); // `recursive: true` ensures parent directories are created if they don't exist
  }

  // Write to the file
  fs.writeFileSync(path.join(videoId, "1.txt"), text);

  res.send(text);
});

app.post("/create-structure", async (req, res) => {
  const videoId = req.body.videoId;

  const structure = await createStructure(videoId);

  fs.writeFileSync(
    path.join(videoId, "structure.json"),
    JSON.stringify(structure)
  );

  res.json(structure);
});

app.post("/create-mindmap-data", async (req, res) => {
  const videoId = req.body.videoId;

  const structure = openAiStructureToMindmapData(videoId);

  try {
    fs.writeFileSync(
      path.join(videoId, "mindmap.json"),
      JSON.stringify(structure, null, 2)
    );

    res.json(JSON.stringify(structure, null, 2));
  } catch (e: any) {
    console.log(e.message);
    throw new Error();
  }
});

app.post("/create-mindmap-data2", async (req, res) => {
  const videoId = req.body.videoId;

  const structure = openAiStructureToReactVisMindmapData(videoId);

  try {
    fs.writeFileSync(
      path.join(videoId, "mindmap2.json"),
      JSON.stringify(structure, null, 2)
    );

    res.json(JSON.stringify(structure, null, 2));
  } catch (e: any) {
    console.log(e.message);
    throw new Error();
  }
});

app.get("/mindmap-data/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  const structure = JSON.parse(
    fs.readFileSync(path.join(videoId, "mindmap.json"), "utf-8")
  );

  res.json(structure);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
