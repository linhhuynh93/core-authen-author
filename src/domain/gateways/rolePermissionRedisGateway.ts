import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { RedisClient } from "redis";
import { RedisProvider } from "src/utils/providers/redisProvider";
import { RolePermissionResponse } from "models/rolePermission/rolePermissionResponse";
import { RolePermissionRedisRequest } from "models/rolePermission/rolePermissionRedisRequest";

export interface RolePermissionRedisGateway {
  setRolePermission(rolePermission: object[]): Promise<void>;
  getRolePermission(): Promise<RolePermissionResponse[]>;
}

@injectable()
export class RolePermissionRedisGatewayImpl
  implements RolePermissionRedisGateway {
  private readonly redisClient: RedisClient;
  private readonly rolePermissionKey = "role_permission";
  constructor(
    @inject(TYPES.RedisProvider) private readonly redisProvider: RedisProvider
  ) {
    this.redisClient = redisProvider.redisClient();
  }

  public async setRolePermission(rolePermission: RolePermissionRedisRequest[]): Promise<void> {
    this.redisClient.set(
      this.rolePermissionKey,
      JSON.stringify(rolePermission)
    );
  }

  public async getRolePermission(): Promise<RolePermissionResponse[]> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(this.rolePermissionKey, (err, data) => {
        if (err) {
          return reject(err);
        }

        resolve(data ? (JSON.parse(data) as RolePermissionResponse[]) : null);
      });
    });
  }
}
