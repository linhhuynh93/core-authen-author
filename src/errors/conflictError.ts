import HttpStatusCode from "src/utils/httpStatusCode";
import { HttpBaseError } from "./httpBaseError";

export class ConflictError extends HttpBaseError {
  constructor(className: string, functionName: string, message: string) {
    super(
      className,
      functionName,
      HttpStatusCode.CONFLICT,
      "DuplicatedError",
      message
    );
  }
}
