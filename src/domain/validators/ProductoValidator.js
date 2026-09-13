'use strict';

const EstadoResultado = require('./EstadoResultado');

/** Reglas de negocio 1 (línea) y 5 (precio). */
class ProductoValidator {
  static validar(producto) {
    const resultado = new EstadoResultado();

    if (!producto.linea || typeof producto.linea !== 'string' || producto.linea.trim() === '') {
      resultado.agregarError(
        'Regla 1: cada producto debe pertenecer a una línea/categoría válida (no puede quedar sin clasificar).'
      );
    }

    if (typeof producto.precio !== 'number' || !Number.isFinite(producto.precio) || producto.precio <= 0) {
      resultado.agregarError('Regla 5: el precio de un producto debe ser un número mayor que cero.');
    }

    return resultado;
  }

  static validarCambioPrecio(nuevoPrecio) {
    if (typeof nuevoPrecio !== 'number' || !Number.isFinite(nuevoPrecio) || nuevoPrecio <= 0) {
      return EstadoResultado.fallido(
        'Regla 5: el precio de un producto no puede modificarse a un valor negativo o igual a cero.'
      );
    }
    return EstadoResultado.exitoso();
  }
}

module.exports = ProductoValidator;