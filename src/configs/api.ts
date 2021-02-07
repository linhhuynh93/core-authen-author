import { ApiConfig } from "./appConfig";
import { dbConfig } from "./components/database";
import { env } from "./components/env";
import { jwtConfig } from "./components/jsonWebToken";
import { redisConfig } from "./components/redis";
import { serverConfig } from "./components/server";
import { authenticationConfig } from "./components/authentication";

export const apiConfig: ApiConfig = new ApiConfig(
  env,
  serverConfig,
  dbConfig,
  redisConfig,
  jwtConfig,
  authenticationConfig
);
