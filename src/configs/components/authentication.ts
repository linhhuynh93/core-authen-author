import joi from "joi";
import { AuthenticationConfig } from "../appConfig";

const envVarsSchema = joi
  .object({
    VERIFICATION_URL: joi.string().uri().required(),
    MAIL_SYSTEM: joi.string().email().required(),
    MAIL_SYSTEM_USERNAME: joi.string().required(),
    MAIL_SYSTEM_PASSWORD: joi.string().required(),
  })
  .unknown()
  .required();

const { error, value: envVars } = joi.validate(process.env, envVarsSchema);

if (error) {
  throw new Error(`Config validate error: ${error.message}`);
}

export const authenticationConfig: AuthenticationConfig = {
  verificationUrl: envVars.VERIFICATION__URL,
  mailSystem: envVars.MAIL_SYSTEM,
  mailSystemUsername: envVars.MAIL_SYSTEM_USERNAME,
  mailSystemPassword: envVars.MAIL_SYSTEM_PASSWORD,
};
