'use strict';

const { Router } = require('express');
const controller = require('./quote.controller');
const { requireAuth, requireRole } = require('../../shared/middlewares/auth.middleware');

const router = Router();

// Publica: el formulario del sitio institucional / tienda para empresas.
router.post('/', controller.create);

// Privadas: seguimiento comercial desde el panel.
router.get('/', requireAuth, requireRole('admin', 'metricas'), controller.list);
router.get('/:id', requireAuth, requireRole('admin', 'metricas'), controller.getById);
router.patch('/:id/estado', requireAuth, requireRole('admin'), controller.updateStatus);

module.exports = router;
