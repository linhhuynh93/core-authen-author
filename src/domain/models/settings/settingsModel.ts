import { ModelsInterface } from "models/models";
import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseTables } from "src/domain/models/databaseTables";

const settingsModelSchema = {
  key: {
    type: DataTypes.STRING,
    field: "key",
    primaryKey: true,
  },
  value: {
    type: DataTypes.TEXT,
    field: "value",
  },
};

export class SettingsModel extends Model {
  public key: string;
  public value: string;

  public static initModel(sequelize: Sequelize) {
    SettingsModel.init(settingsModelSchema, {
      sequelize,
      tableName: DatabaseTables.TABLE_SETTINGS,
      timestamps: false,
    });
  }

  public static associate(models: ModelsInterface) {}
}
