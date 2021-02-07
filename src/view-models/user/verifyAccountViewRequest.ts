import { IllegalParameterError } from "errors/illegalParameterError";
import joi from "joi";
export class VerifyAccountViewRequest {
  public static readonly SCHEMA = joi
    .object({
      id: joi.string().required(),
      code: joi.string().required(),
    })
    .required();

  public static validate(request: VerifyAccountViewRequest) {
    const { error } = joi.validate(request, VerifyAccountViewRequest.SCHEMA);

    if (error) {
      throw new IllegalParameterError(
        "VerifyAccountViewRequest",
        "validate",
        `Invalid provided values: ${error.message}`
      );
    }
  }
  constructor(readonly id: number, readonly code: string) {}
}
