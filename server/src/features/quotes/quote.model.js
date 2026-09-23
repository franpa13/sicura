'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ESTADOS = ['nueva', 'en_contacto', 'presupuestada', 'ganada', 'perdida'];

const Quote = sequelize.define(
  'Quote',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_empresa: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    // Mail o telefono del referente comercial de la empresa.
    contacto: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    detalle_servicio: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM(...ESTADOS),
      allowNull: false,
      defaultValue: 'nueva',
    },
  },
  {
    tableName: 'quotes',
  }
);

Quote.ESTADOS = ESTADOS;

module.exports = Quote;
