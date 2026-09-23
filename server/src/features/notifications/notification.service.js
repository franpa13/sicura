'use strict';

const config = require('../../config/env');

/**
 * Notificaciones post-compra. Los proveedores concretos (nodemailer y la
 * API de WhatsApp Cloud) se conectan cuando armemos la feature completa.
 */
async function sendMail({ to, subject, body }) {
  if (!config.notifications.mail.host) {
    console.warn('[notifications] MAIL_HOST sin configurar, se omite el envio de mail');
    return { enviado: false, motivo: 'mail_no_configurado' };
  }

  // Pendiente: integrar nodemailer usando config.notifications.mail.
  console.info('[notifications] mail pendiente de envio', { to, subject, body });
  return { enviado: false, motivo: 'pendiente_de_implementar' };
}

async function sendWhatsApp({ to, template, params }) {
  if (!config.notifications.whatsapp.apiToken) {
    console.warn('[notifications] WHATSAPP_API_TOKEN sin configurar, se omite el envio');
    return { enviado: false, motivo: 'whatsapp_no_configurado' };
  }

  // Pendiente: integrar WhatsApp Cloud API usando config.notifications.whatsapp.
  console.info('[notifications] whatsapp pendiente de envio', { to, template, params });
  return { enviado: false, motivo: 'pendiente_de_implementar' };
}

/** Disparo unificado al confirmarse un pedido. */
async function notifyOrderConfirmed(order) {
  const [mail, whatsapp] = await Promise.all([
    sendMail({ to: order.email, subject: `Compra confirmada #${order.id}`, body: '' }),
    sendWhatsApp({ to: order.telefono, template: 'compra_confirmada', params: { orderId: order.id } }),
  ]);

  return { mail, whatsapp };
}

module.exports = { sendMail, sendWhatsApp, notifyOrderConfirmed };
