import bcrypt from "bcrypt";
import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import * as jwt from "jsonwebtoken";
import { UpdatePasswordRequest } from "models/user/updatePasswordRequest";
import { UpdatePriorLoginAtRequest } from "models/user/updatePriorLoginAtRequest";
import { UpdateUserStatusRequest } from "models/user/updateUserStatusRequest";
import { generate } from "randomstring";
import { SETTING_KEY } from "src/common/enum/settingsKeyEnum";
import { USER_STATUS } from "src/common/enum/userEnum";
import { Environment } from "src/common/environment";
import { CHECK_USER_VALID_CASE, USER } from "src/common/user";
import { AuthenticationConfig } from "src/configs/appConfig";
import { SendEmailVerifyRequest } from "src/domain/models/authentication/sendEmailVerifyRequest";
import { UserReponse } from "src/domain/models/user/userReponse";
import { RoleRepository } from "src/domain/repositories/roleRepository";
import { UserRedisRepository } from "src/domain/repositories/userRedisRepository";
import { UserRepository } from "src/domain/repositories/userRepository";
import { IllegalParameterError } from "src/errors/illegalParameterError";
import { SendEmailUtil } from "utils/sendEmailUtil";
import { JwtConfigRequest } from "../models/authentication/jwtConfigRequest";
import { UserModel } from "../models/user/userModel";
import { SettingsRepository } from "./settingsRepository";

export interface AuthenticationRepository {
  generateVerifyCode(userId: number): Promise<string>;
  validateVerifyCode(request: any | undefined): Promise<boolean>;
  sendVerifyEmail(
    user: UserModel,
    request: SendEmailVerifyRequest
  ): Promise<boolean>;
  generateForgotPasswordCode(request: UserReponse): Promise<string>;
  checkUserValid(user: UserReponse, usecase: string): Promise<string>;
  getTokenPayLoad(user: UserReponse): Promise<object>;
  postLoginSuccess(user: UserModel): Promise<void>;
  preAuthen(user: UserReponse): Promise<void>;
  preResetPassword(user: UserReponse): Promise<void>;
  updatePassword(id: number, password: string): Promise<void>;
  generateHashPassword(password: string): Promise<string>;
  checkPassword(password: string, hashPassword: string): Promise<boolean>;
  generateToken(
    user: UserReponse,
    jwtConfigRequest: JwtConfigRequest,
    userRole: string
  ): Promise<{ token: string; refreshToken: string }>;
}

@injectable()
export class AuthenticationRepositoryImpl implements AuthenticationRepository {
  constructor(
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.RoleRepository)
    private readonly roleRepository: RoleRepository,
    @inject(TYPES.UserRedisRepository)
    private readonly userRedisRepository: UserRedisRepository,
    @inject(TYPES.SendEmailUtil) private sendEmailUtil: SendEmailUtil,
    @inject(TYPES.AuthenticationConfig)
    private readonly authenticationConfig: AuthenticationConfig,
    @inject(TYPES.SettingsRepository)
    private readonly settingsRepository: SettingsRepository
  ) {}

  public async generateForgotPasswordCode(
    request: UserReponse
  ): Promise<string> {
    const expireIn = await this.settingsRepository.getByKey(
      SETTING_KEY.EXPIRE_RESET_CODE_SECOND
    );
    const code = generate(10);
    await Promise.all([
      this.userRedisRepository.setVerifyCode(
        request.id,
        code,
        parseInt(expireIn.value, 10)
      ),
      this.userRedisRepository.setResendTime(request.id),
    ]);
    return code;
  }

  public async generateVerifyCode(userId: number): Promise<string> {
    const code = generate(10);
    await this.userRedisRepository.setVerifyCode(
      userId,
      code,
      USER.EXPIRE_VERTIFY_CODE_SECOND
    );
    return code;
  }

  public async validateVerifyCode(request: any): Promise<boolean> {
    const verifyCode = await this.userRedisRepository.getVerifyCode(request.id);
    if (!verifyCode || request.code !== verifyCode) {
      throw new IllegalParameterError(
        "VerifyAccountUseCase",
        "validate",
        "Invalid code"
      );
    }
    return true;
  }

  public async sendVerifyEmail(
    user: UserModel,
    request: SendEmailVerifyRequest
  ): Promise<boolean> {
    let template = request.htmlTemplate.replace(/{{id}}/gi, user.id.toString());
    template = template.replace(/{{code}}/gi, request.param.verifyCode);
    template = template.replace(/{{user_full_name}}/gi, `${user.firstName}`);

    const url = this.authenticationConfig.verificationUrl;
    template = template.replace(/{{url}}/gi, url);

    const fromEmail = await this.settingsRepository.getByKey(
      process.env.NODE_ENV === Environment.PRODUCTION
        ? SETTING_KEY.FROM_EMAIL_PRODUCTION
        : SETTING_KEY.FROM_EMAIL
    );
    await this.sendEmailUtil.sendEmail(
      fromEmail.value,
      [request.toEmail],
      USER.NEW_ACCOUNT_SUBJECT,
      template
    );
    await this.userRedisRepository.setResendTime(user.id);
    return true;
  }

  public async checkUserValid(
    user: UserReponse,
    usecase: string
  ): Promise<string> {
    let error = null;
    switch (usecase) {
      case CHECK_USER_VALID_CASE.RESEND_VERIFY:
        if (!user || user.status !== USER_STATUS.UNVERIFIED) {
          error = "Invalid User";
        } else {
          const ttl = await this.userRedisRepository.getResendTime(user.id);
          if (ttl > 0) {
            error = `Retry after ${ttl} seconds`;
          }
        }
        break;
      case CHECK_USER_VALID_CASE.LOGIN:
        if (user.status !== USER_STATUS.ACTIVE) {
          error = "User Invalid";
        }
        break;
      case CHECK_USER_VALID_CASE.RESET_PASSWORD:
        if (!user || user.status === USER_STATUS.UNVERIFIED) {
          error = "Account not found";
        } else if (user.status === USER_STATUS.INACTIVE) {
          error = "Account not active, contact support";
        } else {
          const ttl = await this.userRedisRepository.getResendTime(user.id);
          if (ttl > 0) {
            error = `Retry after ${ttl} seconds`;
          }
        }
        break;
      default:
        return null;
    }
    return error;
  }

  public async getTokenPayLoad(user: UserReponse): Promise<object> {
    const role = await this.roleRepository.getRoleByUserId(user.id);
    const tokenPayload = {
      sub: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: role.name || "",
    };
    return tokenPayload;
  }

  public async postLoginSuccess(user: UserModel): Promise<void> {
    const updateDate = new UpdatePriorLoginAtRequest(user.updatedAt);
    await Promise.all([
      this.userRepository.updateById(user.id, updateDate),
      this.userRedisRepository.setRetryLoginNumber(user.id, 0, 1),
    ]);
    return;
  }

  public async preAuthen(user: UserReponse): Promise<void> {
    const [retry, maxRetry, timeExpires] = await Promise.all([
      this.userRedisRepository.getRetryLoginNumber(user.id),
      this.settingsRepository.getByKey(SETTING_KEY.RETRY_LOGIN_COUNT),
      this.settingsRepository.getByKey(SETTING_KEY.ATTEMPT_LOCK_ACCOUNT_SECOND),
    ]);

    if (retry > parseInt(maxRetry.value, 10)) {
      throw new IllegalParameterError(
        "Authentication",
        "login",
        "The account has been temporarily locked"
      );
    }
    await this.userRedisRepository.setRetryLoginNumber(
      user.id,
      retry + 1,
      parseInt(timeExpires.value, 10)
    );
  }

  public async preResetPassword(user: UserReponse): Promise<void> {
    const updateRequest = new UpdateUserStatusRequest(
      USER_STATUS.PASSWORD_RESET
    );
    await this.userRepository.updateById(user.id, updateRequest);
  }

  public async updatePassword(id: number, password: string): Promise<void> {
    const updateRequest = new UpdatePasswordRequest(
      password,
      USER_STATUS.ACTIVE
    );
    await Promise.all([
      this.userRepository.updateById(id, updateRequest),
      this.userRedisRepository.setVerifyCode(id, "", 1),
    ]);
  }

  public async checkPassword(
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashPassword);
  }

  public async generateHashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);
    return hashPassword;
  }

  public async generateToken(
    user: UserReponse,
    jwtConfigRequest: JwtConfigRequest,
    userRole: string
  ): Promise<{ token: string; refreshToken: string }> {
    const tokenPayload = await this.getTokenPayLoad(user);
    const token = jwt.sign(tokenPayload, jwtConfigRequest.jwtPrivateKey, {
      expiresIn: jwtConfigRequest.jwtExpriresIn,
    });

    const refreshPayload = {
      userRole,
      email: user.email,
    };
    const refreshToken = jwt.sign(
      refreshPayload,
      jwtConfigRequest.jwtRefreshKey,
      {
        expiresIn: jwtConfigRequest.jwtExpriresIn + 3600,
      }
    );
    return { token, refreshToken };
  }
}
