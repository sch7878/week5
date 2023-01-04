
require("dotenv").config();
module.exports =
{
  "development": {
    "username": process.env.config_USERNAME,
    "password": process.env.config_PASSWORD,
    "database": process.env.config_DATABASE,
    "host": process.env.config_HOST,
    "dialect": process.env.config_DIALECT,
    "timezone" : "+9:00"
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql"
  },
  "production": {
    "username": "root",
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "mysql"
  }
};
