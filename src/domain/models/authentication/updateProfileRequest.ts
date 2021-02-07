import * as joi from "joi";
import { USER } from "src/common/user";
import { IllegalParameterError } from "src/errors/illegalParameterError";

export class UpdateProfileRequest {
  constructor(
    public readonly id: number,
    public readonly firstName: string,
    public readonly lastName: string,
    public hashPassword?: string
  ) {}
}
