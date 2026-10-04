'use strict';

const { Router } = require('express');
const controller = require('./auth.controller');
const { requireAuth } = require('../../shared/middlewares/auth.middleware');

const router = Router();

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/refresh', controller.refresh);
router.post('/logout', controller.logout);
router.post('/logout-all', requireAuth, controller.logoutAll);
router.get('/me', requireAuth, controller.me);

module.exports = router;
