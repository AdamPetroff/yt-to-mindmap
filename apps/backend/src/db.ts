import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";
import { DB_CONNECTION_STRING } from "../constants";
require("dotenv").config();

const queryClient = postgres(DB_CONNECTION_STRING);
export const db = drizzle(queryClient, { schema });
