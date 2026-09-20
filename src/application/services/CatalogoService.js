'use strict';

const Producto = require('../../domain/entities/Producto');
const ProductoValidator = require('../../domain/validators/ProductoValidator');

class CatalogoService {
  constructor(repositorioProductos) {
    this.repositorioProductos = repositorioProductos;
  }

  async listar({ linea } = {}) {
    const productos = await this.repositorioProductos.listar();

    if (!linea) {
      return { exito: true, datos: productos };
    }

    const filtrados = productos.filter(
      (p) => String(p.linea).toLowerCase() === String(linea).toLowerCase()
    );

    return { exito: true, datos: filtrados };
  }

  async buscarPorId(id) {
    return this.repositorioProductos.buscarPorId(id);
  }

  async crear({ nombre, descripcion, precio, linea, stock }) {
    const producto = new Producto({ nombre, descripcion, precio, linea, stock });
    const validacion = ProductoValidator.validar(producto);
    if (!validacion.esExitoso) {
      return { exito: false, codigo: 400, errores: validacion.obtenerErrores() };
    }

    const guardado = await this.repositorioProductos.guardar(producto);
    return { exito: true, datos: guardado };
  }

  async actualizar(id, cambios) {
    const existente = await this.repositorioProductos.buscarPorId(id);
    if (!existente) {
      return { exito: false, codigo: 404, errores: [`El producto "${id}" no existe.`] };
    }

    const producto = new Producto({
      id: existente.id,
      nombre: cambios.nombre !== undefined ? cambios.nombre : existente.nombre,
      descripcion: cambios.descripcion !== undefined ? cambios.descripcion : existente.descripcion,
      precio: cambios.precio !== undefined ? cambios.precio : existente.precio,
      linea: cambios.linea !== undefined ? cambios.linea : existente.linea,
      stock: cambios.stock !== undefined ? cambios.stock : existente.stock,
    });

    const validacion = ProductoValidator.validar(producto);
    if (!validacion.esExitoso) {
      return { exito: false, codigo: 400, errores: validacion.obtenerErrores() };
    }

    const guardado = await this.repositorioProductos.guardar(producto);
    return { exito: true, datos: guardado };
  }

  async eliminar(id) {
    const eliminado = await this.repositorioProductos.eliminar(id);
    if (!eliminado) {
      return { exito: false, codigo: 404, errores: [`El producto "${id}" no existe.`] };
    }
    return { exito: true, datos: eliminado };
  }
}

module.exports = CatalogoService;