import type { Config } from "drizzle-kit";
import { DB_CONNECTION_STRING } from "./constants";

export default {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: DB_CONNECTION_STRING,
  },
} satisfies Config;
