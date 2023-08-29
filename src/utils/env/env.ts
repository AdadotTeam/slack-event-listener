import * as z from "zod";
import { loadEnv } from "./functions";
loadEnv();

export const env = z
  .object({
    ENVIRONMENT_NAME: z
      .string()
      .optional()
      .transform((str) => str || "local"),
    LOG_LEVEL: z.string(),
    PORT: z.string().transform((str) => (str ? parseInt(str, 10) : 3100)),
    SLACK_SIGNING_SECRET: z.string(),
    SLACK_APP_TOKEN: z.string(),
    SLACK_BOT_TOKEN: z.string(),
    API_URL: z.string().optional(),
  })
  .parse(process.env);
