'use strict';

class EstadoResultado {
  constructor() {
    this.esExitoso = true;
    this.errores = [];
  }

  agregarError(mensaje) {
    this.esExitoso = false;
    this.errores.push(mensaje);
  }

  obtenerErrores() {
    return [...this.errores];
  }

  static exitoso() {
    return new EstadoResultado();
  }

  static fallido(errores) {
    const resultado = new EstadoResultado();
    resultado.esExitoso = false;
    resultado.errores = Array.isArray(errores) ? [...errores] : [errores];
    return resultado;
  }
}

module.exports = EstadoResultado;