'use strict';

const swaggerDocument = {
  openapi: '3.0.3',
  info: {
    title: 'GreenCart API',
    version: '1.0.0',
    description:
      'API REST de GreenCart (productos ecológicos). Arquitectura N-Capas: presentación, aplicación, dominio e infraestructura. Incluye las historias E1, E2 y E3 con las reglas de negocio R1–R6.',
  },
  servers: [
    { url: '/', description: 'Servidor actual (local o Render)' },
  ],
  tags: [
    { name: 'Sistema', description: 'Salud del servicio' },
    { name: 'Catálogo', description: 'Consulta de productos ecológicos (E1)' },
    { name: 'Pedidos', description: 'Gestión de pedidos (E2 y E3)' },
    { name: 'Clientes', description: 'Consulta de clientes' },
  ],
  paths: {
    '/health': {
      get: {
        tags: ['Sistema'],
        summary: 'Estado del servicio',
        description: 'Devuelve el estado operativo de la API.',
        responses: {
          200: {
            description: 'Servicio operativo',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Salud' },
              },
            },
          },
        },
      },
    },
    '/api/catalogo': {
      get: {
        tags: ['Catálogo'],
        summary: 'Listar catálogo de productos (E1)',
        description:
          'Devuelve los productos ecológicos disponibles. Si se envía el parámetro opcional "linea", filtra por línea/categoría sin distinguir mayúsculas.',
        parameters: [
          {
            name: 'linea',
            in: 'query',
            required: false,
            description: 'Filtro por línea/categoría (p. ej. Frutas, Verduras, Cesta)',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Listado de productos',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Producto' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Catálogo'],
        summary: 'Crear producto (E4)',
        description:
          'Crea un nuevo producto ecológico. Valida la línea/categoría (R1) y que el precio sea mayor que cero (R5).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductoRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Producto creado correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Producto' },
              },
            },
          },
          400: {
            description: 'Faltan datos o viola las reglas R1/R5',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
    },
    '/api/catalogo/{id}': {
      get: {
        tags: ['Catálogo'],
        summary: 'Consultar producto por id',
        description: 'Devuelve el producto indicado o 404 si no existe o el id no es un ObjectId válido.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador (ObjectId) del producto',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Producto encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Producto' },
              },
            },
          },
          404: {
            description: 'El producto no existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
      put: {
        tags: ['Catálogo'],
        summary: 'Actualizar producto',
        description:
          'Actualiza los datos de un producto (nombre, descripción, precio, línea, stock). Valida R1 y R5.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador (ObjectId) del producto',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProductoRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Producto actualizado correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Producto' },
              },
            },
          },
          400: {
            description: 'Datos inválidos (R1/R5)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
          404: {
            description: 'El producto no existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
      delete: {
        tags: ['Catálogo'],
        summary: 'Eliminar producto',
        description: 'Elimina el producto indicado del catálogo.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador (ObjectId) del producto',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Producto eliminado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EliminadoRespuesta' },
              },
            },
          },
          404: {
            description: 'El producto no existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
    },
    '/api/pedidos': {
      get: {
        tags: ['Pedidos'],
        summary: 'Consultar pedidos por cliente (E3)',
        description: 'Devuelve todos los pedidos del cliente indicado.',
        parameters: [
          {
            name: 'clienteId',
            in: 'query',
            required: true,
            description: 'Identificador (ObjectId) del cliente',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Pedidos del cliente',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Pedido' },
                },
              },
            },
          },
          400: {
            description: 'No se indicó el clienteId',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
          404: {
            description: 'El cliente no existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
      post: {
        tags: ['Pedidos'],
        summary: 'Crear pedido (E2)',
        description:
          'Crea un pedido en estado Pendiente. Valida la existencia del cliente (R4), el stock de los productos (R2) y la regla de doble pedido (R6).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/PedidoRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Pedido creado correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pedido' },
              },
            },
          },
          400: {
            description: 'Faltan datos (clienteId o items) o el cuerpo JSON es inválido',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
          404: {
            description: 'El cliente indicado no existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
          409: {
            description: 'Regla 2: producto agotado/sin stock, o Regla 6: doble pedido Pendiente en menos de 5 minutos',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
    },
    '/api/pedidos/{id}': {
      get: {
        tags: ['Pedidos'],
        summary: 'Consultar pedido por id',
        description: 'Devuelve el pedido indicado o 404 si no existe o el id no es un ObjectId válido.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador (ObjectId) del pedido',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Pedido encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pedido' },
              },
            },
          },
          404: {
            description: 'El pedido no existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
    },
    '/api/pedidos/{id}/estado': {
      patch: {
        tags: ['Pedidos'],
        summary: 'Avanzar estado de un pedido',
        description:
          'Cambia el estado de un pedido. Solo permite avanzar hacia adelante en el flujo Pendiente -> Preparando -> Enviado -> Entregado (R3).',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador (ObjectId) del pedido',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/EstadoRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Estado actualizado correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Pedido' },
              },
            },
          },
          404: {
            description: 'El pedido no existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
          409: {
            description: 'Regla 3: el estado no puede retroceder o es inválido',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
    },
    '/api/clientes': {
      get: {
        tags: ['Clientes'],
        summary: 'Listar clientes',
        description: 'Devuelve todos los clientes registrados.',
        responses: {
          200: {
            description: 'Listado de clientes',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Cliente' },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Clientes'],
        summary: 'Crear cliente',
        description:
          'Registra un nuevo cliente. El email es único; si ya existe devuelve 409.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ClienteRequest' },
            },
          },
        },
        responses: {
          201: {
            description: 'Cliente creado correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cliente' },
              },
            },
          },
          400: {
            description: 'Faltan datos (nombre o email)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
          409: {
            description: 'El email ya está registrado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
    },
    '/api/clientes/{id}': {
      get: {
        tags: ['Clientes'],
        summary: 'Consultar cliente por id',
        description: 'Devuelve el cliente indicado o 404 si no existe o el id no es un ObjectId válido.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador (ObjectId) del cliente',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Cliente encontrado',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cliente' },
              },
            },
          },
          404: {
            description: 'El cliente no existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
      put: {
        tags: ['Clientes'],
        summary: 'Actualizar cliente',
        description: 'Actualiza el nombre y/o email de un cliente. Si el email ya pertenece a otro cliente devuelve 409.',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador (ObjectId) del cliente',
            schema: { type: 'string' },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ClienteRequest' },
            },
          },
        },
        responses: {
          200: {
            description: 'Cliente actualizado correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Cliente' },
              },
            },
          },
          400: {
            description: 'Faltan datos (nombre o email)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
          404: {
            description: 'El cliente no existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
          409: {
            description: 'El email ya está registrado o el cliente tiene pedidos (R4)',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
      delete: {
        tags: ['Clientes'],
        summary: 'Eliminar cliente',
        description:
          'Elimina el cliente indicado. No se puede eliminar si tiene pedidos registrados (R4: se conserva el historial).',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Identificador (ObjectId) del cliente',
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: 'Cliente eliminado correctamente',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/EliminadoRespuesta' },
              },
            },
          },
          404: {
            description: 'El cliente no existe',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
          409: {
            description: 'Regla 4: no se puede eliminar un cliente con pedidos',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorRespuesta' } } },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      Salud: {
        type: 'object',
        properties: {
          estado: { type: 'string', example: 'ok' },
        },
      },
      Producto: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ObjectId de MongoDB' },
          nombre: { type: 'string', example: 'Manzana ecológica' },
          descripcion: { type: 'string' },
          precio: { type: 'number', example: 2.5, description: 'Mayor a 0 (R5)' },
          linea: { type: 'string', example: 'Frutas', description: 'Obligatoria (R1)' },
          stock: { type: 'string', enum: ['disponible', 'agotado'], example: 'disponible' },
        },
      },
      ProductoRequest: {
        type: 'object',
        required: ['nombre', 'precio', 'linea'],
        properties: {
          nombre: { type: 'string', example: 'Pera ecológica' },
          descripcion: { type: 'string', example: 'Fruta de temporada certificada orgánica' },
          precio: { type: 'number', example: 1.9, description: 'Mayor a 0 (R5)' },
          linea: { type: 'string', example: 'Frutas', description: 'Obligatoria (R1)' },
          stock: { type: 'string', enum: ['disponible', 'agotado'], example: 'disponible' },
        },
      },
      Cliente: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ObjectId de MongoDB' },
          nombre: { type: 'string', example: 'María García' },
          email: { type: 'string', example: 'maria.garcia@greencart.com' },
        },
      },
      ClienteRequest: {
        type: 'object',
        required: ['nombre', 'email'],
        properties: {
          nombre: { type: 'string', example: 'Laura Fernández' },
          email: { type: 'string', example: 'laura.fernandez@greencart.com' },
        },
      },
      EstadoRequest: {
        type: 'object',
        required: ['estado'],
        properties: {
          estado: {
            type: 'string',
            enum: ['Preparando', 'Enviado', 'Entregado'],
            example: 'Preparando',
            description: 'Estado siguiente en el flujo (R3)',
          },
        },
      },
      EliminadoRespuesta: {
        type: 'object',
        properties: {
          mensaje: { type: 'string', example: 'Producto eliminado correctamente.' },
          id: { type: 'string', description: 'ObjectId del recurso eliminado' },
        },
      },
      PedidoItem: {
        type: 'object',
        required: ['productoId', 'cantidad'],
        properties: {
          productoId: { type: 'string', description: 'ObjectId del producto' },
          cantidad: { type: 'integer', example: 2, minimum: 1 },
        },
      },
      PedidoRequest: {
        type: 'object',
        required: ['clienteId', 'items'],
        properties: {
          clienteId: { type: 'string', description: 'ObjectId del cliente' },
          items: { type: 'array', minItems: 1, items: { $ref: '#/components/schemas/PedidoItem' } },
        },
      },
      Pedido: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ObjectId de MongoDB' },
          clienteId: { type: 'string' },
          items: { type: 'array', items: { $ref: '#/components/schemas/PedidoItem' } },
          estado: {
            type: 'string',
            enum: ['Pendiente', 'Preparando', 'Enviado', 'Entregado'],
            example: 'Pendiente',
          },
          fechaCreacion: { type: 'string', format: 'date-time' },
        },
      },
      ErrorRespuesta: {
        type: 'object',
        properties: {
          error: { type: 'string', description: 'Primer error encontrado' },
          errores: { type: 'array', items: { type: 'string' }, description: 'Todos los errores de validación' },
        },
      },
    },
  },
};

module.exports = swaggerDocument;