'use strict';

const User = require('../users/user.model');

/**
 * Esqueleto de autenticacion. El hash de password y la firma del JWT
 * se implementan cuando armemos la feature completa (bcrypt + jsonwebtoken).
 */
async function register(/* data */) {
  throw new Error('auth.service.register: pendiente de implementar');
}

async function login(/* credenciales */) {
  throw new Error('auth.service.login: pendiente de implementar');
}

async function getProfile(userId) {
  return User.findByPk(userId, { attributes: { exclude: ['password_hash'] } });
}

module.exports = { register, login, getProfile };
