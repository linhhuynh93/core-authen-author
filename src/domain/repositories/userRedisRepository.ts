import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { UserRedisGateway } from "src/domain/gateways/userRedisGateway";

export interface UserRedisRepository {
  setVerifyCode(userId: number, code: string, expires: number): Promise<void>;
  getVerifyCode(userId: number): Promise<string>;
  setResendTime(userId: number): Promise<void>;
  getResendTime(userId: number): Promise<number>;
  setRetryLoginNumber(userId: number, retry: number, expire: number): Promise<void>;
  getRetryLoginNumber(userId: number): Promise<number>;
}

@injectable()
export class UserRedisRepositoryImpl implements UserRedisRepository {
  constructor(
    @inject(TYPES.UserRedisGateway)
    private readonly userRedisGateway: UserRedisGateway
  ) {}

  public setVerifyCode(userId: number, code: string, expires: number): Promise<void> {
    return this.userRedisGateway.setVerifyCode(userId, code, expires);
  }

  public getVerifyCode(userId: number) {
    return this.userRedisGateway.getVerifyCode(userId);
  }

  public setResendTime(userId: number): Promise<void> {
    return this.userRedisGateway.setResendTime(userId);
  }

  public getResendTime(userId: number): Promise<number> {
    return this.userRedisGateway.getResendTime(userId);
  }

  public setRetryLoginNumber(userId: number, retry: number, expire: number): Promise<void> {
    return this.userRedisGateway.setRetryLoginNumber(userId, retry, expire);
  }
  public getRetryLoginNumber(userId: number): Promise<number> {
    return this.userRedisGateway.getRetryLoginNumber(userId);
  }
}
