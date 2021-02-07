import { IllegalParameterError } from "errors/illegalParameterError";
import joi from "joi";
export class UpdateUserProfileViewRequest {
  public static readonly SCHEMA = joi
    .object({
      id: joi.string().required(),
      firstName: joi.string().optional(),
      lastName: joi.string().optional(),
      currentPassword: joi.string().optional(),
      newPassword: joi.string().optional(),
      newPasswordConfirm: joi
        .string()
        .valid(joi.ref("newPassword"))
        .optional()
        .options({ language: { any: { allowOnly: "must match password" } } }),
    })
    .min(2)
    .required();

  public static validate(request: UpdateUserProfileViewRequest) {
    const { error } = joi.validate(
      request,
      UpdateUserProfileViewRequest.SCHEMA
    );

    if (error) {
      throw new IllegalParameterError(
        "UpdateUserProfileViewRequest",
        "validate",
        `Invalid provided values: ${error.message}`
      );
    }
  }

  constructor(
    readonly id: number,
    readonly firstName: string,
    readonly lastName: string,
    readonly currentPassword: string,
    readonly newPassword: string,
    readonly newPasswordConfirm: string
  ) {}
}
