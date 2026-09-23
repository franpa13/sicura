'use strict';

const Product = require('./product.model');

/**
 * Capa de negocio del catalogo. Por ahora solo consultas basicas;
 * el filtrado por persona/empresa y los kits se agregan feature por feature.
 */
async function listProducts(filtros = {}) {
  const where = {};
  if (filtros.categoria) where.categoria = filtros.categoria;
  if (filtros.tipo) where.tipo = filtros.tipo;

  return Product.findAll({ where, order: [['id', 'DESC']] });
}

async function getProductById(id) {
  return Product.findByPk(id);
}

async function createProduct(data) {
  return Product.create(data);
}

async function updateProduct(id, data) {
  const product = await Product.findByPk(id);
  if (!product) return null;
  return product.update(data);
}

async function deleteProduct(id) {
  const product = await Product.findByPk(id);
  if (!product) return false;
  await product.destroy();
  return true;
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
