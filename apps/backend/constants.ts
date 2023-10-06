require("dotenv").config();

if (!process.env.DB_CONNECTION_STRING) {
  throw new Error("DB_CONNECTION_STRING is not set");
}
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
