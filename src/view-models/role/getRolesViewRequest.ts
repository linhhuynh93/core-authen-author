import { IllegalParameterError } from "errors/illegalParameterError";
import joi from "joi";

export class GetRolesViewRequest {
  public static readonly SCHEMA = joi
    .object({
      name: joi.string().optional(),
      abbreviation: joi.string().optional(),
    })
    .required();

  public static validate(request: GetRolesViewRequest) {
    const { error } = joi.validate(request, GetRolesViewRequest.SCHEMA);

    if (error) {
      throw new IllegalParameterError(
        "GetRolesViewRequest",
        "validate",
        `Invalid provided values: ${error.message}`
      );
    }
  }
  constructor(
    public readonly name: string,
    public readonly abbreviation: string
  ) {}
}
