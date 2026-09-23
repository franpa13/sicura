'use strict';

const { Router } = require('express');
const controller = require('./order.controller');
const { requireAuth, requireRole } = require('../../shared/middlewares/auth.middleware');

const router = Router();

// Publicas: checkout de invitado y notificaciones de pago.
router.post('/checkout', controller.checkout);
router.post('/payments/webhook', controller.paymentWebhook);

// Privadas: seguimiento y gestion de pedidos desde el panel.
router.get('/', requireAuth, requireRole('admin', 'metricas'), controller.list);
router.get('/:id', requireAuth, controller.getById);
router.patch('/:id/estado', requireAuth, requireRole('admin'), controller.updateStatus);

module.exports = router;
