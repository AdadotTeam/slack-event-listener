import { ErrorHandler } from "@slack/bolt/dist/App";
import { NonUserEventError } from "app/exceptions/non-user-event-error";
import Logger from "utils/logger";

const logger = Logger.create("error-handler");

export const errorHandler: ErrorHandler = async (error) => {
  if (error instanceof NonUserEventError || error.name === "NonUserEventError") {
    return;
  }
  logger.error("Bolt error occurred", { error });
};
