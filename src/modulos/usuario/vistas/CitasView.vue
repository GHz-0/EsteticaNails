<template>
  <div class="citas-container">
    <div class="citas-content">
      <h2>Mis Citas</h2>

      <!-- Formulario de nueva cita -->
      <div class="nueva-cita-section">
        <h3>Agendar Nueva Cita</h3>
        <form @submit.prevent="crearNuevaCita" class="cita-form">
          <div class="form-group">
            <label>Servicio *</label>
            <select v-model="nuevaCita.servicioId" required>
              <option value="">Selecciona un servicio</option>
              <option
                v-for="servicio in servicios"
                :key="servicio.id"
                :value="servicio.id"
              >
                {{ servicio.nombre }} - ${{ servicio.precio }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Fecha *</label>
            <input v-model="nuevaCita.fecha" type="date" required />
          </div>

          <div class="form-group">
            <label>Hora *</label>
            <input v-model="nuevaCita.hora" type="time" required />
          </div>

          <div class="form-group">
            <label>Notas</label>
            <textarea
              v-model="nuevaCita.notas"
              placeholder="Agrega cualquier nota especial..."
            ></textarea>
          </div>

          <button type="submit" class="btn-enviar" :disabled="enviando">
            {{ enviando ? "Creando..." : "Agendar Cita" }}
          </button>
          <p v-if="errorCita" class="error">{{ errorCita }}</p>
          <p v-if="exitoCita" class="exito">¡Cita creada exitosamente!</p>
        </form>
      </div>

      <!-- Lista de citas -->
      <div class="citas-list-section">
        <h3>Tus Citas</h3>

        <div v-if="cargando" class="loading">
          <p>Cargando citas...</p>
        </div>

        <div v-else-if="misCitas.length === 0" class="empty">
          <p>No tienes citas agendadas</p>
        </div>

        <div v-else class="citas-list">
          <div
            v-for="cita in misCitas"
            :key="cita.id"
            class="cita-item"
            :class="cita.estado"
          >
            <div class="cita-info">
              <h4>{{ cita.servicio?.nombre || "Servicio desconocido" }}</h4>
              <p class="fecha">📅 {{ formatearFecha(cita.fecha) }}</p>
              <p class="hora">🕐 {{ cita.hora }}</p>
              <p v-if="cita.notas" class="notas">{{ cita.notas }}</p>
            </div>
            <div class="cita-status">
              <span class="estado-badge" :class="cita.estado">{{
                cita.estado
              }}</span>
              <button
                v-if="cita.estado !== 'cancelada'"
                @click="cancelarCita(cita.id)"
                class="btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { obtenerServicios } from "@/nucleo/firebase/servicios.js";
import {
  obtenerMisCitas,
  crearCita,
  cancelarCita as cancelarCitaFirebase,
} from "@/nucleo/firebase/citas.js";
import { useAuthStore } from "@/nucleo/estado/auth.js";

const auth = useAuthStore();
const servicios = ref([]);
const misCitas = ref([]);
const cargando = ref(true);
const enviando = ref(false);
const errorCita = ref("");
const exitoCita = ref("");

const nuevaCita = ref({
  servicioId: "",
  fecha: "",
  hora: "",
  notas: "",
});

onMounted(async () => {
  try {
    // Cargar servicios
    servicios.value = await obtenerServicios();

    // Cargar mis citas
    cargarCitas();

    // Si hay un servicio seleccionado en sessionStorage, usarlo
    const servicioSeleccionado = sessionStorage.getItem("servicioSeleccionado");
    if (servicioSeleccionado) {
      const servicio = JSON.parse(servicioSeleccionado);
      nuevaCita.value.servicioId = servicio.id;
      sessionStorage.removeItem("servicioSeleccionado");
    }
  } catch (error) {
    console.error("Error cargando datos:", error);
  }
});

const cargarCitas = async () => {
  cargando.value = true;
  try {
    const citas = await obtenerMisCitas();
    // Enriquecer citas con info del servicio
    misCitas.value = citas.map((cita) => ({
      ...cita,
      servicio: servicios.value.find((s) => s.id === cita.servicioId),
    }));
  } catch (error) {
    console.error("Error cargando citas:", error);
  } finally {
    cargando.value = false;
  }
};

const crearNuevaCita = async () => {
  errorCita.value = "";
  exitoCita.value = "";

  if (
    !nuevaCita.value.servicioId ||
    !nuevaCita.value.fecha ||
    !nuevaCita.value.hora
  ) {
    errorCita.value = "Completa todos los campos requeridos";
    return;
  }

  enviando.value = true;
  try {
    const fechaHora = new Date(
      `${nuevaCita.value.fecha}T${nuevaCita.value.hora}`,
    );

    await crearCita({
      servicioId: nuevaCita.value.servicioId,
      fecha: fechaHora,
      hora: nuevaCita.value.hora,
      notas: nuevaCita.value.notas,
    });

    exitoCita.value = "¡Cita creada exitosamente!";

    // Limpiar formulario
    nuevaCita.value = {
      servicioId: "",
      fecha: "",
      hora: "",
      notas: "",
    };

    // Recargar citas
    await cargarCitas();

    // Limpiar mensaje de éxito después de 3 segundos
    setTimeout(() => {
      exitoCita.value = "";
    }, 3000);
  } catch (error) {
    errorCita.value = "Error al crear la cita: " + error.message;
  } finally {
    enviando.value = false;
  }
};

const cancelarCita = async (citaId) => {
  if (confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
    try {
      await cancelarCitaFirebase(citaId, "Cancelada por el usuario");
      await cargarCitas();
    } catch (error) {
      console.error("Error cancelando cita:", error);
    }
  }
};

const formatearFecha = (fecha) => {
  if (!fecha) return "";
  const date = fecha instanceof Date ? fecha : new Date(fecha);
  const opciones = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("es-MX", opciones);
};
</script>

<style scoped>
.citas-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.citas-content h2 {
  font-family: "Syne", sans-serif;
  font-size: 2rem;
  color: #fff;
  margin-bottom: 2rem;
}

h3 {
  font-family: "Syne", sans-serif;
  font-size: 1.3rem;
  color: #fff;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

/* Sección nueva cita */
.nueva-cita-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.cita-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 0.75rem;
  border-radius: 8px;
  font-family: inherit;
  font-size: 0.95rem;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #ec64b0;
  background: rgba(255, 255, 255, 0.15);
}

.form-group textarea {
  grid-column: 1 / -1;
  min-height: 80px;
  resize: vertical;
}

.btn-enviar {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #ec64b0, #d946ef);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-family: "Syne", sans-serif;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-enviar:hover:not(:disabled) {
  transform: scale(1.02);
  box-shadow: 0 0 20px rgba(236, 100, 176, 0.4);
}

.btn-enviar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  grid-column: 1 / -1;
  color: #ff6b6b;
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
}

.exito {
  grid-column: 1 / -1;
  color: #51cf66;
  font-size: 0.9rem;
  margin: 0.5rem 0 0 0;
}

/* Lista de citas */
.citas-list-section {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(10px);
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.6);
}

.citas-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.cita-item {
  background: rgba(255, 255, 255, 0.05);
  border-left: 4px solid #ec64b0;
  border-radius: 8px;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.cita-item.cancelada {
  opacity: 0.6;
  border-left-color: #999;
}

.cita-item:hover:not(.cancelada) {
  background: rgba(255, 255, 255, 0.1);
}

.cita-info h4 {
  margin: 0 0 0.5rem 0;
  color: #fff;
  font-family: "Syne", sans-serif;
}

.cita-info p {
  margin: 0.25rem 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.notas {
  color: rgba(255, 255, 255, 0.6);
  font-style: italic;
  margin-top: 0.5rem;
}

.cita-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.estado-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
  background: rgba(236, 100, 176, 0.2);
  color: #ec64b0;
}

.estado-badge.cancelada {
  background: rgba(200, 50, 50, 0.2);
  color: #ff6b6b;
}

.btn-cancelar {
  background: transparent;
  color: #ff6b6b;
  border: 1px solid #ff6b6b;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancelar:hover {
  background: rgba(255, 107, 107, 0.1);
}
</style>
