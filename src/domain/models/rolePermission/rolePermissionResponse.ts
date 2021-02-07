export interface RolePermissionResponse {
  readonly roleId: number;
  readonly permissionId: number;
  readonly role: string;
  readonly resource: string;
  readonly action: string;
  readonly outputAttributes: string[];
  readonly inputAttributes: string[];
}
