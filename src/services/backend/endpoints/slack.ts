import { PostTeamJoinParams, PostDeleteWorkspaceParams } from "services/backend/types";
import { requestBackend } from "services/backend/wrappers";
import {
  ChannelEntry,
  HuddleEntry,
  MemberJoinedChannelEntry,
  MessageEntry,
  ReactionParams,
} from "app/listeners/types";

export async function messageReceived(params: MessageEntry): Promise<void> {
  await requestBackend("api/external-slack/message", "post", {
    headers: {
      accept: "application/json",
    },
    json: params,
  });
}

export async function channelRenamed(params: ChannelEntry): Promise<void> {
  await requestBackend(
    "api/external-slack/channelRenamed",
    "post",
    {
      headers: {
        accept: "application/json",
      },
      json: params,
    },
    true
  );
}

export async function memberJoinedChannel(params: MemberJoinedChannelEntry): Promise<void> {
  await requestBackend("api/external-slack/channelCreated", "post", {
    headers: {
      accept: "application/json",
    },
    json: params,
  });
}
export async function channelCreated(params: ChannelEntry): Promise<void> {
  await requestBackend(
    "api/external-slack/channelCreated",
    "post",
    {
      headers: {
        accept: "application/json",
      },
      json: params,
    },
    true
  );
}

export async function huddleStateChanged(params: HuddleEntry): Promise<void> {
  await requestBackend(
    "api/external-slack/huddleChanged",
    "post",
    {
      headers: {
        accept: "application/json",
      },
      json: params,
    },
    true
  );
}

export async function reactionAdded(params: ReactionParams): Promise<void> {
  await requestBackend("api/external-slack/reactionAdded", "post", {
    headers: {
      accept: "application/json",
    },
    json: params,
  });
}

export async function reactionRemoved(params: ReactionParams): Promise<void> {
  await requestBackend(
    "api/external-slack/reactionAdded",
    "post",
    {
      headers: {
        accept: "application/json",
      },
      json: params,
    },
    true
  );
}

export async function teamJoin(params: PostTeamJoinParams): Promise<void> {
  await requestBackend(
    "api/external-slack/team-join",
    "post",
    {
      headers: {
        accept: "application/json",
      },
      json: params,
    },
    true
  );
}

export async function deleteWorkspace(params: PostDeleteWorkspaceParams): Promise<void> {
  await requestBackend(
    "api/external-slack/workspace",
    "delete",
    {
      headers: {
        accept: "application/json",
      },
      json: params,
    },
    true
  );
}
