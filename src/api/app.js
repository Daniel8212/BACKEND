'use strict';

const express = require('express');
const catalogoRoutes = require('./routes/catalogo.routes');
const pedidosRoutes = require('./routes/pedidos.routes');
const clientesRoutes = require('./routes/clientes.routes');

function crearApp({ catalogoService, pedidoService, clienteService }) {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.json({ estado: 'ok' });
  });

  app.use('/api/catalogo', catalogoRoutes({ catalogoService }));
  app.use('/api/pedidos', pedidosRoutes({ pedidoService }));
  app.use('/api/clientes', clientesRoutes({ clienteService }));

  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') {
      return res.status(400).json({ error: 'JSON inválido en el cuerpo de la petición' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Error interno del servidor' });
  });

  return app;
}

module.exports = crearApp;