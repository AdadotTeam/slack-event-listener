import chalk from "chalk";
import { RequestError } from "got";
import * as winston from "winston";

const stripAnsi = (() => {
  const pattern = [
    "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
    "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
  ].join("|");
  const regex = new RegExp(pattern, "g");
  return (str: string) => {
    return str.replace(regex, "");
  };
})();

/*
 * Enumerable properties show up in for...in loops
 * but the Error object properties are set not to be Enumerable.
 * While calling JSON.stringify(err), most of it's properties don't show
 * because JSON.stringify internally uses something like for...in or Object.keys(err)
 * Bellow we replace the Error with new object which all it's properties are enumerable.
 */

const errorObjectFormat = winston.format((info) => {
  if (info.error instanceof Error) {
    const enumeratedErrorObject = {} as any;
    Object.getOwnPropertyNames(info.error).forEach((key: string) => {
      if (info.error instanceof RequestError && ["request", "response", "options"].includes(key)) {
        return;
      }
      enumeratedErrorObject[key] = info.error[key];
    });
    info.error = enumeratedErrorObject;
  }
  return info;
});

/*
 * Simple helper for stringifying all remaining
 * properties.
 */
function rest(info: Record<string, unknown>): string {
  if (Object.keys(info).length === 0) {
    return "";
  }

  delete (info.error as any)?.logged;

  info.level = stripAnsi(info.level as string);
  info.logDate = new Date();

  return chalk.grey(`\n${JSON.stringify(info)}`);
}

const Logger = {
  create: (logName?: string) => {
    const logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            errorObjectFormat(),
            winston.format.colorize(),
            winston.format.printf((info) => `[${info.level}] ${info.message}${rest(info)}`)
          ),
        }),
      ],
      defaultMeta: {
        ...(logName && { logName }),
      },
    });

    return {
      info: (
        message: string,
        {
          info,
        }: {
          info?: object;
        } = {}
      ) => {
        logger.info(message, {
          info,
        });
      },
      error: (
        message: string,
        {
          info,
          error,
        }: {
          info?: object;
          error?: any;
        } = {}
      ) => {
        if (!error || !error.logged) {
          if (error) error.logged = true;
          logger.error(`${message}: ${error?.message}`, {
            info,
            error,
          });
        }
      },
      debug: (message: string, info?: object) => {
        logger.debug(message, { info });
      },
      warn: (
        message: string,
        {
          info,
          error,
        }: {
          info?: object;
          error?: any;
        } = {}
      ) => {
        if (!error || !error.logged) {
          if (error) error.logged = true;
          logger.warn(`${message}: ${error?.message}`, {
            info,
            error,
          });
        }
      },
    };
  },
};

export default Logger;
