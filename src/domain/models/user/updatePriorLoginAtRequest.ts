import { IllegalParameterError } from "errors/illegalParameterError";
import joi from "joi";

export class UpdatePriorLoginAtRequest {
  constructor(public readonly priorLoginAt: Date) {}
}
