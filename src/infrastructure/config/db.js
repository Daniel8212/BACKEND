'use strict';

const mongoose = require('mongoose');
const config = require('./env');

async function conectar() {
  const conn = await mongoose.connect(config.mongoUri);
  console.log(`MongoDB conectado: ${conn.connection.host}`);
  return conn;
}

async function desconectar() {
  await mongoose.disconnect();
}

module.exports = { conectar, desconectar };