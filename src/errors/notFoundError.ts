import { SystemMessage } from "common/systemMessage";
import HttpStatusCode from "src/utils/httpStatusCode";
import { HttpBaseError } from "./httpBaseError";

export class NotFoundError extends HttpBaseError {
  constructor(
    className: string,
    functionName: string,
    message: string = SystemMessage.RESOURCE_NOT_FOUND_ERROR
  ) {
    super(
      className,
      functionName,
      HttpStatusCode.NOT_FOUND,
      "NotFoundError",
      message
    );
  }
}
