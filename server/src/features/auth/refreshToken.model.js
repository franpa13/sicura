'use strict';

const { DataTypes, Op } = require('sequelize');
const { sequelize } = require('../../config/database');

const RefreshToken = sequelize.define(
  'RefreshToken',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    token_hash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revoked_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    // ID del nuevo token que lo reemplazó durante la rotación.
    // Permite detectar el reuso de un token revocado (posible robo de sesión).
    replaced_by: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      defaultValue: null,
    },
    user_agent: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING(45),
      allowNull: true,
    },
    isExpired: {
      type: DataTypes.VIRTUAL,
      get() {
        return Boolean(this.expires_at && new Date() >= new Date(this.expires_at));
      },
    },
    isActive: {
      type: DataTypes.VIRTUAL,
      get() {
        return Boolean(!this.revoked_at && !this.isExpired);
      },
    },
    isRevoked: {
      type: DataTypes.VIRTUAL,
      get() {
        return Boolean(this.revoked_at !== null);
      },
    },
  },
  {
    tableName: 'refresh_tokens',
    indexes: [
      {
        unique: true,
        fields: ['token_hash'],
      },
      {
        fields: ['user_id'],
      },
    ],
  }
);

/**
 * Revoca un token marcándolo con la fecha actual y opcionalmente registrando
 * el ID del token que lo reemplazó en la rotación.
 */
RefreshToken.prototype.revoke = async function (replacedById = null) {
  this.revoked_at = new Date();
  if (replacedById) {
    this.replaced_by = replacedById;
  }
  return this.save();
};

/**
 * Método utilitario para purgar tokens vencidos de la base.
 * Si se pasa userId, solo purga los tokens de ese usuario.
 */
RefreshToken.cleanupExpired = async function (userId = null) {
  const where = {
    expires_at: { [Op.lt]: new Date() },
  };

  if (userId) {
    where.user_id = userId;
  }

  return RefreshToken.destroy({ where });
};

module.exports = RefreshToken;
