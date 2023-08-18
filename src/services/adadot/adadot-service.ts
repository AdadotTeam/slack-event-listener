import { Redis } from "ioredis";
import { RequestSlackWorkspaceResponse } from "./adadot-types";
import { HuddleEvent, MessageEvent, ReactionEvent } from "app/listeners/types";
import env from "utils/env";
import got, { HTTPAlias, OptionsOfJSONResponseBody } from "got";
import logger from "utils/logger";

const log = logger.create();

class AdadotService {
  private redisClient: Redis;
  private token: string;
  private backendHostname: string;

  constructor({
    redisClient,
    token,
    backendHostname,
  }: {
    redisClient: Redis;
    token: string;
    backendHostname: string;
  }) {
    this.redisClient = redisClient;
    this.token = token;
    this.backendHostname = backendHostname;
  }

  private async requestSlackWorkspace(params: {
    teamId: string;
  }): Promise<RequestSlackWorkspaceResponse> {
    const response = await this.requestBackend<RequestSlackWorkspaceResponse>(
      "api/slack/workspace",
      "post",
      {
        headers: {
          accept: "application/json",
        },
        responseType: "json",
        json: params,
      }
    );
    return response;
  }

  public async teamJoin(params: {
    orgId: string;
    botToken: string;
    email: string;
    slackUserId: string;
  }): Promise<void> {
    await this.requestBackend("api/slack/team-join", "post", {
      headers: {
        accept: "application/json",
      },
      json: params,
    });
  }

  public async deleteWorkspace(params: { orgId: string; teamId: string }): Promise<void> {
    await this.requestBackend("api/slack/workspace", "delete", {
      headers: {
        accept: "application/json",
      },
      json: params,
    });

    this.redisClient.del(`workspace-${params.teamId}`);
  }

  private async requestBackend<Response>(
    path: string,
    method: HTTPAlias,
    opts: OptionsOfJSONResponseBody,
    retries?: number
  ): Promise<Response> {
    opts.headers = {
      ...opts.headers,
      authorization: `Bearer ${this.token}`,
    };

    const urlObj: URL = new URL(this.backendHostname);
    urlObj.pathname = path;

    log.debug(`Executing ${method.toUpperCase()}: ${urlObj.href}`, {
      method,
      origin: urlObj.origin,
      pathname: urlObj.pathname,
      searchParams: urlObj.search,
    });
    try {
      const { body } = await got[method](urlObj.href, opts);
      return body as Response;
    } catch (err) {
      if (!retries || retries < 5) {
        if (!retries) retries = 0;
        return await this.requestBackend(path, method, opts, retries + 1);
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

  public async authorize() {
    if (!env.ADADOT_SERVICE_TOKEN) {
      throw new Error("Missing ADADOT_SERVICE_TOKEN environment variable");
    }
    // this.requestBackend -> check authorization with this.token
  }

  public async getWorkspaceMeta(teamId: string): Promise<RequestSlackWorkspaceResponse> {
    const key = `workspace-${teamId}`;
    const meta = await this.redisClient.get(key);
    let workspaceMeta = meta && JSON.parse(meta);
    if (!workspaceMeta) {
      workspaceMeta = await this.requestSlackWorkspace({ teamId });
      await this.redisClient.set(key, JSON.stringify(meta));
    }
    return workspaceMeta;
  }

  public async saveMessage(event: MessageEvent): Promise<void> {
    event.messageId = event.messageId || event.eventId;
    await this.requestBackend("api/slack/saveMessage", "post", {
      headers: {
        accept: "application/json",
      },
      json: event,
    });
  }

  public async saveHuddle(huddle: HuddleEvent): Promise<void> {
    await this.requestBackend("api/slack/saveHuddle", "post", {
      headers: {
        accept: "application/json",
      },
      json: huddle,
    });
  }

  public async saveReaction(reaction: ReactionEvent): Promise<void> {
    await this.requestBackend("api/slack/saveReaction", "post", {
      headers: {
        accept: "application/json",
      },
      json: reaction,
    });
  }
}

export default AdadotService;
