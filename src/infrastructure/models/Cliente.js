'use strict';

const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Cliente', clienteSchema);