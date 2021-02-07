import { HttpRequestHeader } from "common/httpRequestHeader";
import calculateResponseTimeMiddleware from "common/middlewares/calculateResponseTimeMiddleware";
import errorHandlerMiddleware from "common/middlewares/errorHandlerMiddleware";
import authorizeMiddleware from "common/middlewares/authorizeMiddleware";
import { Router } from "common/router";
import { TYPES } from "injection/types";
import cors from "@koa/cors";
import { Logger } from "utils/logger";
import http from "http";
import { Container } from "inversify";
import koa from "koa";
import koaBodyparser from "koa-bodyparser";
import { ServerConfig } from "src/configs/appConfig";
import { jwtConfig } from "src/configs/components/jsonWebToken";
import { InitCronJob } from "src/cron-jobs/initCronJob";

export class Server {
  private readonly app: koa;
  private readonly logger: Logger;
  private readonly serverConfig: ServerConfig;

  constructor(appContainer: Container) {
    this.logger = appContainer.get<Logger>(TYPES.Logger);
    this.serverConfig = appContainer.get<ServerConfig>(TYPES.ServerConfig);

    // Router initialize
    const internalRouter = appContainer.get<Router>(TYPES.InternalRouter);
    const userRouter = appContainer.get<Router>(TYPES.UserRouter);
    const roleRouter = appContainer.get<Router>(TYPES.RoleRouter);
    const settingsRouter = appContainer.get<Router>(TYPES.SettingsRouter);

    this.app = new koa();
    this.app.use(calculateResponseTimeMiddleware());
    this.app.use(errorHandlerMiddleware(this.logger));
    this.app.use(cors());
    this.app.use(koaBodyparser());
    this.app.use(
      authorizeMiddleware(HttpRequestHeader.HEADER_AUTHORIZATION, jwtConfig)
    );

    this.app.use(internalRouter.routes());
    this.app.use(userRouter.routes());
    this.app.use(roleRouter.routes());
    this.app.use(settingsRouter.routes());
    InitCronJob.init(appContainer);
  }

  public start(): http.Server {
    return this.app.listen(this.serverConfig.port, () => {
      this.logger.info(
        `The server is starting at port ${this.serverConfig.port}`
      );
    });
  }
}
