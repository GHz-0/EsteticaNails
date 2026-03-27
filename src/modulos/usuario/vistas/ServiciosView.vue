<template>
  <div class="servicios-container">
    <h2>Nuestros Servicios</h2>

    <div v-if="cargando" class="loading">
      <p>Cargando servicios...</p>
    </div>

    <div v-else-if="servicios.length === 0" class="empty">
      <p>No hay servicios disponibles</p>
    </div>

    <div v-else class="servicios-grid">
      <div
        v-for="servicio in servicios"
        :key="servicio.id"
        class="servicio-card"
      >
        <div class="servicio-header">
          <h3>{{ servicio.nombre }}</h3>
          <span class="categoria">{{ servicio.categoria }}</span>
        </div>
        <p class="descripcion">{{ servicio.descripcion }}</p>
        <div class="servicio-footer">
          <div class="info">
            <span class="duracion">⏱️ {{ servicio.duracion }} min</span>
            <span class="precio">${{ servicio.precio }}</span>
          </div>
          <button @click="agendar(servicio)" class="btn-agendar">
            Agendar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { obtenerServicios } from "@/nucleo/firebase/servicios.js";
import { useRouter } from "vue-router";

const servicios = ref([]);
const cargando = ref(true);
const router = useRouter();

onMounted(async () => {
  try {
    servicios.value = await obtenerServicios();
  } catch (error) {
    console.error("Error cargando servicios:", error);
  } finally {
    cargando.value = false;
  }
});

const agendar = (servicio) => {
  // Guardar servicio seleccionado en sessionStorage para usar en CitasView
  sessionStorage.setItem("servicioSeleccionado", JSON.stringify(servicio));
  router.push("/citas");
};
</script>

<style scoped>
.servicios-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  font-family: "Syne", sans-serif;
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #fff;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.servicio-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.servicio-card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(236, 100, 176, 0.5);
  transform: translateY(-4px);
}

.servicio-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 0.75rem;
}

.servicio-header h3 {
  font-family: "Syne", sans-serif;
  font-size: 1.2rem;
  color: #fff;
  margin: 0;
}

.categoria {
  background: linear-gradient(
    135deg,
    rgba(236, 100, 176, 0.3),
    rgba(217, 70, 239, 0.3)
  );
  color: #ec64b0;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 500;
}

.descripcion {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0.75rem 0;
  flex: 1;
}

.servicio-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.duracion {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.precio {
  font-family: "Syne", sans-serif;
  font-size: 1.3rem;
  color: #ec64b0;
  font-weight: 600;
}

.btn-agendar {
  background: linear-gradient(135deg, #ec64b0, #d946ef);
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: "Syne", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-agendar:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(236, 100, 176, 0.4);
}
</style>
