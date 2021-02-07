import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { CreateRoleRequest } from "src/domain/models/role/createRoleRequest";
import { RolePermissionRepository } from "src/domain/repositories/rolePermissionRepository";
import { RoleRepository } from "src/domain/repositories/roleRepository";
import { CreateRoleViewRequest } from "src/view-models/role/createdRoleViewRequest";
import { RoleViewResponse } from "src/view-models/role/roleViewResponse";

export interface CreateRoleUseCase {
  execute(request: CreateRoleViewRequest): Promise<RoleViewResponse>;
}
@injectable()
export class CreateRoleUseCaseImpl implements CreateRoleUseCase {
  constructor(
    @inject(TYPES.RoleRepository)
    private readonly roleRepository: RoleRepository,
    @inject(TYPES.RolePermissionRepository)
    private readonly rolePermissionRepository: RolePermissionRepository
  ) {}

  public async execute(
    request: CreateRoleViewRequest
  ): Promise<RoleViewResponse> {
    const createRoleRequest = new CreateRoleRequest(
      request.name,
      request.abbreviation
    );

    const role = await this.roleRepository.createRole(createRoleRequest);

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
