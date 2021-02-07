import { ModelsInterface } from "models/models";
import { RoleModel } from "models/role/roleModel";
import { DataTypes, Model, Sequelize } from "sequelize";
import { USER_STATUS } from "src/common/enum/userEnum";
import { DatabaseTables } from "src/domain/models/databaseTables";

const userModelSchema = {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
    field: "id",
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "email",
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "first_name",
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
    field: "last_name",
  },
  hashPassword: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "hash_password",
  },
  status: {
    type: DataTypes.ENUM(
      USER_STATUS.ACTIVE,
      USER_STATUS.INACTIVE,
      USER_STATUS.PASSWORD_RESET,
      USER_STATUS.UNVERIFIED
    ),
    field: "status",
  },

  roleId: {
    type: DataTypes.INTEGER,
    field: "role_id",
    references: {
      model: "role",
      key: "id",
    },
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

export class UserModel extends Model {
  public id: number;
  public email: string;
  public firstName: string;
  public lastName: string;
  public hashPassword: string;
  public status: USER_STATUS;
  public roleId: number;
  public profileImageId: number;
  public priorLoginAt: Date;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public static initModel(sequelize: Sequelize) {
    UserModel.init(userModelSchema, {
      sequelize,
      tableName: DatabaseTables.TABLE_USER,
    });
  }

  public static associate(models: ModelsInterface) {
    const user = models[DatabaseTables.TABLE_USER] as typeof UserModel;
    const role = models[DatabaseTables.TABLE_ROLE] as typeof RoleModel;

    user.belongsTo(role, { foreignKey: "role_id" });
  }
}
