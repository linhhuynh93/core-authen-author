import { TYPES } from "injection/types";
import { inject, injectable } from "inversify";
import { Sequelize } from "sequelize";
import { SequelizeProvider } from "src/utils/providers/sequelizeProvider";
import { DatabaseTables } from "./databaseTables";
import { PermissionModel } from "./permission/permissionModel";
import { RoleModel } from "./role/roleModel";
import { RolePermissionModel } from "./rolePermission/rolePermissionModel";
import { SettingsModel } from "./settings/settingsModel";
import { UserModel } from "./user/userModel";

export interface ModelsInterface {
  [key: string]:
    | typeof UserModel
    | typeof SettingsModel
    | typeof RoleModel
    | typeof PermissionModel
    | typeof RolePermissionModel;
}

export interface Models {
  getModels(): ModelsInterface;
}

@injectable()
export class ModelsImpl implements Models {
  private _models: ModelsInterface = {
    [DatabaseTables.TABLE_USER]: UserModel,
    [DatabaseTables.TABLE_SETTINGS]: SettingsModel,
    [DatabaseTables.TABLE_PERMISSION]: PermissionModel,
    [DatabaseTables.TABLE_ROLE]: RoleModel,
    [DatabaseTables.TABLE_ROLE_PERMISSION]: RolePermissionModel,
  };

  constructor(
    @inject(TYPES.SequelizeProvider)
    private readonly sequelize: SequelizeProvider
  ) {
    this.init(sequelize.sequelize());
    this.associate();
  }

  public getModels(): ModelsInterface {
    return this._models;
  }

  private init(sequelize: Sequelize) {
    Object.keys(this._models).forEach((modelName) => {
      this._models[modelName].initModel(sequelize);
    });
  }

  private associate() {
    Object.keys(this._models).forEach((modelName) => {
      if (this._models[modelName].associate) {
        this._models[modelName].associate(this._models);
      }
    });
  }
}
