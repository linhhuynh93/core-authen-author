import { TYPES } from "injection/types";
import * as bcrypt from "bcrypt";
import { UserViewResponse } from "src/view-models/user/userViewResponse";
import { inject, injectable } from "inversify";
import { UpdateProfileRequest } from "src/domain/models/authentication/updateProfileRequest";
import { AuthenticationRepository } from "src/domain/repositories/authenticationRepository";
import { IllegalParameterError } from "src/errors/illegalParameterError";
import { UpdateUserViewRequest } from "src/view-models/user/updateUserViewRequest";
import { UserRepository } from "src/domain/repositories/userRepository";
import { UpdateUserProfileViewRequest } from "src/view-models/user/updateUserProfileViewRequest";

export interface UpdateUserProfileUseCase {
  execute(request: UpdateUserProfileViewRequest): Promise<UserViewResponse>;
}
@injectable()
export class UpdateUserProfileUseCaseImpl implements UpdateUserProfileUseCase {
  constructor(
    @inject(TYPES.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  public async execute(
    request: UpdateUserProfileViewRequest
  ): Promise<UserViewResponse> {
    const oldUserData = await this.userRepository.checkUserExist(request.id);

    const updateRequest = new UpdateProfileRequest(
      request.id,
      request.firstName,
      request.lastName
    );

    if (request.currentPassword && request.newPassword) {
      const isCorrectPassword = await this.authenticationRepository.checkPassword(
        request.currentPassword,
        oldUserData.hashPassword
      );
      if (!isCorrectPassword) {
        throw new IllegalParameterError(
          "Authentication",
          "updateProfile",
          "Wrong password!"
        );
      }
      updateRequest.hashPassword = await this.authenticationRepository.generateHashPassword(
        request.newPassword
      );
    }
    return this.userRepository.updateById(oldUserData.id, updateRequest);
  }
}
