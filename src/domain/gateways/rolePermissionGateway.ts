import { TYPES } from "injection/types";
import { DatabaseTables } from "models/databaseTables";
import { Models } from "models/models";
import { PermissionModel } from "models/permission/permissionModel";
import { RoleModel } from "models/role/roleModel";
import { RolePermissionResponse } from "models/rolePermission/rolePermissionResponse";
import { inject, injectable } from "inversify";
import { NewRolePermissionRequest } from "../models/rolePermission/newRolePermissionRequest";
import { RolePermissionModel } from "../models/rolePermission/rolePermissionModel";

export interface RolePermissionDbGateway {
  getRolePermission(): Promise<RolePermissionResponse[]>;
  createRolePermission(request: NewRolePermissionRequest[]): Promise<void>;
  deleteRolePermissionByRoleId(roleId: number): Promise<void>;
  getRolePermissionByRoleId(roleId: number): Promise<RolePermissionResponse[]>;
}

@injectable()
export class RolePermissionDbGatewayImpl implements RolePermissionDbGateway {
  private readonly roleDb: typeof RoleModel;
  private readonly permissionDb: typeof PermissionModel;
  private readonly rolePermissionDb: typeof RolePermissionModel;

  constructor(@inject(TYPES.Models) models: Models) {
    this.roleDb = models.getModels()[
      DatabaseTables.TABLE_ROLE
    ] as typeof RoleModel;
    this.permissionDb = models.getModels()[
      DatabaseTables.TABLE_PERMISSION
    ] as typeof PermissionModel;
    this.rolePermissionDb = models.getModels()[
      DatabaseTables.TABLE_ROLE_PERMISSION
    ] as typeof RolePermissionModel;
  }

  public async getRolePermission(): Promise<RolePermissionResponse[]> {
    const roles = await this.roleDb.findAll({
      include: [
        {
          model: this.permissionDb,
          as: "permissions",
        },
      ],
    });

    const rolePermission: RolePermissionResponse[] = [];
    for (const role of roles) {
      for (const permission of role.permissions) {
        rolePermission.push({
          roleId: role.id,
          permissionId: permission.id,
          role: role.name,
          resource: permission.resource,
          action: permission.action,
          outputAttributes: permission.outputAttributes,
          inputAttributes: permission.inputAttributes,
        });
      }
    }

    return rolePermission;
  }

  public async getRolePermissionByRoleId(
    roleId: number
  ): Promise<RolePermissionResponse[]> {
    const role = await this.roleDb.findByPk(roleId, {
      include: [
        {
          model: this.permissionDb,
          as: "permissions",
        },
      ],
    });

    const rolePermission: RolePermissionResponse[] = [];

    for (const permission of role.permissions) {
      rolePermission.push({
        roleId: role.id,
        permissionId: permission.id,
        role: role.name,
        resource: permission.resource,
        action: permission.action,
        outputAttributes: permission.outputAttributes,
        inputAttributes: permission.inputAttributes,
      });
    }

    return rolePermission;
  }

  public async createRolePermission(
    request: NewRolePermissionRequest[]
  ): Promise<void> {
    await this.rolePermissionDb.bulkCreate(request);
  }

  public async deleteRolePermissionByRoleId(roleId: number): Promise<void> {
    await this.rolePermissionDb.destroy({
      where: {
        roleId,
      },
    });
  }
}
