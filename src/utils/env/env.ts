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
    PROJECT_NAME: z.string(),
    PORT: z.string().transform((str) => (str ? parseInt(str, 10) : 3100)),
    SLACK_SIGNING_SECRET: z.string(),
    SLACK_APP_TOKEN: z.string(),
    ADADOT_SERVICE_TOKEN: z.string(),
    ADADOT_BACKEND_HOSTNAME: z.string(),
    REDIS_HOST: z.string().default("http://localhost"),
    REDIS_PORT: z
      .string()
      .optional()
      .transform((str) => (str ? parseInt(str, 10) : 6379)),
  })
  .parse(process.env);
