'use strict';

const notificationService = require('./notification.service');

/** Reenvio manual de la confirmacion de una compra desde el panel. */
async function resendOrderConfirmation(req, res, next) {
  try {
    const resultado = await notificationService.notifyOrderConfirmed(req.body);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

module.exports = { resendOrderConfirmation };
