import Logger from "utils/logger";
import { Authorize, AuthorizeSourceData } from "@slack/bolt";
import { NonUserEventError } from "app/exceptions/non-user-event-error";
import adadotService from "services/adadot";

const logger = Logger.create("authorizer");

export const authorizer: Authorize<boolean> = async (
  source: AuthorizeSourceData<boolean>,
  body: any
) => {
  const teamId = source.teamId as string;

  logger.info(`Received event: ${body.event.type}`, {
    info: {
      type: body.event.type,
      user: body.event.user,
      team: body.event.team,
      channel: body.event.channel,
      channelType: body.event.channel_type,
      ts: body.event.ts,
    },
  });

  if (
    !body.event.user ||
    body.event.subtype === "bot_message" ||
    body.event.bot_id ||
    body.event.bot_profile
  ) {
    logger.warn("Bot event ignored");
    throw new NonUserEventError();
  }

  const workspaceMeta = await adadotService.getWorkspaceMeta(teamId);

  const { objectId: orgId, botToken, botUserId } = workspaceMeta;

  logger.debug("Authorizing action", {
    orgId,
    teamId,
    botToken,
    botUserId,
  });

  return {
    orgId,
    teamId,
    botId: undefined,
    botToken,
    botUserId,
  };
};
