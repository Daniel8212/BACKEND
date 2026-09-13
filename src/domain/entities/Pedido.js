'use strict';

const ESTADOS = ['Pendiente', 'Preparando', 'Enviado', 'Entregado'];

class Pedido {
  constructor({ id, clienteId, items, estado, fechaCreacion }) {
    this.id = id;
    this.clienteId = clienteId;
    this.items = items;
    this.estado = estado || ESTADOS[0];
    this.fechaCreacion = fechaCreacion || new Date();
  }

  esPendiente() {
    return this.estado === 'Pendiente';
  }

  mismoCatalogoQue(otroPedido) {
    if (!otroPedido) return false;
    if (this.items.length !== otroPedido.items.length) return false;

    const normalizar = (items) =>
      items
        .slice()
        .sort((a, b) => String(a.productoId).localeCompare(String(b.productoId)));

    const itemsA = normalizar(this.items);
    const itemsB = normalizar(otroPedido.items);

    return itemsA.every(
      (item, i) =>
        String(item.productoId) === String(itemsB[i].productoId) &&
        item.cantidad === itemsB[i].cantidad
    );
  }
}

Pedido.ESTADOS = ESTADOS;

module.exports = Pedido;