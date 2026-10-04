'use strict';

const bcrypt = require('bcrypt');
const User = require('../users/user.model');
const userService = require('../users/user.service');
const RefreshToken = require('./refreshToken.model');
const { BadRequestError, ConflictError, UnauthorizedError } = require('../../shared/utils/errors');
const { generateAccessToken, createRefreshToken, hashToken } = require('./auth.helper');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BCRYPT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
// Hash sintético válido para mitigar ataques de temporización si el usuario no existe
const DUMMY_HASH = '$2b$10$7EqJtq98hPqEX7fNZaFWoO.8/RzLw5uJm0tYgNn/3v86Mfq8tSg4G';

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

/**
 * Autentica un usuario mediante email y contraseña.
 * Devuelve los datos del usuario (sin password_hash) y los tokens generados.
 * Retorna siempre 401 UnauthorizedError con el mismo mensaje si falla email o password.
 */
async function login(credentials = {}, meta = {}) {
  const { email, password } = credentials;

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    throw new UnauthorizedError('Credenciales inválidas');
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await userService.getUserByEmail(normalizedEmail);

  if (!user) {
    throw new UnauthorizedError('Credenciales inválidas');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new UnauthorizedError('Credenciales inválidas');
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

async function getProfile(userId) {
  return User.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
}

/**
 * Rota el refresh token por uno nuevo y emite un access token renovado.
 * Implementa detección de reuso: si el token ya fue reemplazado, invalida todas
 * las sesiones activas del usuario debido a una posible vulneración de sesión.
 */
async function rotateRefreshToken(rawRefreshToken, meta = {}) {
  if (!rawRefreshToken || typeof rawRefreshToken !== 'string') {
    throw new UnauthorizedError('Falta el token de actualización', 'REFRESH_TOKEN_MISSING');
  }

  const tokenHash = hashToken(rawRefreshToken);
  const tokenRecord = await RefreshToken.findOne({ where: { token_hash: tokenHash } });

  if (!tokenRecord) {
    throw new UnauthorizedError('Token de actualización inválido o inexistente', 'REFRESH_TOKEN_INVALID');
  }

  // Detección de reuso: si el token ya fue reemplazado por otro, hay copias concurrentes
  if (tokenRecord.replaced_by !== null) {
    console.warn(
      `[SECURITY] Reuso de refresh token detectado para el usuario ID ${tokenRecord.user_id}. ` +
        `Token ID reutilizado: ${tokenRecord.id}, reemplazado originalmente por: ${tokenRecord.replaced_by}. ` +
        `Revocando todas las sesiones del usuario.`
    );

    // Revocar todas las sesiones del usuario comprometido
    await RefreshToken.update(
      { revoked_at: new Date() },
      { where: { user_id: tokenRecord.user_id, revoked_at: null } }
    );

    throw new UnauthorizedError('Sesión comprometida detectada. Por favor inicie sesión nuevamente', 'SESSION_COMPROMISED');
  }

  // Rechazar si venció o está revocado
  if (tokenRecord.isExpired || tokenRecord.isRevoked) {
    throw new UnauthorizedError('El token de actualización ha expirado o ha sido revocado', 'REFRESH_TOKEN_EXPIRED');
  }

  // Verificar que el usuario exista
  const user = await User.findByPk(tokenRecord.user_id);
  if (!user) {
    throw new UnauthorizedError('Usuario no encontrado', 'USER_NOT_FOUND');
  }

  // Emitir nuevo refresh token en base de datos
  const { rawToken: newRefreshToken, tokenRecord: newTokenRecord } = await createRefreshToken(user, {
    ip: meta.ip,
    userAgent: meta.userAgent,
    returnRecord: true,
  });

  // Revocar el token actual apuntando a replaced_by = newTokenRecord.id
  await tokenRecord.revoke(newTokenRecord.id);

  // Emitir nuevo access token
  const accessToken = generateAccessToken(user);

  const userJson = user.toJSON();
  delete userJson.password_hash;

  return {
    user: userJson,
    tokens: {
      accessToken,
      refreshToken: newRefreshToken,
    },
  };
}

/**
 * Revoca el refresh token actual para cerrar sesión.
 * Si se recibe el refresh token directamente, se revoca por su hash.
 * Si no viene pero se conoce el userId (por access_token), se revocan sus tokens activos.
 */
async function logout({ refreshToken = null, userId = null } = {}) {
  if (refreshToken && typeof refreshToken === 'string') {
    const tokenHash = hashToken(refreshToken);
    await RefreshToken.update(
      { revoked_at: new Date() },
      { where: { token_hash: tokenHash, revoked_at: null } }
    );
    return;
  }

  if (userId) {
    await RefreshToken.update(
      { revoked_at: new Date() },
      { where: { user_id: userId, revoked_at: null } }
    );
  }
}

/**
 * Revoca todas las sesiones activas de un usuario (para cierre de sesión global).
 */
async function logoutAll(userId) {
  if (!userId) {
    throw new BadRequestError('El ID de usuario es obligatorio');
  }

  await RefreshToken.update(
    { revoked_at: new Date() },
    { where: { user_id: userId, revoked_at: null } }
  );
}

module.exports = { register, login, getProfile, rotateRefreshToken, logout, logoutAll, MIN_PASSWORD_LENGTH };
