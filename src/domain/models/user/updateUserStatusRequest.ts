import { IllegalParameterError } from "errors/illegalParameterError";
import joi from "joi";
import { USER_STATUS } from "src/common/enum/userEnum";

export class UpdateUserStatusRequest {
  constructor(public readonly status: USER_STATUS) {}
}
