import Redis from "ioredis";
import env from "utils/env";

export default new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
});
