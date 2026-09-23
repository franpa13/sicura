'use strict';

const Order = require('./order.model');
const OrderItem = require('./orderItem.model');

/**
 * Checkout y estados de pedido. Se soporta compra como invitado
 * (user_id nulo) y compra con usuario registrado.
 */
async function listOrders(filtros = {}) {
  const where = {};
  if (filtros.estado) where.estado = filtros.estado;
  if (filtros.userId) where.user_id = filtros.userId;

  return Order.findAll({ where, include: [{ model: OrderItem, as: 'items' }], order: [['id', 'DESC']] });
}

async function getOrderById(id) {
  return Order.findByPk(id, { include: [{ model: OrderItem, as: 'items' }] });
}

async function createOrder(/* data */) {
  // Pendiente: validar stock, calcular total y crear Order + OrderItems en una transaccion.
  throw new Error('order.service.createOrder: pendiente de implementar');
}

async function updateStatus(id, estado) {
  const order = await Order.findByPk(id);
  if (!order) return null;
  return order.update({ estado });
}

/** Webhook / retorno de Mercado Pago. */
async function handlePaymentCallback(/* payload */) {
  throw new Error('order.service.handlePaymentCallback: pendiente de implementar');
}

module.exports = { listOrders, getOrderById, createOrder, updateStatus, handlePaymentCallback };
