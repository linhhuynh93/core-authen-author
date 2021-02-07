import { ModelsInterface } from "models/models";
import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseTables } from "src/domain/models/databaseTables";
import { RoleModel } from "models/role/roleModel";
import { RolePermissionModel } from "models/rolePermission/rolePermissionModel";

const permissionModelSchema = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    field: "id",
  },
  action: {
    allowNull: false,
    type: DataTypes.STRING,
    field: "action",
  },
  resource: {
    allowNull: false,
    type: DataTypes.STRING,
    field: "resource",
  },
  inputAttributes: {
    allowNull: false,
    type: DataTypes.STRING,
    field: "input_attributes",
  },
  outputAttributes: {
    allowNull: false,
    type: DataTypes.STRING,
    field: "output_attributes",
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "created_at",
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: "updated_at",
  },
};

export class PermissionModel extends Model {
  public id: number;
  public action: string;
  public resource: string;
  public inputAttributes: string[];
  public outputAttributes: string[];
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly roles?: RoleModel[];

  public static initModel(sequelize: Sequelize) {
    PermissionModel.init(permissionModelSchema, {
      sequelize,
      tableName: DatabaseTables.TABLE_PERMISSION,
    });
  }

  public static associate(models: ModelsInterface) {
    const role = models[DatabaseTables.TABLE_ROLE] as typeof RoleModel;
    const permission = models[
      DatabaseTables.TABLE_PERMISSION
    ] as typeof PermissionModel;
    const rolePermission = models[
      DatabaseTables.TABLE_ROLE_PERMISSION
    ] as typeof RolePermissionModel;

    permission.belongsToMany(role, {
      through: rolePermission,
      as: "roles",
      foreignKey: "permission_id",
    });
  }
}
