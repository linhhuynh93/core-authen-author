import { UserDbGateway } from "gateways/userDbGateway";
import { inject, injectable } from "inversify";
import { UpdatePriorLoginAtRequest } from "models/user/updatePriorLoginAtRequest";
import { UpdateUserRequest } from "src/domain/models/user/updateUserRequest";
import { UpdateUserStatusRequest } from "models/user/updateUserStatusRequest";
import { UserModel } from "models/user/userModel";
import { USER_STATUS } from "src/common/enum/userEnum";
import { IllegalParameterError } from "src/errors/illegalParameterError";
import { TYPES } from "src/injection/types";
import { CreateUserRequest } from "../models/user/createUserRequest";
import { UpdateProfileRequest } from "../models/authentication/updateProfileRequest";

export interface UserRepository {
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
  checkUserExist(userId: number): Promise<UserModel>;
  checkEmailExist(email: string): Promise<boolean>;
}

@injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @inject(TYPES.UserDbGateway) private readonly userDbGateway: UserDbGateway
  ) {}

  public async createUser(request: CreateUserRequest): Promise<UserModel> {
    return this.userDbGateway.createUser(request);
  }

  public async getByEmail(email: string): Promise<UserModel> {
    return this.userDbGateway.getByEmail(email);
  }

  public async getById(id: number): Promise<UserModel> {
    return this.userDbGateway.getById(id);
  }

  public async updateById(
    id: number,
    request:
      | UpdateUserStatusRequest
      | UpdateUserRequest
      | UpdatePriorLoginAtRequest
      | UpdateProfileRequest
  ): Promise<UserModel> {
    return this.userDbGateway.updateById(id, request);
  }

  public async checkUserExist(userId: number): Promise<UserModel> {
    const user = await this.getById(userId);
    if (!user) {
      throw new IllegalParameterError(
        "UserRepository",
        "checkUserExist",
        "User does not exist"
      );
    }
    return user;
  }

  public async checkEmailExist(email: string): Promise<boolean> {
    const user = await this.getByEmail(email);
    return !!user && user.status !== USER_STATUS.UNVERIFIED;
  }
}
