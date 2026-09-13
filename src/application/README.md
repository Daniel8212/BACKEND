# Capa de Aplicación (Servicios / Casos de uso)

- `services/` → orquestan los casos de uso: crear pedido, actualizar estado, filtrar
  catálogo, administrar clientes y stock.
- Invocan las reglas de negocio del dominio y usan los contratos (interfaces) de
  repositorio, nunca las implementaciones concretas de MongoDB.