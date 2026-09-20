'use strict';

const ModeloCliente = require('../models/Cliente');
const mongoose = require('mongoose');
const Cliente = require('../../domain/entities/Cliente');
const IRepositorioCliente = require('../../domain/interfaces/IRepositorioCliente');

function aEntidad(doc) {
  return new Cliente({
    id: doc._id.toString(),
    nombre: doc.nombre,
    email: doc.email,
  });
}

class ClienteRepository extends IRepositorioCliente {
  async listar() {
    const documentos = await ModeloCliente.find().lean();
    return documentos.map(aEntidad);
  }

  async buscarPorId(id) {
    if (!mongoose.isValidObjectId(id)) return null;
    const doc = await ModeloCliente.findById(id).lean();
    return doc ? aEntidad(doc) : null;
  }

  async guardar(cliente) {
    const datos = { nombre: cliente.nombre, email: cliente.email };
    const doc = cliente.id
      ? await ModeloCliente.findByIdAndUpdate(cliente.id, datos, { new: true, runValidators: true }).lean()
      : (await ModeloCliente.create(datos)).toObject();
    return aEntidad(doc);
  }

  async eliminar(id) {
    const doc = await ModeloCliente.findByIdAndDelete(id).lean();
    return doc ? aEntidad(doc) : null;
  }
}

module.exports = ClienteRepository;