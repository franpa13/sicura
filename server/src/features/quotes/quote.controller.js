'use strict';

const quoteService = require('./quote.service');

async function list(req, res, next) {
  try {
    res.json(await quoteService.listQuotes({ estado: req.query.estado }));
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const quote = await quoteService.getQuoteById(req.params.id);
    if (!quote) {
      return res.status(404).json({ message: 'Cotizacion no encontrada' });
    }
    res.json(quote);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const quote = await quoteService.createQuote(req.body);
    res.status(201).json(quote);
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const quote = await quoteService.updateStatus(req.params.id, req.body.estado);
    if (!quote) {
      return res.status(404).json({ message: 'Cotizacion no encontrada' });
    }
    res.json(quote);
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, updateStatus };
