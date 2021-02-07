import { inject, injectable } from "inversify";
import { TYPES } from "src/injection/types";
import { PermissionDbGateway } from "../gateways/permissionDbGateway";
import { PermissionModel } from "../models/permission/permissionModel";

export interface PermissionRepository {
  getPermissions(): Promise<PermissionModel[]>;
  getPermissionByIds(permissionIds: number[]): Promise<PermissionModel[]>;
}

@injectable()
export class PermissionRepositoryImpl implements PermissionRepository {
  constructor(
    @inject(TYPES.PermisionDbGateway)
    private readonly permisionDbGateway: PermissionDbGateway
  ) {}

  public async getPermissions(): Promise<PermissionModel[]> {
    return this.permisionDbGateway.getPermissions();
  }
  public async getPermissionByIds(
    permissionIds: number[]
  ): Promise<PermissionModel[]> {
    return this.permisionDbGateway.getPermissionByIds(permissionIds);
  }
}
