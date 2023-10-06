import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { PythonScriptResponse } from "./functions";

// declaring enum in database
export const statusEnum = pgEnum("status", [
  "fetchingTranscript",
  "fetchingGptResponse",
  "generatingFinalStructure",
  "ok",
  "error",
]);

export const mindmaps = pgTable(
  "mindmaps",
  {
    id: serial("id").primaryKey(),
    videoId: varchar("video_id", { length: 256 }).notNull(),
    title: varchar("title", { length: 256 }).notNull(),
    description: text("description"),
    spentTokens: integer("spent_tokens").default(0),
    nOfNodes: integer("n_of_nodes").default(0),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    transcript: jsonb("transcript").$type<PythonScriptResponse | null>(),
    gptResponse: jsonb("gpt_response"),
    structure: jsonb("structure"),
    status: statusEnum("status"),
  },
  (mindmaps) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(mindmaps.videoId),
    };
  }
);
