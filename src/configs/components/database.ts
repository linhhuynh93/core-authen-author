import joi from "joi";
import { DatabaseConfig } from "../appConfig";

const envVarsSchema = joi
  .object({
    DB_HOST: joi.string().required(),
    DB_PORT: joi.number().required(),
    DB_USER: joi.string().required(),
    DB_PASSWORD: joi.string().required(),
    DB_DATABASE: joi.string().required(),
    DB_SSL_KEY: joi.string().optional()
  })
  .unknown()
  .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const dbConfig: DatabaseConfig = {
  host: envVars.DB_HOST as string,
  port: Number(envVars.DB_PORT as string),
  user: envVars.DB_USER as string,
  password: envVars.DB_PASSWORD as string,
  database: envVars.DB_DATABASE as string,
  caPath: envVars.DB_SSL_KEY as string
};
