import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { RedisClient } from "redis";
import { USER } from "src/common/user";
import { RedisProvider } from "src/utils/providers/redisProvider";

export interface UserRedisGateway {
  setVerifyCode(userId: number, code: string, expires: number): Promise<void>;
  getVerifyCode(userId: number): Promise<string>;
  setResendTime(userId: number): Promise<void>;
  getResendTime(userId: number): Promise<number>;
  setRetryLoginNumber(userId: number, retry: number, expire: number): Promise<void>;
  getRetryLoginNumber(userId: number): Promise<number>;
}

@injectable()
export class UserRedisGatewayImpl implements UserRedisGateway {
  private readonly redisClient: RedisClient;

  private readonly prefixVerify = "user_verify_code_";
  private readonly prefixResend = "user_resend_code_";
  private readonly prefixRetryLogin = "user_retry_login_";

  constructor(
    @inject(TYPES.RedisProvider) private readonly redisProvider: RedisProvider
  ) {
    this.redisClient = redisProvider.redisClient();
  }

  public async setVerifyCode(userId: number, code: string, expires: number): Promise<void> {
    this.redisClient.set(
      this.prefixVerify + userId,
      code,
      "EX",
      expires
    );
  }

  public async getVerifyCode(userId: number): Promise<string> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(this.prefixVerify + userId, (err, data) => {
        if (err) {
          return reject(err);
        }

        resolve(data || null);
      });
    });
  }

  public async setResendTime(userId: number): Promise<void> {
    this.redisClient.set(
      this.prefixResend + userId,
      "T",
      "EX",
      USER.RESEND_VERTIFY_CODE_SECOND
    );
  }

  public async getResendTime(userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.ttl(this.prefixResend + userId, (err, data) => {
        if (err) {
          return reject(err);
        }

        resolve(data || null);
      });
    });
  }

  public async setRetryLoginNumber(userId: number, retry: number, expire: number): Promise<void> {
    this.redisClient.set(
      this.prefixRetryLogin + userId,
      retry.toString(),
      "EX",
      expire
    );
  }

  public async getRetryLoginNumber(userId: number): Promise<number> {
    return new Promise((resolve, reject) => {
      this.redisClient.get(this.prefixRetryLogin + userId, (err, data) => {
        if (err) {
          return reject(err);
        }

        resolve(data ? Number(data) : null);
      });
    });
  }
}
