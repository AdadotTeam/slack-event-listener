import { retryPolicies, WebClient as SlackClient } from "@slack/web-api";

export const slackClient = (token: string) =>
  new SlackClient(token, {
    rejectRateLimitedCalls: true,
    retryConfig: retryPolicies.fiveRetriesInFiveMinutes,
  });
