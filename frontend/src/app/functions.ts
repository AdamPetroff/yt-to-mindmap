import fs from "fs";
import { Configuration, OpenAIApi } from "openai";
import { Edge, Node } from "reactflow";

export function ytCaptionsScriptResultToText() {
  const content = JSON.parse(
    fs.readFileSync("./transcripts.json", "utf-8")
  ) as {
    duration: number;
    start: number;
    text: string;
  }[][];

  const str = content[0].reduce((acc, item) => {
    return acc + " " + item.text;
  }, "");

  fs.writeFileSync("transcript.txt", str);
}

export async function saveMindMapJsonFromOpenApi() {
  const transcript = fs.readFileSync("./lsd.txt", "utf-8");

  const configuration = new Configuration({
    // organization: "YOUR_ORG_ID",
    apiKey: "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",
  });
  const openai = new OpenAIApi(configuration);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0613",
      messages: [{ role: "user", content: transcript }],
      function_call: { name: "get_mind_map" },
      functions: [
        {
          name: "get_mind_map",
          description:
            "Provide JSON that can serve in creation of a mind map. Do this for every user message.",
          parameters: {
            type: "object",
            properties: {
              jsonString: {
                type: "string",
                description:
                  "The JSON string that will be used for creation of a mind map. Example: { nodeName: 'main node title' children: [{ nodeName: 'sub node 1', children:[{ nodeName: 'sub sub node 1', children:[...] }] }, ...] }",
              },
            },
          },
        },
      ],
    });

    fs.writeFileSync("res.json", JSON.stringify(response.data));
    console.log("ok");
  } catch (e: any) {
    console.log(e.message);
  }
}

type ResultItem = { nodeName: string; children: ResultItem[] };

function transformItem(
  item: ResultItem,
  parentNodeId: string | null
): { nodes: Node[]; edges: Edge[] } {
  const id =
    (parentNodeId ? parentNodeId + "-" : "") +
    item.nodeName.replace(/[ ]/g, "_");

  console.log(item);

  const { nodes, edges } = item.children
    ? item.children.reduce(
        (acc, it) => {
          const res = transformItem(it, id);
          return {
            nodes: [...acc.nodes, ...res.nodes],
            edges: [...acc.edges, ...res.edges],
          };
        },
        { nodes: [] as Node[], edges: [] as Edge[] }
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

export function openAiResultToNiceJSON() {
  const res = JSON.parse(fs.readFileSync("./res.json", "utf-8"));

  console.log(res, "--------------");
  const tranformed = transformItem(res, null);

  try {
    fs.writeFileSync("product.json", JSON.stringify(tranformed, null, 2));

    return tranformed;
  } catch (e: any) {
    console.log(e.message);
    throw new Error();
  }
}

export function getNodesAndEdges() {
  const { nodes, edges } = JSON.parse(
    fs.readFileSync("./product.json", "utf-8")
  ) as { nodes: Node[]; edges: Edge[] };

  return { nodes, edges };
}
