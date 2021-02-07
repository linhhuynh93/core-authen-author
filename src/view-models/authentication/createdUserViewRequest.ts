import { IllegalParameterError } from "errors/illegalParameterError";
import joi from "joi";

export class CreateUserViewRequest {
  public static readonly SCHEMA = joi
    .object({
      email: joi.string().email().required(),
      roleId: joi.string().required(),
      currentUserId: joi.string().required(),
    })
    .required();

  public static validate(request: CreateUserViewRequest) {
    const { error } = joi.validate(request, CreateUserViewRequest.SCHEMA);

    if (error) {
      throw new IllegalParameterError(
        "CreateUserViewRequest",
        "validate",
        `Invalid provided values: ${error.message}`
      );
    }
  }
  constructor(
    public readonly currentUserId: number,
    public readonly email: string,
    public readonly roleId: number
  ) {}
}
