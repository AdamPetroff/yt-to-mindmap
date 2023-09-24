if (!process.env.NEXT_PUBLIC_BE_URL) {
  throw new Error("NEXT_PUBLIC_BE_URL is not set");
}

export const API_URL = process.env.NEXT_PUBLIC_BE_URL;
