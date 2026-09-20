'use strict';

const { conectar } = require('../infrastructure/config/db');
const config = require('../infrastructure/config/env');
const crearApp = require('./app');

const ProductoRepository = require('../infrastructure/repositories/ProductoRepository');
const PedidoRepository = require('../infrastructure/repositories/PedidoRepository');
const ClienteRepository = require('../infrastructure/repositories/ClienteRepository');

const CatalogoService = require('../application/services/CatalogoService');
const PedidoService = require('../application/services/PedidoService');
const ClienteService = require('../application/services/ClienteService');

async function iniciar() {
  await conectar();

  const repositorioProductos = new ProductoRepository();
  const repositorioPedidos = new PedidoRepository();
  const repositorioClientes = new ClienteRepository();

  const catalogoService = new CatalogoService(repositorioProductos);
  const pedidoService = new PedidoService(repositorioPedidos, repositorioProductos, repositorioClientes);
  const clienteService = new ClienteService(repositorioClientes);

  const app = crearApp({ catalogoService, pedidoService, clienteService });

  app.listen(config.port, () => {
    console.log(`GreenCart API escuchando en http://localhost:${config.port}`);
  });
}

iniciar().catch((err) => {
  console.error('No se pudo iniciar la API:', err.message);
  process.exit(1);
});