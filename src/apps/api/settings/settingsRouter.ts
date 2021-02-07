import { Router } from "common/router";
import { TYPES } from "injection/types";
import { GetSettingsUseCase } from "usecases/settings/getSettingsUseCase";
import { inject, injectable } from "inversify";
import koaRouter, { IMiddleware } from "koa-router";
import HttpStatusCode from "src/utils/httpStatusCode";

@injectable()
export class SettingsRouter extends Router {
  private readonly router: koaRouter;

  constructor(
    @inject(TYPES.GetSettingsUseCase)
    private readonly getSettingsUseCase: GetSettingsUseCase
  ) {
    super();

    this.router = new koaRouter({
      prefix: "/settings",
    });

    this.router.get(
      "setting/read:any",
      "/",
      this.handleProtectedRoute(async (ctx) => {
        const body = await this.getSettingsUseCase.execute(ctx.query.key);

        ctx.body = Router.buildSuccessBody(body);
        ctx.status = HttpStatusCode.OK;
      })
    );
  }
  public routes(): IMiddleware {
    return this.router.routes();
  }
}
