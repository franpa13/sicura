'use strict';

const bcrypt = require('bcrypt');
const User = require('../users/user.model');
const { BadRequestError, ConflictError } = require('../../shared/utils/errors');
const { generateAccessToken, createRefreshToken } = require('./auth.helper');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;

/**
 * Registra un nuevo usuario con rol forzado a 'cliente',
 * valida contraseña mínima de 8 caracteres, hashea con bcrypt
 * y genera los tokens de sesión.
 */
async function register(data = {}, meta = {}) {
  const { nombre, email, password, tipo } = data;

  if (!nombre || typeof nombre !== 'string' || !nombre.trim()) {
    throw new BadRequestError('El nombre es obligatorio');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    throw new BadRequestError('El email no tiene un formato válido');
  }

  if (!password || typeof password !== 'string' || password.length < MIN_PASSWORD_LENGTH) {
    throw new BadRequestError(`La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres`);
  }

  if (!tipo || !User.TIPOS.includes(tipo)) {
    throw new BadRequestError(`El tipo de usuario es obligatorio y debe ser: ${User.TIPOS.join(', ')}`);
  }

  const normalizedEmail = email.trim().toLowerCase();

  // Verificar si ya existe un usuario con este email
  const existingUser = await User.findOne({ where: { email: normalizedEmail } });
  if (existingUser) {
    throw new ConflictError('El email ya se encuentra registrado');
  }

  // Hashear contraseña con bcrypt (10 rounds o más)
  const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // Crear usuario forzando estrictamente rol 'cliente' (ignora cualquier rol proveniente del body)
  let user;
  try {
    user = await User.create({
      nombre: nombre.trim(),
      email: normalizedEmail,
      password_hash,
      rol: 'cliente',
      tipo,
    });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      throw new ConflictError('El email ya se encuentra registrado');
    }
    throw error;
  }

  // Generar sesión: access token y refresh token persistido en base
  const accessToken = generateAccessToken(user);
  const refreshToken = await createRefreshToken(user, meta);

  const userJson = user.toJSON();
  delete userJson.password_hash;

  return {
    user: userJson,
    tokens: {
      accessToken,
      refreshToken,
    },
  };
}

async function login(/* credenciales */) {
  throw new Error('auth.service.login: pendiente de implementar');
}

async function getProfile(userId) {
  return User.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
}

module.exports = { register, login, getProfile, MIN_PASSWORD_LENGTH };
