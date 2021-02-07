import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { CHECK_USER_VALID_CASE } from "src/common/user";
import { SendEmailVerifyRequest } from "src/domain/models/authentication/sendEmailVerifyRequest";
import { AuthenticationRepository } from "src/domain/repositories/authenticationRepository";
import { UserRepository } from "src/domain/repositories/userRepository";
import { ConflictError } from "src/errors/conflictError";

export interface ResendVerifyEmailUseCase {
  execute(id: number, fromEmail: string, template: string): Promise<void>;
}

@injectable()
export class ResendVerifyEmailUseCaseImpl implements ResendVerifyEmailUseCase {
  constructor(
    @inject(TYPES.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  public async execute(
    id: number,
    fromEmail: string,
    template: string
  ): Promise<void> {
    const user = await this.userRepository.getById(id);
    const error = await this.authenticationRepository.checkUserValid(
      user,
      CHECK_USER_VALID_CASE.RESEND_VERIFY
    );
    if (error) {
      throw new ConflictError("Authentication", "resendVerifyEmail", error);
    }

    const verifyCode = await this.authenticationRepository.generateVerifyCode(
      user.id
    );

    const sendEmailVerifyParam = new SendEmailVerifyRequest(
      fromEmail,
      user.email,
      template,
      {
        verifyCode,
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        dateTimeVerifyCode: new Date(),
      }
    );
    this.authenticationRepository.sendVerifyEmail(user, sendEmailVerifyParam);
  }
}
