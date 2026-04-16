-- Estetica DB schema (PostgreSQL)
-- Covers auth, citas, clientes (CRM), inventario (SCM), admin reportes and configuracion

BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('usuario', 'empleado', 'admin');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_status') THEN
    CREATE TYPE record_status AS ENUM ('activo', 'inactivo');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
    CREATE TYPE appointment_status AS ENUM ('pendiente', 'confirmada', 'completada', 'cancelada');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
    CREATE TYPE payment_status AS ENUM ('pendiente', 'completado', 'rechazado', 'reembolsado');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
    CREATE TYPE payment_method AS ENUM ('efectivo', 'tarjeta', 'transferencia', 'paypal');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inventory_movement_type') THEN
    CREATE TYPE inventory_movement_type AS ENUM ('entrada', 'uso', 'ajuste', 'merma');
  END IF;
END $$;

-- Auth + usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  rol user_role NOT NULL,
  avatar VARCHAR(8),
  telefono VARCHAR(30),
  estado record_status NOT NULL DEFAULT 'activo',
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_ultimo_acceso TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS sesiones_usuario (
  id BIGSERIAL PRIMARY KEY,
  usuario_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  ip_origen VARCHAR(64),
  user_agent TEXT,
  expira_en TIMESTAMPTZ NOT NULL,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (token_hash)
);

-- CRM
CREATE TABLE IF NOT EXISTS perfiles_cliente (
  usuario_id BIGINT PRIMARY KEY REFERENCES usuarios(id) ON DELETE CASCADE,
  fecha_nacimiento DATE,
  genero VARCHAR(30),
  alergias TEXT,
  notas_privadas TEXT,
  visitas_totales INT NOT NULL DEFAULT 0,
  ultima_visita TIMESTAMPTZ,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (visitas_totales >= 0)
);

CREATE TABLE IF NOT EXISTS interacciones_cliente (
  id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  empleado_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo VARCHAR(40) NOT NULL,
  detalle TEXT NOT NULL,
  fecha_interaccion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS puntos_cliente (
  id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT NOT NULL UNIQUE REFERENCES usuarios(id) ON DELETE CASCADE,
  saldo_puntos INT NOT NULL DEFAULT 0,
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (saldo_puntos >= 0)
);

CREATE TABLE IF NOT EXISTS movimientos_puntos (
  id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  cita_id BIGINT,
  cambio INT NOT NULL,
  motivo VARCHAR(120) NOT NULL,
  fecha_movimiento TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Servicios
CREATE TABLE IF NOT EXISTS categorias_servicio (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT,
  estado record_status NOT NULL DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS servicios (
  id BIGSERIAL PRIMARY KEY,
  categoria_id BIGINT REFERENCES categorias_servicio(id) ON DELETE SET NULL,
  nombre VARCHAR(140) NOT NULL,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  duracion_minutos INT NOT NULL DEFAULT 60,
  icono VARCHAR(20),
  estado record_status NOT NULL DEFAULT 'activo',
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (precio >= 0),
  CHECK (duracion_minutos > 0)
);

-- Empleados
CREATE TABLE IF NOT EXISTS especialidades (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  descripcion TEXT
);

CREATE TABLE IF NOT EXISTS empleado_especialidad (
  empleado_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  especialidad_id BIGINT NOT NULL REFERENCES especialidades(id) ON DELETE CASCADE,
  fecha_asignacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (empleado_id, especialidad_id)
);

CREATE TABLE IF NOT EXISTS horario_empleado (
  id BIGSERIAL PRIMARY KEY,
  empleado_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  dia_semana SMALLINT NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  estado record_status NOT NULL DEFAULT 'activo',
  CHECK (dia_semana BETWEEN 1 AND 7),
  CHECK (hora_fin > hora_inicio)
);

-- Citas
CREATE TABLE IF NOT EXISTS citas (
  id BIGSERIAL PRIMARY KEY,
  cliente_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  empleado_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
  servicio_id BIGINT NOT NULL REFERENCES servicios(id) ON DELETE RESTRICT,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME,
  estado appointment_status NOT NULL DEFAULT 'pendiente',
  notas_cliente TEXT,
  notas_internas TEXT,
  calificacion SMALLINT,
  comentario_calificacion TEXT,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (calificacion IS NULL OR calificacion BETWEEN 1 AND 5)
);

CREATE TABLE IF NOT EXISTS historial_estado_cita (
  id BIGSERIAL PRIMARY KEY,
  cita_id BIGINT NOT NULL REFERENCES citas(id) ON DELETE CASCADE,
  estado_anterior appointment_status,
  estado_nuevo appointment_status NOT NULL,
  cambiado_por BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
  comentario TEXT,
  fecha_cambio TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pagos
CREATE TABLE IF NOT EXISTS pagos (
  id BIGSERIAL PRIMARY KEY,
  cita_id BIGINT NOT NULL UNIQUE REFERENCES citas(id) ON DELETE CASCADE,
  cliente_id BIGINT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
  monto DECIMAL(10,2) NOT NULL,
  estado payment_status NOT NULL DEFAULT 'pendiente',
  metodo payment_method,
  referencia_externa VARCHAR(200),
  fecha_pago TIMESTAMPTZ,
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (monto >= 0)
);

-- SCM inventario
CREATE TABLE IF NOT EXISTS proveedores (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(140) NOT NULL,
  contacto VARCHAR(120),
  telefono VARCHAR(30),
  email VARCHAR(160),
  estado record_status NOT NULL DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS inventario_insumos (
  id BIGSERIAL PRIMARY KEY,
  nombre VARCHAR(140) NOT NULL,
  cantidad_actual INT NOT NULL DEFAULT 0,
  cantidad_minima_ideal INT NOT NULL DEFAULT 0,
  unidad VARCHAR(30) NOT NULL DEFAULT 'pieza',
  costo_unitario DECIMAL(10,2),
  proveedor_id BIGINT REFERENCES proveedores(id) ON DELETE SET NULL,
  estado record_status NOT NULL DEFAULT 'activo',
  fecha_creacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (cantidad_actual >= 0),
  CHECK (cantidad_minima_ideal >= 0),
  CHECK (costo_unitario IS NULL OR costo_unitario >= 0)
);

CREATE TABLE IF NOT EXISTS movimientos_inventario (
  id BIGSERIAL PRIMARY KEY,
  insumo_id BIGINT NOT NULL REFERENCES inventario_insumos(id) ON DELETE CASCADE,
  cita_id BIGINT REFERENCES citas(id) ON DELETE SET NULL,
  empleado_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
  tipo inventory_movement_type NOT NULL,
  cantidad INT NOT NULL,
  stock_antes INT,
  stock_despues INT,
  observacion TEXT,
  fecha_movimiento TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (cantidad > 0)
);

-- Promociones
CREATE TABLE IF NOT EXISTS promociones (
  id BIGSERIAL PRIMARY KEY,
  titulo VARCHAR(140) NOT NULL,
  descripcion TEXT,
  precio_promocional DECIMAL(10,2),
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado record_status NOT NULL DEFAULT 'activo',
  CHECK (fecha_fin >= fecha_inicio),
  CHECK (precio_promocional IS NULL OR precio_promocional >= 0)
);

CREATE TABLE IF NOT EXISTS promocion_servicio (
  promocion_id BIGINT NOT NULL REFERENCES promociones(id) ON DELETE CASCADE,
  servicio_id BIGINT NOT NULL REFERENCES servicios(id) ON DELETE CASCADE,
  PRIMARY KEY (promocion_id, servicio_id)
);

-- Configuracion
CREATE TABLE IF NOT EXISTS configuracion_sistema (
  clave VARCHAR(100) PRIMARY KEY,
  valor TEXT NOT NULL,
  descripcion TEXT,
  fecha_actualizacion TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auditoria
CREATE TABLE IF NOT EXISTS actividad_auditoria (
  id BIGSERIAL PRIMARY KEY,
  actor_id BIGINT REFERENCES usuarios(id) ON DELETE SET NULL,
  accion VARCHAR(120) NOT NULL,
  entidad VARCHAR(80) NOT NULL,
  entidad_id BIGINT,
  detalle JSONB,
  fecha_evento TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- FK deferred relation for movimientos_puntos -> citas
ALTER TABLE movimientos_puntos
  ADD CONSTRAINT fk_movimientos_puntos_cita
  FOREIGN KEY (cita_id) REFERENCES citas(id) ON DELETE SET NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_usuarios_rol ON usuarios(rol);
CREATE INDEX IF NOT EXISTS idx_citas_cliente ON citas(cliente_id);
CREATE INDEX IF NOT EXISTS idx_citas_empleado ON citas(empleado_id);
CREATE INDEX IF NOT EXISTS idx_citas_fecha_estado ON citas(fecha, estado);
CREATE INDEX IF NOT EXISTS idx_pagos_estado ON pagos(estado);
CREATE INDEX IF NOT EXISTS idx_inventario_bajo_stock ON inventario_insumos(cantidad_actual, cantidad_minima_ideal);
CREATE INDEX IF NOT EXISTS idx_movimientos_inventario_insumo_fecha ON movimientos_inventario(insumo_id, fecha_movimiento DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_fecha ON actividad_auditoria(fecha_evento DESC);

-- Trigger: auto update timestamp
CREATE OR REPLACE FUNCTION set_timestamp_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.fecha_actualizacion = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_usuarios_timestamp ON usuarios;
CREATE TRIGGER trg_usuarios_timestamp BEFORE UPDATE ON usuarios
FOR EACH ROW EXECUTE FUNCTION set_timestamp_update();

DROP TRIGGER IF EXISTS trg_servicios_timestamp ON servicios;
CREATE TRIGGER trg_servicios_timestamp BEFORE UPDATE ON servicios
FOR EACH ROW EXECUTE FUNCTION set_timestamp_update();

DROP TRIGGER IF EXISTS trg_citas_timestamp ON citas;
CREATE TRIGGER trg_citas_timestamp BEFORE UPDATE ON citas
FOR EACH ROW EXECUTE FUNCTION set_timestamp_update();

DROP TRIGGER IF EXISTS trg_inventario_timestamp ON inventario_insumos;
CREATE TRIGGER trg_inventario_timestamp BEFORE UPDATE ON inventario_insumos
FOR EACH ROW EXECUTE FUNCTION set_timestamp_update();

DROP TRIGGER IF EXISTS trg_puntos_timestamp ON puntos_cliente;
CREATE TRIGGER trg_puntos_timestamp BEFORE UPDATE ON puntos_cliente
FOR EACH ROW EXECUTE FUNCTION set_timestamp_update();

COMMIT;
