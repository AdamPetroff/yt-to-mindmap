import {
  integer,
  json,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

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
    createdAt: timestamp("created_at").defaultNow().notNull(),
    transcript: text("transcript"),
    gptResponse: json("gpt_response"),
    structure: json("structure"),
    status: statusEnum("status"),
  },
  (mindmaps) => {
    return {
      nameIndex: uniqueIndex("name_idx").on(mindmaps.videoId),
    };
  }
);
