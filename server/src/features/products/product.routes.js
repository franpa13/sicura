'use strict';

const { Router } = require('express');
const controller = require('./product.controller');
const { requireAuth, requireRole } = require('../../shared/middlewares/auth.middleware');

const router = Router();

// Publicas: las consume la tienda.
router.get('/', controller.list);
router.get('/:id', controller.getById);

// Privadas: ABM desde el panel administrativo.
router.post('/', requireAuth, requireRole('admin', 'cargador'), controller.create);
router.put('/:id', requireAuth, requireRole('admin', 'cargador'), controller.update);
router.delete('/:id', requireAuth, requireRole('admin', 'cargador'), controller.remove);

module.exports = router;
