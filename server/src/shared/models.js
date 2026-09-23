'use strict';

const { sequelize } = require('../config/database');
const User = require('../features/users/user.model');
const Product = require('../features/products/product.model');
const Order = require('../features/orders/order.model');
const OrderItem = require('../features/orders/orderItem.model');
const Quote = require('../features/quotes/quote.model');

/**
 * Punto unico donde se declaran las relaciones entre los modelos de cada feature.
 * Los modelos siguen viviendo en su feature; aca solo se los cruza.
 */

// Un usuario tiene muchos pedidos. user_id es nulo en compras de invitado.
User.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

// Un pedido tiene muchos items.
Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id', as: 'order' });

// Cada item referencia un producto del catalogo.
Product.hasMany(OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });

module.exports = { sequelize, User, Product, Order, OrderItem, Quote };
