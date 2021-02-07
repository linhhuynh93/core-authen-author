import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { CHECK_USER_VALID_CASE } from "src/common/user";
import { JwtConfigRequest } from "src/domain/models/authentication/jwtConfigRequest";
import { AuthenticationRepository } from "src/domain/repositories/authenticationRepository";
import { UserRepository } from "src/domain/repositories/userRepository";
import { ConflictError } from "src/errors/conflictError";
import { IllegalParameterError } from "src/errors/illegalParameterError";
import { LoginViewRequest } from "src/view-models/authentication/loginViewRequest";

export interface LoginUseCase {
  execute(
    userLoginInfo: LoginViewRequest,
    jwtConfigRequest: JwtConfigRequest
  ): Promise<object>;
}
@injectable()
export class LoginUseCaseImpl implements LoginUseCase {
  constructor(
    @inject(TYPES.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  public async execute(
    request: LoginViewRequest,
    jwtConfigRequest: JwtConfigRequest
  ): Promise<object> {
    const user = await this.userRepository.getByEmail(request.email);
    if (!user) {
      throw new ConflictError("Authentication", "login", "User is not exist!");
    }
    await this.authenticationRepository.preAuthen(user);
    const isCorrectPassword = await this.authenticationRepository.checkPassword(
      request.password,
      user.hashPassword
    );
    if (!isCorrectPassword) {
      throw new IllegalParameterError(
        "Authentication",
        "login",
        "Wrong password!"
      );
    }

    const invalid = await this.authenticationRepository.checkUserValid(
      user,
      CHECK_USER_VALID_CASE.LOGIN
    );
    if (invalid) {
      return {
        id: user.id,
        email: user.email,
        status: user.status,
        message: invalid,
      };
    }

    const token = await this.authenticationRepository.generateToken(
      user,
      jwtConfigRequest,
      "super_admin"
    );
    await this.authenticationRepository.postLoginSuccess(user);
    return token;
  }
}
