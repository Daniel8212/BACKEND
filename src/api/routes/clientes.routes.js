'use strict';

const { Router } = require('express');

function crearRutasClientes({ clienteService }) {
  const router = Router();

  router.get('/:id', async (req, res) => {
    const cliente = await clienteService.buscarPorId(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: `El cliente "${req.params.id}" no existe.` });
    }
    return res.status(200).json(cliente);
  });

  return router;
}

module.exports = crearRutasClientes;