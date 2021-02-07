import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { UpdateUserRequest } from "src/domain/models/user/updateUserRequest";
import { AuthenticationRepository } from "src/domain/repositories/authenticationRepository";
import { RoleRepository } from "src/domain/repositories/roleRepository";
import { UserRepository } from "src/domain/repositories/userRepository";
import { IllegalParameterError } from "src/errors/illegalParameterError";
import { UpdateUserViewRequest } from "src/view-models/user/updateUserViewRequest";
import { UserViewResponse } from "src/view-models/user/userViewResponse";

export interface UpdateUserUseCase {
  execute(request: UpdateUserViewRequest): Promise<UserViewResponse>;
}

@injectable()
export class UpdateUserUseCaseImpl implements UpdateUserUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.RoleRepository)
    private readonly roleRepository: RoleRepository,
    @inject(TYPES.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository
  ) {}

  public async execute(
    request: UpdateUserViewRequest
  ): Promise<UserViewResponse> {
    const oldUserData = await this.userRepository.checkUserExist(request.id);

    await this.roleRepository.getRoleExist(request.roleId);

    const updateRequest = new UpdateUserRequest(
      request.id,
      request.firstName,
      request.lastName,
      request.roleId
    );

    const newUserData = await this.userRepository.updateById(
      request.id,
      updateRequest
    );

    const response: UserViewResponse = {
      id: newUserData.id,
      email: newUserData.email,
      firstName: newUserData.firstName,
      lastName: newUserData.lastName,
      status: newUserData.status,
      priorLoginAt: newUserData.priorLoginAt,
      createdAt: newUserData.createdAt,
      updatedAt: newUserData.updatedAt,
    };

    return response;
  }
}
