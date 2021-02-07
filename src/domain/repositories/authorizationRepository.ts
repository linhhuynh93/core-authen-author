import { AccessControl, Permission, Query } from "accesscontrol";
import { injectable, inject } from "inversify";
import { Context } from "koa";
import { UnauthorizedError } from "src/errors/unauthorizedError";
import { RolePermissionRedisGateway } from "gateways/rolePermissionRedisGateway";
import { TYPES } from "src/injection/types";
import { RolePermissionDbGateway } from "gateways/rolePermissionGateway";
import { RolePermissionResponse } from "models/rolePermission/rolePermissionResponse";
import { RolePermissionRedisRequest } from "models/rolePermission/rolePermissionRedisRequest";

export interface AuthorizationRepository {
  getPermission(context: Context, routerName: string): Promise<Permission>;
}

@injectable()
export class AuthorizationRepositoryImpl implements AuthorizationRepository {
  private accessControl: AccessControl;
  constructor(
    @inject(TYPES.RolePermissionRedisGateway)
    private readonly rolePermissionRedisGateway: RolePermissionRedisGateway,
    @inject(TYPES.RolePermissionDbGateway)
    private readonly rolePermissionDbGateway: RolePermissionDbGateway
  ) {
    this.accessControl = new AccessControl();
  }

  public async getPermission(
    context: Context,
    routerName: string // format [resource]/[action]
  ): Promise<Permission> {
    const granted = await this.getRolePermissionData();
    this.accessControl.setGrants(granted);

    const role = context._tokenPayload.role;
    const resource = routerName.split("/")[0];
    const action = routerName.split("/")[1];
    if (!role || !resource || !action) {
      throw new UnauthorizedError(
        "AuthorizationRepository",
        "getPermission",
        "invalid_permission"
      );
    }
    const query = this.accessControl.can(role);

    const permission = this.checkAction(query, action, resource);
    return permission;
  }

  private checkAction(
    query: Query,
    actionName: string,
    resource: string
  ): Permission {
    let permission: Permission;
    switch (actionName) {
      case "create:own":
        permission = query.createOwn(resource);
        break;
      case "create:any":
        permission = query.createAny(resource);
        break;
      case "update:own":
        permission = query.updateOwn(resource);
        break;
      case "update:any":
        permission = query.updateAny(resource);
        break;
      case "read:own":
        permission = query.readOwn(resource);
        break;
      case "read:any":
        permission = query.readAny(resource);
        break;
      case "delete:own":
        permission = query.deleteOwn(resource);
        break;
      case "delete:any":
        permission = query.deleteAny(resource);
        break;
      default:
        throw new UnauthorizedError(
          "AuthorizationRepository",
          "checkPermission",
          "invalid_action"
        );
    }

    return permission;
  }

  public async getRolePermissionData(): Promise<RolePermissionResponse[]> {
    let grant: RolePermissionResponse[] = await this.rolePermissionRedisGateway.getRolePermission();
    if (!grant || !grant.length) {
      grant = await this.rolePermissionDbGateway.getRolePermission();
      await this.rolePermissionRedisGateway.setRolePermission(
        grant as RolePermissionRedisRequest[]
      );
    }
    return grant;
  }
}
