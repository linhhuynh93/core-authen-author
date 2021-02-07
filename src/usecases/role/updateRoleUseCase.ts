import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { CreateRoleRequest } from "src/domain/models/role/createRoleRequest";
import { UpdateRoleRequest } from "src/domain/models/role/updateRoleRequest";
import { RolePermissionRepository } from "src/domain/repositories/rolePermissionRepository";
import { RoleRepository } from "src/domain/repositories/roleRepository";
import { CreateRoleViewRequest } from "src/view-models/role/createdRoleViewRequest";
import { RoleViewResponse } from "src/view-models/role/roleViewResponse";
import { UpdateRoleViewRequest } from "src/view-models/role/updateRoleViewRequest";

export interface UpdateRoleUseCase {
  execute(request: CreateRoleViewRequest): Promise<RoleViewResponse>;
}
@injectable()
export class UpdateRoleUseCaseImpl implements UpdateRoleUseCase {
  constructor(
    @inject(TYPES.RoleRepository)
    private readonly roleRepository: RoleRepository,
    @inject(TYPES.RolePermissionRepository)
    private readonly rolePermissionRepository: RolePermissionRepository
  ) {}

  public async execute(
    request: UpdateRoleViewRequest
  ): Promise<RoleViewResponse> {
    const roleOldData = await this.roleRepository.getRoleExist(request.id);

    const updateRoleRequest = new UpdateRoleRequest(
      roleOldData.id,
      request.name,
      request.abbreviation,
      request.level
    );

    const role = await this.roleRepository.updateRole(updateRoleRequest);

    await this.rolePermissionRepository.deleteRolePermissionByRoleId(role.id);
    const newRolePermissionRequests = request.permissions.map((permission) => {
      return {
        roleId: role.id,
        permissionId: permission.permissionId,
        inputAttributes: permission.inputAttributes,
        outputAttributes: permission.outputAttributes,
      };
    });
    await this.rolePermissionRepository.createRolePermission(
      newRolePermissionRequests
    );

    return {
      id: role.id,
      name: role.name,
      abbreviation: role.abbreviation,
      level: role.level,
      createdAt: role.createdAt,
      updatedAt: role.updatedAt,
    };
  }
}
