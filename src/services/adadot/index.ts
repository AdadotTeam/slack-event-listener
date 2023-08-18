import redisClient from "utils/clients/redis";
import AdadotService from "./adadot-service";
import env from "utils/env";

const adadotService = new AdadotService({
  redisClient,
  backendHostname: env.ADADOT_BACKEND_HOSTNAME,
  token: env.ADADOT_SERVICE_TOKEN,
});

export default adadotService;
