import { TYPES } from "injection/types";
import { UserRepository } from "repositories/userRepository";
import { UserViewResponse } from "src/view-models/user/userViewResponse";
import { inject, injectable } from "inversify";

export interface GetUserProfileUseCase {
  execute(userId: number): Promise<UserViewResponse>;
}
@injectable()
export class GetUserProfileUseCaseImpl implements GetUserProfileUseCase {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  public async execute(userId: number): Promise<UserViewResponse> {
    const user = await this.userRepository.checkUserExist(userId);

    const response: UserViewResponse = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roleId: user.roleId,
      status: user.status,
      priorLoginAt: user.priorLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return response;
  }
}
