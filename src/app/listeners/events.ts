import {
  AllMiddlewareArgs,
  App,
  GenericMessageEvent,
  SlackEventMiddlewareArgs,
  UserChangeEvent,
  UserHuddleChangedEvent,
} from "@slack/bolt";
import {
  channelCreated,
  channelRenamed,
  deleteWorkspace,
  huddleStateChanged,
  memberJoinedChannel,
  messageReceived,
  reactionAdded,
  reactionRemoved,
  teamJoin,
} from "services/backend/endpoints";
import { v4 as uuid } from "uuid";
import {
  MessagesToReactionsAssociationEntry,
  ReactionEntry,
  SlackEntryTypesV1,
  UsersToReactionsAssociationEntry,
} from "app/listeners/types";
import Logger from "utils/logger";
import { slackClient } from "services/slack-api";
import { ReactionEventAction } from "services/backend/types/reactions";
import DateUtil from "utils/date";

const logger = Logger.create("events");

export default function (app: App): void {
  app.event("team_join", async (args) => {
    const payload = args.payload as unknown as UserChangeEvent;
    const {
      id: slackUserId,
      profile: { email },
    } = payload.user;

    const { orgId, botToken } = args.context;

    await teamJoin({
      orgId,
      botToken: botToken as string,
      email: email as string,
      slackUserId,
    });
  });

  app.event("app_uninstalled", async (args) => {
    const { context } = args;
    const { orgId, teamId } = context;

    await deleteWorkspace({ orgId, teamId: teamId as string });
  });

  app.event("channel_created", async (args) => {
    const { payload, context } = args;
    const { channel } = payload;
    const meta = await slackClient(context.botToken as string).conversations.info({
      channel: channel.id,
      include_num_members: true,
    });
    if (meta.channel) {
      const channel = {
        ...meta.channel,
        adadot_created_at: DateUtil.getDateNowInSeconds(),
        entry_type: SlackEntryTypesV1.CHANNEL,
        origin: "bolt-app",
      };
      await channelCreated(channel);
    }
  });

  app.event("channel_rename", async (args) => {
    const { payload, context } = args;
    const { channel } = payload;
    const meta = await slackClient(context.botToken as string).conversations.info({
      channel: channel.id,
      include_num_members: true,
    });
    if (meta.channel) {
      const channel = {
        ...meta.channel,
        adadot_created_at: DateUtil.getDateNowInSeconds(),
        entry_type: SlackEntryTypesV1.CHANNEL,
        origin: "bolt-app",
      };
      await channelRenamed(channel);
    }
  });

  app.event("member_joined_channel", async (args) => {
    const { payload } = args;
    const memberJoined = {
      user_id: payload.user,
      channel_id: payload.channel,
      connection_identified_at: DateUtil.getDateNowInSeconds(),
      adadot_created_at: DateUtil.getDateNowInSeconds(),
      entry_type: SlackEntryTypesV1.MEMBERS_TO_CHANNELS,
      origin: "bolt-app",
    };
    await memberJoinedChannel(memberJoined);
  });

  app.event("message", async (args) => {
    const { context, payload } = args;
    const {
      channel: channelId,
      channel_type: channelType,
      user: slackUserId,
      event_ts: eventTs,
      client_msg_id: messageId,
    } = payload as GenericMessageEvent;

    const tempMessage = payload as GenericMessageEvent;
    const { text, ...payloadWithoutText } = tempMessage;
    const message = {
      ...payloadWithoutText,
      channel: channelId,
      channel_type: channelType,
      user: slackUserId,
      event_ts: eventTs,
      client_msg_id: messageId,
      team: context.teamId,
      id: tempMessage.client_msg_id || uuid(),
      channel_id: payload.channel,
      adadot_created_at: DateUtil.getDateNowInSeconds(),
      entry_type: SlackEntryTypesV1.MESSAGE,
      origin: "bolt-app",
    };
    await messageReceived(message);
  });

  app.event("user_huddle_changed", async (args) => {
    const { context, payload } = args;
    const slackUserId = payload.user.id;
    const { event_ts: eventTs } = payload as UserHuddleChangedEvent;
    const huddleState = payload.user.profile.huddle_state;
    if (!huddleState) {
      logger.warn("NO HUDDLE STATE", { info: { payload, context } });
      return;
    }
    const { teamId } = context;
    const huddle = {
      ts: parseInt(eventTs, 10),
      team_id: teamId as string,
      user_id: slackUserId,
      huddle_state: huddleState,
      adadot_created_at: DateUtil.getDateNowInSeconds(),
      entry_type: SlackEntryTypesV1.HUDDLE,
      origin: "bolt-app",
    };
    await huddleStateChanged(huddle);
  });

  app.event("reaction_added", async (args) => {
    const event = buildReactionObject(args, ReactionEventAction.added);
    if (!event) return;
    await reactionAdded(buildReactionObjects(args, ReactionEventAction.added));
  });

  app.event("reaction_removed", async (args) => {
    const event = buildReactionObject(args, ReactionEventAction.removed);
    if (!event) return;
    await reactionRemoved(buildReactionObjects(args, ReactionEventAction.removed));
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

const buildReactionObjects = (
  args: (
    | SlackEventMiddlewareArgs<"reaction_added">
    | SlackEventMiddlewareArgs<"reaction_removed">
  ) &
    AllMiddlewareArgs,
  action: ReactionEventAction
): {
  reactionEntry: ReactionEntry;
  messagesToReactionsAssociation?: MessagesToReactionsAssociationEntry;
  usersToReactionsAssociation: UsersToReactionsAssociationEntry;
} => {
  const { payload } = args;
  const { event_ts: eventTs, item_user, item, reaction, user } = payload;

  const reactionId = uuid();

  const reactionEntry = {
    id: reactionId,
    ts: parseInt(eventTs, 10),
    reaction,
    reactionAction: action,
    item,
    item_user: item_user || "automation",
    adadot_created_at: DateUtil.getDateNowInSeconds(),
    entry_type: SlackEntryTypesV1.REACTION,
    origin: "bolt-app",
  };

  let messagesToReactionsAssociation;

  if (item.type === "message") {
    messagesToReactionsAssociation = {
      message_ts: item.ts,
      message_channel: item.channel,
      reaction_id: reactionId,
      adadot_created_at: DateUtil.getDateNowInSeconds(),
      entry_type: SlackEntryTypesV1.REACTIONS_TO_MESSAGES,
      origin: "bolt-app",
    };
  }

  const usersToReactionsAssociation = {
    user_id: user,
    reaction_id: reactionId,
    reaction_ts: parseInt(eventTs, 10),
    adadot_created_at: DateUtil.getDateNowInSeconds(),
    entry_type: SlackEntryTypesV1.USERS_TO_REACTIONS,
    origin: "bolt-app",
  };

  return {
    reactionEntry,
    messagesToReactionsAssociation,
    usersToReactionsAssociation,
  };
};
