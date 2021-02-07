import * as joi from "joi";
import { USER } from "src/common/user";
import { IllegalParameterError } from "src/errors/illegalParameterError";

export class ChangePasswordRequest {
  constructor(
    public readonly id: number,
    public readonly code: string,
    public readonly password: string
  ) {}
}
