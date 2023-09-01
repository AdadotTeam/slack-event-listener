import got, { HTTPAlias, OptionsOfJSONResponseBody } from "got";
import Logger from "utils/logger";
import env from "utils/env";
import { URL } from "url";

const logger = Logger.create("request-backend");

export async function requestBackend<Response>(
  path: string,
  method: HTTPAlias,
  opts: OptionsOfJSONResponseBody,
  authenticate?: boolean,
  retries?: number
): Promise<Response> {
  opts.headers = {
    ...opts.headers,
    api_token: env.API_KEY,
  };

  const urlObj: URL = new URL(env.API_URL as string);
  urlObj.pathname = path;

  logger.debug(`Executing ${method.toUpperCase()}: ${urlObj.href}`, {
    method,
    origin: urlObj.origin,
    pathname: urlObj.pathname,
    searchParams: urlObj.search,
  });
  try {
    const { body } = await got[method](urlObj.href, opts);
    return body as Response;
  } catch (err) {
    if (authenticate && err.statusCode === 401 && (!retries || retries < 5)) {
      if (!retries) retries = 0;
      return await requestBackend(path, method, opts, false, retries + 1);
    }
    err.requestInfo = {
      method,
      origin: urlObj.origin,
      pathname: urlObj.pathname,
      searchParams: urlObj.search,
    };

    throw err;
  }
}
