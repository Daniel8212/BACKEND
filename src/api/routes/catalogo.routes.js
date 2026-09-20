'use strict';

const { Router } = require('express');

function crearRutasCatalogo({ catalogoService }) {
  const router = Router();

  router.get('/', async (req, res) => {
    const { linea } = req.query;
    const resultado = await catalogoService.listar({ linea: linea || undefined });
    return res.status(200).json(resultado.datos);
  });

  return router;
}

module.exports = crearRutasCatalogo;