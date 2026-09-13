# Capa de Infraestructura

- `config/` → variables de entorno y conexión a MongoDB.
- `models/` → esquemas Mongoose (Producto, Cliente, Pedido).
- `repositories/` → implementaciones concretas de los contratos del dominio,
  hablando con MongoDB.
- Esto es lo único que conoce detalles de la base de datos.