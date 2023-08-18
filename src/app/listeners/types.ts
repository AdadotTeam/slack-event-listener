import { ReactionFileCommentItem, ReactionFileItem, ReactionMessageItem } from "@slack/bolt";

export enum ReactionEventAction {
  added = "added",
  removed = "removed",
}

interface BaseEvent {
  eventId: string;
  teamId: string;
  slackUserId: string;
  timestamp: number;
}

export interface MessageEvent extends BaseEvent {
  messageId: string | undefined;
  channelId: string;
  channelType: string;
}

export interface HuddleEvent extends BaseEvent {
  huddleState: string;
}

export interface ReactionEvent extends BaseEvent {
  reactionAction: ReactionEventAction;
  reaction: string;
  originalAuthor: string;
  originalItemType: string;
  originalItem: ReactionFileItem | ReactionFileCommentItem | ReactionMessageItem;
}

export interface ReactionEntry {
  id: string;
  ts: number;
  reaction: string;
  reactionAction: ReactionEventAction;
  item: ReactionMessageItem | ReactionFileItem | ReactionFileCommentItem;
  item_user: string;
}

export interface MessagesToReactionsAssociation {
  message_ts: string;
  message_channel: string;
  reaction_id: string;
}

export interface UsersToReactionsAssociation {
  user_id: string;
  reaction_id: string;
  reaction_ts: number;
}

export interface Huddle {
  ts: number;
  team_id: string;
  user_id: string;
  huddle_state: string;
}
