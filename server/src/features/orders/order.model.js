'use strict';

const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/database');

const ESTADOS = ['pendiente', 'pagado', 'en_preparacion', 'enviado', 'entregado', 'cancelado'];
const MEDIOS_PAGO = ['mercado_pago', 'transferencia', 'tarjeta'];

const Order = sequelize.define(
  'Order',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    // Nulo cuando la compra se hace como invitado.
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    estado: {
      type: DataTypes.ENUM(...ESTADOS),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    total: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0,
    },
    medio_pago: {
      type: DataTypes.ENUM(...MEDIOS_PAGO),
      allowNull: false,
    },
  },
  {
    tableName: 'orders',
  }
);

Order.ESTADOS = ESTADOS;
Order.MEDIOS_PAGO = MEDIOS_PAGO;

module.exports = Order;
