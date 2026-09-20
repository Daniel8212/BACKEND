'use strict';

const mongoose = require('mongoose');
const config = require('../config/env');
const ModeloProducto = require('../models/Producto');
const ModeloCliente = require('../models/Cliente');
const ModeloPedido = require('../models/Pedido');

const catalogo = [
  { nombre: 'Manzana ecológica', descripcion: 'Cosecha local certificada orgánica', precio: 2.5, linea: 'Frutas', stock: 'disponible' },
  { nombre: 'Aguacate Hass', descripcion: 'Aguacate ecológico de temporada', precio: 1.8, linea: 'Frutas', stock: 'disponible' },
  { nombre: 'Tomate pera', descripcion: 'Hortaliza fresca de huerto local', precio: 1.2, linea: 'Verduras', stock: 'disponible' },
  { nombre: 'Espinaca baby', descripcion: 'Hortaliza de hoja verde lavada y lista para consumir', precio: 1.5, linea: 'Verduras', stock: 'disponible' },
  { nombre: 'Zanahoria baby', descripcion: 'Raíz ecológica cosechada en temporada', precio: 1.3, linea: 'Verduras', stock: 'disponible' },
  { nombre: 'Café de origen', descripcion: 'Café gourmet molido de origen único', precio: 8.5, linea: 'Cesta', stock: 'agotado' },
  { nombre: 'Miel de abeja', descripcion: 'Miel cruda sin procesar de apiarios locales', precio: 6.0, linea: 'Cesta', stock: 'disponible' },
  { nombre: 'Aceite de oliva extra virgen', descripcion: 'Aceite de primera presión en frío', precio: 10.0, linea: 'Cesta', stock: 'disponible' },
];

const clientesDemo = [
  { nombre: 'María García', email: 'maria.garcia@greencart.com' },
  { nombre: 'Carlos López', email: 'carlos.lopez@greencart.com' },
];

async function sembrar() {
  await mongoose.connect(config.mongoUri);

  await ModeloProducto.deleteMany({});
  const productosCreados = await ModeloProducto.insertMany(catalogo);
  console.log(`Seed: ${productosCreados.length} productos insertados`);

  await ModeloCliente.deleteMany({});
  const clientesCreados = await ModeloCliente.insertMany(clientesDemo);
  console.log(`Seed: ${clientesCreados.length} clientes demo insertados`);

  await ModeloPedido.deleteMany({});
  console.log('Seed: pedidos de prueba eliminados');

  await mongoose.disconnect();
  console.log('Seed completado correctamente.');
}

if (require.main === module) {
  sembrar().catch((err) => {
    console.error('Error en seed:', err.message);
    process.exit(1);
  });
}

module.exports = sembrar;