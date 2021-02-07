import { Environment } from "common/environment";
import joi from "joi";

const envVarsSchema = joi
  .object({
    NODE_ENV: joi
      .string()
      .allow([
        Environment.DEVELOPMENT,
        Environment.STAGING,
        Environment.PRODUCTION,
        Environment.TESTING,
        Environment.DEMO,
      ])
      .required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const env: string = envVars.NODE_ENV as string;
