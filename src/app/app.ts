import { App } from "@slack/bolt";
import { authorizer } from "./functions";
import initializeListeners from "./listeners";
import env from "utils/env";
import { errorHandler } from "utils/error-handler";

const app: App = new App({
  authorize: authorizer,
  appToken: env.SLACK_APP_TOKEN,
  signingSecret: env.SLACK_SIGNING_SECRET,
  socketMode: true,
  ignoreSelf: true,
  logLevel: undefined,
});

initializeListeners(app);

app.error(errorHandler);

export { app };
