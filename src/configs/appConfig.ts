export class ApiConfig {
  private _env: string;
  private _serverConfig: ServerConfig | undefined = undefined;
  private _dbConfig: DatabaseConfig | undefined = undefined;
  private _redisConfig: RedisConfig | undefined = undefined;
  private _jwtConfig: JwtConfig | undefined = undefined;
  private _authenticationConfig: AuthenticationConfig | undefined = undefined;

  constructor(
    env: string,
    serverConfig: ServerConfig,
    dbConfig: DatabaseConfig,
    redisConfig: RedisConfig,
    jwtConfig: JwtConfig,
    authenticationConfig: AuthenticationConfig
  ) {
    this._env = env;
    this._serverConfig = serverConfig;
    this._dbConfig = dbConfig;
    this._redisConfig = redisConfig;
    this._jwtConfig = jwtConfig;
    this._authenticationConfig = authenticationConfig;
  }

  get env(): string {
    return this._env;
  }

  get serverConfig(): ServerConfig {
    if (!this._serverConfig) {
      throw new Error(`Server config wasn't set yet`);
    }

    return this._serverConfig;
  }

  get dbConfig(): DatabaseConfig {
    if (!this._dbConfig) {
      throw new Error(`Database config wasn't set yet`);
    }

    return this._dbConfig;
  }

  get redisConfig(): RedisConfig {
    if (!this._redisConfig) {
      throw new Error(`Redis config wasn't set yet`);
    }

    return this._redisConfig;
  }

  get jwtConfig(): JwtConfig {
    if (!this._jwtConfig) {
      throw new Error(`Jwt config wasn't set yet`);
    }

    return this._jwtConfig;
  }

  get authenticationConfig(): AuthenticationConfig {
    if (!this._authenticationConfig) {
      throw new Error(`Jwt config wasn't set yet`);
    }

    return this._authenticationConfig;
  }
}

export interface ServerConfig {
  readonly port: number;
  readonly logPath: string;
}

export interface DatabaseConfig {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  readonly password: string;
  readonly database: string;
  readonly caPath: string;
}

export interface RedisConfig {
  readonly endpoint: string;
  readonly port: number;
}

export interface JwtConfig {
  readonly jwtPrivateKey: string;
  readonly jwtExpriresIn: number;
  readonly jwtRefreshKey: string;
}

export interface AuthenticationConfig {
  readonly verificationUrl: string;
  readonly mailSystem: string;
  readonly mailSystemUsername: string;
  readonly mailSystemPassword: string;
}
