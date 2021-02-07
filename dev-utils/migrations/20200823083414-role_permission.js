"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      "role_permission",
      {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        role_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "role",
            },
            key: "id",
          },
          unique: "relation_unique",
        },
        permission_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: "permission",
            },
            key: "id",
          },
          unique: "relation_unique",
        },
        input_attributes: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        output_attributes: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
      },
      {
        uniqueKeys: {
          relation_unique: {
            fields: ["role_id", "permission_id"],
          },
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("role_permission");
  },
};
