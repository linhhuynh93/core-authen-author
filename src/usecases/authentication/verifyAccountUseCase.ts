import { USER_STATUS } from "common/enum/userEnum";
import { TYPES } from "injection/types";
import { UserRepository } from "repositories/userRepository";
import { UserViewResponse } from "src/view-models/user/userViewResponse";
import { VerifyAccountViewRequest } from "src/view-models/user/verifyAccountViewRequest";
import { inject, injectable } from "inversify";
import { UpdateUserStatusRequest } from "src/domain/models/user/updateUserStatusRequest";
import { AuthenticationRepository } from "src/domain/repositories/authenticationRepository";
import { UserRedisRepository } from "src/domain/repositories/userRedisRepository";

export interface VerifyAccountUseCase {
  execute(request: VerifyAccountViewRequest): Promise<UserViewResponse>;
}

@injectable()
export class VerifyAccountUseCaseImpl implements VerifyAccountUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.UserRedisRepository)
    private readonly userRedisRepository: UserRedisRepository,
    @inject(TYPES.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository
  ) {}

  public async execute(
    request: VerifyAccountViewRequest
  ): Promise<UserViewResponse> {
    await this.authenticationRepository.validateVerifyCode({
      code: request.code,
      id: request.id,
    });

    const user = await this.userRepository.checkUserExist(request.id);

    const updateRequest = new UpdateUserStatusRequest(USER_STATUS.ACTIVE);
    await Promise.all([
      this.userRepository.updateById(user.id, updateRequest),
      this.userRedisRepository.setVerifyCode(user.id, "", 1),
    ]);

    const response: UserViewResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      status: user.status,
      priorLoginAt: user.priorLoginAt,

      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return response;
  }
}
