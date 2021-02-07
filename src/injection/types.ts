const TYPES = {
  // Config
  ServerConfig: Symbol.for("ServerConfig"),
  NodeEnv: Symbol.for("NodeEnv"),
  DatabaseConfig: Symbol.for("DatabaseConfig"),
  RedisConfig: Symbol.for("RedisConfig"),
  JwtConfig: Symbol.for("JwtConfig"),
  AuthenticationConfig: Symbol.for("AuthenticationConfig"),

  // Internal,
  InternalRouter: Symbol.for("InternalRouter"),
  ClearPermissionCacheUseCase: Symbol.for("ClearPermissionCacheUseCase"),

  // Utilities,
  Logger: Symbol.for("Logger"),
  Util: Symbol.for("Util"),
  SequelizeProvider: Symbol.for("SequelizeProvider"),
  RedisProvider: Symbol.for("RedisProvider"),
  SendEmailUtil: Symbol.for("SendEmailUtil"),
  ValidateQuestionUtil: Symbol.for("ValidateQuestionUtil"),

  // Aws
  AwsGateway: Symbol.for("AwsGateway"),

  // User
  UserRouter: Symbol.for("UserRouter"),
  UserRepository: Symbol.for("UserRepository"),
  AuthenticationRepository: Symbol.for("AuthenticationRepository"),
  UserDbGateway: Symbol.for("UserDbGateway"),
  UserRedisRepository: Symbol.for("UserRedisRepository"),
  UserRedisGateway: Symbol.for("UserRe¬disGateway"),
  CreateUserUseCase: Symbol.for("CreateUserUseCase"),
  VerifyAccountUseCase: Symbol.for("VerifyAccountUseCase"),
  UpdateUserProfileUseCase: Symbol.for("UpdateUserProfileUseCase"),
  GetUserProfileUseCase: Symbol.for("GetUserProfileUseCase"),
  UpdateUserUseCase: Symbol.for("UpdateUserUseCase"),
  LoginUseCase: Symbol.for("LoginUseCase"),
  RenewTokenUseCase: Symbol.for("RenewTokenUseCase"),
  ResendVerifyEmailUseCase: Symbol.for("ResendVerifyEmailUseCase"),
  ResetPasswordUseCase: Symbol.for("ResetPasswordUseCase"),
  RegisterUseCase: Symbol.for("RegisterUseCase"),
  UpdatePasswordUseCase: Symbol.for("UpdatePasswordUseCase"),

  // Role
  RoleRouter: Symbol.for("RoleRouter"),
  RoleDbGateway: Symbol.for("RoleDbGateway"),
  RoleRepository: Symbol.for("RoleRepository"),
  CreateRoleUseCase: Symbol.for("CreateRoleUseCase"),

  // Permission
  PermisionDbGateway: Symbol.for("PermisionDbGateway"),
  PermissionRepository: Symbol.for("PermissionRepository"),

  // RolePermission
  RolePermissionDbGateway: Symbol.for("RolePermissionDbGateway"),
  RolePermissionRedisGateway: Symbol.for("RolePermissionRedisGateway"),
  AuthorizationRepository: Symbol.for("AuthorizationRepository"),
  RolePermissionRepository: Symbol.for("RolePermissionRepository"),

  // Settings
  SettingsRouter: Symbol.for("SettingsRouter"),
  SettingsRepository: Symbol.for("SettingsRepository"),
  SettingsDbGateway: Symbol.for("SettingsDbGateway"),
  GetSettingsUseCase: Symbol.for("GetSettingsUseCase"),

  // Audit Log
  CreateAuditLogUseCase: Symbol.for("CreateAuditLogUseCase"),

  Models: Symbol.for("Models"),
};

export { TYPES };
