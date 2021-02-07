import { Router } from "common/router";
import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import koaRouter, { IMiddleware } from "koa-router";
import { RESET_PASSWORD_EMAIL_TEMPLATE } from "src/common/templates/resetPasswordTemplate";
import { SIGN_UP_EMAIL_TEMPLATE } from "src/common/templates/signUpEmailTemplate";
import { JwtConfig } from "src/configs/appConfig";
import { ChangePasswordRequest } from "src/domain/models/authentication/changePasswordRequest";
import { LoginUseCase } from "src/usecases/authentication/loginUseCase";
import { RenewTokenUseCase } from "src/usecases/authentication/renewTokenUseCase";
import { ResendVerifyEmailUseCase } from "src/usecases/authentication/resendVerifyEmailUseCase";
import { ResetPasswordUseCase } from "src/usecases/authentication/resetPasswordUseCase";
import { UpdatePasswordUseCase } from "src/usecases/authentication/updatePasswordUseCase";
import { VerifyAccountUseCase } from "src/usecases/authentication/verifyAccountUseCase";
import {
  CreateUserUseCase,
  CreateUserUseCaseImpl,
} from "src/usecases/user/createUserUseCase";
import { GetUserProfileUseCase } from "src/usecases/user/getUserProfileUseCase";
import { UpdateUserProfileUseCase } from "src/usecases/user/updateProfileUseCase";
import { UpdateUserUseCase } from "src/usecases/user/updateUserUseCase";
import HttpStatusCode from "src/utils/httpStatusCode";
import { CreateUserViewRequest } from "src/view-models/authentication/createdUserViewRequest";
import { LoginViewRequest } from "src/view-models/authentication/loginViewRequest";
import { UpdateUserProfileViewRequest } from "src/view-models/user/updateUserProfileViewRequest";
import { UpdateUserViewRequest } from "src/view-models/user/updateUserViewRequest";
import { UserViewResponse } from "src/view-models/user/userViewResponse";
import { VerifyAccountViewRequest } from "src/view-models/user/verifyAccountViewRequest";

@injectable()
export class UserRouter extends Router {
  private readonly router: koaRouter;

  constructor(
    @inject(TYPES.JwtConfig) private readonly jwtConfig: JwtConfig,
    @inject(TYPES.GetUserProfileUseCase)
    private readonly getUserProfileUseCase: GetUserProfileUseCase,
    @inject(TYPES.RenewTokenUseCase)
    private readonly renewTokenUseCase: RenewTokenUseCase,
    @inject(TYPES.ResendVerifyEmailUseCase)
    private readonly resendVerifyEmailUseCase: ResendVerifyEmailUseCase,
    @inject(TYPES.LoginUseCase)
    private readonly loginUseCase: LoginUseCase,
    @inject(TYPES.VerifyAccountUseCase)
    private readonly verifyAccountUseCase: VerifyAccountUseCase,
    @inject(TYPES.UpdateUserProfileUseCase)
    private readonly updateUserProfileUseCase: UpdateUserProfileUseCase,
    @inject(TYPES.ResetPasswordUseCase)
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    @inject(TYPES.UpdatePasswordUseCase)
    private readonly updatePasswordUseCase: UpdatePasswordUseCase,
    @inject(TYPES.CreateUserUseCase)
    private readonly createUserUseCase: CreateUserUseCase,
    @inject(TYPES.UpdateUserUseCase)
    private readonly updateUserUseCase: UpdateUserUseCase
  ) {
    super();

    this.router = new koaRouter({
      prefix: "/users",
    });

    this.router.post(
      "login",
      "/login",
      this.handlePublicRoute(async (ctx) => {
        const request = new LoginViewRequest(
          ctx.request.body.email,
          ctx.request.body.password
        );

        const result = await this.loginUseCase.execute(request, this.jwtConfig);

        ctx.body = Router.buildSuccessBody(result);
        ctx.status = HttpStatusCode.OK;
      })
    );

    this.router.post(
      "createUser",
      "/:id",
      this.handleProtectedRoute(async (ctx) => {
        const request = new CreateUserViewRequest(
          1,
          ctx.request.body.email,
          ctx.request.body.roleId
        );

        const result = await this.createUserUseCase.execute(request);

        ctx.body = Router.buildSuccessBody(result);
        ctx.status = HttpStatusCode.OK;
      })
    );

    this.router.put(
      "updateUser",
      "/:id",
      this.handleProtectedRoute(async (ctx) => {
        const request = new UpdateUserViewRequest(
          ctx.params.id,
          ctx.request.body.firstName,
          ctx.request.body.lastName,
          ctx.request.body.roleId,
          ctx._tokenPayload.sub
        );

        const result = await this.updateUserUseCase.execute(request);

        ctx.body = Router.buildSuccessBody(result);
        ctx.status = HttpStatusCode.OK;
      })
    );

    this.router.post(
      "resendVerificationEmail",
      "/resend-verification",
      this.handlePublicRoute(async (ctx) => {
        await this.resendVerifyEmailUseCase.execute(
          ctx.request.body.id,
          "",
          SIGN_UP_EMAIL_TEMPLATE
        );

        ctx.status = HttpStatusCode.NO_CONTENT;
      })
    );

    this.router.patch(
      "verifyAccount",
      "/verify-account",
      this.handlePublicRoute(async (ctx) => {
        const request = new VerifyAccountViewRequest(
          ctx.params.id,
          ctx.request.body.code
        );
        const body = await this.verifyAccountUseCase.execute(request);

        ctx.body = Router.buildSuccessBody(body);
        ctx.status = HttpStatusCode.OK;
      })
    );

    this.router.get(
      "getUserProfile",
      "/my-profile",
      this.handleAuthenticatedRoute(async (ctx) => {
        const userId = ctx._tokenPayload.sub as number;
        const body = await this.getUserProfileUseCase.execute(userId);

        ctx.body = Router.buildSuccessBody(body);
        ctx.status = HttpStatusCode.OK;
      })
    );

    this.router.put(
      "updateUserProfile",
      "/my-profile",
      this.handleAuthenticatedRoute(async (ctx) => {
        const request = new UpdateUserProfileViewRequest(
          ctx._tokenPayload.sub,
          ctx.request.body.firstName,
          ctx.request.body.lastName,
          ctx.request.body.currentPassword,
          ctx.request.body.newPassword,
          ctx.request.body.newPasswordConfirm
        );
        const user: UserViewResponse = await this.updateUserProfileUseCase.execute(
          request
        );
        ctx.body = Router.buildSuccessBody(user);
        ctx.status = HttpStatusCode.OK;
      })
    );

    this.router.post(
      "ResetPassword",
      "/reset-password",
      this.handlePublicRoute(async (ctx) => {
        await this.resetPasswordUseCase.execute(
          ctx.request.body.email,
          RESET_PASSWORD_EMAIL_TEMPLATE
        );

        ctx.status = HttpStatusCode.NO_CONTENT;
      })
    );

    this.router.patch(
      "ChangePassword",
      "/:id/password",
      this.handlePublicRoute(async (ctx) => {
        const request = new ChangePasswordRequest(
          ctx.params.id,
          ctx.request.body.code,
          ctx.request.body.password
        );
        await this.updatePasswordUseCase.execute(request);

        ctx.status = HttpStatusCode.NO_CONTENT;
      })
    );

    this.router.post(
      "RenewToken",
      "/renew-token",
      this.handlePublicRoute(async (ctx) => {
        const token = await this.renewTokenUseCase.execute(
          ctx.request.body.refreshToken,
          this.jwtConfig
        );

        ctx.body = Router.buildSuccessBody(token);
        ctx.status = HttpStatusCode.OK;
      })
    );
  }
  public routes(): IMiddleware {
    return this.router.routes();
  }
}
