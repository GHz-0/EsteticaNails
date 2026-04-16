# Base de datos propuesta para Estetica

Este directorio contiene una base de datos completa en PostgreSQL para cubrir el proyecto actual:

- Autenticacion y roles (usuario, empleado, admin)
- Citas (agenda cliente/empleado)
- CRM (perfiles de cliente, interacciones, puntos)
- SCM (inventario y movimientos)
- Servicios, promociones y configuracion
- Pagos, auditoria y reportes operativos

## Estructura

- database/postgres/01_schema.sql: tablas, tipos, constraints, indices y triggers.
- database/postgres/02_seed.sql: datos demo iniciales para pruebas.

## Como ejecutarlo

1. Crear base de datos vacia:

```sql
CREATE DATABASE estetica_db;
```

2. Ejecutar scripts en orden:

```bash
psql -U postgres -d estetica_db -f database/postgres/01_schema.sql
psql -U postgres -d estetica_db -f database/postgres/02_seed.sql
```

## Credenciales demo sembradas

- usuario@demo.com / 123456
- empleado@demo.com / 123456
- admin@demo.com / 123456

Nota: en BD se guarda hash con `crypt` (extension `pgcrypto`), no texto plano.

## Mapeo rapido con el frontend

- Auth store y roles: tabla `usuarios`.
- Registro/CRM basico: `usuarios`, `perfiles_cliente`, `interacciones_cliente`, `puntos_cliente`.
- Vistas de citas y paneles: `citas`, `historial_estado_cita`, `servicios`, `pagos`.
- Inventario SCM: `inventario_insumos`, `movimientos_inventario`, `proveedores`.
- Admin configuracion/reportes: `configuracion_sistema`, `actividad_auditoria`.

## Siguiente paso recomendado

Implementar un backend (Node/Nest/Laravel) para reemplazar el `MOCK_USERS` y los modulos en memoria con API real conectada a estas tablas.
