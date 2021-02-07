import joi from "joi";
import { RedisConfig } from "../appConfig";

const envVarsSchema = joi
  .object({
    REDIS_ENDPOINT: joi.string().required(),
    REDIS_PORT: joi.number().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const redisConfig: RedisConfig = {
  endpoint: envVars.REDIS_ENDPOINT as string,
  port: envVars.REDIS_PORT as any as number
};
