import { UnauthorizedError } from "errors/unauthorizedError";
import { TYPES } from "injection/types";
import { AuthorizationRepository } from "repositories/authorizationRepository";
import { inject, injectable } from "inversify";
import { Context } from "koa";
import { IMiddleware } from "koa-router";
import { ForbiddenError } from "src/errors/forbiddenError";

@injectable()
export abstract class Router {
  @inject(TYPES.AuthorizationRepository)
  private readonly authorizationRepository: AuthorizationRepository;
  constructor() {}

  public abstract routes(): IMiddleware;

  protected static buildSuccessBody<T>(data: T): SuccessResponse<T> {
    return { data };
  }

  protected static isAuthorized(tokenPayload: any): boolean {
    return !!tokenPayload;
  }

  protected static getTokenPayload(context: Context): any {
    return context._tokenPayload;
  }

  protected static getCurrentUserId(context: Context): any {
    return context._tokenPayload.sub;
  }

  protected static getDecodedIdRole(context: Context): any {
    return context._userRole;
  }

  protected static assertAuthenticatedInternal(tokenPayloadInternal: any) {
    if (!Router.isAuthorized(tokenPayloadInternal)) {
      throw new UnauthorizedError(
        "Router",
        "assertProtectedPermission",
        "Permission denied"
      );
    }
  }

  protected static assertAuthenticated(tokenPayload: any) {
    if (!Router.isAuthorized(tokenPayload)) {
      throw new UnauthorizedError(
        "Router",
        "assertProtectedPermission",
        "Permission denied"
      );
    }
  }

  protected handleProtectedRoute(
    handler: (context: Context) => Promise<any>
  ): (context: Context) => Promise<any> {
    return async (context: Context): Promise<any> => {
      Router.assertAuthenticated(context._tokenPayload);
      const permission = await this.authorizationRepository.getPermission(
        context,
        context.routerName
      );
      if (!permission || !permission.granted) {
        throw new ForbiddenError(
          "Router",
          "assertProtectedPermission",
          "Permission denied"
        );
      }
      context.permission = permission;
      await handler(context);
    };
  }

  protected handleAuthenticatedRoute(
    handler: (context: Context) => Promise<any>
  ): (context: Context) => Promise<any> {
    return async (context: Context): Promise<any> => {
      Router.assertAuthenticated(Router.getTokenPayload(context));
      await handler(context);
    };
  }

  protected handleProtectedInternalRoute(
    handler: (context: Context) => Promise<any>
  ): (context: Context) => Promise<any> {
    return async (context: Context): Promise<any> => {
      Router.assertAuthenticatedInternal(context._tokenPayloadInternal);
      await handler(context);
    };
  }

  protected handlePublicRoute(
    handler: (context: Context) => Promise<any>
  ): (context: Context) => Promise<any> {
    return async (context: Context): Promise<any> => {
      await handler(context);
    };
  }
}

interface SuccessResponse<T> {
  data: T;
}
