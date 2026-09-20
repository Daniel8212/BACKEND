# GreenCart — Contexto del proyecto (AGENTS.md)

Convención: responder en el idioma del usuario.

## Identidad y repo

- Proyecto: API REST **GreenCart** (startup de productos ecológicos, Caso 6, Equipo 6).
- Stack: Node.js + Express + MongoDB · Docker · Arquitectura N-Capas.
- Repo remoto: `https://github.com/Vanguardia-754-8/BACKEND.git` (rama `main`).
- Autor de commits configurado en el repo: `JP-019 <juliocgp30@gmail.com>`.
- `docs/` está en `.gitignore` (informes `.docx` NO se suben al repo).

## Estado de sprints (informe en `docs/Informe_Avance_GreenCart_APA7_Formal.docx`)

| Sprint | Contenido | Estado |
|---|---|---|
| 1 | Investigación del stack | COMPLETADO |
| 2 | Arquitectura N-Capas y diseño API | COMPLETADO |
| 3 | Capa de dominio + infraestructura | COMPLETADO |
| 4 | Capa de aplicación (servicios) y API funcional E1–E3 | COMPLETADO |
| 5 | Administración E4–E6 y Docker | PENDIENTE |
| 6 | Despliegue PaaS, Postman y cierre | PENDIENTE |

El informe docx se actualiza para reflejar el último sprint completado (usa Word COM /
edición de `word/document.xml` del docx; no subir al repo).

## Arquitectura y código

- `src/api` (presentación), `src/application` (servicios), `src/domain`
  (entidades/validadores/interfaces), `src/infrastructure` (Mongoose/config/repos/seed).
- `src/domain/entities/`: `Producto.js`, `Cliente.js`, `Pedido.js` (`ESTADOS = Pendiente, Preparando, Enviado, Entregado`).
- `src/domain/interfaces/`: `IRepositorioProducto.js`, `IRepositorioPedido.js`, `IRepositorioCliente.js`.
- `src/domain/validators/`: `EstadoResultado.js` (patrón resultado), `ProductoValidator.js`,
  `PedidoValidator.js`, `ClienteValidator.js`.
- `src/infrastructure/`: `config/env.js`, `config/db.js`, `models/{Producto,Cliente,Pedido}.js`,
  `repositories/*Repository.js`, `seed/seed.js`.

## Reglas de negocio (validadores reales, no comentarios)

- R1: producto debe tener línea/categoría no vacía → `ProductoValidator.validar`.
- R2: pedido no puede incluir producto agotado/sin stock → `PedidoValidator.validarProductos`.
- R3: estado del pedido solo avanza → `PedidoValidator.validarTransicionEstado`.
- R4: no se elimina cliente con pedidos → `ClienteValidator.validarBorrado`.
- R5: precio no puede ser ≤ 0 → `ProductoValidator.validarCambioPrecio`.
- R6: no dos pedidos Pendientes idénticos en <5 min → `PedidoValidator.validarDoblePedido`.

## Convenciones

- Un commit por sprint completado, mensaje en español con prefijo `Sprint N:`.
- El informe avanza coherente con el código (resumen, tabla, trabajo futuro).
- `npm run seed` siembra el catálogo (config `MONGO_URI`).

## Verificación

- Sintaxis JS: `node --check <archivo>`.
- Informe: abrir en Word (valida el docx).