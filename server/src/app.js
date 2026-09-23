'use strict';

const express = require('express');
const cors = require('cors');

const config = require('./config/env');
const { notFoundHandler, errorHandler } = require('./shared/middlewares/error.middleware');

// Se cargan aca para que las asociaciones entre modelos queden registradas al arrancar.
require('./shared/models');

const authRoutes = require('./features/auth/auth.routes');
const productRoutes = require('./features/products/product.routes');
const orderRoutes = require('./features/orders/order.routes');
const quoteRoutes = require('./features/quotes/quote.routes');
const userRoutes = require('./features/users/user.routes');
const notificationRoutes = require('./features/notifications/notification.routes');

const app = express();

// --- Middlewares globales ---
app.use(cors({ origin: config.cors.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Health check ---
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    env: config.env,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// --- Montaje central de las rutas de cada feature ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// --- Manejo de errores (siempre al final) ---
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
