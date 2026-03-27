<template>
  <div class="registro-page">
    <div class="registro-card">
      <h1>Crear cuenta</h1>
      <p class="sub">
        Regístrate para agendar y conocer promociones del salón.
      </p>

      <form @submit.prevent="registrar" class="form">
        <label>
          Nombre completo
          <input v-model="form.nombre" type="text" required />
        </label>

        <label>
          Correo electrónico
          <input v-model="form.email" type="email" required />
        </label>

        <label>
          Contraseña
          <input
            v-model="form.password"
            type="password"
            minlength="6"
            required
          />
        </label>

        <button type="submit" class="btn-principal" :disabled="auth.cargando">
          {{ auth.cargando ? "Creando cuenta..." : "Registrarme" }}
        </button>
      </form>

      <p v-if="auth.error" class="mensaje">{{ auth.error }}</p>
      <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>

      <div class="links">
        <RouterLink to="/login">Ya tengo cuenta</RouterLink>
        <RouterLink to="/">Volver al inicio</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/nucleo/estado/auth";
import { getRutaDashboard } from "@/nucleo/router";

const router = useRouter();
const auth = useAuthStore();

const form = reactive({
  nombre: "",
  email: "",
  password: "",
});

const mensaje = ref("");

async function registrar() {
  auth.limpiarError();
  const resultado = await auth.registrar({
    nombre: form.nombre,
    email: form.email,
    password: form.password,
  });

  if (!resultado.ok) {
    mensaje.value = resultado.mensaje;
    return;
  }

  mensaje.value = "Cuenta creada correctamente. Redirigiendo...";
  form.nombre = "";
  form.email = "";
  form.password = "";
  setTimeout(() => {
    router.push(getRutaDashboard(resultado.rol));
  }, 600);
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap");

.registro-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: radial-gradient(
    circle at 20% 20%,
    #331423 0%,
    #12090f 40%,
    #0a0a0f 100%
  );
  color: #fff;
  padding: 1rem;
  font-family: "DM Sans", sans-serif;
}

.registro-card {
  width: 100%;
  max-width: 430px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(249, 168, 212, 0.25);
  border-radius: 16px;
  padding: 1.2rem;
}

h1 {
  font-family: "Syne", sans-serif;
  margin: 0 0 0.4rem;
}

.sub {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.form {
  display: grid;
  gap: 0.8rem;
}

label {
  display: grid;
  gap: 0.35rem;
  font-size: 0.86rem;
  color: rgba(255, 255, 255, 0.86);
}

input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 10px;
  color: #fff;
  padding: 0.65rem 0.8rem;
}

.btn-principal {
  margin-top: 0.4rem;
  border: none;
  border-radius: 10px;
  padding: 0.72rem;
  background: linear-gradient(135deg, #f472b6, #ec4899);
  color: #fff;
  font-weight: 600;
  cursor: pointer;
}

.mensaje {
  margin-top: 0.9rem;
  font-size: 0.84rem;
  color: #fbcfe8;
}

.links {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
}

.links a {
  color: #f9a8d4;
  text-decoration: none;
  font-size: 0.84rem;
}
</style>
