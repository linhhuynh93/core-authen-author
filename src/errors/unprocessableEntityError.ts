import { SystemMessage } from "common/systemMessage";
import HttpStatusCode from "src/utils/httpStatusCode";
import { HttpBaseError } from "./httpBaseError";

export class UnprocessableEntityError extends HttpBaseError {
  constructor(
    className: string,
    functionName: string,
    message: string = SystemMessage.NON_EXISTING_RESOURCE
  ) {
    super(
      className,
      functionName,
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      "UnprocessableEntityError",
      message
    );
  }
}
