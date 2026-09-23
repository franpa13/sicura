'use strict';

const productService = require('./product.service');

async function list(req, res, next) {
  try {
    const products = await productService.listProducts({
      categoria: req.query.categoria,
      tipo: req.query.tipo,
    });
    res.json(products);
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const ok = await productService.deleteProduct(req.params.id);
    if (!ok) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, create, update, remove };
