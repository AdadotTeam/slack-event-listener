export interface PostSlackWorkspaceParams {
  teamId: string;
}

export interface PostTeamJoinParams {
  orgId: string;
  botToken: string;
  email: string;
  slackUserId: string;
}

export interface PostDeleteWorkspaceParams {
  orgId: string;
  teamId: string;
}
