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
  data: { status: Status; mindmapData: MindmapData; videoId: string };
};

export type GetMindmapListEndpointResponse = {
  status: "ok";
  data: {
    mindmapList: {
      title: string;
      description: string | null;
      id: number;
      videoId: string;
      spentTokens: number | null;
      nOfNodes: number | null;
      createdAt: Date;
    }[];
  };
};
