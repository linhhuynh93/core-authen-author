import { IllegalParameterError } from "errors/illegalParameterError";
import joi from "joi";

export class LoginViewRequest {
  public static readonly SCHEMA = joi
    .object({
      email: joi.string().email().required(),
      password: joi.string().required(),
    })
    .required();

  public static validate(request: LoginViewRequest) {
    const { error } = joi.validate(request, LoginViewRequest.SCHEMA);

    if (error) {
      throw new IllegalParameterError(
        "LoginViewRequest",
        "validate",
        `Invalid provided values: ${error.message}`
      );
    }
  }
  constructor(readonly email: string, readonly password: string) {}
}
