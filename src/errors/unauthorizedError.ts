import { SystemMessage } from "common/systemMessage";
import HttpStatusCode from "src/utils/httpStatusCode";
import { HttpBaseError } from "./httpBaseError";

export class UnauthorizedError extends HttpBaseError {
  constructor(
    className: string,
    functionName: string,
    message: string = SystemMessage.UNAUTHORIZED_ERROR
  ) {
    super(
      className,
      functionName,
      HttpStatusCode.UNAUTHORIZED,
      "UnauthorizedError",
      message
    );
  }
}
