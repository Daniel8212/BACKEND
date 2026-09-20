'use strict';

const ModeloProducto = require('../models/Producto');
const mongoose = require('mongoose');
const Producto = require('../../domain/entities/Producto');
const IRepositorioProducto = require('../../domain/interfaces/IRepositorioProducto');

function aEntidad(doc) {
  return new Producto({
    id: doc._id.toString(),
    nombre: doc.nombre,
    descripcion: doc.descripcion,
    precio: doc.precio,
    linea: doc.linea,
    stock: doc.stock,
  });
}

class ProductoRepository extends IRepositorioProducto {
  async listar() {
    const documentos = await ModeloProducto.find().lean();
    return documentos.map(aEntidad);
  }

  async buscarPorId(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await ModeloProducto.findById(id).lean();
    return doc ? aEntidad(doc) : null;
  }

  async guardar(producto) {
    const datos = {
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: producto.precio,
      linea: producto.linea,
      stock: producto.stock,
    };

    const doc = producto.id
      ? await ModeloProducto.findByIdAndUpdate(producto.id, datos, { new: true, runValidators: true }).lean()
      : (await ModeloProducto.create(datos)).toObject();

    return aEntidad(doc);
  }

  async actualizarPrecio(id, precio) {
    const doc = await ModeloProducto.findByIdAndUpdate(id, { precio }, { new: true, runValidators: true }).lean();
    return doc ? aEntidad(doc) : null;
  }

  async marcarAgotado(id) {
    const doc = await ModeloProducto.findByIdAndUpdate(id, { stock: 'agotado' }, { new: true }).lean();
    return doc ? aEntidad(doc) : null;
  }

  async eliminar(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await ModeloProducto.findByIdAndDelete(id).lean();
    return doc ? aEntidad(doc) : null;
  }
}

module.exports = ProductoRepository;