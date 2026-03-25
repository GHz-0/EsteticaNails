<template>
  <div class="login-page">
    <!-- Fondo animado -->
    <div class="bg-canvas">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="petals">
        <span v-for="i in 12" :key="i" class="petal" :style="petalStyle(i)"
          >🌸</span
        >
      </div>
    </div>

    <!-- Panel izquierdo — identidad del salón -->
    <div class="panel-left">
      <div class="salon-identity">
        <div class="salon-logo">◈</div>
        <h1 class="salon-nombre">Nails Bere</h1>
        <p class="salon-tagline">Belleza que inspira, cuidado que transforma</p>
        <div class="salon-servicios">
          <span v-for="s in servicios" :key="s" class="servicio-chip">{{
            s
          }}</span>
        </div>
      </div>
    </div>

    <!-- Panel derecho — formulario -->
    <div class="panel-right">
      <div class="login-card" :class="{ loaded: cardCargada }">
        <!-- Header -->
        <div class="card-header">
          <div class="card-logo">◈</div>
          <h2 class="card-titulo">Bienvenida</h2>
          <p class="card-sub">Inicia sesión en tu cuenta</p>
        </div>

        <!-- Formulario -->
        <form class="login-form" @submit.prevent="handleLogin">
          <!-- Email -->
          <div
            class="field-wrap"
            :class="{ focused: foco === 'email', filled: form.email }"
          >
            <label class="field-label">Correo electrónico</label>
            <div class="field-inner">
              <span class="field-icon">✉</span>
              <input
                v-model="form.email"
                type="email"
                autocomplete="email"
                required
                @focus="foco = 'email'"
                @blur="foco = ''"
              />
            </div>
          </div>

          <!-- Password -->
          <div
            class="field-wrap"
            :class="{ focused: foco === 'password', filled: form.password }"
          >
            <label class="field-label">Contraseña</label>
            <div class="field-inner">
              <span class="field-icon">🔒</span>
              <input
                v-model="form.password"
                :type="mostrarPassword ? 'text' : 'password'"
                autocomplete="current-password"
                required
                @focus="foco = 'password'"
                @blur="foco = ''"
              />
              <button
                type="button"
                class="toggle-pass"
                @click="mostrarPassword = !mostrarPassword"
              >
                {{ mostrarPassword ? "🙈" : "👁" }}
              </button>
            </div>
          </div>

          <!-- Error -->
          <Transition name="shake">
            <div v-if="auth.error" class="error-msg">⚠ {{ auth.error }}</div>
          </Transition>

          <!-- Botón login -->
          <button type="submit" class="btn-login" :disabled="auth.cargando">
            <span v-if="auth.cargando" class="spinner"></span>
            <span v-else>Iniciar sesión</span>
          </button>
        </form>

        <!-- Divider -->
        <div class="divider"><span>o acceso rápido demo</span></div>

        <!-- Botones demo -->
        <div class="demo-buttons">
          <button
            v-for="demo in demoUsers"
            :key="demo.rol"
            class="demo-btn"
            :class="`demo-${demo.rol}`"
            @click="loginDemo(demo)"
          >
            <span class="demo-icon">{{ demo.icono }}</span>
            <span class="demo-label">{{ demo.etiqueta }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/nucleo/estado/auth";
import { getRutaDashboard } from "@/nucleo/router/index";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const form = reactive({ email: "", password: "" });
const foco = ref("");
const mostrarPassword = ref(false);
const cardCargada = ref(false);

const servicios = ["✂️ Corte", "💅 Uñas", "🧖 Facial", "💄 Maquillaje"];

const demoUsers = [
  {
    rol: "usuario",
    etiqueta: "Cliente",
    icono: "👤",
    email: "usuario@demo.com",
    password: "123456",
  },
  {
    rol: "empleado",
    etiqueta: "Empleada",
    icono: "💇",
    email: "empleado@demo.com",
    password: "123456",
  },
  {
    rol: "admin",
    etiqueta: "Administrador",
    icono: "🔑",
    email: "admin@demo.com",
    password: "123456",
  },
];

onMounted(() => {
  setTimeout(() => {
    cardCargada.value = true;
  }, 100);
});

// Estilo aleatorio para pétalos
function petalStyle(i) {
  const left = ((i - 1) * 8.5) % 100;
  const delay = (i * 0.7) % 6;
  const dur = 6 + (i % 4);
  const size = 0.8 + (i % 3) * 0.3;
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`,
    fontSize: `${size}rem`,
  };
}

async function handleLogin() {
  auth.limpiarError();
  const resultado = await auth.login(form.email, form.password);
  if (resultado.ok) {
    const redirect = route.query.redirect || getRutaDashboard(resultado.rol);
    router.push(redirect);
  }
}

async function loginDemo(demo) {
  form.email = demo.email;
  form.password = demo.password;
  await handleLogin();
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500&display=swap");

/* ── Base ────────────────────────────────────────── */
.login-page {
  min-height: 100vh;
  display: flex;
  background: #1a0a12;
  font-family: "DM Sans", sans-serif;
  color: #fff;
  overflow: hidden;
  position: relative;
}

/* ── Fondo animado ───────────────────────────────── */
.bg-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  animation: blobFloat 8s ease-in-out infinite;
}

.blob-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #f9a8d4 0%, #be185d 100%);
  opacity: 0.18;
  top: -150px;
  left: -100px;
  animation-delay: 0s;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #fbcfe8 0%, #f472b6 100%);
  opacity: 0.14;
  bottom: -100px;
  right: -80px;
  animation-delay: 3s;
}

.blob-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #fce7f3 0%, #ec4899 100%);
  opacity: 0.1;
  top: 40%;
  left: 45%;
  animation-delay: 1.5s;
}

@keyframes blobFloat {
  0%,
  100% {
    transform: scale(1) translate(0, 0);
  }
  33% {
    transform: scale(1.06) translate(20px, -20px);
  }
  66% {
    transform: scale(0.95) translate(-15px, 15px);
  }
}

/* Pétalos */
.petals {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.petal {
  position: absolute;
  top: -40px;
  opacity: 0.25;
  animation: petalFall linear infinite;
  user-select: none;
}

@keyframes petalFall {
  0% {
    transform: translateY(0) rotate(0deg) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.15;
  }
  100% {
    transform: translateY(110vh) rotate(360deg) translateX(40px);
    opacity: 0;
  }
}

/* ── Panel izquierdo ─────────────────────────────── */
.panel-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  position: relative;
  z-index: 1;
}

.salon-identity {
  text-align: center;
  animation: fadeSlideUp 0.8s ease both;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.salon-logo {
  font-size: 3.5rem;
  color: #f9a8d4;
  line-height: 1;
  margin-bottom: 1rem;
  animation: pulse-icon 3s ease-in-out infinite;
}

@keyframes pulse-icon {
  0%,
  100% {
    filter: drop-shadow(0 0 8px rgba(249, 168, 212, 0.5));
  }
  50% {
    filter: drop-shadow(0 0 20px rgba(249, 168, 212, 0.9));
  }
}

.salon-nombre {
  font-family: "Cormorant Garamond", serif;
  font-style: italic;
  font-size: 4rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
  line-height: 1;
  background: linear-gradient(135deg, #fce7f3, #f9a8d4, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: 0.02em;
}

.salon-tagline {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.45);
  margin: 0.8rem 0 2rem;
  font-style: italic;
  letter-spacing: 0.02em;
}

.salon-servicios {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  justify-content: center;
}

.servicio-chip {
  background: rgba(249, 168, 212, 0.1);
  border: 1px solid rgba(249, 168, 212, 0.25);
  color: rgba(255, 255, 255, 0.65);
  padding: 0.35rem 0.9rem;
  border-radius: 20px;
  font-size: 0.82rem;
  animation: fadeSlideUp 0.8s ease both;
}

.servicio-chip:nth-child(1) {
  animation-delay: 0.1s;
}
.servicio-chip:nth-child(2) {
  animation-delay: 0.2s;
}
.servicio-chip:nth-child(3) {
  animation-delay: 0.3s;
}
.servicio-chip:nth-child(4) {
  animation-delay: 0.4s;
}

/* ── Panel derecho ───────────────────────────────── */
.panel-right {
  width: 460px;
  min-width: 460px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.025);
  border-left: 1px solid rgba(249, 168, 212, 0.12);
  backdrop-filter: blur(20px);
}

/* ── Card ────────────────────────────────────────── */
.login-card {
  width: 100%;
  max-width: 380px;
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.6s ease,
    transform 0.6s ease;
}

.login-card.loaded {
  opacity: 1;
  transform: translateY(0);
}

/* Header de la card */
.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-logo {
  font-size: 2rem;
  color: #f9a8d4;
  margin-bottom: 0.8rem;
  display: block;
}

.card-titulo {
  font-family: "Cormorant Garamond", serif;
  font-style: italic;
  font-size: 2rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.3rem;
}

.card-sub {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

/* ── Form fields ─────────────────────────────────── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  margin-bottom: 1.5rem;
}

.field-wrap {
  position: relative;
}

.field-label {
  display: block;
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.35);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.4rem;
  transition: color 0.2s;
}

.field-wrap.focused .field-label {
  color: #f9a8d4;
}

.field-inner {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0 1rem;
  transition:
    border-color 0.25s,
    background 0.25s,
    box-shadow 0.25s;
}

.field-wrap.focused .field-inner {
  border-color: rgba(249, 168, 212, 0.6);
  background: rgba(249, 168, 212, 0.07);
  box-shadow: 0 0 0 3px rgba(249, 168, 212, 0.1);
}

.field-icon {
  font-size: 0.9rem;
  opacity: 0.4;
  flex-shrink: 0;
  margin-right: 0.6rem;
  transition: opacity 0.2s;
}

.field-wrap.focused .field-icon {
  opacity: 0.8;
}

.field-inner input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: #fff;
  font-size: 0.9rem;
  font-family: "DM Sans", sans-serif;
  padding: 0.75rem 0;
}

.field-inner input::placeholder {
  color: rgba(255, 255, 255, 0.2);
}

.toggle-pass {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0.2rem;
  opacity: 0.5;
  transition: opacity 0.2s;
  flex-shrink: 0;
}
.toggle-pass:hover {
  opacity: 1;
}

/* Error */
.error-msg {
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.25);
  border-radius: 10px;
  padding: 0.65rem 1rem;
  color: #fca5a5;
  font-size: 0.82rem;
}

/* Animación shake para error */
.shake-enter-active {
  animation: shake 0.4s ease;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8px);
  }
  40% {
    transform: translateX(8px);
  }
  60% {
    transform: translateX(-5px);
  }
  80% {
    transform: translateX(5px);
  }
}

/* Botón login */
.btn-login {
  background: linear-gradient(135deg, #f472b6, #ec4899);
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 0.9rem;
  font-family: "Cormorant Garamond", serif;
  font-size: 1.05rem;
  font-style: italic;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.04em;
  transition:
    opacity 0.2s,
    transform 0.15s,
    box-shadow 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.4rem;
  box-shadow: 0 4px 20px rgba(236, 72, 153, 0.3);
}

.btn-login:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(236, 72, 153, 0.45);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}
.btn-login:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* ── Divider ─────────────────────────────────────── */
.divider {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: rgba(255, 255, 255, 0.2);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.divider::before,
.divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
}

/* ── Demo buttons ────────────────────────────────── */
.demo-buttons {
  display: flex;
  gap: 0.6rem;
}

.demo-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.7rem 0.5rem;
  border-radius: 12px;
  border: 1px solid;
  cursor: pointer;
  transition: all 0.2s;
  font-family: "DM Sans", sans-serif;
}

.demo-icon {
  font-size: 1.2rem;
}
.demo-label {
  font-size: 0.7rem;
  font-weight: 500;
}

.demo-usuario {
  background: rgba(249, 168, 212, 0.08);
  border-color: rgba(249, 168, 212, 0.25);
  color: #f9a8d4;
}
.demo-usuario:hover {
  background: rgba(249, 168, 212, 0.18);
  transform: translateY(-2px);
}

.demo-empleado {
  background: rgba(253, 186, 116, 0.08);
  border-color: rgba(253, 186, 116, 0.25);
  color: #fdba74;
}
.demo-empleado:hover {
  background: rgba(253, 186, 116, 0.18);
  transform: translateY(-2px);
}

.demo-admin {
  background: rgba(196, 181, 253, 0.08);
  border-color: rgba(196, 181, 253, 0.25);
  color: #c4b5fd;
}
.demo-admin:hover {
  background: rgba(196, 181, 253, 0.18);
  transform: translateY(-2px);
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 768px) {
  .panel-left {
    display: none;
  }
  .panel-right {
    width: 100%;
    min-width: 100%;
    border-left: none;
  }
}
</style>
