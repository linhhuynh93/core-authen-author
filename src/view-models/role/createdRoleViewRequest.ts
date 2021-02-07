import { IllegalParameterError } from "errors/illegalParameterError";
import joi from "joi";

export class CreateRoleViewRequest {
  public static readonly SCHEMA = joi
    .object({
      name: joi.string().required(),
      abbreviation: joi.string().required(),
      permissions: joi.array().items(
        joi.object({
          permissionId: joi.number().required(),
          inputAttributes: joi.array().items(joi.string()).required(),
          outputAttributes: joi.array().items(joi.string()).required(),
        })
      ),
    })
    .required();

  public static validate(request: CreateRoleViewRequest) {
    const { error } = joi.validate(request, CreateRoleViewRequest.SCHEMA);

    if (error) {
      throw new IllegalParameterError(
        "CreateRoleViewRequest",
        "validate",
        `Invalid provided values: ${error.message}`
      );
    }
  }
  constructor(
    public readonly name: string,
    public readonly abbreviation: string,
    public readonly permissions: {
      permissionId: number;
      inputAttributes: string[];
      outputAttributes: string[];
    }[]
  ) {}
}
