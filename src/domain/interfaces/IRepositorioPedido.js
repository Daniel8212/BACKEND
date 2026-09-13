'use strict';

class IRepositorioPedido {
  async crear(pedido) {
    throw new Error('IRepositorioPedido.crear() no implementado');
  }

  async listarPorCliente(clienteId) {
    throw new Error('IRepositorioPedido.listarPorCliente() no implementado');
  }

  async buscarPorId(id) {
    throw new Error('IRepositorioPedido.buscarPorId() no implementado');
  }

  async buscarPendienteReciente(clienteId, ventanaMinutos) {
    throw new Error('IRepositorioPedido.buscarPendienteReciente() no implementado');
  }

  async actualizarEstado(id, estado) {
    throw new Error('IRepositorioPedido.actualizarEstado() no implementado');
  }

  async contarPorCliente(clienteId) {
    throw new Error('IRepositorioPedido.contarPorCliente() no implementado');
  }
}

module.exports = IRepositorioPedido;