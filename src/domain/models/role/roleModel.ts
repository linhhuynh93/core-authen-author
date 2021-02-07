import { ModelsInterface } from "models/models";
import { DataTypes, Model, Sequelize } from "sequelize";
import { DatabaseTables } from "src/domain/models/databaseTables";
import { PermissionModel } from "models/permission/permissionModel";
import { RolePermissionModel } from "models/rolePermission/rolePermissionModel";
import { UserModel } from "models/user/userModel";

const roleModelSchema = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    field: "id",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "name",
  },
  abbreviation: {
    type: DataTypes.STRING,
    field: "abbreviation",
  },
  level: {
    type: DataTypes.INTEGER,
    field: "level",
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

export class RoleModel extends Model {
  public id: number;
  public name: string;
  public abbreviation: string;
  public level: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly permissions?: PermissionModel[];

  public static initModel(sequelize: Sequelize) {
    RoleModel.init(roleModelSchema, {
      sequelize,
      tableName: DatabaseTables.TABLE_ROLE,
    });
  }

  public static associate(models: ModelsInterface) {
    const user = models[DatabaseTables.TABLE_USER] as typeof UserModel;
    const role = models[DatabaseTables.TABLE_ROLE] as typeof RoleModel;
    const permission = models[
      DatabaseTables.TABLE_PERMISSION
    ] as typeof PermissionModel;
    const rolePermission = models[
      DatabaseTables.TABLE_ROLE_PERMISSION
    ] as typeof RolePermissionModel;

    role.belongsToMany(permission, {
      through: rolePermission,
      as: "permissions",
      foreignKey: "role_id",
    });

    role.hasMany(user, { foreignKey: "role_id", as: "users" });
  }
}
