'use strict';

const User = require('./user.model');

const SIN_PASSWORD = { attributes: { exclude: ['password_hash'] } };

async function listUsers() {
  return User.findAll({ ...SIN_PASSWORD, order: [['id', 'DESC']] });
}

async function getUserById(id) {
  return User.findByPk(id, SIN_PASSWORD);
}

async function getUserByEmail(email) {
  return User.findOne({ where: { email } });
}

async function updateRole(id, rol) {
  const user = await User.findByPk(id);
  if (!user) return null;
  return user.update({ rol });
}

module.exports = { listUsers, getUserById, getUserByEmail, updateRole };
