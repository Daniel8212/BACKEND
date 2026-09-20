'use strict';

class IRepositorioProducto {
  async listar() {
    throw new Error('IRepositorioProducto.listar() no implementado');
  }

  async buscarPorId(id) {
    throw new Error('IRepositorioProducto.buscarPorId() no implementado');
  }

  async guardar(producto) {
    throw new Error('IRepositorioProducto.guardar() no implementado');
  }

  async actualizarPrecio(id, precio) {
    throw new Error('IRepositorioProducto.actualizarPrecio() no implementado');
  }

  async marcarAgotado(id) {
    throw new Error('IRepositorioProducto.marcarAgotado() no implementado');
  }

  async eliminar(id) {
    throw new Error('IRepositorioProducto.eliminar() no implementado');
  }
}

module.exports = IRepositorioProducto;