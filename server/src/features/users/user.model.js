'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ROLES = ['admin', 'cargador', 'metricas', 'cliente'];
const TIPOS = ['persona', 'empresa'];

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(160),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM(...ROLES),
      allowNull: false,
      defaultValue: 'cliente',
    },
    tipo: {
      type: DataTypes.ENUM(...TIPOS),
      allowNull: false,
      defaultValue: 'persona',
    },
  },
  {
    tableName: 'users',
  }
);

User.ROLES = ROLES;
User.TIPOS = TIPOS;

module.exports = User;
