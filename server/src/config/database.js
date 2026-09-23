'use strict';

const { Sequelize } = require('sequelize');
const config = require('./env');

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: config.db.dialect,
  logging: config.isDevelopment ? console.log : false,
  define: {
    underscored: true,
    timestamps: true,
  },
  pool: {
    max: 10,
    min: 0,
    idle: 10000,
    acquire: 30000,
  },
});

/** Verifica la conexion contra MySQL. Se llama al arrancar el servidor. */
async function testConnection() {
  await sequelize.authenticate();
}

module.exports = { sequelize, testConnection, Sequelize };
