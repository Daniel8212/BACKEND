# Capa de Dominio

- `entities/` → entidades de negocio: Producto, Cliente, Pedido (con estados
  Pendiente → Preparando → Enviado → Entregado).
- `interfaces/` → contratos de repositorio (IRepositorioProducto,
  IRepositorioPedido, IRepositorioCliente) que la infraestructura implementa.
- Aquí viven las 6 reglas de negocio del caso como validadores reales
  (patrón validadores + EstadoResultado). No depende de Express ni de MongoDB.