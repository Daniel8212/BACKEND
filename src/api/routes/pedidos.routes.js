'use strict';

const { Router } = require('express');

function crearRutasPedidos({ pedidoService }) {
  const router = Router();

  router.get('/', async (req, res) => {
    const { clienteId } = req.query;
    const resultado = await pedidoService.listarPorCliente(clienteId);
    if (!resultado.exito) {
      return res.status(resultado.codigo).json({ error: resultado.errores[0], errores: resultado.errores });
    }
    return res.status(200).json(resultado.datos);
  });

  router.post('/', async (req, res) => {
    const { clienteId, items } = req.body || {};
    const resultado = await pedidoService.crear({ clienteId, items });
    if (!resultado.exito) {
      return res.status(resultado.codigo).json({ error: resultado.errores[0], errores: resultado.errores });
    }
    return res.status(201).json(resultado.datos);
  });

  router.get('/:id', async (req, res) => {
    const pedido = await pedidoService.buscarPorId(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: `El pedido "${req.params.id}" no existe.` });
    }
    return res.status(200).json(pedido);
  });

  router.patch('/:id/estado', async (req, res) => {
    const { estado } = req.body || {};
    const resultado = await pedidoService.actualizarEstado(req.params.id, estado);
    if (!resultado.exito) {
      return res.status(resultado.codigo).json({ error: resultado.errores[0], errores: resultado.errores });
    }
    return res.status(200).json(resultado.datos);
  });

  return router;
}

module.exports = crearRutasPedidos;