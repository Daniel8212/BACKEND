'use strict';

const Pedido = require('../../domain/entities/Pedido');
const PedidoValidator = require('../../domain/validators/PedidoValidator');

class PedidoService {
  constructor(repositorioPedidos, repositorioProductos, repositorioClientes) {
    this.repositorioPedidos = repositorioPedidos;
    this.repositorioProductos = repositorioProductos;
    this.repositorioClientes = repositorioClientes;
  }

  async crear({ clienteId, items }) {
    if (!clienteId || !Array.isArray(items) || items.length === 0) {
      return {
        exito: false,
        codigo: 400,
        errores: ['El pedido debe incluir clienteId y al menos un ítem (productoId, cantidad).'],
      };
    }

    const cliente = await this.repositorioClientes.buscarPorId(clienteId);
    if (!cliente) {
      return { exito: false, codigo: 404, errores: [`El cliente "${clienteId}" no existe.`] };
    }

    const pedido = new Pedido({
      clienteId,
      items: items.map((i) => ({ productoId: String(i.productoId), cantidad: i.cantidad })),
    });

    const productos = [];
    for (const item of pedido.items) {
      const producto = await this.repositorioProductos.buscarPorId(item.productoId);
      if (producto) productos.push(producto);
    }

    const validacionStock = PedidoValidator.validarProductos(pedido, productos);
    if (!validacionStock.esExitoso) {
      return { exito: false, codigo: 409, errores: validacionStock.obtenerErrores() };
    }

    const pendienteReciente = await this.repositorioPedidos.buscarPendienteReciente(
      clienteId,
      PedidoValidator.VENTANA_DOBLE_PEDIDO_MINUTOS
    );
    const validacionDoble = PedidoValidator.validarDoblePedido(pedido, pendienteReciente);
    if (!validacionDoble.esExitoso) {
      return { exito: false, codigo: 409, errores: validacionDoble.obtenerErrores() };
    }

    const creado = await this.repositorioPedidos.crear(pedido);
    return { exito: true, datos: creado };
  }

  async listarPorCliente(clienteId) {
    if (!clienteId) {
      return { exito: false, codigo: 400, errores: ['Debe indicar el clienteId.'] };
    }

    const cliente = await this.repositorioClientes.buscarPorId(clienteId);
    if (!cliente) {
      return { exito: false, codigo: 404, errores: [`El cliente "${clienteId}" no existe.`] };
    }

    const pedidos = await this.repositorioPedidos.listarPorCliente(clienteId);
    return { exito: true, datos: pedidos };
  }
}

module.exports = PedidoService;