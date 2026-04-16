# Contexto para IA — Desarrollo de Nuevos Módulos

Este documento define la **estructura mínima de contexto** que debe incluirse cuando se solicita a una IA (Copilot, ChatGPT, etc.) que ayude a **crear o modificar módulos** en esta aplicación.

---

## 📋 Información General del Proyecto

- **Nombre:** Estetica (Nails Management System)
- **Framework:** Vue 3 + Vite
- **Estado global:** Pinia
- **Enrutamiento:** Vue Router 5
- **Backend:** Firebase (Auth + Firestore)
- **Despliegue:** Vercel
- **Estilo:** CSS personalizado (no Tailwind/Bootstrap en uso actual)
- **Estructura:** Modular por roles (autenticacion, usuario, empleado, administracion)

---

## 🔑 Roles y Permisos

El sistema maneja **3 roles principales**:

```javascript
const ROLES = {
  USUARIO: "usuario", // Cliente final
  EMPLEADO: "empleado", // Staff/Servidora
  ADMIN: "admin", // Administrador
};
```

**Gestión:**

- Definido en: `src/nucleo/estado/auth.js`
- Determinación: Email en `VITE_ADMIN_EMAILS` → admin; resto → usuario
- Cada módulo tiene Layout+Rutas hijas específicas por rol

---

## 📂 Estructura de Archivos Críticos

### 1. **Entrypoint y Configuración**

```
src/main.js                  # Inicializa: Pinia → Router → Auth → Firebase
src/App.vue                  # Componente raíz (solo <RouterView />)
vite.config.js               # Alias @/ → src/
package.json                 # Dependencias (vue, vue-router, pinia, firebase)
vercel.json                  # Rewrite de rutas para SPA en Vercel
```

### 2. **Núcleo — Estado y Autenticación**

```
src/nucleo/estado/auth.js
├─ defineStore("auth")
├─ Métodos: login(), registrar(), logout(), inicializarAuth()
├─ Computed: estaAutenticado, rol, esUsuario, esEmpleado, esAdmin
├─ Persistencia: localStorage (usuario, token)
└─ IMPORTANTE: onAuthStateChanged() sincroniza con Firebase Auth

src/nucleo/firebase/client.js
├─ getFirebaseApp()          # Init Firebase SDK
├─ getFirebaseAuth()         # Retorna instancia Auth
└─ getFirebaseDb()           # Retorna Firestore instance
```

### 3. **Núcleo — Enrutamiento**

```
src/nucleo/router/index.js
├─ Rutas públicas: /, /registro, /login, /sin-permiso, 404
├─ Ruta usuario: /usuario/** (requiereAuth: true, roles: ["usuario"])
├─ Ruta empleado: /empleado/** (requiereAuth: true, roles: ["empleado"])
├─ Ruta admin: /admin/** (requiereAuth: true, roles: ["admin"])
├─ beforeEach: validar auth, rol, redirecciones
└─ Meta campos: publica, soloNoAuth, requiereAuth, roles, titulo, icono
```

### 4. **Núcleo — Firebase Collections**

```
src/nucleo/firebase/servicios.js
├─ Collection: /servicios
├─ Métodos: obtenerServicios(), agregarServicio(), etc.

src/nucleo/firebase/citas.js
├─ Collection: /citas y /appointments
├─ Métodos: obtenerMisCitas(), obtenerCitas(), crearCita(), etc.

src/nucleo/firebase/inventario.js
├─ Collection: /inventario
├─ Métodos: obtenerInventario(), agregarItem(), etc.

firebase.firestore.rules
├─ Reglas de seguridad Firestore
├─ Funciones: isSignedIn(), isAdmin(), userRole()
└─ Permisos por colección: users, services, servicios, citas, inventario
```

### 5. **Compartido — Componentes Base**

```
src/compartido/componentes/PlantillaBase.vue
├─ Layout base para usuarios autenticados
├─ Navbar con rol, avatar, navegación
├─ Sidebar con rutas hijas (meta.titulo, meta.icono)
├─ Injected: usuario, rol, permisos (usePermisos)
└─ Uso: Envuelve toda ruta autenticada

src/compartido/composables/usePermisos.js
├─ Composable reutilizable para lógica de permisos
├─ Métodos: tieneRol(), puedeAcceder()
└─ Inyectado en PlantillaBase.vue
```

### 6. **Módulos — Estructura Estándar**

#### Módulo de Autenticación (Sin Layout)

```
src/modulos/autenticacion/
├─ vistas/
│  ├─ InicioView.vue           # Landing pública
│  ├─ RegistroView.vue         # Crear cuenta (Firebase Auth)
│  ├─ InicioSesionView.vue    # Login
│  ├─ AccesoDenegadoView.vue  # 403
│  └─ NoEncontradoView.vue    # 404
└─ PATRÓN: Vistas sin Layout, meta: { publica: true }
```

#### Módulo de Usuario (Con Layout)

```
src/modulos/usuario/
├─ layouts/
│  └─ UsuarioLayout.vue        # Layout + PlantillaBase
├─ vistas/
│  ├─ PanelView.vue            # Dashboard usuario
│  ├─ ServiciosView.vue        # Catálogo servicios
│  ├─ CitasView.vue            # Mis citas + reservar
│  └─ PerfilView.vue           # Mi perfil
├─ crm.js                       # Lógica CRM opcional
└─ PATRÓN: Meta { requiereAuth: true, roles: ["usuario"] }
```

#### Módulo de Empleado (Con Layout)

```
src/modulos/empleado/
├─ layouts/
│  └─ EmpleadoLayout.vue
├─ vistas/
│  ├─ PanelView.vue            # Dashboard empleado
│  ├─ GestionCitasView.vue    # Citas asignadas
│  ├─ ClientesView.vue         # Mis clientes
│  └─ PerfilView.vue
└─ PATRÓN: Meta { requiereAuth: true, roles: ["empleado"] }
```

#### Módulo de Administración (Con Layout)

```
src/modulos/administracion/
├─ layouts/
│  └─ AdministradorLayout.vue
├─ vistas/
│  ├─ PanelView.vue            # Dashboard admin
│  ├─ ReportesView.vue         # Reportes
│  ├─ EmpleadosView.vue        # Gestión empleados
│  ├─ ServiciosView.vue        # CRUD servicios
│  └─ ConfiguracionView.vue   # Configuración
└─ PATRÓN: Meta { requiereAuth: true, roles: ["admin"] }
```

---

## 🔧 Convenciones de Código

### Imports

```javascript
// Siempre usar alias @
import { useAuthStore } from "@/nucleo/estado/auth";
import { obtenerServicios } from "@/nucleo/firebase/servicios.js";
import PlantillaBase from "@/compartido/componentes/PlantillaBase.vue";
```

### Composables

```javascript
// Estructura estándar
export function useTuComposable() {
  const auth = useAuthStore();
  const { usuario, rol } = storeToRefs(auth);

  const miLogica = () => {
    /* ... */
  };

  return { usuario, rol, miLogica };
}
```

### Componentes Vue

```vue
<template>
  <!-- Estructura -->
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuthStore } from "@/nucleo/estado/auth";

const auth = useAuthStore();
const miEstado = ref(null);
const miComputada = computed(() => {
  /* ... */
});

const miMetodo = async () => {
  /* ... */
};
</script>

<style scoped>
/* Estilos específicos del componente */
</style>
```

### Firestore CRUD

```javascript
import { getFirebaseDb } from "@/nucleo/firebase/client";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

export async function obtenerDatos() {
  const db = getFirebaseDb();
  const q = query(collection(db, "miColeccion"), where("activo", "==", true));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
```

---

## 📝 Checklist para Nuevo Módulo

Cuando asks crear un **nuevo módulo**, la IA debe seguir:

1. **Definir ruta en `src/nucleo/router/index.js`**
   - Path: `/ruta-publica` o `/rol/ruta`
   - Meta: `{ requiereAuth?, roles?, soloNoAuth?, publica? }`

2. **Crear estructura carpeta**

   ```
   src/modulos/nuevoModulo/
   ├─ layouts/
   │  └─ NuevoModuloLayout.vue (si requiere auth)
   └─ vistas/
      ├─ PanelView.vue
      ├─ OtraView.vue
      └─ ...
   ```

3. **Importar composables y stores**
   - `useAuthStore` para auth
   - `usePermisos` para lógica de acceso

4. **Si necesita datos Firestore**
   - Crear archivo en `src/nucleo/firebase/nuevoModulo.js`
   - Exportar funciones CRUD
   - Incluir en `src/main.js` si es inicialización global

5. **Style: CSS scoped**
   - Usar variables CSS si lo requiere (`--color-primary`, etc.)
   - Respetar dark mode (fondo: #0a0a0f)

6. **Rutas hijas (si aplica)**
   - Usar children en router
   - Envolver en Layout con PlantillaBase

---

## 🌍 Variables de Entorno

```env
VITE_ADMIN_EMAILS=admin@ejemplo.com,otro@admin.com
# Firebase viene en src/nucleo/firebase/client.js hardcoded (mejora futura)
```

---

## 🧪 Testing y Debugging

- **localStorage:** Contiene `usuario` (JSON) y `token`
- **Console logs:** auth.js registra onAuthStateChanged
- **Firestore Rules:** Chequear en Firebase Console si hay errores de permiso
- **Vercel Logs:** npm run build && vercel env pull

---

## ⚠️ Qué NO incluir en contexto de IA

- `_legado/` (archivos obsoletos)
- `node_modules/`, `dist/`
- Imágenes grandes en `public/img/`
- `.env`, `.git`, configuración local

---

## 📚 Referencias Rápidas

| Necesidad              | Ubicación                                       |
| ---------------------- | ----------------------------------------------- |
| Añadir ruta            | `src/nucleo/router/index.js`                    |
| Acceso usuarios        | `src/nucleo/estado/auth.js`                     |
| Datos Firestore        | `src/nucleo/firebase/*.js`                      |
| Layout base            | `src/compartido/componentes/PlantillaBase.vue`  |
| Permisos reutilizables | `src/compartido/composables/usePermisos.js`     |
| Reglas seguridad       | `firebase.firestore.rules`                      |
| Build/Deploy           | `vite.config.js`, `vercel.json`, `package.json` |

---

**Versión:** 1.0  
**Última actualización:** 16 abril 2026  
**Para usar con:** GitHub Copilot, ChatGPT o similar (adjunta este archivo como contexto)
