'use strict';

const ModeloPedido = require('../models/Pedido');
const Pedido = require('../../domain/entities/Pedido');
const IRepositorioPedido = require('../../domain/interfaces/IRepositorioPedido');

function aEntidad(doc) {
  return new Pedido({
    id: doc._id.toString(),
    clienteId: doc.cliente.toString(),
    items: doc.items.map((i) => ({
      productoId: i.producto.toString(),
      cantidad: i.cantidad,
    })),
    estado: doc.estado,
    fechaCreacion: doc.createdAt || doc.fechaCreacion,
  });
}

class PedidoRepository extends IRepositorioPedido {
  async crear(pedido) {
    const doc = await ModeloPedido.create({
      cliente: pedido.clienteId,
      items: pedido.items.map((i) => ({ producto: i.productoId, cantidad: i.cantidad })),
      estado: pedido.estado,
    });
    return aEntidad(doc.toObject());
  }

  async listarPorCliente(clienteId) {
    const documentos = await ModeloPedido.find({ cliente: clienteId }).lean();
    return documentos.map(aEntidad);
  }

  async buscarPorId(id) {
    const doc = await ModeloPedido.findById(id).lean();
    return doc ? aEntidad(doc) : null;
  }

  async buscarPendienteReciente(clienteId, ventanaMinutos) {
    const desde = new Date(Date.now() - ventanaMinutos * 60 * 1000);
    const doc = await ModeloPedido.findOne({
      cliente: clienteId,
      estado: 'Pendiente',
      createdAt: { $gte: desde },
    }).sort({ createdAt: -1 }).lean();
    return doc ? aEntidad(doc) : null;
  }

  async actualizarEstado(id, estado) {
    const doc = await ModeloPedido.findByIdAndUpdate(id, { estado }, { new: true }).lean();
    return doc ? aEntidad(doc) : null;
  }

  async contarPorCliente(clienteId) {
    return ModeloPedido.countDocuments({ cliente: clienteId });
  }
}

module.exports = PedidoRepository;