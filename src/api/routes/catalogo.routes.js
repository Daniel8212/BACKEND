'use strict';

const { Router } = require('express');

function crearRutasCatalogo({ catalogoService }) {
  const router = Router();

  router.get('/', async (req, res) => {
    const { linea } = req.query;
    const resultado = await catalogoService.listar({ linea: linea || undefined });
    return res.status(200).json(resultado.datos);
  });

  router.post('/', async (req, res) => {
    const resultado = await catalogoService.crear(req.body || {});
    if (!resultado.exito) {
      return res.status(resultado.codigo).json({ error: resultado.errores[0], errores: resultado.errores });
    }
    return res.status(201).json(resultado.datos);
  });

  router.get('/:id', async (req, res) => {
    const producto = await catalogoService.buscarPorId(req.params.id);
    if (!producto) {
      return res.status(404).json({ error: `El producto "${req.params.id}" no existe.` });
    }
    return res.status(200).json(producto);
  });

  router.put('/:id', async (req, res) => {
    const resultado = await catalogoService.actualizar(req.params.id, req.body || {});
    if (!resultado.exito) {
      return res.status(resultado.codigo).json({ error: resultado.errores[0], errores: resultado.errores });
    }
    return res.status(200).json(resultado.datos);
  });

  router.delete('/:id', async (req, res) => {
    const resultado = await catalogoService.eliminar(req.params.id);
    if (!resultado.exito) {
      return res.status(resultado.codigo).json({ error: resultado.errores[0], errores: resultado.errores });
    }
    return res.status(200).json({ mensaje: 'Producto eliminado correctamente.', ...resultado.datos });
  });

  return router;
}

module.exports = crearRutasCatalogo;