'use strict';

const { Router } = require('express');
const controller = require('./notification.controller');
const { requireAuth, requireRole } = require('../../shared/middlewares/auth.middleware');

const router = Router();

router.post('/orders/resend', requireAuth, requireRole('admin'), controller.resendOrderConfirmation);

module.exports = router;
