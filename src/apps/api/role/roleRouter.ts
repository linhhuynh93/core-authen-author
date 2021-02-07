import { Router } from "common/router";
import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import koaRouter, { IMiddleware } from "koa-router";
import { CreateRoleUseCase } from "src/usecases/role/createRoleUseCase";
import HttpStatusCode from "src/utils/httpStatusCode";
import { CreateRoleViewRequest } from "src/view-models/role/createdRoleViewRequest";

@injectable()
export class RoleRouter extends Router {
  private readonly router: koaRouter;

  constructor(
    @inject(TYPES.CreateRoleUseCase)
    private readonly createRoleUseCase: CreateRoleUseCase
  ) {
    super();

    this.router = new koaRouter({
      prefix: "/roles",
    });

    this.router.post(
      "createRole",
      "/",
      this.handleProtectedRoute(async (ctx) => {
        const request = new CreateRoleViewRequest(
          ctx.request.body.name,
          ctx.request.body.abbreviation,
          ctx.request.body.permissions
        );

        const result = await this.createRoleUseCase.execute(request);

        ctx.body = Router.buildSuccessBody(result);
        ctx.status = HttpStatusCode.OK;
      })
    );
  }
  public routes(): IMiddleware {
    return this.router.routes();
  }
}
