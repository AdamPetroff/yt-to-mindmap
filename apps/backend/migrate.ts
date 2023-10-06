import { DB_CONNECTION_STRING } from "./constants";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";

(async () => {
  const connectionString = DB_CONNECTION_STRING;
  const sql = postgres(connectionString, { max: 1 });
  const db = drizzle(sql);

  await migrate(db, { migrationsFolder: "drizzle" });
})();
