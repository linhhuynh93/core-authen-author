import { RoleDbGateway } from "gateways/roleDbGateway";
import { RolePermissionRedisGateway } from "gateways/rolePermissionRedisGateway";
import { inject, injectable } from "inversify";
import { CreateRoleRequest } from "models/role/createRoleRequest";
import { RoleModel } from "models/role/roleModel";
import { IllegalParameterError } from "src/errors/illegalParameterError";
import { TYPES } from "src/injection/types";
import { UpdateRoleRequest } from "../models/role/updateRoleRequest";

export interface RoleRepository {
  getRoleByUserId(userId: number): Promise<RoleModel>;
  getRoleById(roleId: number): Promise<RoleModel>;
  clearCache(): Promise<void>;
  createRole(request: CreateRoleRequest): Promise<RoleModel>;
  updateRole(request: UpdateRoleRequest): Promise<RoleModel>;
  getRoleExist(roleId: number): Promise<RoleModel>;
}

@injectable()
export class RoleRepositoryImpl implements RoleRepository {
  constructor(
    @inject(TYPES.RoleDbGateway) private readonly roleDbGateway: RoleDbGateway,
    @inject(TYPES.RolePermissionRedisGateway)
    private readonly rolePermissionRedisGateway: RolePermissionRedisGateway
  ) {}

  public async getRoleExist(roleId: number): Promise<RoleModel> {
    const role = await this.getRoleById(roleId);
    if (!role) {
      throw new IllegalParameterError(
        "RoleRepository",
        "checkRoleExist",
        "Role does not exist"
      );
    }
    return role;
  }

  public async getRoleByUserId(userId: number): Promise<RoleModel> {
    return this.roleDbGateway.getRoleByUserId(userId);
  }

  public async getRoleById(roleId: number): Promise<RoleModel> {
    return this.roleDbGateway.getRoleById(roleId);
  }

  public async createRole(request: CreateRoleRequest): Promise<RoleModel> {
    return this.roleDbGateway.createRole(request);
  }

  public async clearCache(): Promise<void> {
    return this.rolePermissionRedisGateway.setRolePermission([]);
  }

  public async updateRole(request: UpdateRoleRequest): Promise<RoleModel> {
    return this.roleDbGateway.updateRole(request);
  }
}
