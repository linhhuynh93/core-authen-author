import { IllegalParameterError } from "errors/illegalParameterError";
import joi from "joi";

export class UpdateRoleViewRequest {
  public static readonly SCHEMA = joi
    .object({
      id: joi.number().required(),
      name: joi.string().required(),
      abbreviation: joi.string().required(),
      level: joi.number().optional(),
      permissions: joi.array().items(
        joi.object({
          permissionId: joi.number().required(),
          inputAttributes: joi.array().items(joi.string).required(),
          outputAttributes: joi.array().items(joi.string).required(),
        })
      ),
    })
    .required();

  public static validate(request: UpdateRoleViewRequest) {
    const { error } = joi.validate(request, UpdateRoleViewRequest.SCHEMA);

    if (error) {
      throw new IllegalParameterError(
        "CreateRoleViewRequest",
        "validate",
        `Invalid provided values: ${error.message}`
      );
    }
  }
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly abbreviation: string,
    public readonly level: number,
    public readonly permissions: {
      permissionId: number;
      inputAttributes: string[];
      outputAttributes: string[];
    }[]
  ) {}
}
