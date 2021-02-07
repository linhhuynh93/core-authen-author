import joi from "joi";
import { JwtConfig } from "../appConfig";
const envVarsSchema = joi
  .object({
    JWT_PRIVATE_KEY: joi.string().required(),
    JWT_EXPRIRES_IN: joi.number().required(),
    JWT_REFRESH_KEY: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export const jwtConfig: JwtConfig = {
  jwtPrivateKey: envVars.JWT_PRIVATE_KEY as string,
  jwtExpriresIn: Number(envVars.JWT_EXPRIRES_IN),
  jwtRefreshKey: envVars.JWT_REFRESH_KEY as string
};
