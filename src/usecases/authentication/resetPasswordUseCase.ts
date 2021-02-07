import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { SETTING_KEY } from "src/common/enum/settingsKeyEnum";
import { Environment } from "src/common/environment";
import { CHECK_USER_VALID_CASE, USER } from "src/common/user";
import { AuthenticationConfig } from "src/configs/appConfig";
import { AuthenticationRepository } from "src/domain/repositories/authenticationRepository";
import { UserRedisRepository } from "src/domain/repositories/userRedisRepository";
import { UserRepository } from "src/domain/repositories/userRepository";
import { ConflictError } from "src/errors/conflictError";
import { SendEmailUtil } from "src/utils/sendEmailUtil";
import { GetSettingsUseCase } from "../settings/getSettingsUseCase";

export interface ResetPasswordUseCase {
  execute(email: string, template: string): Promise<void>;
}

@injectable()
export class ResetPasswordUseCaseImpl implements ResetPasswordUseCase {
  constructor(
    @inject(TYPES.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.GetSettingsUseCase)
    private readonly getSettingsUseCase: GetSettingsUseCase,
    @inject(TYPES.SendEmailUtil) private sendEmailUtil: SendEmailUtil,
    @inject(TYPES.UserRedisRepository)
    private readonly userRedisRepository: UserRedisRepository,
    @inject(TYPES.AuthenticationConfig)
    private readonly authenticationConfig: AuthenticationConfig
  ) {}

  public async execute(email: string, templateString: string) {
    const user = await this.userRepository.getByEmail(email);
    const error = await this.authenticationRepository.checkUserValid(
      user,
      CHECK_USER_VALID_CASE.RESET_PASSWORD
    );
    if (error) {
      throw new ConflictError("Authentication", "resendVerifyEmail", error);
    }
    await this.authenticationRepository.preResetPassword(user);
    const verifyCode = await this.authenticationRepository.generateForgotPasswordCode(
      user
    );
    let template = templateString;

    template = template.replace(/{{id}}/gi, user.id.toString());
    template = template.replace(/{{code}}/gi, verifyCode);
    template = template.replace(/{{user_name}}/gi, user.firstName);

    const url = this.authenticationConfig.verificationUrl;
    template = template.replace(/{{url}}/gi, url);

    const fromEmail = await this.getSettingsUseCase.execute(
      process.env.NODE_ENV === Environment.PRODUCTION
        ? SETTING_KEY.FROM_EMAIL_PRODUCTION
        : SETTING_KEY.FROM_EMAIL
    );
    await this.sendEmailUtil.sendEmail(
      fromEmail.value,
      [email],
      USER.RESET_PASSWORD,
      template
    );

    await this.userRedisRepository.setResendTime(user.id);
  }
}
