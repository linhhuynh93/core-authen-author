import { TYPES } from "injection/types";
import { DatabaseTables } from "models/databaseTables";
import { Models } from "models/models";
import { UserModel } from "models/user/userModel";
import { inject, injectable } from "inversify";
import { PermissionModel } from "models/permission/permissionModel";

export interface PermissionDbGateway {
  getPermissions(): Promise<PermissionModel[]>;
  getPermissionByIds(permissionIds: number[]): Promise<PermissionModel[]>;
}

@injectable()
export class PermissionDbGatewayImpl implements PermissionDbGateway {
  private readonly permissionDb: typeof PermissionModel;

  constructor(@inject(TYPES.Models) models: Models) {
    this.permissionDb = models.getModels()[
      DatabaseTables.TABLE_PERMISSION
    ] as typeof PermissionModel;
  }

  public async getPermissions(): Promise<PermissionModel[]> {
    return this.permissionDb.findAll();
  }

  public async getPermissionByIds(
    permissionIds: number[]
  ): Promise<PermissionModel[]> {
    return this.permissionDb.findAll({
      where: {
        id: permissionIds,
      },
    });
  }
}
