import { existsSync } from "fs";
import * as dotenv from "dotenv";

/**
 * Possible paths for `.env` file.
 */
const dotfilePaths: string[] = ["./.env", "../../.env", "~/.env"];

/*
 * Don't forget to validate env with Zod.
 */
export function loadEnv(): void {
  for (const path of dotfilePaths) {
    if (existsSync(path)) {
      dotenv.config({
        path,
      });
    }
  }
}
