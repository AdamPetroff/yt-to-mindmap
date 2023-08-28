import fs from "fs";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
require("dotenv").config();

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY env variable is not set");
}

const OpenAIApiKey = process.env.OPENAI_API_KEY;

type ResStructure = {
  duration: number;
  start: number;
  text: string;
}[];

export function ytCaptionsScriptResultToText(src: string) {
  const content = JSON.parse(fs.readFileSync(`./${src}.json`, "utf-8")) as
    | ResStructure[]
    | ResStructure;

  const arr = Array.isArray(content[0])
    ? content[0]
    : (content as ResStructure);

  const str = arr.reduce((acc, item) => {
    return acc + " " + item.text;
  }, "");

  if (!fs.existsSync(src)) {
    // Create the directory if it doesn't
    fs.mkdirSync(src, { recursive: true }); // `recursive: true` ensures parent directories are created if they don't exist
  }

  fs.writeFileSync(`${src}/1.txt`, str);
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

  return JSON.parse(JSON.parse(targetJson || "").jsonString);
}

const taskDef1 = `Provide JSON structure that will be used for creation of a mind map`;
const taskDef2 = `Analyze a given long-form text and extract key points to create a structured hierarchical tree. The tree should start with the main topic as the root node, and then branch out into subtopics. Each subtopic should further branch out into more specific points. Ensure that the sub-points are not too broad and contain useful, detailed, and relevant information. The model should be able to understand the content, identify the main points and sub-points, and organize them in a structured, hierarchical manner. The output should provide a clear and concise summary of the main ideas and details presented in the text.`;
const taskDefNext1 = `Finish the provided JSON structure (which will be used for creation of a mind map) with the provided text. Use the provided JSON structure as a starting point and add more information from the provided text to it. You can also change the structure if you think it's necessary, but keep the previous information.`;
const taskDefNext2 = `Analyze a given long-form text and use it to complete and expand a provided JSON structure. The JSON structure serves as a starting point, representing a hierarchical tree with the main topic as the root node and subtopics as branches. The model should understand the content of the text, identify the main points and sub-points, and incorporate this information into the existing JSON structure. The model can also modify the structure if necessary for better organization or clarity. The sub-points should be specific, detailed, and contain useful information derived from the text. The goal is to create a comprehensive and concise JSON structure that accurately represents the key ideas and details from the text.`;

export async function getMindMapJsonFromOpenApiInitial(transcript: string) {
  // const transcript = fs.readFileSync(`./${src}`, "utf-8");

  try {
    return await getResponseFromGPT4({
      temperature: 0,
      messages: [{ role: "user", content: transcript }],
      fcDescription: taskDef1,
      jsonPropDescription:
        "The JSON structure. Here's the desired structure expressed as a TypeScript type: type Node = { nodeName: string; children: Node[] }. Use multiple levels of nesting to incorporate all relevant information.",
    });
  } catch (e: any) {
    console.log(e.response.data);
  }
}

export async function getMindMapJsonFromOpenApiNext(
  transcript: string,
  currentJson: any
) {
  try {
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
  } catch (e: any) {
    console.log(e.response.data);
  }
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

export async function work() {
  const parts = getTranscriptParts("posture");

  if (parts.length === 0) {
    return;
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

// function transformItem(item: ResultItem, parent: ResultItem | null): Node[] {
//   return [
//     {
//       id:
//         item.nodeName.replace(/[ ]/g, "-") +
//         "-" +
//         parent?.nodeName.replace(/[ ]/g, "-"),
//       data: { label: item.nodeName },
//       position: { x: 0, y: 0 },
//     },
//     ...item.children.map((it) => transformItem(it, item)),
//   ].flat();
// }

export function openAiResultToNiceJSON() {
  // const res = JSON.parse(fs.readFileSync("./res.json", "utf-8"));
  // const json = JSON.parse(
  //   JSON.parse(res.choices[0].message?.function_call?.arguments || "")
  //     .jsonString
  // ) as ResultItem;
  // const tranformed = json;
  // try {
  //   fs.writeFileSync(
  //     "product.json",
  //     JSON.stringify(transformItem(json), null, 2)
  //   );
  //   console.log("ok");
  // } catch (e: any) {
  //   console.log(e.message);
  // }
}
