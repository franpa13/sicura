'use strict';

const { Router } = require('express');
const controller = require('./user.controller');
const { requireAuth, requireRole } = require('../../shared/middlewares/auth.middleware');

const router = Router();

// Toda la gestion de usuarios vive dentro del panel administrativo.
router.get('/', requireAuth, requireRole('admin'), controller.list);
router.get('/:id', requireAuth, requireRole('admin'), controller.getById);
router.patch('/:id/rol', requireAuth, requireRole('admin'), controller.updateRole);

module.exports = router;
