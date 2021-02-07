import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
// import { RedisConfig } from "../configs/appConfig";
import { RedisClient } from "redis";
import { RedisConfig } from "src/configs/appConfig";

export interface RedisProvider {
  redisClient(): RedisClient;
}

@injectable()
export class RedisProviderImpl implements RedisProvider {
  private readonly redis: RedisClient;

  constructor(
    @inject(TYPES.RedisConfig) private readonly redisConfig: RedisConfig
  ) {
    this.redis = new RedisClient({
      host: this.redisConfig.endpoint,
      port: this.redisConfig.port,
    });
  }

  public redisClient(): RedisClient {
    return this.redis;
  }
}
