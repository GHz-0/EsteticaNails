<template>
  <div class="login-page">
    <div class="bg-canvas" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="grid-lines"></div>
    </div>

    <section class="brand-panel" aria-label="Nails Bere">
      <RouterLink to="/" class="back-link">Volver al inicio</RouterLink>

      <div class="brand-content">
        <p class="eyebrow">Salón de belleza</p>
        <h1>Nails Bere</h1>
        <p class="brand-copy">
          Agenda, consulta y administra tus citas en un espacio hecho para cuidar
          cada detalle de tu experiencia.
        </p>

        <div class="service-row">
          <span v-for="s in servicios" :key="s">{{ s }}</span>
        </div>
      </div>
    </section>

    <section class="form-panel" aria-label="Iniciar sesión">
      <div class="login-card" :class="{ loaded: cardCargada }">
        <div class="card-header">
          <p class="eyebrow">Acceso seguro</p>
          <h2>Bienvenida</h2>
          <p>Inicia sesión para continuar con tu cuenta.</p>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <label
            class="field-wrap"
            :class="{ focused: foco === 'email', filled: form.email }"
          >
            <span class="field-label">Correo electrónico</span>
            <span class="field-inner">
              <span class="field-icon">@</span>
              <input
                v-model="form.email"
                type="email"
                autocomplete="email"
                placeholder="tu@email.com"
                required
                @focus="foco = 'email'"
                @blur="foco = ''"
              />
            </span>
          </label>

          <label
            class="field-wrap"
            :class="{ focused: foco === 'password', filled: form.password }"
          >
            <span class="field-label">Contraseña</span>
            <span class="field-inner">
              <span class="field-icon">*</span>
              <input
                v-model="form.password"
                :type="mostrarPassword ? 'text' : 'password'"
                autocomplete="current-password"
                placeholder="Tu contraseña"
                required
                @focus="foco = 'password'"
                @blur="foco = ''"
              />
              <button
                type="button"
                class="toggle-pass"
                @click="mostrarPassword = !mostrarPassword"
                :aria-label="mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'"
                title="{{ mostrarPassword ? 'Ocultar' : 'Ver' }}"
              >
                <svg v-if="!mostrarPassword" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a21.86 21.86 0 0 1 5.06-5.94"></path>
                  <path d="M1 1l22 22"></path>
                  <path d="M9.88 9.88A3 3 0 0 0 14.12 14.12"></path>
                </svg>
              </button>
            </span>
          </label>

          <Transition name="shake">
            <div v-if="auth.error" class="error-msg">{{ auth.error }}</div>
          </Transition>

          <button type="submit" class="btn-login" :disabled="auth.cargando">
            <span v-if="auth.cargando" class="spinner"></span>
            <span v-else>Iniciar sesión</span>
          </button>
        </form>

        <div class="registro-link">
          <span>¿Aún no tienes cuenta?</span>
          <RouterLink to="/registro">Crear cuenta</RouterLink>
        </div>
      </div>
    </section>
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

const servicios = ["Manicure", "Color", "Facial", "Maquillaje"];

onMounted(() => {
  setTimeout(() => {
    cardCargada.value = true;
  }, 100);
});

async function handleLogin() {
  auth.limpiarError();

  if (!form.email.trim() || !form.password.trim()) {
    auth.error = "Completa email y contraseña";
    return;
  }

  const resultado = await auth.login(form.email, form.password);
  if (resultado.ok) {
    const redirect = route.query.redirect || getRutaDashboard(resultado.rol);
    router.push(redirect);
  }
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Cabinet+Grotesk:wght@300;400;500;700;800&display=swap");

.login-page {
  --c-bg: #100b0f;
  --c-panel: rgba(255,255,255,0.045);
  --c-card: rgba(25,18,24,0.88);
  --c-border: rgba(236,171,218,0.20);
  --c-border-soft: rgba(255,255,255,0.09);
  --c-rose: #f0a7d8;
  --c-rose-d: #c95aa8;
  --c-gold: #f5cf92;
  --c-text: #fff7fb;
  --c-muted: rgba(255,247,251,0.64);
  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Cabinet Grotesk", "DM Sans", sans-serif;

  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(380px, 520px);
  background:
    radial-gradient(circle at top left, rgba(122,47,103,0.32), transparent 34rem),
    linear-gradient(180deg, #130d12 0%, #100b0f 54%, #090608 100%);
  color: var(--c-text);
  font-family: var(--font-body);
  overflow: hidden;
  position: relative;
}

.bg-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.28;
}

.blob-1 {
  width: 520px;
  height: 520px;
  left: -160px;
  top: -180px;
  background: #963781;
}

.blob-2 {
  width: 420px;
  height: 420px;
  right: -120px;
  bottom: -140px;
  background: #c95aa8;
  opacity: 0.18;
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(236,171,218,0.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(236,171,218,0.025) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%);
}

.brand-panel,
.form-panel {
  position: relative;
  z-index: 1;
}

.brand-panel {
  display: flex;
  align-items: center;
  padding: clamp(2rem, 6vw, 5rem);
}

.back-link {
  position: absolute;
  top: 1.5rem;
  left: clamp(1.5rem, 4vw, 3rem);
  color: var(--c-muted);
  text-decoration: none;
  font-size: 0.88rem;
  font-weight: 700;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--c-text);
}

.brand-content {
  max-width: 560px;
  animation: fadeUp 0.7s ease both;
}

.brand-mark,
.card-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, #ef9bd4 0%, #c95aa8 55%, #8f347c 100%);
  border: 1px solid rgba(255,180,230,0.30);
  box-shadow: 0 14px 30px rgba(180,60,140,0.22);
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
}

.eyebrow {
  margin: 1.4rem 0 0.45rem;
  color: var(--c-gold);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.brand-content h1 {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(3.4rem, 7vw, 6rem);
  line-height: 0.95;
  font-weight: 700;
}

.brand-copy {
  max-width: 440px;
  margin: 1.2rem 0 1.8rem;
  color: var(--c-muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

.service-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.65rem;
}

.service-row span {
  min-height: 36px;
  display: inline-flex;
  align-items: center;
  padding: 0 0.9rem;
  border: 1px solid var(--c-border);
  border-radius: 999px;
  background: rgba(255,255,255,0.04);
  color: rgba(255,247,251,0.78);
  font-size: 0.84rem;
  font-weight: 700;
}

.form-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: clamp(1.25rem, 4vw, 2rem);
  border-left: 1px solid var(--c-border-soft);
  background: rgba(255,255,255,0.025);
  backdrop-filter: blur(18px);
}

.login-card {
  width: min(100%, 410px);
  padding: clamp(1.4rem, 4vw, 2rem);
  border: 1px solid var(--c-border);
  border-radius: 24px;
  background: var(--c-card);
  box-shadow: 0 28px 80px rgba(0,0,0,0.34);
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.55s ease, transform 0.55s ease;
}

.login-card.loaded {
  opacity: 1;
  transform: translateY(0);
}

.card-header {
  margin-bottom: 1.8rem;
}

.card-header .eyebrow {
  margin-top: 1rem;
}

.card-header h2 {
  margin: 0;
  font-family: var(--font-display);
  font-size: 2.35rem;
  line-height: 1;
}

.card-header p {
  margin: 0.7rem 0 0;
  color: var(--c-muted);
  line-height: 1.55;
}

.login-form {
  display: grid;
  gap: 1rem;
}

.field-wrap {
  display: grid;
  gap: 0.45rem;
}

.field-label {
  color: rgba(255,247,251,0.58);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: color 0.2s ease;
}

.field-wrap.focused .field-label {
  color: var(--c-rose);
}

.field-inner {
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0 0.9rem;
  border: 1px solid var(--c-border-soft);
  border-radius: 16px;
  background: rgba(12,8,12,0.76);
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
}

.field-wrap.focused .field-inner {
  border-color: rgba(236,171,218,0.44);
  background: rgba(255,255,255,0.055);
  box-shadow: 0 0 0 4px rgba(236,171,218,0.08);
}

.field-icon {
  width: 22px;
  color: var(--c-rose);
  font-weight: 900;
  text-align: center;
}

.field-inner input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--c-text);
  font: inherit;
  font-size: 0.95rem;
}

.field-inner input::placeholder {
  color: rgba(255,247,251,0.30);
}

.toggle-pass {
  border: 0;
  background: transparent;
  color: var(--c-muted);
  cursor: pointer;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 800;
  padding: 0.35rem 0;
  transition: color 0.2s ease;
}

.toggle-pass:hover {
  color: var(--c-text);
}

.error-msg {
  padding: 0.78rem 0.95rem;
  border: 1px solid rgba(248,113,113,0.26);
  border-radius: 14px;
  color: #fecaca;
  background: rgba(127,29,29,0.20);
  font-size: 0.86rem;
}

.btn-login {
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,180,230,0.30);
  border-radius: 16px;
  color: #fff;
  background: linear-gradient(135deg, #ef9bd4 0%, #c95aa8 55%, #8f347c 100%);
  box-shadow: 0 14px 30px rgba(180,60,140,0.24);
  cursor: pointer;
  font: inherit;
  font-weight: 900;
  margin-top: 0.2rem;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px rgba(180,60,140,0.32);
}

.btn-login:disabled {
  cursor: not-allowed;
  opacity: 0.58;
  box-shadow: none;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.registro-link {
  display: flex;
  justify-content: center;
  gap: 0.45rem;
  margin-top: 1.25rem;
  color: var(--c-muted);
  font-size: 0.9rem;
}

.registro-link a {
  color: var(--c-rose);
  text-decoration: none;
  font-weight: 900;
}

.registro-link a:hover {
  color: var(--c-text);
}

.shake-enter-active {
  animation: shake 0.35s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-6px); }
  50% { transform: translateX(6px); }
  75% { transform: translateX(-3px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(22px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 860px) {
  .login-page {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .brand-panel {
    min-height: 38vh;
    padding: 5rem 1.25rem 2rem;
    align-items: flex-end;
  }

  .brand-content h1 {
    font-size: clamp(3rem, 14vw, 4.4rem);
  }

  .brand-copy {
    margin-bottom: 1.2rem;
  }

  .form-panel {
    border-left: 0;
    align-items: flex-start;
    padding: 1rem 1rem 2rem;
  }
}

@media (max-width: 520px) {
  .service-row {
    display: none;
  }

  .registro-link {
    flex-direction: column;
    align-items: center;
  }
}
</style>
