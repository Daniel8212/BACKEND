'use strict';

class IRepositorioCliente {
  async listar() {
    throw new Error('IRepositorioCliente.listar() no implementado');
  }

  async buscarPorId(id) {
    throw new Error('IRepositorioCliente.buscarPorId() no implementado');
  }

  async guardar(cliente) {
    throw new Error('IRepositorioCliente.guardar() no implementado');
  }

  async eliminar(id) {
    throw new Error('IRepositorioCliente.eliminar() no implementado');
  }
}

module.exports = IRepositorioCliente;