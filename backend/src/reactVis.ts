import fs from "fs";
import path from "path";

type ResultItem = { nodeName: string; children: ResultItem[] };

let _id = 0;

function transformItem(
  item: ResultItem,
  parentNodeId: number | null
): { nodes: any[]; links: any[] } {
  const id = _id + 1;
  _id += 1;
  // const id =
  //   (parentNodeId ? parentNodeId + "-" : "") +
  //   item.nodeName.replace(/[ ]/g, "_");

  const { nodes, links } = item.children
    ? item.children.reduce(
        (acc, it) => {
          const res = transformItem(it, id);
          return {
            nodes: [...acc.nodes, ...res.nodes],
            links: [...acc.links, ...res.links],
          };
        },
        { nodes: [] as any[], links: [] as any[] }
      )
    : { nodes: [], links: [] };

  return {
    nodes: [
      {
        id: id,
        label: item.nodeName,
        title: item.nodeName,
      },
      ...nodes,
    ],
    links: [
      ...(parentNodeId
        ? [
            {
              source: parentNodeId,
              target: id,
              // id: id + "-link",
            },
          ]
        : []),
      ...links,
    ],
  };
}

export function openAiStructureToReactVisMindmapData(videoId: string) {
  const res = JSON.parse(
    fs.readFileSync(path.join(videoId, "structure.json"), "utf-8")
  );

  const tranformed = transformItem(res, null);

  return tranformed;
}
