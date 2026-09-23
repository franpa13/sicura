'use strict';

const Quote = require('./quote.model');

/**
 * Cotizador de servicios para empresas: no genera una compra,
 * deriva el pedido al equipo comercial.
 */
async function listQuotes(filtros = {}) {
  const where = {};
  if (filtros.estado) where.estado = filtros.estado;

  return Quote.findAll({ where, order: [['id', 'DESC']] });
}

async function getQuoteById(id) {
  return Quote.findByPk(id);
}

async function createQuote(data) {
  return Quote.create(data);
}

async function updateStatus(id, estado) {
  const quote = await Quote.findByPk(id);
  if (!quote) return null;
  return quote.update({ estado });
}

module.exports = { listQuotes, getQuoteById, createQuote, updateStatus };
