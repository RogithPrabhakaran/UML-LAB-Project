// utils/db.js

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE || 'database_name',
  process.env.DB_USERNAME || 'your_mysql_username',
  process.env.DB_PASSWORD || 'your_mysql_password',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);


module.exports = sequelize;