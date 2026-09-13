'use strict';

class Cliente {
  constructor({ id, nombre, email }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
  }
}

module.exports = Cliente;