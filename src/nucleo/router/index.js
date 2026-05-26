import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/nucleo/estado/auth";

const rutasPublicas = [
  {
    path: "/",
    name: "inicio",
    component: () => import("@/modulos/autenticacion/vistas/InicioView.vue"),
    meta: { publica: true },
  },
  {
    path: "/registro",
    name: "registro",
    component: () => import("@/modulos/autenticacion/vistas/RegistroView.vue"),
    meta: { publica: true, soloNoAuth: true },
  },
  {
    path: "/login",
    name: "login",
    component: () =>
      import("@/modulos/autenticacion/vistas/InicioSesionView.vue"),
    meta: { publica: true, soloNoAuth: true },
  },
];

const rutasUsuario = [
  {
    path: "/usuario",
    component: () => import("@/modulos/usuario/layouts/UsuarioLayout.vue"),
    meta: { requiereAuth: true, roles: ["usuario"] },
    children: [
      { path: "", redirect: "/usuario/dashboard" },
      {
        path: "dashboard",
        name: "usuario-dashboard",
        component: () => import("@/modulos/usuario/vistas/PanelView.vue"),
        meta: { titulo: "Mi Panel", icono: "🏠" },
      },
      {
        path: "servicios",
        name: "usuario-servicios",
        component: () => import("@/modulos/usuario/vistas/ServiciosView.vue"),
        meta: { titulo: "Servicios", icono: "🛍️" },
      },
      {
        path: "mis-citas",
        name: "usuario-citas",
        component: () => import("@/modulos/usuario/vistas/CitasView.vue"),
        meta: { titulo: "Mis Citas", icono: "📅" },
      },
      {
        path: "perfil",
        name: "usuario-perfil",
        component: () => import("@/modulos/usuario/vistas/PerfilView.vue"),
        meta: { titulo: "Mi Perfil", icono: "👤" },
      },
      {
        path: "productos",
        name: "usuario-productos",
        component: () => import("@/modulos/usuario/vistas/ProductosView.vue"),
        meta: { titulo: "Tienda de Productos", icono: "🧴" },
      },
      {
        path: "notificaciones",
        name: "usuario-notificaciones",
        component: () => import("@/modulos/usuario/vistas/NotificacionesView.vue"),
        meta: { titulo: "Notificaciones", icono: "🔔" },
      },
    ],
  },
];

const rutasEmpleado = [
  {
    path: "/empleado",
    component: () => import("@/modulos/empleado/layouts/EmpleadoLayout.vue"),
    meta: { requiereAuth: true, roles: ["empleado"] },
    children: [
      { path: "", redirect: "/empleado/dashboard" },
      {
        path: "dashboard",
        name: "empleado-dashboard",
        component: () => import("@/modulos/empleado/vistas/PanelView.vue"),
        meta: { titulo: "Panel Empleado", icono: "🏠" },
      },
      {
        path: "citas",
        name: "empleado-citas",
        component: () =>
          import("@/modulos/empleado/vistas/GestionCitasView.vue"),
        meta: { titulo: "Gestión de Citas", icono: "📋" },
      },
      {
        path: "clientes",
        name: "empleado-clientes",
        component: () => import("@/modulos/empleado/vistas/ClientesView.vue"),
        meta: { titulo: "Clientes", icono: "👥" },
      },
      {
        path: "perfil",
        name: "empleado-perfil",
        component: () => import("@/modulos/empleado/vistas/PerfilView.vue"),
        meta: { titulo: "Mi Perfil", icono: "👤" },
      },
    ],
  },
];

const rutasAdmin = [
  {
    path: "/admin",
    component: () =>
      import("@/modulos/administracion/layouts/AdministradorLayout.vue"),
    meta: { requiereAuth: true, roles: ["admin"] },
    children: [
      { path: "", redirect: "/admin/dashboard" },
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: () =>
          import("@/modulos/administracion/vistas/PanelView.vue"),
        meta: { titulo: "Panel Admin", icono: "🏠" },
      },
      {
        path: "reportes",
        name: "admin-reportes",
        component: () =>
          import("@/modulos/administracion/vistas/ReportesView.vue"),
        meta: { titulo: "Reportes", icono: "📊" },
      },
      {
        path: "empleados",
        name: "admin-empleados",
        component: () =>
          import("@/modulos/administracion/vistas/EmpleadosView.vue"),
        meta: { titulo: "Empleados", icono: "👨‍💼" },
      },
      {
        path: "servicios",
        name: "admin-servicios",
        component: () =>
          import("@/modulos/administracion/vistas/ServiciosView.vue"),
        meta: { titulo: "Servicios", icono: "🛠️" },
      },
      {
        path: "promociones",
        name: "admin-promociones",
        component: () =>
          import("@/modulos/administracion/vistas/PromocionesView.vue"),
        meta: { titulo: "Promociones", icono: "🏷️" },
      },
    ],
  },
];

const rutasError = [
  {
    path: "/sin-permiso",
    name: "sin-permiso",
    component: () =>
      import("@/modulos/autenticacion/vistas/AccesoDenegadoView.vue"),
    meta: { publica: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () =>
      import("@/modulos/autenticacion/vistas/NoEncontradoView.vue"),
    meta: { publica: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...rutasPublicas,
    ...rutasUsuario,
    ...rutasEmpleado,
    ...rutasAdmin,
    ...rutasError,
  ],
});

router.beforeEach((to) => {
  const auth = useAuthStore();
  const requiereAuth = to.matched.some((r) => r.meta.requiereAuth);
  const soloNoAuth = to.matched.some((r) => r.meta.soloNoAuth);
  const rolesPermitidos = to.matched.find((r) => r.meta.roles)?.meta.roles;

  if (requiereAuth && !auth.estaAutenticado)
    return { name: "login", query: { redirect: to.fullPath } };
  if (soloNoAuth && auth.estaAutenticado) return getRutaDashboard(auth.rol);
  if (rolesPermitidos && !rolesPermitidos.includes(auth.rol))
    return { name: "sin-permiso" };
  return true;
});

export function getRutaDashboard(rol) {
  const dashboards = {
    usuario: "/usuario/dashboard",
    empleado: "/empleado/dashboard",
    admin: "/admin/dashboard",
  };
  return dashboards[rol] || "/";
}

export default router;
