import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { Sequelize } from "sequelize";
import { DatabaseConfig } from "src/configs/appConfig";

export interface SequelizeProvider {
  sequelize(): Sequelize;
}

@injectable()
export class SequelizeProviderImpl implements SequelizeProvider {
  private readonly sequelizeClient: Sequelize;

  constructor(@inject(TYPES.DatabaseConfig) dbConfig: DatabaseConfig) {
    this.sequelizeClient = new Sequelize(
      dbConfig.database,
      dbConfig.user,
      dbConfig.password,
      {
        host: dbConfig.host,
        dialect: "mysql",
        pool: {
          max: 10,
          min: 2,
          acquire: 15000,
        },
        define: {
          underscored: true,
          freezeTableName: true,
        },
      }
    );
  }

  public sequelize(): Sequelize {
    return this.sequelizeClient;
  }
}
