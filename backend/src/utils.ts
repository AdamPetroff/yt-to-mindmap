import { AnyZodObject, ZodError, z } from "zod";
import { Request } from "express"

export class RequestParseError extends Error {}

/** @throws */
export function parseRequest<T extends AnyZodObject>(
  schema: T,
  req: Request
): z.infer<T> {
  try {
    return schema.parse(req);
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues
        .map((issue) =>
          issue.code === "custom"
            ? issue.message
            : `${issue.path.filter((item) => item !== "body").join(": ")}: ${
                issue.message
              }`
        )
        .join(";");

      throw new RequestParseError(message);
    }
    throw error;
  }
}
