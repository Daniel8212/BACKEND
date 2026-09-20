'use strict';

const Cliente = require('../../domain/entities/Cliente');
const ClienteValidator = require('../../domain/validators/ClienteValidator');

class ClienteService {
  constructor(repositorioClientes, repositorioPedidos) {
    this.repositorioClientes = repositorioClientes;
    this.repositorioPedidos = repositorioPedidos;
  }

  async listar() {
    const clientes = await this.repositorioClientes.listar();
    return { exito: true, datos: clientes };
  }

  async buscarPorId(id) {
    return this.repositorioClientes.buscarPorId(id);
  }

  async crear({ nombre, email }) {
    if (!nombre || !email) {
      return { exito: false, codigo: 400, errores: ['El cliente debe incluir nombre y email.'] };
    }

    const cliente = new Cliente({ nombre, email });
    try {
      const guardado = await this.repositorioClientes.guardar(cliente);
      return { exito: true, datos: guardado };
    } catch (err) {
      if (err.code === 11000) {
        return { exito: false, codigo: 409, errores: [`Ya existe un cliente con el email "${email}".`] };
      }
      throw err;
    }
  }

  async actualizar(id, cambios) {
    const existente = await this.repositorioClientes.buscarPorId(id);
    if (!existente) {
      return { exito: false, codigo: 404, errores: [`El cliente "${id}" no existe.`] };
    }

    const cliente = new Cliente({
      id: existente.id,
      nombre: cambios.nombre !== undefined ? cambios.nombre : existente.nombre,
      email: cambios.email !== undefined ? cambios.email : existente.email,
    });
    if (!cliente.nombre || !cliente.email) {
      return { exito: false, codigo: 400, errores: ['El cliente debe incluir nombre y email.'] };
    }

    try {
      const guardado = await this.repositorioClientes.guardar(cliente);
      return { exito: true, datos: guardado };
    } catch (err) {
      if (err.code === 11000) {
        return { exito: false, codigo: 409, errores: [`Ya existe un cliente con el email "${cliente.email}".`] };
      }
      throw err;
    }
  }

  async eliminar(id) {
    const cliente = await this.repositorioClientes.buscarPorId(id);
    if (!cliente) {
      return { exito: false, codigo: 404, errores: [`El cliente "${id}" no existe.`] };
    }

    const tienePedidos = (await this.repositorioPedidos.contarPorCliente(id)) > 0;
    const validacion = ClienteValidator.validarBorrado(cliente, tienePedidos);
    if (!validacion.esExitoso) {
      return { exito: false, codigo: 409, errores: validacion.obtenerErrores() };
    }

    const eliminado = await this.repositorioClientes.eliminar(id);
    return { exito: true, datos: eliminado };
  }
}

module.exports = ClienteService;