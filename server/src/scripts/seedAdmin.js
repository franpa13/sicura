'use strict';

require('../config/env');
const { parseArgs } = require('node:util');
const bcrypt = require('bcrypt');
const User = require('../features/users/user.model');
const { sequelize } = require('../config/database');

const BCRYPT_ROUNDS = 10; // idealmente importar la constante compartida con el módulo de auth (SIC-29)
const MIN_PASSWORD_LENGTH = 12;
const MAX_PASSWORD_BYTES = 72; // bcrypt ignora todo lo que pase de 72 bytes
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_NAME = 'Administrador Inicial';

function readInput() {
  const { values } = parseArgs({
    options: {
      email: { type: 'string', short: 'e' },
      password: { type: 'string', short: 'p' },
      nombre: { type: 'string', short: 'n' },
    },
    strict: true,
  });

  if (values.password) {
    console.warn(
      '[seed:admin] Aviso: pasar la contraseña por argumento la deja en el historial del shell y en la lista de procesos. ' +
      'Preferí la variable de entorno ADMIN_PASSWORD.'
    );
  }

  return {
    email: values.email || process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD || values.password,
    nombre: values.nombre || process.env.ADMIN_NAME || DEFAULT_NAME,
  };
}

function validate({ email, password, nombre }) {
  if (!email || !password) {
    throw new Error(
      'Faltan credenciales obligatorias.\n' +
      '  - Variables de entorno: ADMIN_EMAIL=<email> ADMIN_PASSWORD=<contraseña> npm run seed:admin\n' +
      '  - Argumentos: npm run seed:admin -- --email <email> --password <contraseña> [--nombre <nombre>]'
    );
  }

  const normalizedEmail = email.trim().toLowerCase();
  if (!EMAIL_REGEX.test(normalizedEmail)) {
    throw new Error(`El email "${email}" no tiene un formato válido.`);
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new Error(
      `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres (recibidos: ${password.length}).`
    );
  }

  if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
    throw new Error(`La contraseña no puede superar ${MAX_PASSWORD_BYTES} bytes (límite de bcrypt).`);
  }

  const trimmedName = nombre.trim();
  if (!trimmedName) {
    throw new Error('El nombre no puede estar vacío.');
  }

  return { email: normalizedEmail, password, nombre: trimmedName };
}

/**
 * Crea el usuario admin si no existe. No cierra la conexión ni termina el proceso:
 * eso es responsabilidad de quien la invoque.
 * @returns {Promise<{ user: object, created: boolean }>}
 */
async function seedAdmin(input = readInput()) {
  const { email, password, nombre } = validate(input);

  const password_hash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  // findOrCreate evita la race condition entre el chequeo y la creación
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: { nombre, password_hash, rol: 'admin', tipo: 'persona' },
  });

  return { user, created };
}

async function main() {
  try {
    const { user, created } = await seedAdmin();

    if (created) {
      console.log('\n[seed:admin] ¡Usuario administrador creado con éxito!');
      console.log(`  - ID: ${user.id}`);
      console.log(`  - Nombre: ${user.nombre}`);
      console.log(`  - Email: ${user.email}`);
      console.log(`  - Rol: ${user.rol}`);
      console.log('Ahora puede iniciar sesión en /api/auth/login con estas credenciales.\n');
      return;
    }

    console.log(`\n[seed:admin] El usuario "${user.email}" ya existe (ID: ${user.id}, Rol: ${user.rol}).`);

    if (user.rol !== 'admin') {
      console.error(
        '[seed:admin] ATENCIÓN: el usuario existe pero NO es admin. No se modificó nada; ' +
        'cambiá el rol manualmente o usá otro email.\n'
      );
      process.exitCode = 1;
    } else {
      console.log('[seed:admin] Operación idempotente: no se realizaron modificaciones.\n');
    }
  } catch (err) {
    console.error(`\n[seed:admin] ERROR: ${err.message}\n`);
    process.exitCode = 1;
  } finally {
    await sequelize.close().catch(() => { });
  }
}

if (require.main === module) {
  main();
}

module.exports = { seedAdmin };