import {
  AllMiddlewareArgs,
  App,
  GenericMessageEvent,
  SlackEventMiddlewareArgs,
  UserChangeEvent,
  UserHuddleChangedEvent,
} from "@slack/bolt";

import adadotService from "services/adadot";

import Logger from "utils/logger";
import { ReactionEventAction } from "./types";

const logger = Logger.create("events");

export default function (app: App): void {
  app.event("team_join", async (args) => {
    const payload = args.payload as unknown as UserChangeEvent;
    const {
      id: slackUserId,
      profile: { email },
    } = payload.user;

    const { orgId, botToken } = args.context;

    await adadotService.teamJoin({
      orgId,
      botToken: botToken as string,
      email: email as string,
      slackUserId,
    });
  });

  app.event("app_uninstalled", async (args) => {
    const { context } = args;
    const { orgId, teamId } = context;

    await adadotService.deleteWorkspace({ orgId, teamId: teamId as string });
  });

  app.event("message", async (args) => {
    const { context, payload } = args;
    const eventId = args.body.event_id;
    const {
      channel: channelId,
      channel_type: channelType,
      user: slackUserId,
      event_ts: eventTs,
      client_msg_id: messageId,
    } = payload as GenericMessageEvent;

    const { teamId } = context;
    const eventMessage = {
      eventId,
      messageId,
      teamId: teamId as string,
      slackUserId,
      channelId,
      channelType,
      timestamp: parseInt(eventTs, 10),
    };

    await adadotService.saveMessage(eventMessage);
  });

  app.event("user_huddle_changed", async (args) => {
    const { context, payload } = args;
    const eventId = args.body.event_id;
    const slackUserId = payload.user.id;
    const { event_ts: eventTs } = payload as UserHuddleChangedEvent;
    const huddleState = payload.user.profile.huddle_state;
    if (!huddleState) {
      logger.warn("NO HUDDLE STATE", { info: { payload, context } });
      return;
    }
    const { teamId } = context;

    const huddleMessage = {
      eventId,
      teamId: teamId as string,
      slackUserId,
      timestamp: parseInt(eventTs, 10),
      huddleState,
    };

    await adadotService.saveHuddle(huddleMessage);
  });

  app.event("reaction_added", async (args) => {
    const event = buildReactionObject(args, ReactionEventAction.added);
    if (!event) return;
    await adadotService.saveReaction(event);
  });

  app.event("reaction_removed", async (args) => {
    const event = buildReactionObject(args, ReactionEventAction.removed);
    if (!event) return;
    await adadotService.saveReaction(event);
  });
}

const buildReactionObject = (
  args: (
    | SlackEventMiddlewareArgs<"reaction_added">
    | SlackEventMiddlewareArgs<"reaction_removed">
  ) &
    AllMiddlewareArgs,
  action: ReactionEventAction
) => {
  const { context, payload } = args;
  const eventId = args.body.event_id;
  let originalAuthor;
  const { user: slackUserId, event_ts: eventTs, item: originalItem, reaction } = payload;
  if (!payload.item_user) {
    originalAuthor = "automation";
  } else originalAuthor = payload.item_user;
  const originalItemType = payload.item.type;
  const { teamId } = context;
  return {
    eventId,
    teamId: teamId as string,
    slackUserId,
    timestamp: parseInt(eventTs, 10),
    reaction,
    originalAuthor,
    originalItemType,
    originalItem,
    reactionAction: action,
  };
};
