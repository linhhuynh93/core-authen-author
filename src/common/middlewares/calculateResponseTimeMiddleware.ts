import { Context } from "koa";
import { HttpRequestHeader } from "../httpRequestHeader";

export default function calculateResponseTimeMiddleware(): (context: Context, next: () => Promise<any>) => any {
  return async (context: Context, next: () => Promise<any>): Promise<any> => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    context.set(HttpRequestHeader.HEADER_X_RESPONSE_TIME, `${ms}ms`);
  };
}
