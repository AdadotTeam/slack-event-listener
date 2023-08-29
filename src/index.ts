import "source-map-support/register";

import app from "app";
import env from "utils/env";
import Logger from "utils/logger";

const logger = Logger.create("app-init");

(async () => {
  try {
    await app.start(env.PORT);
    logger.info(`⚡️ Bolt app is running at port ${env.PORT}!`);
  } catch (err) {
    logger.error("Bolt app could not run", {
      error: err,
    });
  }
})();
