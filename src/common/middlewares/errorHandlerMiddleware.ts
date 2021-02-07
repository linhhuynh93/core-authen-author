import { HttpBaseError } from "errors/httpBaseError";
import { Logger } from "utils/logger";

import { Context } from "koa";
import { Environment } from "src/common/environment";
import { env } from "src/configs/components/env";
import HttpStatusCode from "src/utils/httpStatusCode";
import { SystemMessage } from "../systemMessage";

export default function errorHandlerMiddleware(
  logger: Logger
): (context: Context, next: () => Promise<any>) => any {
  return async (context: Context, next: () => Promise<any>): Promise<any> => {
    try {
      await next();
    } catch (error) {
      logger.error(error.message, error.stack);

      if (error instanceof HttpBaseError) {
        // TODO log error for HttpBaseError
        // TODO log error for BaseError
        context.status = error.code;
        context.body = buildErrorBody(error.code, error.message);
        return;
      }

      // TODO log error for SystemError
      context.status = HttpStatusCode.INTERNAL_SERVER_ERROR;
      context.body = buildErrorBody(
        HttpStatusCode.INTERNAL_SERVER_ERROR,
        env === Environment.DEVELOPMENT
          ? error.message
          : SystemMessage.SYSTEM_ERROR
      );
    }
  };
}

function buildErrorBody(
  errorCode: number,
  errorMessage: string
): ErrorResponse {
  return {
    status: errorCode,
    message: errorMessage,
  };
}

interface ErrorResponse {
  status: number;
  message: string;
}
