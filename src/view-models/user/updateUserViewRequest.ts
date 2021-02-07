import { IllegalParameterError } from "errors/illegalParameterError";
import joi from "joi";
export class UpdateUserViewRequest {
  public static readonly SCHEMA = joi
    .object({
      id: joi.string().required(),
      firstName: joi.string().optional(),
      lastName: joi.string().optional(),
      roleId: joi.number().optional(),
      currentUserId: joi.number().required(),
    })
    .min(2)
    .required();

  public static validate(request: UpdateUserViewRequest) {
    const { error } = joi.validate(request, UpdateUserViewRequest.SCHEMA);

    if (error) {
      throw new IllegalParameterError(
        "UpdateUserViewRequest",
        "validate",
        `Invalid provided values: ${error.message}`
      );
    }
  }

  constructor(
    readonly id: number,
    readonly firstName: string,
    readonly lastName: string,
    readonly roleId: number,
    readonly currentUserId: number
  ) {}
}
