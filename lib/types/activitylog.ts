export interface ActivityLog {
  _id?: string;
  user: string;
  userName: string;
  actionType: string;
  entityType: string;
  entityId: string;
  entityName: string;
  detail: string;
  timestamp?: string;
}
