'use strict';

const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, default: '', trim: true },
    precio: { type: Number, required: true, min: 0.01 },
    linea: { type: String, required: true, trim: true },
    stock: { type: String, enum: ['disponible', 'agotado'], default: 'disponible' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Producto', productoSchema);