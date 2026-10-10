'use strict';

require('../config/env');
const Product = require('../features/products/product.model');
const { sequelize } = require('../shared/models');

const INITIAL_PRODUCTS = [
  {
    nombre: 'Cámara Domo IP Exterior Full HD 1080p',
    descripcion: 'Cámara de seguridad para exterior con visión nocturna infrarroja de 30 metros, detección de movimiento y conectividad WiFi.',
    precio: 45000.00,
    categoria: 'camaras',
    imagen_url: 'https://images.unsplash.com/photo-1557862921-37829c790f19',
    tipo: 'sicura',
  },
  {
    nombre: 'Kit Cerco Eléctrico Perimetral 4 Hilos (10 metros)',
    descripcion: 'Sistema de protección perimetral electrificado de alta disuasión con central energizadora homologada, batería de respaldo y sirena de alta potencia.',
    precio: 125000.00,
    categoria: 'cercos_perimetrales',
    imagen_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7',
    tipo: 'sicura',
  },
  {
    nombre: 'Kit Alarma Inalámbrica Integral SICURA Home',
    descripcion: 'Central inteligente de alarma con teclado táctil, 2 sensores de movimiento antimascotas, 2 sensores magnéticos para aberturas, control remoto y discador telefónico.',
    precio: 89000.00,
    categoria: 'kits',
    imagen_url: 'https://images.unsplash.com/photo-1558002038-1055907df827',
    tipo: 'sicura',
  },
  {
    nombre: 'Plan Monitoreo Residencial 24/7 ADT',
    descripcion: 'Servicio de monitoreo continuo las 24 horas con respuesta inmediata, aviso inmediato a fuerzas de seguridad y panel de emergencia conectado.',
    precio: 18500.00,
    categoria: 'planes_adt',
    imagen_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c',
    tipo: 'adt',
  },
  {
    nombre: 'Plan Monitoreo Comercial y Pyme ADT',
    descripcion: 'Monitoreo especializado para locales comerciales con control de aperturas/cierres, botones de pánico silenciosos y asistencia técnica prioritaria.',
    precio: 29000.00,
    categoria: 'planes_adt',
    imagen_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    tipo: 'adt',
  },
  {
    nombre: 'Sensor Infrarrojo Pasivo de Movimiento Antimascotas',
    descripcion: 'Sensor PIR digital con compensación de temperatura e inmunidad a mascotas de hasta 25 kg para evitar falsas alarmas.',
    precio: 14500.00,
    categoria: 'accesorios',
    imagen_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
    tipo: 'sicura',
  },
];

async function seedProducts() {
  try {
    console.log('[seed:products] Conectando a la base de datos...');
    await sequelize.authenticate();

    console.log(`[seed:products] Insertando ${INITIAL_PRODUCTS.length} productos de prueba...`);

    let creados = 0;
    let omitidos = 0;

    for (const item of INITIAL_PRODUCTS) {
      const [product, created] = await Product.findOrCreate({
        where: { nombre: item.nombre },
        defaults: item,
      });

      if (created) {
        creados++;
        console.log(`  [+] Creado: ${product.nombre} (ID: ${product.id}, Tipo: ${product.tipo}, Cat: ${product.categoria})`);
      } else {
        omitidos++;
        console.log(`  [=] Existente: ${product.nombre} (ID: ${product.id})`);
      }
    }

    console.log(`\n[seed:products] Resumen: ${creados} productos creados, ${omitidos} ya existentes.`);
    console.log('[seed:products] ¡Seed de productos completado con éxito!\n');
  } catch (error) {
    console.error('\n[seed:products] Error durante la carga de productos:');
    if (error.original?.sqlMessage) {
      console.error(`[seed:products] Detalle SQL: ${error.original.sqlMessage}`);
    } else {
      console.error(error.message || error);
    }
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  seedProducts().catch(async (err) => {
    console.error('[seed:products] Error fatal:', err);
    await sequelize.close().catch(() => {});
    process.exit(1);
  });
}

module.exports = { seedProducts, INITIAL_PRODUCTS };
