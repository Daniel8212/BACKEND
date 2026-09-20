'use strict';

class ClienteService {
  constructor(repositorioClientes) {
    this.repositorioClientes = repositorioClientes;
  }

  async buscarPorId(id) {
    return this.repositorioClientes.buscarPorId(id);
  }
}

module.exports = ClienteService;