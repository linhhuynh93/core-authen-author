import { th } from "date-fns/locale";
import { RoleDbGateway } from "gateways/roleDbGateway";
import { RolePermissionRedisGateway } from "gateways/rolePermissionRedisGateway";
import { inject, injectable } from "inversify";
import { CreateRoleRequest } from "models/role/createRoleRequest";
import { RoleModel } from "models/role/roleModel";
import { IllegalParameterError } from "src/errors/illegalParameterError";
import { TYPES } from "src/injection/types";
import { RolePermissionDbGateway } from "../gateways/rolePermissionGateway";
import { UpdateRoleRequest } from "../models/role/updateRoleRequest";
import { NewRolePermissionRequest } from "../models/rolePermission/newRolePermissionRequest";
import { RolePermissionResponse } from "../models/rolePermission/rolePermissionResponse";

export interface RolePermissionRepository {
  getRolePermission(): Promise<RolePermissionResponse[]>;
  createRolePermission(request: NewRolePermissionRequest[]): Promise<void>;
  deleteRolePermissionByRoleId(roleId: number): Promise<void>;
  getRolePermissionByRoleId(roleId: number): Promise<RolePermissionResponse[]>;
  clearCache(): Promise<void>;
}

@injectable()
export class RolePermissionRepositoryImpl implements RolePermissionRepository {
  constructor(
    @inject(TYPES.RolePermissionDbGateway)
    private readonly rolePermissionDbGateway: RolePermissionDbGateway,
    @inject(TYPES.RolePermissionRedisGateway)
    private readonly rolePermissionRedisGateway: RolePermissionRedisGateway
  ) {}
  public async getRolePermission(): Promise<RolePermissionResponse[]> {
    throw new Error("Method not implemented.");
  }

  public async createRolePermission(
    request: NewRolePermissionRequest[]
  ): Promise<void> {
    return this.rolePermissionDbGateway.createRolePermission(request);
  }

  public async deleteRolePermissionByRoleId(roleId: number): Promise<void> {
    return this.rolePermissionDbGateway.deleteRolePermissionByRoleId(roleId);
  }

  public async getRolePermissionByRoleId(
    roleId: number
  ): Promise<RolePermissionResponse[]> {
    return this.rolePermissionDbGateway.getRolePermissionByRoleId(roleId);
  }

  public async clearCache(): Promise<void> {
    return this.rolePermissionRedisGateway.setRolePermission([]);
  }
}
