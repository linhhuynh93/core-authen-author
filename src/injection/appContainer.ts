import { TYPES } from "injection/types"; // tslint:disable-next-line:ordered-imports
import { Router } from "common/router";
import { RoleDbGateway, RoleDbGatewayImpl } from "gateways/roleDbGateway";
import {
  RolePermissionDbGateway,
  RolePermissionDbGatewayImpl,
} from "gateways/rolePermissionGateway";
import {
  RolePermissionRedisGateway,
  RolePermissionRedisGatewayImpl,
} from "gateways/rolePermissionRedisGateway";
import {
  SettingsDbGateway,
  SettingsDbGatewayImpl,
} from "gateways/settingsGateway";
import { UserDbGateway, UserDbGatewayImpl } from "gateways/userDbGateway";
import {
  UserRedisGateway,
  UserRedisGatewayImpl,
} from "gateways/userRedisGateway";

import { Models, ModelsImpl } from "models/models";
import {
  AuthenticationRepository,
  AuthenticationRepositoryImpl,
} from "repositories/authenticationRepository";
import {
  AuthorizationRepository,
  AuthorizationRepositoryImpl,
} from "repositories/authorizationRepository";
import {
  RoleRepository,
  RoleRepositoryImpl,
} from "repositories/roleRepository";
import {
  SettingsRepository,
  SettingsRepositoryImpl,
} from "repositories/settingsRepository";
import {
  UserRedisRepository,
  UserRedisRepositoryImpl,
} from "repositories/userRedisRepository";
import {
  UserRepository,
  UserRepositoryImpl,
} from "repositories/userRepository";
import { Logger, WinstonLogger } from "utils/logger";
import {
  RedisProvider,
  RedisProviderImpl,
} from "utils/providers/redisProvider";
import {
  SequelizeProvider,
  SequelizeProviderImpl,
} from "utils/providers/sequelizeProvider";
import { SendEmailUtil, SendEmailUtilImpl } from "utils/sendEmailUtil";
import { Container } from "inversify";
import "reflect-metadata";
import { InternalRouter } from "src/apps/api/internal/internalRouter";
import { SettingsRouter } from "src/apps/api/settings/settingsRouter";
import { UserRouter } from "src/apps/api/user/userRouter";
import { apiConfig } from "src/configs/api";
import {
  AuthenticationConfig,
  DatabaseConfig,
  JwtConfig,
  RedisConfig,
  ServerConfig,
} from "src/configs/appConfig";
import {
  LoginUseCase,
  LoginUseCaseImpl,
} from "src/usecases/authentication/loginUseCase";
import {
  RenewTokenUseCase,
  RenewTokenUseCaseImpl,
} from "src/usecases/authentication/renewTokenUseCase";
import {
  ResendVerifyEmailUseCase,
  ResendVerifyEmailUseCaseImpl,
} from "src/usecases/authentication/resendVerifyEmailUseCase";
import {
  ResetPasswordUseCase,
  ResetPasswordUseCaseImpl,
} from "src/usecases/authentication/resetPasswordUseCase";
import {
  UpdatePasswordUseCase,
  UpdatePasswordUseCaseImpl,
} from "src/usecases/authentication/updatePasswordUseCase";
import {
  VerifyAccountUseCase,
  VerifyAccountUseCaseImpl,
} from "src/usecases/authentication/verifyAccountUseCase";
import {
  ClearPermissionCacheUseCase,
  ClearPermissionCacheUseCaseImpl,
} from "src/usecases/internal/clearPermissionCacheUseCase";
import {
  GetSettingsUseCase,
  GetSettingsUseCaseImpl,
} from "src/usecases/settings/getSettingsUseCase";
import {
  CreateUserUseCase,
  CreateUserUseCaseImpl,
} from "src/usecases/user/createUserUseCase";
import {
  GetUserProfileUseCase,
  GetUserProfileUseCaseImpl,
} from "src/usecases/user/getUserProfileUseCase";
import {
  UpdateUserProfileUseCase,
  UpdateUserProfileUseCaseImpl,
} from "src/usecases/user/updateProfileUseCase";
import {
  UpdateUserUseCase,
  UpdateUserUseCaseImpl,
} from "src/usecases/user/updateUserUseCase";
import { Util, UtilImpl } from "src/utils/utils";
import {
  CreateRoleUseCase,
  CreateRoleUseCaseImpl,
} from "src/usecases/role/createRoleUseCase";
import { RoleRouter } from "src/apps/api/role/roleRouter";
import {
  RolePermissionRepository,
  RolePermissionRepositoryImpl,
} from "src/domain/repositories/rolePermissionRepository";

export class AppContainer extends Container {
  public inject() {
    // Configs
    this.provideNodeEnvironment();
    this.provideDatabaseConfig();
    this.provideServerConfig();
    this.provideRedisConfig();
    this.provideJwtConfig();
    this.provideAuthenticationConfig();

    // Utilities
    this.provideUtil();
    this.provideLogger();
    this.provideSequelizeProvider();
    this.provideRedisProvider();
    this.provideSendEmailUtil();

    // Model
    this.provideModels();

    // Permission

    // Role
    this.provideRoleRouter();
    this.provideRoleRepository();
    this.provideRoleDbGateway();
    this.provideCreateRoleUseCase();

    // RolePermission
    this.provideRolePermissionDbGateway();
    this.provideRolePermissionRedisGateway();
    this.provideAuthorizationRepository();
    this.provideRolePermissionRepository();

    // Settings
    this.provideSettingsRouter();
    this.provideSettingsRepository();
    this.provideSettingsDbGateway();
    this.provideGetSettingsUseCase();

    // User
    this.provideUserRouter();
    this.provideUserRepository();
    this.provideUserDbGateway();
    this.provideUserRedisRepository();
    this.provideUserRedisGateway();
    this.provideGetUserProfileUseCase();
    this.provideUpdateUserUseCase();
    this.provideUpdateUserProfileUseCase();

    // Authentication
    this.provideAuthenticationRepository();
    this.provideUpdatePasswordUseCase();
    this.provideVerifyAccountUseCase();
    this.provideCreateUserUseCase();
    this.provideLoginUseCase();
    this.provideRenewTokenUseCase();
    this.provideResendVerifyEmailUseCase();
    this.provideResetPasswordUseCase();

    // Internal
    this.provideInternalRouter();
    this.provideClearPermissionCacheUseCase();

    // Audit Log
  }

  protected provideNodeEnvironment() {
    this.bind<string>(TYPES.NodeEnv).toConstantValue(apiConfig.env);
  }

  protected provideDatabaseConfig() {
    this.bind<DatabaseConfig>(TYPES.DatabaseConfig).toConstantValue(
      apiConfig.dbConfig
    );
  }

  protected provideServerConfig() {
    this.bind<ServerConfig>(TYPES.ServerConfig).toConstantValue(
      apiConfig.serverConfig
    );
  }

  protected provideRedisConfig() {
    this.bind<RedisConfig>(TYPES.RedisConfig).toConstantValue(
      apiConfig.redisConfig
    );
  }

  protected provideAuthenticationConfig() {
    this.bind<AuthenticationConfig>(TYPES.AuthenticationConfig).toConstantValue(
      apiConfig.authenticationConfig
    );
  }

  protected provideLogger() {
    this.bind<Logger>(TYPES.Logger).to(WinstonLogger).inSingletonScope();
  }

  protected provideSequelizeProvider() {
    this.bind<SequelizeProvider>(TYPES.SequelizeProvider)
      .to(SequelizeProviderImpl)
      .inSingletonScope();
  }

  protected provideUserRouter() {
    this.bind<Router>(TYPES.UserRouter).to(UserRouter).inSingletonScope();
  }

  protected provideRoleRouter() {
    this.bind<Router>(TYPES.RoleRouter).to(RoleRouter).inSingletonScope();
  }

  protected provideInternalRouter() {
    this.bind<Router>(TYPES.InternalRouter)
      .to(InternalRouter)
      .inSingletonScope();
  }

  protected provideUserRepository() {
    this.bind<UserRepository>(TYPES.UserRepository)
      .to(UserRepositoryImpl)
      .inSingletonScope();
  }

  protected provideUserDbGateway() {
    this.bind<UserDbGateway>(TYPES.UserDbGateway)
      .to(UserDbGatewayImpl)
      .inSingletonScope();
  }

  protected provideRedisProvider() {
    this.bind<RedisProvider>(TYPES.RedisProvider)
      .to(RedisProviderImpl)
      .inSingletonScope();
  }

  protected provideUserRedisRepository() {
    this.bind<UserRedisRepository>(TYPES.UserRedisRepository)
      .to(UserRedisRepositoryImpl)
      .inSingletonScope();
  }

  protected provideUserRedisGateway() {
    this.bind<UserRedisGateway>(TYPES.UserRedisGateway)
      .to(UserRedisGatewayImpl)
      .inSingletonScope();
  }

  protected provideSendEmailUtil() {
    this.bind<SendEmailUtil>(TYPES.SendEmailUtil)
      .to(SendEmailUtilImpl)
      .inSingletonScope();
  }

  protected provideModels() {
    this.bind<Models>(TYPES.Models).to(ModelsImpl).inSingletonScope();
  }

  protected provideAuthenticationRepository() {
    this.bind<AuthenticationRepository>(TYPES.AuthenticationRepository)
      .to(AuthenticationRepositoryImpl)
      .inSingletonScope();
  }

  protected provideJwtConfig() {
    this.bind<JwtConfig>(TYPES.JwtConfig).toConstantValue(apiConfig.jwtConfig);
  }

  protected provideGetUserProfileUseCase() {
    this.bind<GetUserProfileUseCase>(TYPES.GetUserProfileUseCase)
      .to(GetUserProfileUseCaseImpl)
      .inSingletonScope();
  }
  protected provideUpdateUserProfileUseCase() {
    this.bind<UpdateUserProfileUseCase>(TYPES.UpdateUserProfileUseCase)
      .to(UpdateUserProfileUseCaseImpl)
      .inSingletonScope();
  }

  protected provideSettingsRouter() {
    this.bind<Router>(TYPES.SettingsRouter)
      .to(SettingsRouter)
      .inSingletonScope();
  }

  protected provideSettingsRepository() {
    this.bind<SettingsRepository>(TYPES.SettingsRepository)
      .to(SettingsRepositoryImpl)
      .inSingletonScope();
  }

  protected provideSettingsDbGateway() {
    this.bind<SettingsDbGateway>(TYPES.SettingsDbGateway)
      .to(SettingsDbGatewayImpl)
      .inSingletonScope();
  }

  protected provideGetSettingsUseCase() {
    this.bind<GetSettingsUseCase>(TYPES.GetSettingsUseCase)
      .to(GetSettingsUseCaseImpl)
      .inSingletonScope();
  }

  protected provideRolePermissionDbGateway() {
    this.bind<RolePermissionDbGateway>(TYPES.RolePermissionDbGateway)
      .to(RolePermissionDbGatewayImpl)
      .inSingletonScope();
  }

  protected provideRolePermissionRedisGateway() {
    this.bind<RolePermissionRedisGateway>(TYPES.RolePermissionRedisGateway)
      .to(RolePermissionRedisGatewayImpl)
      .inSingletonScope();
  }

  protected provideAuthorizationRepository() {
    this.bind<AuthorizationRepository>(TYPES.AuthorizationRepository)
      .to(AuthorizationRepositoryImpl)
      .inSingletonScope();
  }

  protected provideRoleRepository() {
    this.bind<RoleRepository>(TYPES.RoleRepository)
      .to(RoleRepositoryImpl)
      .inSingletonScope();
  }
  protected provideRolePermissionRepository() {
    this.bind<RolePermissionRepository>(TYPES.RolePermissionRepository)
      .to(RolePermissionRepositoryImpl)
      .inSingletonScope();
  }

  protected provideRoleDbGateway() {
    this.bind<RoleDbGateway>(TYPES.RoleDbGateway)
      .to(RoleDbGatewayImpl)
      .inSingletonScope();
  }

  protected provideUpdateUserUseCase() {
    this.bind<UpdateUserUseCase>(TYPES.UpdateUserUseCase)
      .to(UpdateUserUseCaseImpl)
      .inSingletonScope();
  }

  protected provideLoginUseCase() {
    this.bind<LoginUseCase>(TYPES.LoginUseCase)
      .to(LoginUseCaseImpl)
      .inSingletonScope();
  }

  protected provideRenewTokenUseCase() {
    this.bind<RenewTokenUseCase>(TYPES.RenewTokenUseCase)
      .to(RenewTokenUseCaseImpl)
      .inSingletonScope();
  }

  protected provideResendVerifyEmailUseCase() {
    this.bind<ResendVerifyEmailUseCase>(TYPES.ResendVerifyEmailUseCase)
      .to(ResendVerifyEmailUseCaseImpl)
      .inSingletonScope();
  }

  protected provideResetPasswordUseCase() {
    this.bind<ResetPasswordUseCase>(TYPES.ResetPasswordUseCase)
      .to(ResetPasswordUseCaseImpl)
      .inSingletonScope();
  }

  protected provideCreateUserUseCase() {
    this.bind<CreateUserUseCase>(TYPES.CreateUserUseCase)
      .to(CreateUserUseCaseImpl)
      .inSingletonScope();
  }

  protected provideVerifyAccountUseCase() {
    this.bind<VerifyAccountUseCase>(TYPES.VerifyAccountUseCase)
      .to(VerifyAccountUseCaseImpl)
      .inSingletonScope();
  }

  protected provideUpdatePasswordUseCase() {
    this.bind<UpdatePasswordUseCase>(TYPES.UpdatePasswordUseCase)
      .to(UpdatePasswordUseCaseImpl)
      .inSingletonScope();
  }

  protected provideCreateRoleUseCase() {
    this.bind<CreateRoleUseCase>(TYPES.CreateRoleUseCase)
      .to(CreateRoleUseCaseImpl)
      .inSingletonScope();
  }

  protected provideClearPermissionCacheUseCase() {
    this.bind<ClearPermissionCacheUseCase>(TYPES.ClearPermissionCacheUseCase)
      .to(ClearPermissionCacheUseCaseImpl)
      .inSingletonScope();
  }

  protected provideUtil() {
    this.bind<Util>(TYPES.Util).to(UtilImpl).inSingletonScope();
  }
}
