import HttpStatusCode from "src/utils/httpStatusCode";
import { TrackableSystemError } from "./trackableSystemError";

export class HttpBaseError extends TrackableSystemError {
  public readonly code: number;
  public readonly reason: string;
  constructor(
    className: string,
    functionName: string,
    code: number,
    reason: string,
    message: string
  ) {
    super(className, functionName, message);

    // Custom properties
    this.code = code || HttpStatusCode.INTERNAL_SERVER_ERROR;
    this.reason = reason || "InternalServerError";
  }
}
