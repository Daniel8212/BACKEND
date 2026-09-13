'use strict';

const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema(
  {
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Cliente', required: true },
    items: [
      {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
        cantidad: { type: Number, required: true, min: 1 },
      },
    ],
    estado: {
      type: String,
      enum: ['Pendiente', 'Preparando', 'Enviado', 'Entregado'],
      default: 'Pendiente',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pedido', pedidoSchema);