'use strict';

const { Router } = require('express');

function crearRutasClientes({ clienteService }) {
  const router = Router();

  router.get('/', async (req, res) => {
    const resultado = await clienteService.listar();
    return res.status(200).json(resultado.datos);
  });

  router.post('/', async (req, res) => {
    const { nombre, email } = req.body || {};
    const resultado = await clienteService.crear({ nombre, email });
    if (!resultado.exito) {
      return res.status(resultado.codigo).json({ error: resultado.errores[0], errores: resultado.errores });
    }
    return res.status(201).json(resultado.datos);
  });

  router.get('/:id', async (req, res) => {
    const cliente = await clienteService.buscarPorId(req.params.id);
    if (!cliente) {
      return res.status(404).json({ error: `El cliente "${req.params.id}" no existe.` });
    }
    return res.status(200).json(cliente);
  });

  router.put('/:id', async (req, res) => {
    const resultado = await clienteService.actualizar(req.params.id, req.body || {});
    if (!resultado.exito) {
      return res.status(resultado.codigo).json({ error: resultado.errores[0], errores: resultado.errores });
    }
    return res.status(200).json(resultado.datos);
  });

  router.delete('/:id', async (req, res) => {
    const resultado = await clienteService.eliminar(req.params.id);
    if (!resultado.exito) {
      return res.status(resultado.codigo).json({ error: resultado.errores[0], errores: resultado.errores });
    }
    return res.status(200).json({ mensaje: 'Cliente eliminado correctamente.', ...resultado.datos });
  });

  return router;
}

module.exports = crearRutasClientes;