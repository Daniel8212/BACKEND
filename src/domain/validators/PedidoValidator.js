'use strict';

const EstadoResultado = require('./EstadoResultado');
const Pedido = require('../entities/Pedido');

const VENTANA_DOBLE_PEDIDO_MINUTOS = 5;

/** Reglas de negocio 2 (sin stock), 3 (avance de estado) y 6 (doble pedido). */
class PedidoValidator {
  static validarProductos(pedido, productos) {
    const resultado = new EstadoResultado();
    const porId = new Map(productos.map((p) => [String(p.id), p]));

    for (const item of pedido.items) {
      const producto = porId.get(String(item.productoId));
      if (!producto) {
        resultado.agregarError(
          `Regla 2: el producto "${item.productoId}" no existe y no puede incluirse en el pedido.`
        );
      } else if (producto.estaAgotado()) {
        resultado.agregarError(
          `Regla 2: el producto "${producto.nombre}" está agotado/sin stock y no puede incluirse en el pedido.`
        );
      }
    }

    return resultado;
  }

  static validarTransicionEstado(estadoActual, estadoNuevo) {
    const indiceActual = Pedido.ESTADOS.indexOf(estadoActual);
    const indiceNuevo = Pedido.ESTADOS.indexOf(estadoNuevo);

    if (indiceActual === -1 || indiceNuevo === -1) {
      return EstadoResultado.fallido(
        `Regla 3: estado de pedido inválido. Válidos: ${Pedido.ESTADOS.join(', ')}.`
      );
    }

    if (indiceNuevo <= indiceActual) {
      return EstadoResultado.fallido(
        `Regla 3: el estado de un pedido solo puede avanzar hacia adelante (${estadoActual} -> ${estadoNuevo}), nunca retroceder.`
      );
    }

    return EstadoResultado.exitoso();
  }

  static validarDoblePedido(pedidoNuevo, pedidoPendienteReciente, ventanaMinutos = VENTANA_DOBLE_PEDIDO_MINUTOS) {
    if (!pedidoPendienteReciente) return EstadoResultado.exitoso();

    const mismoCatalogo = pedidoNuevo.mismoCatalogoQue(pedidoPendienteReciente);
    const minutosDesdeCreacion =
      (Date.now() - new Date(pedidoPendienteReciente.fechaCreacion).getTime()) / 60000;

    if (pedidoNuevo.esPendiente() && mismoCatalogo && minutosDesdeCreacion < ventanaMinutos) {
      return EstadoResultado.fallido(
        `Regla 6: el cliente no puede crear dos pedidos Pendientes con los mismos productos y cantidades en menos de ${ventanaMinutos} minutos.`
      );
    }

    return EstadoResultado.exitoso();
  }
}

PedidoValidator.VENTANA_DOBLE_PEDIDO_MINUTOS = VENTANA_DOBLE_PEDIDO_MINUTOS;

module.exports = PedidoValidator;