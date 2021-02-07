import { SystemMessage } from "common/systemMessage";
import HttpStatusCode from "src/utils/httpStatusCode";
import { HttpBaseError } from "./httpBaseError";

export class InternalServerError extends HttpBaseError {
  constructor(
    className: string,
    functionName: string,
    message: string = SystemMessage.SYSTEM_ERROR
  ) {
    super(
      className,
      functionName,
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "InternalServerError",
      message
    );
  }
}
