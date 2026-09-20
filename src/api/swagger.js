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
    { url: 'http://localhost:3000', description: 'Servidor local (Docker / Node) ' },
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
      Cliente: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ObjectId de MongoDB' },
          nombre: { type: 'string', example: 'María García' },
          email: { type: 'string', example: 'maria.garcia@greencart.com' },
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