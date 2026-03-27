-- Estetica DB seed data (PostgreSQL)

BEGIN;

-- Usuarios demo alineados con auth.js
INSERT INTO usuarios (nombre, email, password_hash, rol, avatar, estado)
VALUES
  ('Carlos Lopez', 'usuario@demo.com', crypt('123456', gen_salt('bf')), 'usuario', 'CL', 'activo'),
  ('Ana Martinez', 'empleado@demo.com', crypt('123456', gen_salt('bf')), 'empleado', 'AM', 'activo'),
  ('Dueno Sistema', 'admin@demo.com', crypt('123456', gen_salt('bf')), 'admin', 'DS', 'activo'),
  ('Sofia Ramirez', 'sofia@salon.com', crypt('123456', gen_salt('bf')), 'empleado', 'SR', 'activo'),
  ('Laura Gonzalez', 'laura@salon.com', crypt('123456', gen_salt('bf')), 'empleado', 'LG', 'activo')
ON CONFLICT (email) DO NOTHING;

-- Categorias
INSERT INTO categorias_servicio (nombre, descripcion)
VALUES
  ('Cabello', 'Corte, color y peinado'),
  ('Uñas', 'Manicure y aplicacion'),
  ('Facial', 'Limpieza e hidratacion'),
  ('Maquillaje', 'Social y profesional')
ON CONFLICT (nombre) DO NOTHING;

-- Servicios
INSERT INTO servicios (categoria_id, nombre, descripcion, precio, icono, duracion_minutos, estado)
SELECT c.id, s.nombre, s.descripcion, s.precio, s.icono, s.duracion, 'activo'
FROM (
  VALUES
    ('Cabello', 'Corte de cabello', 'Corte personalizado a tu estilo', 250.00, 'corte', 45),
    ('Cabello', 'Tinte y coloracion', 'Cambio de color profesional', 600.00, 'color', 120),
    ('Uñas', 'Manicure Semipermanente', 'Hasta 3 semanas de duracion', 320.00, 'unas', 60),
    ('Facial', 'Limpieza Facial', 'Hidratacion profunda y luminosidad', 550.00, 'facial', 60),
    ('Maquillaje', 'Maquillaje Social', 'Look para evento especial', 450.00, 'maquillaje', 45)
) AS s(categoria, nombre, descripcion, precio, icono, duracion)
JOIN categorias_servicio c ON c.nombre = s.categoria
WHERE NOT EXISTS (SELECT 1 FROM servicios x WHERE x.nombre = s.nombre);

-- Perfiles CRM para cliente demo
INSERT INTO perfiles_cliente (usuario_id, visitas_totales)
SELECT u.id, 0
FROM usuarios u
WHERE u.rol = 'usuario'
ON CONFLICT (usuario_id) DO NOTHING;

INSERT INTO puntos_cliente (cliente_id, saldo_puntos)
SELECT u.id, 320
FROM usuarios u
WHERE u.email = 'usuario@demo.com'
ON CONFLICT (cliente_id) DO NOTHING;

-- Especialidades
INSERT INTO especialidades (nombre, descripcion)
VALUES
  ('Corte y Color', 'Especialidad cabello'),
  ('Facial y Maquillaje', 'Especialidad rostro'),
  ('Uñas y Manicure', 'Especialidad uñas')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO empleado_especialidad (empleado_id, especialidad_id)
SELECT e.id, sp.id
FROM usuarios e
JOIN especialidades sp ON sp.nombre = 'Corte y Color'
WHERE e.email = 'empleado@demo.com'
ON CONFLICT DO NOTHING;

INSERT INTO empleado_especialidad (empleado_id, especialidad_id)
SELECT e.id, sp.id
FROM usuarios e
JOIN especialidades sp ON sp.nombre = 'Facial y Maquillaje'
WHERE e.email = 'sofia@salon.com'
ON CONFLICT DO NOTHING;

INSERT INTO empleado_especialidad (empleado_id, especialidad_id)
SELECT e.id, sp.id
FROM usuarios e
JOIN especialidades sp ON sp.nombre = 'Uñas y Manicure'
WHERE e.email = 'laura@salon.com'
ON CONFLICT DO NOTHING;

-- Horarios base (lunes-viernes, 09:00-18:00)
INSERT INTO horario_empleado (empleado_id, dia_semana, hora_inicio, hora_fin, estado)
SELECT e.id, d.dia, '09:00', '18:00', 'activo'
FROM usuarios e
CROSS JOIN (VALUES (1), (2), (3), (4), (5)) AS d(dia)
WHERE e.rol = 'empleado'
  AND NOT EXISTS (
    SELECT 1 FROM horario_empleado h
    WHERE h.empleado_id = e.id
      AND h.dia_semana = d.dia
      AND h.hora_inicio = '09:00'
      AND h.hora_fin = '18:00'
  );

-- Inventario SCM
INSERT INTO proveedores (nombre, contacto, telefono, email, estado)
VALUES
  ('Distribuidor Central', 'Ventas Centro', '555-0100', 'ventas@distribuidor.com', 'activo'),
  ('Beauty Supplies Inc', 'Cuenta Salon', '555-0101', 'atencion@beauty.com', 'activo')
ON CONFLICT DO NOTHING;

INSERT INTO inventario_insumos (nombre, cantidad_actual, cantidad_minima_ideal, unidad, proveedor_id, estado)
SELECT v.nombre, v.cantidad, v.minimo, 'pieza', p.id, 'activo'
FROM (
  VALUES
    ('Monomero 8oz', 5, 2, 'Distribuidor Central'),
    ('Gelish Tono Nude', 1, 3, 'Beauty Supplies Inc'),
    ('Caja de Tips', 10, 4, 'Distribuidor Central')
) AS v(nombre, cantidad, minimo, proveedor)
JOIN proveedores p ON p.nombre = v.proveedor
WHERE NOT EXISTS (SELECT 1 FROM inventario_insumos i WHERE i.nombre = v.nombre);

-- Citas ejemplo
WITH refs AS (
  SELECT
    (SELECT id FROM usuarios WHERE email = 'usuario@demo.com') AS cliente_id,
    (SELECT id FROM usuarios WHERE email = 'empleado@demo.com') AS empleado_id,
    (SELECT id FROM servicios WHERE nombre = 'Corte de cabello') AS srv1,
    (SELECT id FROM servicios WHERE nombre = 'Limpieza Facial') AS srv2,
    (SELECT id FROM servicios WHERE nombre = 'Manicure Semipermanente') AS srv3,
    (SELECT id FROM servicios WHERE nombre = 'Maquillaje Social') AS srv4,
    (SELECT id FROM servicios WHERE nombre = 'Tinte y coloracion') AS srv5
)
INSERT INTO citas (cliente_id, empleado_id, servicio_id, fecha, hora_inicio, estado, notas_cliente)
SELECT cliente_id, empleado_id, servicio_id, CURRENT_DATE, hora_inicio, estado, 'Cita demo'
FROM refs,
LATERAL (
  VALUES
    (srv1, '09:00'::time, 'completada'::appointment_status),
    (srv2, '10:00'::time, 'confirmada'::appointment_status),
    (srv3, '12:00'::time, 'confirmada'::appointment_status),
    (srv4, '15:00'::time, 'pendiente'::appointment_status),
    (srv5, '16:30'::time, 'pendiente'::appointment_status)
) AS c(servicio_id, hora_inicio, estado)
WHERE cliente_id IS NOT NULL
  AND empleado_id IS NOT NULL
  AND servicio_id IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM citas x
    WHERE x.fecha = CURRENT_DATE
      AND x.hora_inicio = c.hora_inicio
      AND x.cliente_id = refs.cliente_id
      AND x.empleado_id = refs.empleado_id
  );

-- Promociones
INSERT INTO promociones (titulo, descripcion, precio_promocional, fecha_inicio, fecha_fin, estado)
VALUES
  ('Manicure + Gel', 'Diseno incluido para nuevas clientas', 199.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'activo'),
  ('Facial Express', 'Limpieza profunda e hidratacion', 250.00, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', 'activo')
ON CONFLICT DO NOTHING;

-- Configuracion inicial
INSERT INTO configuracion_sistema (clave, valor, descripcion)
VALUES
  ('negocio.nombre', 'Nails Bere', 'Nombre comercial visible en app'),
  ('negocio.moneda', 'MXN', 'Moneda operativa'),
  ('agenda.intervalo_minutos', '30', 'Intervalo base de agenda')
ON CONFLICT (clave) DO UPDATE SET
  valor = EXCLUDED.valor,
  descripcion = EXCLUDED.descripcion,
  fecha_actualizacion = NOW();

COMMIT;
