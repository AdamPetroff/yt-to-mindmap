import fs from "fs";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
require("dotenv").config();
import { spawn } from "child_process";
import path from "path";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY env variable is not set");
}

const OpenAIApiKey = process.env.OPENAI_API_KEY;

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

const configuration = new Configuration({
  // organization: "YOUR_ORG_ID",
  apiKey: OpenAIApiKey,
});
const openai = new OpenAIApi(configuration);

async function getResponseFromGPT4({
  messages,
  temperature,
  fcDescription,
  jsonPropDescription,
}: {
  messages: ChatCompletionRequestMessage[];
  temperature: number;
  fcDescription: string;
  jsonPropDescription: string;
}) {
  const response = await openai.createChatCompletion({
    model: "gpt-4-0613",
    messages,
    temperature,
    max_tokens: 2000,
    function_call: { name: "get_mind_map" },
    functions: [
      {
        name: "get_mind_map",
        description: fcDescription,
        parameters: {
          type: "object",
          properties: {
            jsonString: {
              type: "string",
              description: jsonPropDescription,
            },
          },
        },
      },
    ],
  });

  const targetJson =
    typeof response.data.choices[0].message?.function_call?.arguments ===
    "string"
      ? response.data.choices[0].message?.function_call?.arguments
      : response.data.choices[0].message?.function_call?.arguments;

  return JSON.parse(JSON.parse(targetJson || "").jsonString) as ResultItem;
}

const taskDef1 = `Provide JSON structure that will be used for creation of a mind map`;
const taskDef2 = `Analyze a given long-form text and extract key points to create a structured hierarchical tree. The tree should start with the main topic as the root node, and then branch out into subtopics. Each subtopic should further branch out into more specific points. Ensure that the sub-points are not too broad and contain useful, detailed, and relevant information. The model should be able to understand the content, identify the main points and sub-points, and organize them in a structured, hierarchical manner. The output should provide a clear and concise summary of the main ideas and details presented in the text.`;
const taskDefNext1 = `Finish the provided JSON structure (which will be used for creation of a mind map) with the provided text. Use the provided JSON structure as a starting point and add more information from the provided text to it. You can also change the structure if you think it's necessary, but keep the previous information.`;
const taskDefNext2 = `Analyze a given long-form text and use it to complete and expand a provided JSON structure. The JSON structure serves as a starting point, representing a hierarchical tree with the main topic as the root node and subtopics as branches. The model should understand the content of the text, identify the main points and sub-points, and incorporate this information into the existing JSON structure. The model can also modify the structure if necessary for better organization or clarity. The sub-points should be specific, detailed, and contain useful information derived from the text. The goal is to create a comprehensive and concise JSON structure that accurately represents the key ideas and details from the text.`;

export async function getMindMapJsonFromOpenApiInitial(transcript: string) {
  // const transcript = fs.readFileSync(`./${src}`, "utf-8");

  return await getResponseFromGPT4({
    temperature: 0,
    messages: [{ role: "user", content: transcript }],
    fcDescription: taskDef1,
    jsonPropDescription:
      "The JSON structure. Here's the desired structure expressed as a TypeScript type: type Node = { nodeName: string; children: Node[] }. Use multiple levels of nesting to incorporate all relevant information.",
  });
}

export async function getMindMapJsonFromOpenApiNext(
  transcript: string,
  currentJson: any
) {
  const res = await getResponseFromGPT4({
    temperature: 0,
    messages: [
      { role: "user", content: JSON.stringify(currentJson) },
      { role: "user", content: transcript },
    ],
    fcDescription: taskDefNext1,
    jsonPropDescription:
      "The JSON structure. The structure expressed as a TypeScript type: type Node = { nodeName: string; children: Node[] }. Use multiple levels of nesting to incorporate all relevant information.",
  });

  console.log(
    JSON.stringify(currentJson).length,
    transcript.length,
    JSON.stringify(res).length
  );

  return res;
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

type ResultItem = { nodeName: string; children: ResultItem[] };

export function transformItem(
  item: ResultItem,
  parentNodeId: string | null
): { nodes: any[]; edges: any[] } {
  const id =
    (parentNodeId ? parentNodeId + "-" : "") +
    item.nodeName.replace(/[ ]/g, "_");

  const { nodes, edges } = item.children
    ? item.children.reduce(
        (acc, it) => {
          const res = transformItem(it, id);
          return {
            nodes: [...acc.nodes, ...res.nodes],
            edges: [...acc.edges, ...res.edges],
          };
        },
        { nodes: [] as any[], edges: [] as any[] }
      )
    : { nodes: [], edges: [] };

  return {
    nodes: [
      {
        id: id,
        data: { label: item.nodeName },
        position: { x: 0, y: 0 },
      },
      ...nodes,
    ],
    edges: [
      ...(parentNodeId
        ? [
            {
              id: "arrow-" + id + "-" + parentNodeId,
              source: parentNodeId,
              target: id,
              type: "smoothstep",
              animated: false,
            },
          ]
        : []),
      ...edges,
    ],
  };
}

export function openAiStructureToMindmapData(videoId: string) {
  const res = JSON.parse(
    fs.readFileSync(path.join(videoId, "structure.json"), "utf-8")
  );

  const tranformed = transformItem(res, null);

  return tranformed;
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
