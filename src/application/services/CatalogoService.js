'use strict';

class CatalogoService {
  constructor(repositorioProductos) {
    this.repositorioProductos = repositorioProductos;
  }

  async listar({ linea } = {}) {
    const productos = await this.repositorioProductos.listar();

    if (!linea) {
      return { exito: true, datos: productos };
    }

    const filtrados = productos.filter(
      (p) => String(p.linea).toLowerCase() === String(linea).toLowerCase()
    );

    return { exito: true, datos: filtrados };
  }
}

module.exports = CatalogoService;