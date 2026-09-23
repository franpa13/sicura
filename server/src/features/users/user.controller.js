'use strict';

const userService = require('./user.service');

async function list(req, res, next) {
  try {
    res.json(await userService.listUsers());
  } catch (error) {
    next(error);
  }
}

async function getById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

async function updateRole(req, res, next) {
  try {
    const user = await userService.updateRole(req.params.id, req.body.rol);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
}

module.exports = { list, getById, updateRole };
