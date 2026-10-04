'use strict';

const authService = require('./auth.service');
const { setAuthCookies, clearAuthCookies } = require('./auth.helper');

async function register(req, res, next) {
  try {
    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const { user, tokens } = await authService.register(req.body, meta);

    setAuthCookies(res, tokens);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const { user, tokens } = await authService.login(req.body, meta);

    setAuthCookies(res, tokens);

    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function refresh(req, res, next) {
  try {
    const rawRefreshToken = req.cookies?.refresh_token;
    const meta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    };

    const { user, tokens } = await authService.rotateRefreshToken(rawRefreshToken, meta);

    setAuthCookies(res, tokens);

    res.json(user);
  } catch (error) {
    clearAuthCookies(res);
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await authService.getProfile(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, refresh, me };
