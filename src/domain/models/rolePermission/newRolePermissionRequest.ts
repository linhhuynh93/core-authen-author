export interface NewRolePermissionRequest {
  readonly roleId: number;
  readonly permissionId: number;
  readonly inputAttributes: string[];
  readonly outputAttributes: string[];
}
