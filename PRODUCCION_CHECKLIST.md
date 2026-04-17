# Checklist Pre-Producción

Documento que registra todos los cambios necesarios antes de lanzar la aplicación a producción. Estos cambios se han mantenido en desarrollo para facilitar pruebas y demos.

---

## ✅ Estado Actual (v1 - Dashboard Reportes Implementado)

**Completado:**

- ✅ Capa de servicios de reportes (`src/nucleo/firebase/reportes.js`)
- ✅ Componentes reutilizables (TarjetaMetrica, TablaReporte, GraficoLinea)
- ✅ Dashboard de reportes admin repleto: KPIs, gráficas, tablas

**Versión:** 1.0 Reportes Admin  
**Última actualización:** 16 abril 2026

---

## � Dashboard de Reportes (NUEVO en v1)

**Ubicaciones:**

- Servicio: [src/nucleo/firebase/reportes.js](src/nucleo/firebase/reportes.js)
- Vista: [src/modulos/administracion/vistas/ReportesView.vue](src/modulos/administracion/vistas/ReportesView.vue)
- Componentes:
  - [src/compartido/componentes/TarjetaMetrica.vue](src/compartido/componentes/TarjetaMetrica.vue)
  - [src/compartido/componentes/TablaReporte.vue](src/compartido/componentes/TablaReporte.vue)
  - [src/compartido/componentes/GraficoLinea.vue](src/compartido/componentes/GraficoLinea.vue)

**Funcionalidades:**

- 6 KPI cards con formateo dinámico (número, moneda, porcentaje)
- Filtros globales: Hoy, 7 días, 30 días, mes actual, rango personalizado
- Gráfica SVG de ingresos por período
- 4 tablas operacionales: Top clientes, Top servicios, Stock crítico, Eficiencia empleados

**Para Producción:**

- ✅ No requiere cambios: la lógica está centralizada en `reportes.js` y es agnóstica a datos de prueba
- Si hay datos de prueba en Firestore al momento de migrar, los KPIs los incluirán automáticamente
- Recomendación: Limpiar Firestore manualmente antes de pasar a producción para no mezclar datos históricos de prueba con datos reales

---

## �📋 Datos de Prueba a Remover

### 1. Inicialización Automática de Colecciones

**Ubicación:** [src/main.js](src/main.js#L20-L29)

**Estado actual (Desarrollo):**

```javascript
// Inicializar datos de prueba cuando el usuario se autentica
auth.$subscribe(async (mutation, state) => {
  if (state.usuario && state.token && state.usuario.rol === "admin") {
    try {
      await inicializarServicios();
      await inicializarInventario();
      await inicializarCitas();
    } catch (error) {
      console.error("Error inicializando datos:", error);
    }
  }
});
```

**Por qué se hizo:** Facilita pruebas sin necesidad de crear datos manualmente en Firestore.

**Para Producción:**

- ✅ **Opción 1 (Recomendada):** Remover completamente el bloque `auth.$subscribe(...)`
- ✅ **Opción 2:** Condicionar a entorno desarrollo:
  ```javascript
  if (import.meta.env.DEV) {
    auth.$subscribe(async (mutation, state) => {
      // bloque de inicialización
    });
  }
  ```

---

### 2. Servicios de Prueba

**Ubicación:** [src/nucleo/firebase/servicios.js](src/nucleo/firebase/servicios.js#L100-L160)

**Servicios creados automáticamente:**

- Manicura Básica ($250 | 30min)
- Manicura Gel ($400 | 45min)
- Pedicura Básica ($300 | 30min)
- Pedicura Gel ($450 | 45min)
- Diseño de Uñas ($500 | 60min)
- Extensiones de Uñas ($600 | 90min)

**Para Producción:**

- Reemplazar con servicios reales del salón
- O eliminar función `inicializarServicios()` si se crearán vía AdminPanel
- Verificar en Firestore que no queden servicios de prueba

---

### 3. Inventario de Prueba

**Ubicación:** [src/nucleo/firebase/inventario.js](src/nucleo/firebase/inventario.js#L147-L220)

**Productos creados automáticamente:**

- Esmalte Rojo Pasión (OPI)
- Acetona Pura
- Gel Base (Gelish)
- Broca Punta Diamante
- Algodón Cosmético
- Primer para Uñas (Orly)

**Para Producción:**

- Reemplazar con inventario real del salón
- Eliminar función `inicializarInventario()` si se mantendrá manual
- **Importante:** Verificar cantidades y precios en Firestore

---

### 4. Citas de Prueba

**Ubicación:** [src/nucleo/firebase/citas.js](src/nucleo/firebase/citas.js#L171-L187)

**Estado actual:** No se crean automáticamente (solo log de aviso).

**Para Producción:** ✅ No requiere cambios.

---

## 🔐 Variables de Entorno a Verificar

**Archivo:** `.env` (no versionado en git)

Asegúrate de que estas variables están configuradas correctamente en Vercel:

```env
# Firebase (debe estar en src/nucleo/firebase/client.js hardcoded hoy)
# Pendiente: Migrar a variables de entorno

# Admin emails (opcional, para bootstrap automático)
VITE_ADMIN_EMAILS=tu-email@tudominio.com
```

**Acción pendiente:** Mover credenciales de Firebase a `.env` en lugar de hardcodearlas en [src/nucleo/firebase/client.js](src/nucleo/firebase/client.js#L5).

---

## 🗑️ Archivos Legado a Verificar

**Ubicación:** [\_legado/](../_legado/)

Estos archivos no se usan en producción, pero contienen información histórica:

- `_legado/firebase.js` — Configuración Firebase antigua
- `_legado/database/` — Scripts SQL para PostgreSQL (no aplica a Firebase)

**Para Producción:** ✅ Pueden permanecer sin afectar nada. Opcional: eliminar si quieres repo ultra-limpio.

---

## 🔑 Datos Reales a Agregar Antes de Launch

Estos datos deben crearse/importarse manualmente en Firestore:

### Colección `users`

- Al least 1 admin (por email en VITE_ADMIN_EMAILS)
- Empleados necesarios
- Estructura según [src/nucleo/estado/auth.js](src/nucleo/estado/auth.js#L72-L107)

### Colección `servicios`

- Listar tus servicios reales
- Precios correctos
- Duraciones reales
- Crear vía AdminPanel o script seed

### Colección `inventario`

- Stock real de productos
- Precios de compra/venta correctos
- Proveedores reales

### Colección `citas` (opcional)

- Puedes llenarla con datos históricos si necesario
- O dejarla vacía para nuevas citas

---

## 📝 Checklist Final Pre-Deploy

- [ ] **Dashboard Reportes:**
  - [ ] Ingresar como admin en `/admin/reportes` (ruta ya existe)
  - [ ] Probar todos los filtros (Hoy, 7 días, 30 días, mes actual, rango personalizado)
  - [ ] Validar que KPIs coinciden con conteos manuales en Firestore
  - [ ] Probar en móvil/tablet/desktop (responsive OK con gráfica SVG)
  - [ ] Validar comportamiento con Firestore vacío (sin citas, sin clientes)
  - [ ] Validar comportamiento con errores de permiso (mostrar error sin romper UI)

- [ ] Remover o condicionar bloque `auth.$subscribe()` en [src/main.js](src/main.js)
- [ ] Verificar que no hay datos de prueba en Firestore (colecciones limpias)
- [ ] Crear datos reales de servicios en Firestore
- [ ] Crear datos reales de inventario en Firestore
- [ ] Verificar emails admin en `VITE_ADMIN_EMAILS` en Vercel
- [ ] Revisar firebase.firestore.rules ([firebase.firestore.rules](../firebase.firestore.rules)) en Firebase Console
- [ ] Hacer test login con credenciales reales
- [ ] Probar flujos críticos (crear cita, ver servicios, manejo inventario, ver reportes)
- [ ] Revisar logs en Vercel/Firebase por errores
- [ ] Hacer backup de Firestore antes de cambios finales

---

## 🔗 Referencias de Configuración

| Recurso             | Ubicación                                                      | Acción                      |
| ------------------- | -------------------------------------------------------------- | --------------------------- |
| Init Firebase       | [src/nucleo/firebase/client.js](src/nucleo/firebase/client.js) | Migrar credenciales a .env  |
| Bootstrapping Admin | [src/nucleo/estado/auth.js](src/nucleo/estado/auth.js#L137)    | Verificar `esCorreoAdmin()` |
| Auto-init datos     | [src/main.js](src/main.js#L20)                                 | Remover/condicionar         |
| Reglas Firestore    | [firebase.firestore.rules](../firebase.firestore.rules)        | Revisar permisos en prod    |
| Vercel config       | [vercel.json](../vercel.json)                                  | Verificar rewrite para SPA  |

---

## 📅 Versión

- **Creado:** 16 abril 2026
- **Estado:** En Desarrollo
- **Próxima revisión:** Antes de producción
