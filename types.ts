export type MindmapNode = {
  title: string;
  description: string;
  t: number;
  children?: MindmapNode[];
};

export type MindmapItem = {
  id: string;
  label: string;
  t: number;
  description: string;
  belongsTo: string | null;
  children: string[];
};

export type MindmapData = { root: string; items: Record<string, MindmapItem> };

type Status =
  | "error"
  | "fetchingTranscript"
  | "fetchingGptResponse"
  | "generatingFinalStructure"
  | "ok";

export type GetMindmapEndpointResponse = {
  status: "ok";
  data: { status: Status; mindmapData: MindmapItem };
};
