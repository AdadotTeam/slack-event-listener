export interface TableEntry {
  objectId: string;
  entityRelationship: string;
}

export interface RequestSlackWorkspaceResponse extends TableEntry {
  teamId: string;
  botToken: string;
  botUserId: string;
  createdBy: string;
}
