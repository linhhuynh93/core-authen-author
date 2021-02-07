import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { USER_STATUS } from "src/common/enum/userEnum";
import { SIGN_UP_EMAIL_TEMPLATE } from "src/common/templates/signUpEmailTemplate";
import { SendEmailVerifyRequest } from "src/domain/models/authentication/sendEmailVerifyRequest";
import { CreateUserRequest } from "src/domain/models/user/createUserRequest";
import { AuthenticationRepository } from "src/domain/repositories/authenticationRepository";
import { RoleRepository } from "src/domain/repositories/roleRepository";
import { UserRepository } from "src/domain/repositories/userRepository";
import { ConflictError } from "src/errors/conflictError";
import { IllegalParameterError } from "src/errors/illegalParameterError";
import { CreateUserViewRequest } from "src/view-models/authentication/createdUserViewRequest";
import { UserViewResponse } from "src/view-models/user/userViewResponse";

export interface CreateUserUseCase {
  execute(userInfo: CreateUserViewRequest): Promise<UserViewResponse>;
}
@injectable()
export class CreateUserUseCaseImpl implements CreateUserUseCase {
  constructor(
    @inject(TYPES.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository,
    @inject(TYPES.RoleRepository)
    private readonly roleRepository: RoleRepository
  ) {}

  public async execute(
    request: CreateUserViewRequest
  ): Promise<UserViewResponse> {
    const ramdomPassword = Math.random().toString(36).slice(-8);

    const userIsExist = await this.userRepository.checkEmailExist(
      request.email
    );
    if (userIsExist) {
      throw new ConflictError("Authentication", "signUp", "User is existing!");
    }

    const role = await this.roleRepository.getRoleExist(request.roleId);

    const hashPassword: string = await this.authenticationRepository.generateHashPassword(
      ramdomPassword
    );

    const createUserRequest = new CreateUserRequest(
      request.email,
      hashPassword,
      role.id,
      USER_STATUS.UNVERIFIED
    );

    const user = await this.userRepository.createUser(createUserRequest);

    const verifyCode = await this.authenticationRepository.generateVerifyCode(
      user.id
    );

    const sendEmailRequest = new SendEmailVerifyRequest(
      "",
      request.email,
      SIGN_UP_EMAIL_TEMPLATE,
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        verifyCode,
        dateTimeVerifyCode: new Date(),
      }
    );
    await this.authenticationRepository.sendVerifyEmail(user, sendEmailRequest);

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roleId: user.roleId,
      priorLoginAt: user.priorLoginAt,
    };
  }
}
