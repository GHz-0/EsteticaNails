# Verificación Rápida - Dashboard Reportes v1

## 🚀 Cómo Probar

1. Asegúrate de estar autenticado como `admin`
2. Navega a `/admin/reportes` (el link está en el menú lateral admin)
3. Verifica que carga sin errores

## ✅ Checklist de Verificación Local

### Paso 1: Interfaz Carga Correctamente

- [ ] Página carga sin errores en consola
- [ ] Ves 6 tarjetas KPI (Citas, Cancelaciones, Ingresos, Clientes Únicos, Clientes Activos, Stock Crítico)
- [ ] Ves gráfica de ingresos
- [ ] Ves 4 tablas: Clientes, Servicios, Stock Crítico, Empleados

### Paso 2: Filtros Funcionan

- [ ] Click en "Hoy" filtra datos del día actual
- [ ] Click en "Últimos 7 días" cambia rango
- [ ] Click en "Últimos 30 días" cambia rango
- [ ] Click en "Este mes" filtra mes actual
- [ ] Click en "Personalizado" permite ingresar fecha inicio y fin
- [ ] Botón "Actualizar" recarga datos

### Paso 3: Datos Correctos (con datos de prueba existentes)

- [ ] KPI "Total Citas" > 0 (si hay citas de prueba)
- [ ] KPI "Ingresos" > 0 (calculado: precio servicio × citas activas)
- [ ] Tablas muestran registros si existen
- [ ] Gráfica muestra línea si hay ingresos en el rango

### Paso 4: Estados Lidia (datos vacíos)

- [ ] Si no hay citas: KPIs muestran 0, tablas dicen "Sin registros"
- [ ] Si hay error: aparece banner rojo con mensaje de error

### Paso 5: Responsive

- [ ] En desktop: 6 KPIs en fila, tablas lado a lado
- [ ] En tablet: KPIs en 3×2, tablas apiladas
- [ ] En móvil: todo apilado verticalmente, legible

## ⚙️ Archivos Creados/Modificados

### Nuevos Archivos

- `src/nucleo/firebase/reportes.js` — Capa de servicios (7 funciones)
- `src/compartido/componentes/TarjetaMetrica.vue` — KPI card
- `src/compartido/componentes/TablaReporte.vue` — Tabla genérica
- `src/compartido/componentes/GraficoLinea.vue` — Gráfica SVG

### Archivos Modificados

- `src/modulos/administracion/vistas/ReportesView.vue` — De placeholder a dashboard completo

## 🔍 Próximos Pasos Después de Verificar

1. **Si todo funciona en local:**
   - Commit a git y hacer push a Vercel
   - Probar en Vercel con datos reales
2. **Si hay errores:**
   - Revisar consola del navegador (F12 > Console)
   - Verificar reglas de Firestore en Firebase Console
   - Verificar que usuario admin tiene permiso de lectura en colecciones

3. **Extensiones futuras (Fase 7+):**
   - Implementar CRM.js con CRUD de clientes
   - Implementar ERP.js con CRUD de órdenes
   - Conectar CitasView → crear orden automáticamente
   - Conectar órdenes → descontar inventario

## 📊 Definición de KPIs

| KPI              | Cálculo                                  | Fuente                 |
| ---------------- | ---------------------------------------- | ---------------------- |
| Total Citas      | COUNT(citas) WHERE estado != "cancelada" | Colección `citas`      |
| Cancelaciones    | COUNT(citas) WHERE estado = "cancelada"  | Colección `citas`      |
| Ingresos         | SUM(precio_servicio) por citas activas   | `citas` × `servicios`  |
| Clientes Únicos  | DISTINCT(usuarioId) en período           | `citas`                |
| Clientes Activos | COUNT(users) WHERE rol="usuario"         | Colección `users`      |
| Stock Crítico    | COUNT(inventario) WHERE cantidad < 5     | Colección `inventario` |

## 🐛 Debugging Tips

**Si las gráficas no aparecen:**

- Inspecciona que `serieIngresos` tiene datos: `console.log(serieIngresos.value)`
- Valida formato: debe ser `[{fecha: "2026-04-01", valor: 1500}, ...]`

**Si las tablas están vacías:**

- Verifica que tienes datos en Firestore: abre Firebase Console → Firestore
- Valida que el usuario admin tiene permiso de lectura en todas las colecciones

**Si hay error "No se pudo cargar":**

- Abre DevTools (F12) → Network tab
- Busca requests a Firestore y revisa los errores 403 (permisos)
- Verifica reglas en `firebase.firestore.rules`

---

**Versión:** 1.0 Reportes Admin  
**Fecha de verificación:** [Completar después de probar]
