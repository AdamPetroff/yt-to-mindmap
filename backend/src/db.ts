import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

const queryClient = postgres(
  "postgresql://postgres:password@postgres:5432/mindmap"
);
export const db = drizzle(queryClient, { schema });
