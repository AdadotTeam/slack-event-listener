import {
  GenericMessageEvent,
  ReactionFileCommentItem,
  ReactionFileItem,
  ReactionMessageItem,
} from "@slack/bolt";
import { ReactionEventAction } from "services/backend/types/reactions";
import { Channel } from "@slack/web-api/dist/response/ChannelsInfoResponse";

interface EntryMeta {
  adadot_created_at: number;
  entry_type: string;
  origin: string;
}

export interface MessageEntry extends GenericMessageEvent, EntryMeta {
  channel: string;
  user: string;
  client_msg_id?: string;
  team?: string;
  id: string;
  channel_id: string;
  adadot_created_at: number;
  entry_type: SlackEntryTypesV1;
  origin: string;
}

export interface ReactionParams {
  reactionEntry: ReactionEntry;
  messagesToReactionsAssociation?: MessagesToReactionsAssociationEntry;
  usersToReactionsAssociation: UsersToReactionsAssociationEntry;
}

export interface ReactionEntry extends EntryMeta {
  id: string;
  ts: number;
  reaction: string;
  reactionAction: ReactionEventAction;
  item: ReactionMessageItem | ReactionFileItem | ReactionFileCommentItem;
  item_user: string;
}

export interface MessagesToReactionsAssociationEntry extends EntryMeta {
  message_ts: string;
  message_channel: string;
  reaction_id: string;
}

export interface UsersToReactionsAssociationEntry extends EntryMeta {
  user_id: string;
  reaction_id: string;
  reaction_ts: number;
}

export interface HuddleEntry extends EntryMeta {
  ts: number;
  team_id: string;
  user_id: string;
  huddle_state: string;
}

export interface ChannelEntry extends Channel, EntryMeta {}

export interface MemberJoinedChannelEntry extends EntryMeta {
  user_id: string;
  channel_id: string;
  connection_identified_at: number;
}

export enum SlackEntryTypesV1 {
  CHANNEL = "channel",
  MESSAGE = "message",
  REACTION = "reaction",
  HUDDLE = "huddle",
  USERS_TO_REACTIONS = "users_to_reactions",
  REACTIONS_TO_MESSAGES = "reactions_to_messages",
  MEMBERS_TO_CHANNELS = "members_to_channels",
}
