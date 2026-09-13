# GreenCart — API

API REST para el catálogo, pedidos y clientes de **GreenCart** (startup de productos
ecológicos, Caso 6).

**Stack:** Node.js + Express + MongoDB · Docker · Arquitectura N-Capas.

## Arquitectura N-Capas

| Capa | Carpeta | Responsabilidad |
|---|---|---|
| Presentación | `src/api` | Rutas y controladores Express (traducen HTTP ↔ aplicación) |
| Aplicación | `src/application` | Servicios / casos de uso (orquestan reglas de negocio) |
| Dominio | `src/domain` | Entidades, validadores (Reglas 1–6) y contratos de repositorio |
| Infraestructura | `src/infrastructure` | Modelos Mongoose, repositorios concretos y configuración |

## Estado de avance (informe + sprints)

- **Sprint 1 — Completado:** investigación y decisión del stack (Node.js, Express, MongoDB, Docker).
- **Sprint 2 — Completado:** decisión de arquitectura (Monolito con N-Capas) y diseño de la API.
- **Sprint 3 — Completado:** capa de **dominio** (entidades `Producto`, `Cliente`, `Pedido`;
  contratos `IRepositorio*`; validadores de las 6 reglas de negocio con el patrón
  `EstadoResultado`) y capa de **infraestructura** (modelos Mongoose, configuración de
  entorno, repositorios concretos y seed del catálogo).
- **Sprint 4 — Pendiente:** capa de aplicación (servicios) y API funcional (E1–E3).
- **Sprint 5 — Pendiente:** administración (E4–E6) y contenerización Docker.
- **Sprint 6 — Pendiente:** despliegue en PaaS, colección Postman y cierre.

## Reglas de negocio implementadas (Sprint 3)

| Regla | Descripción | Validador |
|---|---|---|
| R1 | Cada producto debe pertenecer a una línea/categoría no vacía | `ProductoValidator` |
| R2 | Un pedido no puede incluir un producto agotado/sin stock | `PedidoValidator` |
| R3 | El estado del pedido solo avanza (Pendiente → Preparando → Enviado → Entregado) | `PedidoValidator` |
| R4 | No se elimina un cliente con pedidos registrados | `ClienteValidator` |
| R5 | El precio no puede modificarse a cero o negativo | `ProductoValidator` |
| R6 | No hay dos pedidos Pendientes idénticos en menos de 5 minutos | `PedidoValidator` |

## Levantar el entorno (Docker)

```bash
docker compose up --build
```

API en `http://localhost:3000`. MongoDB en `localhost:27017` (volumen `mongo_data`).

## Levantar sin Docker

```bash
npm install
copy .env.example .env   # configurar MONGO_URI
npm run seed             # sembrar el catálogo
npm run dev
```