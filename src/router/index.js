import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const rutasPublicas = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/auth/HomeView.vue'),
    meta: { publica: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
    meta: { publica: true, soloNoAuth: true },
  },
]

const rutasUsuario = [
  {
    path: '/usuario',
    component: () => import('@/layouts/UsuarioLayout.vue'),
    meta: { requiereAuth: true, roles: ['usuario'] },
    children: [
      { path: '', redirect: '/usuario/dashboard' },
      { path: 'dashboard', name: 'usuario-dashboard', component: () => import('@/views/user/DashboardView.vue'), meta: { titulo: 'Mi Panel', icono: '🏠' } },
      { path: 'servicios', name: 'usuario-servicios', component: () => import('@/views/user/ServiciosView.vue'), meta: { titulo: 'Servicios', icono: '🛍️' } },
      { path: 'mis-citas', name: 'usuario-citas', component: () => import('@/views/user/CitasView.vue'), meta: { titulo: 'Mis Citas', icono: '📅' } },
      { path: 'perfil', name: 'usuario-perfil', component: () => import('@/views/user/PerfilView.vue'), meta: { titulo: 'Mi Perfil', icono: '👤' } },
    ],
  },
]

const rutasEmpleado = [
  {
    path: '/empleado',
    component: () => import('@/layouts/EmpleadoLayout.vue'),
    meta: { requiereAuth: true, roles: ['empleado'] },
    children: [
      { path: '', redirect: '/empleado/dashboard' },
      { path: 'dashboard', name: 'empleado-dashboard', component: () => import('@/views/employee/DashboardView.vue'), meta: { titulo: 'Panel Empleado', icono: '🏠' } },
      { path: 'citas', name: 'empleado-citas', component: () => import('@/views/employee/GestionCitasView.vue'), meta: { titulo: 'Gestión de Citas', icono: '📋' } },
      { path: 'clientes', name: 'empleado-clientes', component: () => import('@/views/employee/ClientesView.vue'), meta: { titulo: 'Clientes', icono: '👥' } },
      { path: 'perfil', name: 'empleado-perfil', component: () => import('@/views/employee/PerfilView.vue'), meta: { titulo: 'Mi Perfil', icono: '👤' } },
    ],
  },
]

const rutasAdmin = [
  {
    path: '/admin',
    component: () => import('@/layouts/AdminLayout.vue'),
    meta: { requiereAuth: true, roles: ['admin'] },
    children: [
      { path: '', redirect: '/admin/dashboard' },
      { path: 'dashboard', name: 'admin-dashboard', component: () => import('@/views/admin/DashboardView.vue'), meta: { titulo: 'Panel Admin', icono: '🏠' } },
      { path: 'reportes', name: 'admin-reportes', component: () => import('@/views/admin/ReportesView.vue'), meta: { titulo: 'Reportes', icono: '📊' } },
      { path: 'empleados', name: 'admin-empleados', component: () => import('@/views/admin/EmpleadosView.vue'), meta: { titulo: 'Empleados', icono: '👨‍💼' } },
      { path: 'servicios', name: 'admin-servicios', component: () => import('@/views/admin/ServiciosView.vue'), meta: { titulo: 'Servicios', icono: '🛠️' } },
      { path: 'configuracion', name: 'admin-config', component: () => import('@/views/admin/ConfiguracionView.vue'), meta: { titulo: 'Configuración', icono: '⚙️' } },
    ],
  },
]

const rutasError = [
  { path: '/sin-permiso', name: 'sin-permiso', component: () => import('@/views/auth/SinPermisoView.vue'), meta: { publica: true } },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('@/views/auth/NotFoundView.vue'), meta: { publica: true } },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...rutasPublicas, ...rutasUsuario, ...rutasEmpleado, ...rutasAdmin, ...rutasError],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const requiereAuth = to.matched.some((r) => r.meta.requiereAuth)
  const soloNoAuth = to.matched.some((r) => r.meta.soloNoAuth)
  const rolesPermitidos = to.matched.find((r) => r.meta.roles)?.meta.roles

  if (requiereAuth && !auth.estaAutenticado) return next({ name: 'login', query: { redirect: to.fullPath } })
  if (soloNoAuth && auth.estaAutenticado) return next(getRutaDashboard(auth.rol))
  if (rolesPermitidos && !rolesPermitidos.includes(auth.rol)) return next({ name: 'sin-permiso' })
  next()
})

export function getRutaDashboard(rol) {
  const dashboards = { usuario: '/usuario/dashboard', empleado: '/empleado/dashboard', admin: '/admin/dashboard' }
  return dashboards[rol] || '/'
}

export default router