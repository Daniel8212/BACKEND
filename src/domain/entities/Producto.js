'use strict';

class Producto {
  constructor({ id, nombre, descripcion, precio, linea, stock }) {
    this.id = id;
    this.nombre = nombre;
    this.descripcion = descripcion;
    this.precio = precio;
    this.linea = linea;
    this.stock = stock || 'disponible';
  }

  estaAgotado() {
    return this.stock === 'agotado';
  }
}

module.exports = Producto;