import express from "express";
import {
  readCaptionsFile,
  runPy,
  createStructure,
  ytCaptionsScriptResultToText,
  openAiStructureToMindmapData,
  getTranscriptParts,
  transformItem2,
  ytCaptionsScriptResultToPromptContent,
} from "./functions";
import fs from "fs";
import path from "path";
import { openAiStructureToReactVisMindmapData } from "./reactVis";
// const cors = require("cors");
import cors from "cors";
import { MindmapNode } from "../../types";
require("dotenv").config();

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

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

  const parts = getTranscriptParts(videoId);
  const structure = await createStructure(parts);

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

// app.post("/make-mindmap/:videoId", async (req, res) => {
//   const videoId = req.params.videoId;

//   if (fs.existsSync(path.join(videoId, "mindmap.json"))) {
//     const result = JSON.parse(
//       fs.readFileSync(path.join(videoId, "mindmap.json"), "utf-8")
//     );

//     console.log("--- sending cached");

//     return res.json(result);
//   }

//   console.log(`--- mindmap creation for ${videoId} starting`);

//   const transcript = await runPy(videoId);

//   // Check if the directory exists
//   if (!fs.existsSync(videoId)) {
//     // Create the directory if it doesn't
//     fs.mkdirSync(videoId, { recursive: true }); // `recursive: true` ensures parent directories are created if they don't exist
//   }

//   fs.writeFileSync(path.join(videoId, "1.txt"), transcript.toString());

//   console.log(`--- transcript obtained`, transcript.toString().slice(0, 40));

//   const text = ytCaptionsScriptResultToText(readCaptionsFile(videoId));

//   fs.writeFileSync(path.join(videoId, "text.txt"), text);

//   console.log(`--- text obtained`, text.slice(0, 40));

//   const structure = await createStructure([text]);

//   fs.writeFileSync(
//     path.join(videoId, "structure.json"),
//     JSON.stringify(structure)
//   );

//   console.log(`--- structure obtained`);

//   const mindmapData = transformItem(structure, null);

//   console.log(`--- mindmap data obtained`);

//   fs.writeFileSync(
//     path.join(videoId, "mindmap.json"),
//     JSON.stringify(mindmapData, null, 2)
//   );

//   console.log("--- sending");

//   return res.json(mindmapData);
// });

app.post("/make-mindmap-data/:videoId", async (req, res) => {
  const videoId = req.params.videoId;

  if (fs.existsSync(path.join(videoId, "transformed.json"))) {
    const result = JSON.parse(
      fs.readFileSync(path.join(videoId, "transformed.json"), "utf-8")
    ) as MindmapNode;

    console.log("--- sending cached");

    return res.json(result);
  }

  console.log(`--- mindmap creation for ${videoId} starting`);

  const transcript = await runPy(videoId);

  // Check if the directory exists
  if (!fs.existsSync(videoId)) {
    // Create the directory if it doesn't
    fs.mkdirSync(videoId, { recursive: true }); // `recursive: true` ensures parent directories are created if they don't exist
  }

  fs.writeFileSync(path.join(videoId, "1.txt"), JSON.stringify(transcript));

  console.log(
    `--- transcript obtained`,
    JSON.stringify(transcript).slice(0, 40)
  );

  // const text = ytCaptionsScriptResultToText(readCaptionsFile(videoId));

  const promtContent = ytCaptionsScriptResultToPromptContent(
    readCaptionsFile(videoId)
  );

  fs.writeFileSync(
    path.join(videoId, "prompt-content.json"),
    JSON.stringify(promtContent)
  );

  console.log(`--- text obtained`, promtContent.slice(0, 40));

  const structure = await createStructure([JSON.stringify(promtContent)]);

  fs.writeFileSync(
    path.join(videoId, "structure.json"),
    JSON.stringify(structure)
  );
  console.log(`--- structure obtained`);

  const transformed = transformItem2(structure, "1");

  fs.writeFileSync(
    path.join(videoId, "transformed.json"),
    JSON.stringify(transformed)
  );

  console.log("--- sending");

  return res.json(transformed);
});

app.post("/test", async (req, res) => {
  const videoId = "2NZMaI-HeNU";

  const structure = JSON.parse(
    fs.readFileSync(path.join(videoId, "structure.json"), "utf-8")
  );

  const transformed = transformItem2(structure, "1");

  fs.writeFileSync(
    path.join(videoId, "transformed.json"),
    JSON.stringify(transformed)
  );
  return res.json(transformed);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
