import { UnauthorizedError } from "errors/unauthorizedError";
import * as jwt from "jsonwebtoken";
import { Context } from "koa";
import { JwtConfig } from "src/configs/appConfig";
export default function authorizeMiddleware(
  authorizationHeaderParam: string,
  jwtConfig: JwtConfig
): (context: Context, next: () => Promise<any>) => any {
  return async (context: Context, next: () => Promise<any>): Promise<any> => {
    const authorizedToken = context.request.headers[authorizationHeaderParam];

    context._tokenPayload = undefined;

    if (authorizedToken) {
      context._tokenPayload = verifyToken(authorizedToken, jwtConfig.jwtPrivateKey);
    }

    await next();
  };
}

function verifyToken(token: string, privateKeyJwt: string): string | object {
  try {
    return jwt.verify(token, privateKeyJwt);
  } catch (err) {
    throw new UnauthorizedError("Authorization", "verifyToken");
  }
}
