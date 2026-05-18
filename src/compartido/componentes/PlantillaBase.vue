<template>
  <div class="app-layout" :class="`theme-${rolTema}`">
    <!-- Sidebar -->
    <aside class="sidebar" :class="{ collapsed: sidebarColapsado }">
      <div class="sidebar-header">
        <button
          class="sidebar-brand"
          @click="sidebarColapsado = !sidebarColapsado"
          title="Minimizar/Expandir"
        >
          <span class="brand-icon">◈</span>
          <span class="brand-text">Nails Bere</span>
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
          <span
            v-if="item.iconoSvg"
            class="nav-icon nav-icon--svg"
            v-html="item.iconoSvg"
          ></span>
          <span v-else class="nav-icon">{{ item.icono }}</span>
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
              <span class="perfil-chevron" :class="{ rotado: perfilAbierto }"
                >▾</span
              >
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
                    <span class="dropdown-rol" :class="`badge-${rolTema}`">{{
                      etiquetaRol
                    }}</span>
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/nucleo/estado/auth";

const props = defineProps({
  navItems: { type: Array, default: () => [] },
  rolTema: { type: String, default: "usuario" },
  etiquetaRol: { type: String, default: "Usuario" },
});

const auth = useAuthStore();
const router = useRouter();
const sidebarColapsado = ref(false);
const perfilAbierto = ref(false);
const perfilRef = ref(null);
const horaActual = ref("");
let intervalo = null;

// Ruta de perfil según rol
const rutaPerfil = computed(() => {
  const rutas = {
    usuario: "/usuario/perfil",
    empleado: "/empleado/perfil",
    admin: "/admin/dashboard",
  };
  return rutas[props.rolTema] || "/";
});

function actualizarHora() {
  horaActual.value = new Date().toLocaleTimeString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Cerrar dropdown al hacer clic fuera
function handleClickFuera(e) {
  if (perfilRef.value && !perfilRef.value.contains(e.target)) {
    perfilAbierto.value = false;
  }
}

onMounted(() => {
  actualizarHora();
  intervalo = setInterval(actualizarHora, 30000);
  document.addEventListener("click", handleClickFuera);
});

onUnmounted(() => {
  clearInterval(intervalo);
  document.removeEventListener("click", handleClickFuera);
});

function handleLogout() {
  auth.logout();
  router.push("/");
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Syne:wght@600;700;800&family=DM+Sans:wght@300;400;500&display=swap");

/* ── Layout base ─────────────────────────────────── */
.app-layout {
  display: flex;
  min-height: 100vh;
  background:
    radial-gradient(
      circle at top left,
      rgba(249, 168, 212, 0.08),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(234, 215, 161, 0.05),
      transparent 28%
    ),
    linear-gradient(160deg, #070810 0%, #05060b 100%);
  font-family: "DM Sans", sans-serif;
  color: #fff;
}

/* ── Variables por rol ───────────────────────────── */
.theme-usuario {
  --accent: #f9a8d4;
  --accent-dim: rgba(249, 168, 212, 0.12);
  --accent-mid: rgba(249, 168, 212, 0.25);
}
.theme-empleado {
  --accent: #f9a8d4;
  --accent-dim: rgba(249, 168, 212, 0.12);
  --accent-mid: rgba(249, 168, 212, 0.25);
}
.theme-admin {
  --accent: #f9a8d4;
  --accent-dim: rgba(249, 168, 212, 0.12);
  --accent-mid: rgba(249, 168, 212, 0.25);
}

/* ── Sidebar ─────────────────────────────────────── */
.sidebar {
  width: 220px;
  min-width: 220px;
  background: linear-gradient(
    180deg,
    rgba(12, 13, 21, 0.94) 0%,
    rgba(8, 9, 15, 0.98) 100%
  );
  border-right: 1px solid rgba(249, 168, 212, 0.08);
  box-shadow:
    inset -1px 0 0 rgba(255, 255, 255, 0.03),
    18px 0 50px rgba(0, 0, 0, 0.24);
  display: flex;
  flex-direction: column;
  transition:
    width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  position: relative;
}

.sidebar::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(circle at top, rgba(249, 168, 212, 0.12), transparent 32%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.02), transparent 16%);
  opacity: 0.85;
}

.sidebar.collapsed {
  width: 76px;
  min-width: 76px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 5.2rem;
  padding: 0 1rem;
  border-bottom: 1px solid rgba(249, 168, 212, 0.08);
  position: relative;
  z-index: 1;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  overflow: hidden;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 168, 212, 0.08);
}

.brand-icon {
  width: 2rem;
  height: 2rem;
  display: grid;
  place-items: center;
  border-radius: 999px;
  font-size: 1rem;
  color: #f6e7bc;
  background: linear-gradient(
    135deg,
    rgba(249, 168, 212, 0.24),
    rgba(234, 215, 161, 0.12)
  );
  border: 1px solid rgba(234, 215, 161, 0.15);
  flex-shrink: 0;
  animation: pulse-icon 3s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}

.brand-text {
  font-family: "Cormorant Garamond", serif;
  font-weight: 600;
  font-style: italic;
  font-size: 1.35rem;
  white-space: nowrap;
  letter-spacing: 0.04em;
  background: linear-gradient(135deg, #f6e7bc 0%, #f9a8d4 55%, #fbcfe8 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.collapse-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 168, 212, 0.1);
  color: rgba(255, 255, 255, 0.55);
  cursor: pointer;
  padding: 0.35rem 0.55rem;
  border-radius: 999px;
  flex-shrink: 0;
  transition:
    color 0.2s,
    background 0.2s,
    border-color 0.2s,
    transform 0.2s;
}
.collapse-btn:hover {
  color: #f6e7bc;
  background: rgba(249, 168, 212, 0.08);
  border-color: rgba(234, 215, 161, 0.18);
  transform: translateY(-1px);
}

/* ── Nav items ───────────────────────────────────── */
.sidebar-nav {
  flex: 1;
  padding: 0.9rem 0.7rem;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  position: relative;
  z-index: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.82rem 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 0.88rem;
  border: 1px solid transparent;
  border-radius: 16px;
  transition:
    color 0.2s,
    background 0.2s,
    border-color 0.2s,
    transform 0.2s,
    box-shadow 0.2s;
  white-space: nowrap;
  overflow: hidden;
  animation: slideInLeft 0.4s ease both;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-16px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.nav-item:hover {
  color: rgba(255, 255, 255, 0.92);
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(249, 168, 212, 0.1);
  transform: translateX(2px);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.03);
}

.nav-item--active {
  color: #f6e7bc !important;
  background: linear-gradient(
    135deg,
    rgba(249, 168, 212, 0.16),
    rgba(234, 215, 161, 0.08)
  ) !important;
  border-color: rgba(234, 215, 161, 0.16) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.04),
    0 18px 32px rgba(0, 0, 0, 0.16) !important;
}

.nav-icon {
  font-size: 1rem;
  flex-shrink: 0;
  width: 1.95rem;
  height: 1.95rem;
  display: grid;
  place-items: center;
  text-align: center;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.04);
  color: currentColor;
  transition:
    transform 0.2s,
    background 0.2s,
    border-color 0.2s;
}

.nav-icon--svg :deep(svg) {
  width: 1.12rem;
  height: 1.12rem;
  stroke-width: 2.1;
}

.nav-item:hover .nav-icon {
  transform: scale(1.06);
  background: rgba(249, 168, 212, 0.08);
  border-color: rgba(249, 168, 212, 0.12);
}

.nav-label {
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.2s;
  letter-spacing: 0.01em;
}

/* ── Sidebar footer ──────────────────────────────── */
.sidebar-footer {
  padding: 0.85rem 0.7rem 1rem;
  border-top: 1px solid rgba(249, 168, 212, 0.08);
  position: relative;
  z-index: 1;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.78rem 0.95rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 168, 212, 0.08);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  font-size: 0.85rem;
  font-family: "DM Sans", sans-serif;
  width: 100%;
  transition:
    color 0.2s,
    background 0.2s,
    border-color 0.2s,
    transform 0.2s;
  white-space: nowrap;
  overflow: hidden;
}
.btn-logout:hover {
  color: #f6e7bc;
  background: rgba(255, 107, 107, 0.08);
  border-color: rgba(255, 107, 107, 0.18);
  transform: translateX(2px);
}

/* Ocultar labels colapsado */
.collapsed .nav-label,
.collapsed .brand-text {
  display: none;
}

.collapsed .sidebar-brand {
  justify-content: center;
}

.collapsed .sidebar-header,
.collapsed .sidebar-nav,
.collapsed .sidebar-footer {
  padding-left: 0.55rem;
  padding-right: 0.55rem;
}

.collapsed .nav-item,
.collapsed .btn-logout {
  justify-content: center;
  padding-left: 0;
  padding-right: 0;
}

.collapsed .nav-icon {
  margin: 0;
}

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
  min-height: 5.2rem;
  padding: 0 1rem;
  border-bottom: 1px solid rgba(249, 168, 212, 0.08);
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.04),
      rgba(255, 255, 255, 0.01)
    ),
    rgba(6, 8, 14, 0.7);
  backdrop-filter: blur(16px);
  position: sticky;
  top: 0;
  z-index: 10;
  animation: slideDown 0.4s ease both;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-title {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  border: 1px solid rgba(234, 215, 161, 0.12);
  background: rgba(255, 255, 255, 0.03);
  font-family: "Cormorant Garamond", serif;
  font-weight: 600;
  font-size: 1.05rem;
  color: #f8f5ee;
  letter-spacing: 0.02em;
}

.top-bar-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.current-time {
  font-size: 0.82rem;
  color: rgba(245, 208, 254, 0.52);
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  border: 1px solid rgba(249, 168, 212, 0.08);
  background: rgba(255, 255, 255, 0.03);
}

/* ── Perfil btn ──────────────────────────────────── */
.perfil-wrapper {
  position: relative;
}

.perfil-btn {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 168, 212, 0.08);
  cursor: pointer;
  padding: 0.35rem 0.45rem 0.35rem 0.35rem;
  border-radius: 999px;
  transition:
    background 0.2s,
    border-color 0.2s,
    transform 0.2s;
}

.perfil-btn:hover {
  background: rgba(249, 168, 212, 0.08);
  border-color: rgba(234, 215, 161, 0.16);
  transform: translateY(-1px);
}

.perfil-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.72rem;
  font-weight: 700;
  border: 2px solid var(--accent);
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}

.perfil-btn:hover .perfil-avatar {
  transform: scale(1.08);
  box-shadow: 0 0 14px rgba(249, 168, 212, 0.32);
}

.avatar-usuario,
.avatar-empleado,
.avatar-admin {
  background: rgba(249, 168, 212, 0.15);
  color: #f9a8d4;
}

.perfil-chevron {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.52);
  transition: transform 0.25s;
  padding-right: 0.15rem;
}

.perfil-chevron.rotado {
  transform: rotate(180deg);
}

/* ── Dropdown perfil ─────────────────────────────── */
.perfil-dropdown {
  position: absolute;
  top: calc(100% + 0.6rem);
  right: 0;
  width: 240px;
  background: linear-gradient(
    180deg,
    rgba(18, 19, 27, 0.98),
    rgba(8, 9, 15, 0.98)
  );
  border: 1px solid rgba(234, 215, 161, 0.12);
  border-radius: 18px;
  padding: 0.55rem;
  box-shadow:
    0 22px 50px rgba(0, 0, 0, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.04);
  z-index: 100;
}

.dropdown-header {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 0.75rem 0.75rem;
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
  background: rgba(249, 168, 212, 0.15);
  color: #f9a8d4;
  border: 1px solid rgba(234, 215, 161, 0.18);
  flex-shrink: 0;
}

.dropdown-nombre {
  font-size: 0.85rem;
  font-weight: 600;
  color: #f8f5ee;
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
  background: rgba(234, 215, 161, 0.12);
  color: #f6e7bc;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.06);
  margin: 0.3rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.62rem 0.75rem;
  color: rgba(255, 255, 255, 0.68);
  text-decoration: none;
  font-size: 0.82rem;
  border-radius: 8px;
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  transition:
    background 0.15s,
    color 0.15s;
  text-align: left;
}

.dropdown-item:hover {
  background: rgba(249, 168, 212, 0.08);
  color: #f8f5ee;
}

.logout-item:hover {
  background: rgba(255, 100, 100, 0.08);
  color: #ff6b6b;
}

/* ── Transición dropdown ─────────────────────────── */
.dropdown-enter-active,
.dropdown-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.97);
}

/* ── Transición de página ────────────────────────── */
.page-enter-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.page-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
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
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  overflow-y: auto;
}
</style>
