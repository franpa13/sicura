'use strict';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config/env');
const RefreshToken = require('./refreshToken.model');

const ACCESS_TOKEN_EXPIRES_IN = '15m';
const REFRESH_TOKEN_DAYS = 7;
const REFRESH_TOKEN_MS = REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000;

/**
 * Genera un Access Token JWT firmado con expiración corta (15 min).
 */
function generateAccessToken(user) {
  return jwt.sign(
    {
      id: user.id,
      rol: user.rol,
    },
    config.auth.jwtSecret,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

/**
 * Genera un Refresh Token aleatorio criptográfico (40 bytes hex),
 * calcula su hash SHA-256 y lo persiste en la base de datos asociado al usuario.
 */
async function createRefreshToken(user, { ip = null, userAgent = null } = {}) {
  const rawToken = crypto.randomBytes(40).toString('hex');
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_MS);

  await RefreshToken.create({
    user_id: user.id,
    token_hash: tokenHash,
    expires_at: expiresAt,
    ip: ip || null,
    user_agent: userAgent || null,
  });

  return rawToken;
}

/**
 * Función de hashing SHA-256 para tokens.
 */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

/**
 * Configura las cookies de sesión httpOnly en la respuesta HTTP.
 * Reutilizable tanto en registro como en login.
 */
function setAuthCookies(res, { accessToken, refreshToken }) {
  const isProd = config.isProduction;

  res.cookie('access_token', accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 15 * 60 * 1000, // 15 minutos
    path: '/',
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: REFRESH_TOKEN_MS, // 7 días
    path: '/api/auth/refresh',
  });
}

/**
 * Limpia las cookies de sesión (para logout).
 */
function clearAuthCookies(res) {
  res.clearCookie('access_token', { path: '/' });
  res.clearCookie('refresh_token', { path: '/api/auth/refresh' });
}

module.exports = {
  generateAccessToken,
  createRefreshToken,
  hashToken,
  setAuthCookies,
  clearAuthCookies,
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_MS,
};
