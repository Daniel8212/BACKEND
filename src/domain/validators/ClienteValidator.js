'use strict';

const EstadoResultado = require('./EstadoResultado');

/** Regla de negocio 4 (no eliminar clientes con historial). */
class ClienteValidator {
  static validarBorrado(cliente, tienePedidos) {
    if (tienePedidos) {
      return EstadoResultado.fallido(
        `Regla 4: no se puede eliminar el cliente "${cliente.id}" porque tiene pedidos registrados (se conserva el historial).`
      );
    }
    return EstadoResultado.exitoso();
  }
}

module.exports = ClienteValidator;