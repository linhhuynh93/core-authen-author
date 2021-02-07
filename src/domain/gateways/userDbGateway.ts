import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { DatabaseTables } from "models/databaseTables";
import { Models } from "models/models";
import { UpdatePriorLoginAtRequest } from "models/user/updatePriorLoginAtRequest";
import { UpdateUserRequest } from "src/domain/models/user/updateUserRequest";
import { UpdateUserStatusRequest } from "models/user/updateUserStatusRequest";
import { UserModel } from "models/user/userModel";
import { CreateUserRequest } from "../models/user/createUserRequest";
import { UpdateProfileRequest } from "../models/authentication/updateProfileRequest";

export interface UserDbGateway {
  createUser(request: CreateUserRequest): Promise<UserModel>;
  getByEmail(email: string): Promise<UserModel>;
  getById(id: number): Promise<UserModel>;
  updateById(
    id: number,
    request:
      | UpdateUserStatusRequest
      | UpdateUserRequest
      | UpdatePriorLoginAtRequest
      | UpdateProfileRequest
  ): Promise<UserModel>;
}

@injectable()
export class UserDbGatewayImpl implements UserDbGateway {
  private readonly userDb: typeof UserModel;

  constructor(@inject(TYPES.Models) models: Models) {
    this.userDb = models.getModels()[
      DatabaseTables.TABLE_USER
    ] as typeof UserModel;
  }

  public async createUser(request: CreateUserRequest): Promise<UserModel> {
    await this.userDb.create(request);
    return this.getByEmail(request.email);
  }

  public async getByEmail(email: string): Promise<UserModel> {
    return this.userDb.findOne({
      where: { email },
      raw: true,
    });
  }

  public async getById(id: number): Promise<UserModel> {
    return this.userDb.findOne({
      where: { id },
      raw: true,
      nest: true,
    });
  }

  public async updateById(
    id: number,
    request:
      | UpdateUserStatusRequest
      | UpdateUserRequest
      | UpdatePriorLoginAtRequest
      | UpdateProfileRequest
  ): Promise<UserModel> {
    await this.userDb.update(request, {
      where: { id },
    });
    return this.getById(id);
  }
}
