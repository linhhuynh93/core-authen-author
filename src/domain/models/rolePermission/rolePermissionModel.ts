import { ModelsInterface } from "models/models";
import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseTables } from "src/domain/models/databaseTables";

const rolePermissionModelSchema = {
  roleId: {
    type: DataTypes.INTEGER,
    field: "role_id",
    references: {
      model: "role",
      key: "id",
    },
  },
  permissionId: {
    type: DataTypes.INTEGER,
    field: "permission_id",
    references: {
      model: "permission",
      key: "id",
    },
  },
  outputAttributes: {
    type: DataTypes.JSON,
    field: "output_attributes",
  },
  inputAttributes: {
    type: DataTypes.JSON,
    field: "input_attributes",
  },
};

export class RolePermissionModel extends Model {
  public roleId: string;
  public permissionId: string;
  public outputAttributes: string[];
  public inputAttributes: string[];

  public static initModel(sequelize: Sequelize) {
    RolePermissionModel.init(rolePermissionModelSchema, {
      sequelize,
      tableName: DatabaseTables.TABLE_ROLE_PERMISSION,
    });
  }

  public static associate(models: ModelsInterface) {}
}
