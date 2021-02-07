import { HttpBaseError } from "./httpBaseError";
import HttpStatusCode from "src/utils/httpStatusCode";
export class IllegalParameterError extends HttpBaseError {
  constructor(className: string, functionName: string, message: string) {
    super(
      className,
      functionName,
      HttpStatusCode.BAD_REQUEST,
      "IllegalParameterError",
      message
    );
  }
}
