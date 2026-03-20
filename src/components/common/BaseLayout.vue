<template>
  <div class="app-layout" :class="`theme-${rolTema}`">

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarColapsado }">
      <div class="sidebar-header">
        <div class="sidebar-brand">
          <span class="brand-icon">◈</span>
          <span class="brand-text">Nails Bere</span>
        </div>
        <button class="collapse-btn" @click="sidebarColapsado = !sidebarColapsado">
          {{ sidebarColapsado ? '→' : '←' }}
        </button>
      </div>

      <nav class="sidebar-nav">
        <RouterLink
            v-for="(item, i) in navItems"
            :key="item.name"
            :to="{ name: item.name }"
            class="nav-item"
            active-class="nav-item--active"
            :style="{ animationDelay: `${i * 0.07}s` }"
        >
          <span class="nav-icon">{{ item.icono }}</span>
          <span class="nav-label">{{ item.titulo }}</span>
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <button class="btn-logout" @click="handleLogout">
          <span class="nav-icon">🚪</span>
          <span class="nav-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- Contenido principal -->
    <main class="main-content">

      <!-- Top bar con perfil -->
      <header class="top-bar">
        <div class="page-title">
          <slot name="titulo">Panel</slot>
        </div>

        <div class="top-bar-right">
          <span class="current-time">{{ horaActual }}</span>

          <!-- Perfil dropdown -->
          <div class="perfil-wrapper" ref="perfilRef">
            <button class="perfil-btn" @click="perfilAbierto = !perfilAbierto">
              <div class="perfil-avatar" :class="`avatar-${rolTema}`">
                {{ auth.usuario?.avatar }}
              </div>
              <span class="perfil-chevron" :class="{ rotado: perfilAbierto }">▾</span>
            </button>

            <!-- Dropdown -->
            <Transition name="dropdown">
              <div v-if="perfilAbierto" class="perfil-dropdown">
                <div class="dropdown-header">
                  <div class="dropdown-avatar" :class="`avatar-${rolTema}`">
                    {{ auth.usuario?.avatar }}
                  </div>
                  <div class="dropdown-info">
                    <p class="dropdown-nombre">{{ auth.usuario?.nombre }}</p>
                    <span class="dropdown-rol" :class="`badge-${rolTema}`">{{ etiquetaRol }}</span>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <RouterLink
                    :to="rutaPerfil"
                    class="dropdown-item"
                    @click="perfilAbierto = false"
                >
                  <span>👤</span> Mi perfil
                </RouterLink>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item logout-item" @click="handleLogout">
                  <span>🚪</span> Cerrar sesión
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </header>

      <!-- Contenido con transición -->
      <div class="page-content">
        <RouterView v-slot="{ Component, route }">
          <Transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </Transition>
        </RouterView>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const props = defineProps({
  navItems:    { type: Array,  default: () => [] },
  rolTema:     { type: String, default: 'usuario' },
  etiquetaRol: { type: String, default: 'Usuario' },
})

const auth = useAuthStore()
const router = useRouter()
const sidebarColapsado = ref(false)
const perfilAbierto = ref(false)
const perfilRef = ref(null)
const horaActual = ref('')
let intervalo = null

// Ruta de perfil según rol
const rutaPerfil = computed(() => {
  const rutas = {
    usuario:  '/usuario/perfil',
    empleado: '/empleado/perfil',
    admin:    '/admin/dashboard',
  }
  return rutas[props.rolTema] || '/'
})

function actualizarHora() {
  horaActual.value = new Date().toLocaleTimeString('es-MX', {
    hour: '2-digit', minute: '2-digit',
  })
}

// Cerrar dropdown al hacer clic fuera
function handleClickFuera(e) {
  if (perfilRef.value && !perfilRef.value.contains(e.target)) {
    perfilAbierto.value = false
  }
}

onMounted(() => {
  actualizarHora()
  intervalo = setInterval(actualizarHora, 30000)
  document.addEventListener('click', handleClickFuera)
})

onUnmounted(() => {
  clearInterval(intervalo)
  document.removeEventListener('click', handleClickFuera)
})

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

/* ── Layout base ─────────────────────────────────── */
.app-layout {
  display: flex;
  min-height: 100vh;
  background: #0d0d14;
  font-family: 'DM Sans', sans-serif;
  color: #fff;
}

/* ── Variables por rol ───────────────────────────── */
.theme-usuario  { --accent: #f9a8d4; --accent-dim: rgba(249,168,212,0.12); --accent-mid: rgba(249,168,212,0.25); }
.theme-empleado { --accent: #f9a8d4; --accent-dim: rgba(249,168,212,0.12); --accent-mid: rgba(249,168,212,0.25); }
.theme-admin    { --accent: #f9a8d4; --accent-dim: rgba(249,168,212,0.12); --accent-mid: rgba(249,168,212,0.25); }

/* ── Sidebar ─────────────────────────────────────── */
.sidebar {
  width: 220px;
  min-width: 220px;
  background: #111118;
  border-right: 1px solid rgba(249,168,212,0.1);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4,0,0.2,1),
  min-width 0.3s cubic-bezier(0.4,0,0.2,1);
  overflow: hidden;
}

.sidebar.collapsed {
  width: 60px;
  min-width: 60px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1rem;
  border-bottom: 1px solid rgba(249,168,212,0.08);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow: hidden;
}

.brand-icon {
  font-size: 1.4rem;
  color: var(--accent);
  flex-shrink: 0;
  animation: pulse-icon 3s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.brand-text {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 600;
  font-style: italic;
  font-size: 1.25rem;
  white-space: nowrap;
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, #f9a8d4, #fbcfe8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.collapse-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  flex-shrink: 0;
  transition: color 0.2s;
}
.collapse-btn:hover { color: var(--accent); }

/* ── Nav items ───────────────────────────────────── */
.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  color: rgba(255,255,255,0.4);
  text-decoration: none;
  font-size: 0.85rem;
  border-left: 3px solid transparent;
  transition: color 0.2s, background 0.2s, border-color 0.2s;
  white-space: nowrap;
  overflow: hidden;
  /* Animación de entrada */
  animation: slideInLeft 0.4s ease both;
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-16px); }
  to   { opacity: 1; transform: translateX(0); }
}

.nav-item:hover {
  color: rgba(255,255,255,0.85);
  background: rgba(249,168,212,0.05);
}

.nav-item--active {
  color: var(--accent) !important;
  background: var(--accent-dim) !important;
  border-left-color: var(--accent) !important;
}

.nav-icon {
  font-size: 1.05rem;
  flex-shrink: 0;
  width: 20px;
  text-align: center;
  transition: transform 0.2s;
}

.nav-item:hover .nav-icon { transform: scale(1.15); }

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.2s;
}

/* ── Sidebar footer ──────────────────────────────── */
.sidebar-footer {
  padding: 0.75rem 0;
  border-top: 1px solid rgba(249,168,212,0.08);
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 1rem;
  background: none;
  border: none;
  color: rgba(255,255,255,0.3);
  cursor: pointer;
  font-size: 0.85rem;
  font-family: 'DM Sans', sans-serif;
  width: 100%;
  transition: color 0.2s;
  white-space: nowrap;
  overflow: hidden;
}
.btn-logout:hover { color: #ff6b6b; }

/* Ocultar labels colapsado */
.collapsed .nav-label,
.collapsed .brand-text { display: none; }

/* ── Main content ────────────────────────────────── */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* ── Top bar ─────────────────────────────────────── */
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.9rem 1.5rem;
  border-bottom: 1px solid rgba(249,168,212,0.08);
  background: rgba(255,255,255,0.015);
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
  animation: slideDown 0.4s ease both;
}

@keyframes slideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.page-title {
  font-family: 'Syne', sans-serif;
  font-weight: 700;
  font-size: 1rem;
  color: #fff;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-time {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.25);
}

/* ── Perfil btn ──────────────────────────────────── */
.perfil-wrapper {
  position: relative;
}

.perfil-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.2rem;
  border-radius: 30px;
  transition: background 0.2s;
}

.perfil-btn:hover {
  background: rgba(249,168,212,0.08);
}

.perfil-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  border: 2px solid var(--accent);
  transition: transform 0.2s, box-shadow 0.2s;
}

.perfil-btn:hover .perfil-avatar {
  transform: scale(1.08);
  box-shadow: 0 0 12px rgba(249,168,212,0.4);
}

.avatar-usuario,
.avatar-empleado,
.avatar-admin {
  background: rgba(249,168,212,0.15);
  color: #f9a8d4;
}

.perfil-chevron {
  font-size: 0.7rem;
  color: rgba(255,255,255,0.4);
  transition: transform 0.25s;
}

.perfil-chevron.rotado { transform: rotate(180deg); }

/* ── Dropdown perfil ─────────────────────────────── */
.perfil-dropdown {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  width: 220px;
  background: #1a1a24;
  border: 1px solid rgba(249,168,212,0.2);
  border-radius: 14px;
  padding: 0.5rem;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  z-index: 100;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.6rem 0.7rem;
}

.dropdown-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  background: rgba(249,168,212,0.15);
  color: #f9a8d4;
  border: 1px solid rgba(249,168,212,0.3);
  flex-shrink: 0;
}

.dropdown-nombre {
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dropdown-rol {
  font-size: 0.68rem;
  padding: 0.1rem 0.5rem;
  border-radius: 20px;
}

.badge-usuario,
.badge-empleado,
.badge-admin {
  background: rgba(249,168,212,0.15);
  color: #f9a8d4;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255,255,255,0.06);
  margin: 0.3rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.7rem;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 0.82rem;
  border-radius: 8px;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'DM Sans', sans-serif;
  transition: background 0.15s, color 0.15s;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(249,168,212,0.08);
  color: #fff;
}

.logout-item:hover {
  background: rgba(255,100,100,0.08);
  color: #ff6b6b;
}

/* ── Transición dropdown ─────────────────────────── */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

/* ── Transición de página ────────────────────────── */
.page-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.page-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ── Page content ────────────────────────────────── */
.page-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}
</style>