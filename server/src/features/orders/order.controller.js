'use strict';

const orderService = require('./order.service');

async function list(req, res, next) {
  try {
    res.json(await orderService.listOrders({ estado: req.query.estado }));
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const order = await orderService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
}

async function checkout(req, res, next) {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body.estado);
    if (!order) {
      return res.status(404).json({ message: 'Pedido no encontrado' });
    }
    res.json(order);
  } catch (error) {
    next(error);
  }
}

async function paymentWebhook(req, res, next) {
  try {
    await orderService.handlePaymentCallback(req.body);
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, checkout, updateStatus, paymentWebhook };
