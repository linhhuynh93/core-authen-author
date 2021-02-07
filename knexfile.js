module.exports = {
  development: {
    client: "mysql",
    connection: {
      host: "localhost",
      port: 3306,
      database: "database_name_dev",
      user: "database_name",
      password: "123@abc",
      charset: "utf8",
    },
    migrations: {
      directory: __dirname + "/src/db/migrations/development",
    },
    seeds: {
      directory: __dirname + "/src/db/seeds/development",
    },
  },

  staging: {
    client: "mysql",
    connection: {
      host: "database-1.cqdej3rlyiba.us-east-2.rds.amazonaws.com",
      port: 3306,
      database: "database_name_staging",
      user: "database_name",
      password: "123@abc#DEF",
    },
    migrations: {
      directory: __dirname + "/src/db/migrations/staging",
    },
    seeds: {
      directory: __dirname + "/src/db/seeds/staging",
    },
  },

  production: {
    client: "mysql",
    connection: {
      host: "localhost",
      port: 3306,
      database: "database_name_prod",
      user: "database_name",
      password: "123@abc",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + "/src/db/migrations/production",
    },
    seeds: {
      directory: __dirname + "/src/db/seeds/production",
    },
  },
};
