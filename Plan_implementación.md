📋 Plan de Integración - Estructura de Módulos
🎯 Objetivo
Integrar los tres sistemas de gestión empresarial conectados a Firebase, accesibles desde diferentes roles con una vista consolidada de reportes para el admin.

📁 Estructura de Archivos Propuesta
src/
├── nucleo/
│ └── firebase/
│ ├── crm.js # Gestión de clientes y relaciones
│ ├── erp.js # Planificación de recursos
│ └── scm.js # Gestión de cadena de suministro
│
├── modulos/
│ ├── administracion/
│ │ └── vistas/
│ │ ├── ReportesView.vue # 📊 VISTA PRINCIPAL DE REPORTES
│ │ ├── CRMView.vue # Gestión de clientes
│ │ ├── ERPView.vue # Planificación de recursos
│ │ └── SCMView.vue # Gestión de inventario/proveedores
│ │
│ ├── empleado/
│ │ └── vistas/
│ │ ├── ClientesView.vue # Ver/editar clientes asignados
│ │ └── InventarioView.vue # Consultar inventario disponible
│ │
│ └── usuario/
│ └── vistas/
│ └── HistorialView.vue # Ver su propio historial de compras
│
└── compartido/
└── componentes/
├── GraficoLinea.vue # Componente reutilizable de gráficos
├── TarjetaMetrica.vue # KPI cards
└── TablaReporte.vue # Tabla de datos genérica

🗄️ Colecciones de Firebase Necesarias
javascript// Firestore Collections:

1. /clientes // CRM - Datos de clientes
2. /interacciones // CRM - Historial de contacto
3. /ordenes // ERP - Órdenes de servicio
4. /recursos // ERP - Empleados, equipos, salas
5. /proveedores // SCM - Catálogo de proveedores
6. /compras // SCM - Historial de compras
7. /movimientos // SCM - Entradas/salidas de inventario

🔗 Conexión entre Módulos
CRM → Alimenta a ERP

Cuando un cliente agenda una cita → se crea una orden en ERP
Historial de servicios del cliente → análisis de preferencias

ERP → Alimenta a SCM

Servicios programados → cálculo de insumos necesarios
Alertas de inventario bajo → orden de compra automática

SCM → Alimenta a CRM

Nuevos productos → campañas de marketing
Inventario disponible → servicios que se pueden ofrecer

📊 Vista de Reportes (Admin)
Contenido de ReportesView.vue:
┌─────────────────────────────────────────────┐
│ 📊 Dashboard de Reportes Integrados │
├─────────────────────────────────────────────┤
│ │
│ [KPI Cards Row] │
│ • Total Clientes (CRM) │
│ • Citas del Mes (ERP) │
│ • Inventario Crítico (SCM) │
│ • Ingresos Mensuales (ERP) │
│ │
│ [Gráfico de Ingresos - Línea Temporal] │
│ (ERP: órdenes completadas × precio) │
│ │
│ [Top 5 Clientes - Tabla] │
│ (CRM: clientes × total gastado) │
│ │
│ [Productos Bajo Stock - Lista] │
│ (SCM: inventario < mínimo) │
│ │
│ [Eficiencia de Empleados - Barras] │
│ (ERP: citas completadas / asignadas) │
│ │
└─────────────────────────────────────────────┘

🏗️ Estructura Inicial de Archivos
1️⃣ src/nucleo/firebase/crm.js
javascript// Funciones:
// - obtenerClientes()
// - crearCliente(datos)
// - obtenerInteracciones(clienteId)
// - registrarInteraccion(clienteId, datos)
// - obtenerTopClientes(limite)
// - obtenerEstadisticasClientes()
2️⃣ src/nucleo/firebase/erp.js
javascript// Funciones:
// - obtenerOrdenes()
// - crearOrden(datos)
// - asignarRecurso(ordenId, empleadoId)
// - completarOrden(ordenId)
// - obtenerIngresosMes()
// - obtenerEficienciaEmpleados()
3️⃣ src/nucleo/firebase/scm.js
javascript// Funciones:
// - obtenerProveedores()
// - crearCompra(datos)
// - registrarMovimiento(tipo, productoId, cantidad)
// - obtenerProductosBajoStock()
// - generarAlertaReorden(productoId)
4️⃣ src/modulos/administracion/vistas/ReportesView.vue
vue<template>

  <div class="reportes-dashboard">
    <!-- KPIs en cards -->
    <div class="kpis-grid">
      <TarjetaMetrica titulo="Clientes" :valor="totalClientes" />
      <TarjetaMetrica titulo="Citas" :valor="citasMes" />
      <TarjetaMetrica titulo="Stock Bajo" :valor="stockCritico" />
      <TarjetaMetrica titulo="Ingresos" :valor="ingresosMes" />
    </div>

    <!-- Gráfico de ingresos -->
    <GraficoLinea :datos="datosIngresos" />

    <!-- Top clientes -->
    <TablaReporte :datos="topClientes" />

    <!-- Productos bajo stock -->
    <TablaReporte :datos="productosBajoStock" />

  </div>
</template>

🚀 Roadmap de Implementación
Fase 1: Infraestructura (Semana 1)

Crear colecciones en Firebase
Crear archivos crm.js, erp.js, scm.js con funciones básicas
Probar CRUD en cada módulo

Fase 2: Vistas Individuales (Semana 2)

CRMView.vue - CRUD de clientes
ERPView.vue - Gestión de órdenes
SCMView.vue - Gestión de proveedores e inventario

Fase 3: Integración (Semana 3)

Conectar CRM → ERP (citas crean órdenes)
Conectar ERP → SCM (órdenes descuentan inventario)
Conectar SCM → CRM (productos nuevos)

Fase 4: Reportes (Semana 4)

ReportesView.vue - Dashboard consolidado
Componentes de gráficos reutilizables
Exportar reportes a PDF/Excel

💡 Flujo de Datos Ejemplo
Usuario agenda cita de "Manicure Gel"
↓
CRM: Registra interacción del cliente
↓
ERP: Crea orden de servicio
Asigna empleada + sala + hora
↓
SCM: Verifica inventario de gel/esmaltes
Descuenta 1 unidad de "Gel Base"
Si stock < mínimo → Alerta de reorden
↓
Admin ve en Reportes:
• +1 cita programada
• +$400 ingresos proyectados
• ⚠️ "Gel Base" necesita reposición

✅ Checklist de Integración

## Fase 1: Capa de Datos - COMPLETADA ✅

- ✅ Crear servicio `src/nucleo/firebase/reportes.js` con funciones de agregación
  - ✅ obtenerKPIs()
  - ✅ obtenerSerieIngresos()
  - ✅ obtenerTopClientes()
  - ✅ obtenerProductosCriticos()
  - ✅ obtenerEficienciaEmpleados()
  - ✅ obtenerTopServicios()

## Fase 2: Componentes Reutilizables - COMPLETADA ✅

- ✅ TarjetaMetrica.vue (KPI cards con 4 formatos)
- ✅ TablaReporte.vue (tabla genérica con columnas configurables)
- ✅ GraficoLinea.vue (gráfica SVG sin dependencias externas)

## Fase 3: ReportesView - COMPLETADA ✅

- ✅ Reemplazar placeholder por dashboard completo
- ✅ Filtros globales: Hoy, 7 días, 30 días, mes actual, rango personalizado
- ✅ Fila de KPIs (6 métricas)
- ✅ Gráfica de ingresos por período
- ✅ Tabla top 10 clientes (ordendado por gasto)
- ✅ Tabla top 10 servicios (por cantidad vendida)
- ✅ Tabla inventario crítico (stock < 5)
- ✅ Tabla eficiencia empleados (tasa de completación)

## Fases Pendientes:

### Fase 4: Integración UI/UX Admin

- [ ] Validar consistencia visual con layout admin
- [ ] Probar navegación desde menu lateral
- [ ] Ajustar responsive en móvil

### Fase 5: Robustez de Datos

- [ ] Manejo de estados vacíos (sin citas, sin clientes, etc.)
- [ ] Normalización de fechas Firestore (Timestamp vs string)
- [ ] Manejo de valores nulos/incompletos

### Fase 6: Verificación Funcional

- [ ] Prueba manual de cada filtro en navegador
- [ ] Contrastar KPIs contra Firestore (validación de cálculos)
- [ ] Prueba responsive máx-width desktop, tablet, móvil
- [ ] Actualizar PRODUCCION_CHECKLIST con condiciones de semillas

### Fase 7: Extensiones Futuras

- [ ] Crear CRM.js con funciones de clientes CRUD (si necesario)
- [ ] Crear ERP.js con funciones de órdenes (si necesario)
- [ ] Crear SCM.js con funciones de proveedores/compras (si necesario)
- [ ] Conectar CitasView → ERP (crear orden automática al citar)
- [ ] Conectar ERP → SCM (descontar inventario al completar cita)
- [ ] Exportar reportes a PDF/Excel
