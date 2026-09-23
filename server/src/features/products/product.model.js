'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const CATEGORIAS = ['camaras', 'cercos_perimetrales', 'kits', 'alarmas', 'accesorios', 'planes_adt'];
const TIPOS = ['sicura', 'adt'];

const Product = sequelize.define(
  'Product',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING(160),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    categoria: {
      type: DataTypes.ENUM(...CATEGORIAS),
      allowNull: false,
    },
    imagen_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    tipo: {
      type: DataTypes.ENUM(...TIPOS),
      allowNull: false,
      defaultValue: 'sicura',
    },
  },
  {
    tableName: 'products',
  }
);

Product.CATEGORIAS = CATEGORIAS;
Product.TIPOS = TIPOS;

module.exports = Product;
