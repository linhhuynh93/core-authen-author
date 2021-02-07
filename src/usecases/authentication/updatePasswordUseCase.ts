import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { ChangePasswordRequest } from "src/domain/models/authentication/changePasswordRequest";
import { AuthenticationRepository } from "src/domain/repositories/authenticationRepository";

export interface UpdatePasswordUseCase {
  execute(request: ChangePasswordRequest): Promise<void>;
}

@injectable()
export class UpdatePasswordUseCaseImpl implements UpdatePasswordUseCase {
  constructor(
    @inject(TYPES.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository
  ) {}

  public async execute(request: ChangePasswordRequest) {
    await this.authenticationRepository.validateVerifyCode({
      id: request.id,
      code: request.code,
    });
    const hashPassword = await this.authenticationRepository.generateHashPassword(
      request.password
    );
    await this.authenticationRepository.updatePassword(
      request.id,
      hashPassword
    );
  }
}
