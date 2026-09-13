# Capa de Presentación (API)

- `routes/` → definición de rutas Express (catálogo, pedidos, clientes).
- `controllers/` → reciben el HTTP request, llaman a los servicios de la capa de
  aplicación y responden JSON con los códigos de estado correctos (200/201/400/404/409).
- No contiene reglas de negocio. Solo traduce HTTP ↔ aplicación.