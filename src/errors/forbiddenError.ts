import HttpStatusCode from "src/utils/httpStatusCode";
import { SystemMessage } from "../common/systemMessage";
import { HttpBaseError } from "./httpBaseError";

export class ForbiddenError extends HttpBaseError {
  constructor(
    className: string,
    functionName: string,
    message: string = SystemMessage.FORBIDDEN_ERROR
  ) {
    super(
      className,
      functionName,
      HttpStatusCode.FORBIDDEN,
      "ForbiddenError",
      message
    );
  }
}
