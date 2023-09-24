import fs from "fs";
require("dotenv").config();
import { spawn } from "child_process";
import path from "path";
import { MindmapData, MindmapItem, MindmapNode } from "../../types";
import {
  getMindMapJsonFromOpenApiInitial,
  getMindMapJsonFromOpenApiNext,
} from "./gpt4";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { mindmaps } from "./schema";

type ResStructure = {
  duration: number;
  start: number;
  text: string;
}[];

export type PythonScriptResponse = ResStructure[] | ResStructure;

export function readCaptionsFile(videoId: string) {
  const content = JSON.parse(fs.readFileSync(`./${videoId}.json`, "utf-8")) as
    | ResStructure[]
    | ResStructure;

  return content;
}

// Provide a JSON structure that will be used for creation of a mind map. The structure should include detailed descriptions of all relevant information, including specific instructions, steps, guidelines, and any other detailed procedures mentioned in the text. Here's the desired structure expressed as a TypeScript type: type Node = { Nodetitle: string; nodeDescription: string, children?: Node[] }. Use multiple levels of nesting to incorporate all relevant information. Ensure to capture all the nuances and specifics of the text, including individual steps of processes, detailed descriptions of exercises or procedures, and any other granular information that is crucial to understanding the content.
// Provide a JSON structure that will be used for creation of a mind map, according to the given typescript structure: type Node = { title: string; description: string, children?: Node[] }. Ensure that the structure is as detailed as possible, extensively covering all mentioned information, including specific steps, methods, instructions, or guidelines cited in the text. Ensure to use multiple levels of nesting for breakdown of main topics, subtopics, and detailed elements or steps found within those subtopics. Avoid omitting any part of the text, paying particular attention to sequences, protocols, and specific directions or processes mentioned in the text.

export function ytCaptionsScriptResultToText(
  content: ResStructure[] | ResStructure
) {
  const arr = Array.isArray(content[0])
    ? content[0]
    : (content as ResStructure);

  const str = arr.reduce((acc, item) => {
    return acc + " " + item.text;
  }, "");

  return str;
}

export function ytCaptionsScriptResultToPromptContent(
  content: ResStructure[] | ResStructure
) {
  const arr = Array.isArray(content[0])
    ? content[0]
    : (content as ResStructure);

  return arr.map((it) => ({ txt: it.text, t: it.start }));
}

export function getTranscriptParts(dir: string) {
  const files = fs.readdirSync(`./${dir}`);

  // the file names look like this : 1.txt 2.txt 3.txt
  files.sort((a, b) => {
    return parseInt(a.replace(".txt", "")) - parseInt(b.replace(".txt", ""));
  });

  return files.map((file) => {
    const content = fs.readFileSync(`./${dir}/${file}`, "utf-8");
    return content;
  });
}

export async function createStructure(parts: string[]) {
  // const parts = getTranscriptParts(videoId);

  if (parts.length === 0) {
    throw new Error("No parts");
  } else if (parts.length === 1) {
    return await getMindMapJsonFromOpenApiInitial(parts[0]);
  } else {
    console.log(`Part 1 started`);
    let result = await getMindMapJsonFromOpenApiInitial(parts[0]);
    console.log(`Part 1 done`);
    fs.writeFileSync(`temp/temp-${0}.json`, JSON.stringify(result));

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];

      console.log(`Part ${i + 1} started`);
      const res = await getMindMapJsonFromOpenApiNext(part, result);
      console.log(`Part ${i + 1} done`);

      result = res;
      fs.writeFileSync(`temp/temp-${i}.json`, JSON.stringify(res));
    }

    return result;
  }
}

// export function transformItem(
//   item: MindmapNode,
//   parentNodeId: string | null
// ): { nodes: any[]; edges: any[] } {
//   const id =
//     (parentNodeId ? parentNodeId + "-" : "") +
//     item.nodeName.replace(/[ ]/g, "_");

//   const { nodes, edges } = item.children
//     ? item.children.reduce(
//         (acc, it) => {
//           const res = transformItem(it, id);
//           return {
//             nodes: [...acc.nodes, ...res.nodes],
//             edges: [...acc.edges, ...res.edges],
//           };
//         },
//         { nodes: [] as any[], edges: [] as any[] }
//       )
//     : { nodes: [], edges: [] };

//   return {
//     nodes: [
//       {
//         id: id,
//         data: { label: item.nodeName },
//         position: { x: 0, y: 0 },
//       },
//       ...nodes,
//     ],
//     edges: [
//       ...(parentNodeId
//         ? [
//             {
//               id: "arrow-" + id + "-" + parentNodeId,
//               source: parentNodeId,
//               target: id,
//               type: "smoothstep",
//               animated: false,
//             },
//           ]
//         : []),
//       ...edges,
//     ],
//   };
// }

export function transformItem2(item: MindmapNode, id: string): MindmapData {
  const transformed: Record<string, MindmapItem> = {};

  console.log(item);

  function transformNode(
    node: MindmapNode,
    currentId: string,
    parent: string | null
  ) {
    const childrenIds =
      node.children?.map((_, i) => `${currentId}-${i + 1}`) || [];

    console.log("here", currentId);
    transformed[currentId] = {
      id: currentId,
      label: node.title,
      description: node.description,
      t: node.t,
      belongsTo: parent,
      children: childrenIds,
    };
    console.log("added");

    node.children?.forEach((child, i) => {
      console.log("childo");
      transformNode(child, `${currentId}-${i + 1}`, currentId);
    });
  }

  transformNode(item, id, null);

  console.log(transformed);

  return { items: transformed, root: id };
}

export function openAiStructureToMindmapData(videoId: string) {
  const res = JSON.parse(
    fs.readFileSync(path.join(videoId, "structure.json"), "utf-8")
  );

  // const tranformed = transformItem(res, null);

  return "";
}

export function getNodesAndEdges(videoId: string) {
  const { nodes, edges } = JSON.parse(
    fs.readFileSync(path.join(videoId, "mindmap.json"), "utf-8")
  ) as { nodes: any[]; edges: any[] };

  return { nodes, edges };
}

export async function runPy(videoId: string) {
  return new Promise<PythonScriptResponse>((resolve, reject) => {
    const pythonProcess = spawn("python3", [
      "get-transcript.py",
      videoId,
      `${videoId}.json`,
    ]);

    pythonProcess.stdout.on("data", (data) => {
      // console.log(`Python Output: ${data}`);

      console.log((data.toString() as string).slice(0, 100));

      resolve(JSON.parse(data));
    });

    pythonProcess.stderr.on("data", (data) => {
      console.error(`Python Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
      // resolve();
      console.log(`Python script exited with code ${code}`);
    });
  });
}

export async function makeMindmap(mindmapId: number) {
  let mindmap = await db.query.mindmaps.findFirst({
    where: eq(mindmaps.id, mindmapId),
  });
  if (!mindmap) {
    throw new Error("Mindmap not found");
  } else if (mindmap.status === "ok") {
    return;
  }

  if (mindmap.status === "error") {
    const transcript = await runPy(mindmap.videoId);

    const res = await db
      .update(mindmaps)
      .set({
        transcript: JSON.stringify(transcript),
        status: "fetchingGptResponse",
      })
      .where(eq(mindmaps.id, mindmapId))
      .returning();

    mindmap = res[0];
  }

  if (mindmap.status === "fetchingGptResponse") {
    const promtContent = ytCaptionsScriptResultToPromptContent(
      mindmap.gptResponse as ResStructure
    );
    const structure = await createStructure([JSON.stringify(promtContent)]);

    const res = await db
      .update(mindmaps)
      .set({
        gptResponse: JSON.stringify(structure),
        status: "generatingFinalStructure",
      })
      .where(eq(mindmaps.id, mindmapId))
      .returning();

    mindmap = res[0];
  }

  if (mindmap.status === "generatingFinalStructure") {
    const transformed = transformItem2(mindmap.gptResponse as MindmapNode, "1");

    const res = await db
      .update(mindmaps)
      .set({
        structure: JSON.stringify(transformed),
        status: "ok",
      })
      .where(eq(mindmaps.id, mindmapId))
      .returning();

    mindmap = res[0];
  }

  return mindmap;
}
