import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import * as jwt from "jsonwebtoken";
import { JwtConfigRequest } from "src/domain/models/authentication/jwtConfigRequest";
import { AuthenticationRepository } from "src/domain/repositories/authenticationRepository";
import { UserRepository } from "src/domain/repositories/userRepository";
import { ForbiddenError } from "src/errors/forbiddenError";

export interface RenewTokenUseCase {
  execute(
    refreshToken: string,
    jwtConfigRequest: JwtConfigRequest
  ): Promise<{
    token: string;
    refreshToken: string;
  }>;
}
@injectable()
export class RenewTokenUseCaseImpl implements RenewTokenUseCase {
  constructor(
    @inject(TYPES.AuthenticationRepository)
    private readonly authenticationRepository: AuthenticationRepository,
    @inject(TYPES.UserRepository)
    private readonly userRepository: UserRepository
  ) {}

  public async execute(
    refreshToken: string,
    jwtConfigRequest: JwtConfigRequest
  ) {
    try {
      const tokenPayload = jwt.verify(
        refreshToken,
        jwtConfigRequest.jwtRefreshKey
      ) as {
        email: string;
        userType: string;
      };
      const user = await this.userRepository.getByEmail(tokenPayload.email);
      return this.authenticationRepository.generateToken(
        user,
        jwtConfigRequest,
        tokenPayload.userType
      );
    } catch (err) {
      throw new ForbiddenError(
        "Authentication",
        "renewToken",
        "Invalid refresh token"
      );
    }
  }
}
