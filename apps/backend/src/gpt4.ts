import { MindmapNode } from "my-types";
import { OPENAI_API_KEY } from "../constants";
import OpenAI from "openai";
import fs from "fs";

const openai = new OpenAI({
  apiKey: "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",
  // organization: "Personal",
});

export async function getResponseFromGPT4({
  messages,
  temperature,
  fcDescription,
  jsonPropDescription,
}: {
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  temperature: number;
  fcDescription: string;
  jsonPropDescription: string;
}) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-0613",
      messages,
      temperature,
      // max_tokens: 2000,
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

    // console.log(JSON.stringify(response.data.choices, null, 2));

    const choice = response.choices[0];

    if (
      choice.finish_reason === "length" ||
      choice.finish_reason === "content_filter"
    ) {
      throw new Error(choice.finish_reason);
    }

    const targetJson =
      typeof choice.message.function_call?.arguments === "string"
        ? choice.message.function_call.arguments
        : choice.message.function_call?.arguments;

    const parsedJson = JSON.parse(
      JSON.parse(targetJson || "").jsonString
    ) as MindmapNode;

    return { parsedJson, spentTokens: response.usage?.total_tokens };
  } catch (e) {
    console.log(e);
    throw new Error(e.message);
  }
}

const taskDef1 = `Provide a JSON Object that will be used for creation of a mind map`;
const taskDef2 = `Analyze a given long-form text and extract key points to create a structured hierarchical tree. The tree should start with the main topic as the root node, and then branch out into subtopics. Each subtopic should further branch out into more specific points. Ensure that the sub-points are not too broad and contain useful, detailed, and relevant information. The model should be able to understand the content, identify the main points and sub-points, and organize them in a structured, hierarchical manner. The output should provide a clear and concise summary of the main ideas and details presented in the text.`;
const taskDefNext1 = `Finish the provided JSON structure (which will be used for creation of a mind map) with the provided text. Use the provided JSON structure as a starting point and add more information from the provided text to it. You can also change the structure if you think it's necessary, but keep the previous information.`;
const taskDefNext2 = `Analyze a given long-form text and use it to complete and expand a provided JSON structure. The JSON structure serves as a starting point, representing a hierarchical tree with the main topic as the root node and subtopics as branches. The model should understand the content of the text, identify the main points and sub-points, and incorporate this information into the existing JSON structure. The model can also modify the structure if necessary for better organization or clarity. The sub-points should be specific, detailed, and contain useful information derived from the text. The goal is to create a comprehensive and concise JSON structure that accurately represents the key ideas and details from the text.`;

const taskDefDescription0 = `The JSON structure. Here's the desired structure expressed as a TypeScript type: type Node = { nodeName: string; children: Node[] }. Use multiple levels of nesting to incorporate all relevant information.`;
const taskDefDescription1 = `The JSON structure that will be used for creation of a mind map, according to the given typescript structure: type Node = { title: string; description: string, children?: Node[] }. Ensure that the structure is as detailed as possible, extensively covering all mentioned information, including specific steps, methods, instructions, or guidelines cited in the text. Ensure to use multiple levels of nesting for breakdown of main topics, subtopics, and detailed elements or steps found within those subtopics. Avoid omitting any part of the text, paying particular attention to sequences, protocols, and specific directions or processes mentioned in the text.`;
const taskDefDescription2 = `The given input will be transcript for a video in the form of an array of objects with properties "txt" (text), and "t" (timestamp). Provide a JSON structure according to the following typescript structure: type Node = { title: string; description: string, t: number, children?: Node[] }. The description should include all the important information discussed about the particular topic. Ensure that the structure is as detailed as possible, extensively covering all mentioned information, including specific steps, methods, instructions, or guidelines cited in the text. Ensure to use multiple levels of nesting for breakdown of main topics, subtopics, and detailed elements or steps found within those subtopics. Avoid omitting any part of the text, paying particular attention to sequences, protocols, and specific directions or processes mentioned in the text. The JSON structure should be an object (not array) which is the main Node object which will include all the children.`;

export async function getMindMapJsonFromOpenApiInitial(transcript: string) {
  // const transcript = fs.readFileSync(`./${src}`, "utf-8");

  return await getResponseFromGPT4({
    temperature: 0.6,
    messages: [{ role: "user", content: transcript }],
    fcDescription: taskDef1,
    jsonPropDescription: taskDefDescription2,
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
