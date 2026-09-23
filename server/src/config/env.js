'use strict';

const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '../../.env'), quiet: true });

/**
 * Variables sin las cuales la aplicacion no puede funcionar.
 * En desarrollo se avisa por consola; en produccion el arranque falla.
 */
const REQUIRED_KEYS = ['DB_HOST', 'DB_NAME', 'DB_USER', 'JWT_SECRET'];

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

function toNumber(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

function validateEnv() {
  const missing = REQUIRED_KEYS.filter((key) => {
    const value = process.env[key];
    return value === undefined || value === null || value.trim() === '';
  });

  if (missing.length === 0) return;

  const detalle = missing.join(', ');

  if (isProduction) {
    throw new Error(
      `[config] Faltan variables de entorno obligatorias en produccion: ${detalle}. ` +
        'Copiá .env.example a .env y completá esos valores antes de levantar el servidor.'
    );
  }

  console.warn(
    `[config] Variables de entorno sin definir (${detalle}). ` +
      'En desarrollo se usan valores por defecto, pero en produccion son obligatorias.'
  );
}

validateEnv();

const config = {
  env: nodeEnv,
  isProduction,
  isDevelopment: nodeEnv === 'development',

  server: {
    port: toNumber(process.env.PORT, 4000),
  },

  db: {
    host: process.env.DB_HOST || 'localhost',
    port: toNumber(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME || 'sicura_db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    dialect: 'mysql',
  },

  cors: {
    clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'dev-only-insecure-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },

  mercadoPago: {
    accessToken: process.env.MP_ACCESS_TOKEN || '',
    publicKey: process.env.MP_PUBLIC_KEY || '',
  },

  notifications: {
    mail: {
      host: process.env.MAIL_HOST || '',
      port: toNumber(process.env.MAIL_PORT, 587),
      user: process.env.MAIL_USER || '',
      password: process.env.MAIL_PASSWORD || '',
      from: process.env.MAIL_FROM || 'tienda@sicura.com.ar',
    },
    whatsapp: {
      apiToken: process.env.WHATSAPP_API_TOKEN || '',
      phoneId: process.env.WHATSAPP_PHONE_ID || '',
    },
  },
};

module.exports = config;
