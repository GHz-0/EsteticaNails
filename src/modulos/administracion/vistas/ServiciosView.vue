<template>
  <section class="servicios-admin">
    <header class="cabecera">
      <h2>Gestión de Servicios</h2>
      <p>Administra catálogo, precios y duración.</p>
    </header>

    <div class="grid">
      <article class="panel formulario-panel">
        <h3>{{ editandoId ? "Editar servicio" : "Nuevo servicio" }}</h3>

        <form class="formulario" @submit.prevent="guardarServicio">
          <label>
            Nombre
            <input
              v-model.trim="form.nombre"
              type="text"
              required
              maxlength="80"
            />
          </label>

          <label>
            Categoría
            <select v-model="form.categoria" required>
              <option value="manos">Manos</option>
              <option value="pies">Pies</option>
              <option value="diseño">Diseño</option>
              <option value="extensiones">Extensiones</option>
              <option value="otros">Otros</option>
            </select>
          </label>

          <label>
            Precio (MXN)
            <input
              v-model.number="form.precio"
              type="number"
              min="1"
              step="1"
              required
            />
          </label>

          <label>
            Duración (min)
            <input
              v-model.number="form.duracion"
              type="number"
              min="5"
              step="5"
              required
            />
          </label>

          <label class="full">
            Descripción
            <textarea
              v-model.trim="form.descripcion"
              rows="4"
              maxlength="280"
              required
            ></textarea>
          </label>

          <p v-if="error" class="mensaje error">{{ error }}</p>
          <p v-if="ok" class="mensaje ok">{{ ok }}</p>

          <div class="acciones">
            <button type="submit" class="btn principal" :disabled="guardando">
              {{
                guardando ? "Guardando..." : editandoId ? "Actualizar" : "Crear"
              }}
            </button>
            <button
              v-if="editandoId"
              type="button"
              class="btn secundario"
              :disabled="guardando"
              @click="cancelarEdicion"
            >
              Cancelar edición
            </button>
          </div>
        </form>
      </article>

      <article class="panel lista-panel">
        <div class="lista-header">
          <h3>Servicios registrados</h3>
          <button
            class="btn secundario"
            :disabled="cargando"
            @click="cargarServicios"
          >
            {{ cargando ? "Actualizando..." : "Refrescar" }}
          </button>
        </div>

        <p v-if="cargando" class="estado">Cargando servicios...</p>
        <p v-else-if="!servicios.length" class="estado">
          No hay servicios registrados.
        </p>

        <ul v-else class="lista">
          <li v-for="servicio in servicios" :key="servicio.id" class="item">
            <div class="info">
              <h4>{{ servicio.nombre }}</h4>
              <p>{{ servicio.descripcion }}</p>
              <div class="chips">
                <span class="chip">{{ servicio.categoria }}</span>
                <span class="chip">${{ servicio.precio }}</span>
                <span class="chip">{{ servicio.duracion }} min</span>
              </div>
            </div>

            <div class="item-acciones">
              <button class="btn pequeno" @click="editar(servicio)">
                Editar
              </button>
              <button class="btn pequeno peligro" @click="eliminar(servicio)">
                Eliminar
              </button>
            </div>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import {
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  obtenerServicios,
} from "@/nucleo/firebase/servicios";

const cargando = ref(false);
const guardando = ref(false);
const servicios = ref([]);
const editandoId = ref(null);
const error = ref("");
const ok = ref("");

const formVacio = () => ({
  nombre: "",
  categoria: "manos",
  precio: 250,
  duracion: 30,
  descripcion: "",
});

const form = ref(formVacio());

function limpiarMensajes() {
  error.value = "";
  ok.value = "";
}

function validarFormulario() {
  if (!form.value.nombre || !form.value.descripcion) {
    error.value = "Completa nombre y descripción.";
    return false;
  }
  if (!Number.isFinite(form.value.precio) || form.value.precio <= 0) {
    error.value = "El precio debe ser mayor a 0.";
    return false;
  }
  if (!Number.isFinite(form.value.duracion) || form.value.duracion <= 0) {
    error.value = "La duración debe ser mayor a 0.";
    return false;
  }
  return true;
}

async function cargarServicios() {
  cargando.value = true;
  limpiarMensajes();
  try {
    servicios.value = await obtenerServicios();
  } catch (e) {
    error.value = "No se pudieron cargar los servicios.";
    console.error(e);
  } finally {
    cargando.value = false;
  }
}

function editar(servicio) {
  limpiarMensajes();
  editandoId.value = servicio.id;
  form.value = {
    nombre: servicio.nombre || "",
    categoria: servicio.categoria || "otros",
    precio: Number(servicio.precio || 0),
    duracion: Number(servicio.duracion || 0),
    descripcion: servicio.descripcion || "",
  };
}

function cancelarEdicion() {
  editandoId.value = null;
  form.value = formVacio();
  limpiarMensajes();
}

async function guardarServicio() {
  limpiarMensajes();
  if (!validarFormulario()) return;

  guardando.value = true;
  const payload = {
    nombre: form.value.nombre,
    categoria: form.value.categoria,
    precio: Number(form.value.precio),
    duracion: Number(form.value.duracion),
    descripcion: form.value.descripcion,
  };

  try {
    if (editandoId.value) {
      await actualizarServicio(editandoId.value, payload);
      ok.value = "Servicio actualizado correctamente.";
    } else {
      await crearServicio(payload);
      ok.value = "Servicio creado correctamente.";
    }
    cancelarEdicion();
    await cargarServicios();
  } catch (e) {
    error.value = "No se pudo guardar el servicio. Verifica permisos de admin.";
    console.error(e);
  } finally {
    guardando.value = false;
  }
}

async function eliminar(servicio) {
  limpiarMensajes();
  const confirmar = window.confirm(
    `¿Eliminar el servicio "${servicio.nombre}"? Esta acción no se puede deshacer.`,
  );
  if (!confirmar) return;

  try {
    await eliminarServicio(servicio.id);
    ok.value = "Servicio eliminado correctamente.";
    if (editandoId.value === servicio.id) cancelarEdicion();
    await cargarServicios();
  } catch (e) {
    error.value =
      "No se pudo eliminar el servicio. Verifica permisos de admin.";
    console.error(e);
  }
}

onMounted(cargarServicios);
</script>

<style scoped>
.servicios-admin {
  color: #fff;
}

.cabecera h2 {
  margin: 0;
  font-family: "Syne", sans-serif;
  font-size: 1.6rem;
}

.cabecera p {
  margin: 0.35rem 0 1.25rem;
  color: rgba(255, 255, 255, 0.65);
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 1rem;
}

.panel {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 1rem;
}

.panel h3 {
  margin: 0 0 0.9rem;
  font-size: 1rem;
}

.formulario {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.85rem;
}

input,
select,
textarea {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9px;
  padding: 0.6rem 0.7rem;
  background: rgba(0, 0, 0, 0.28);
  color: #fff;
}

textarea {
  resize: vertical;
}

.full {
  grid-column: 1 / -1;
}

.mensaje {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 0.85rem;
}

.mensaje.error {
  color: #ff8f8f;
}

.mensaje.ok {
  color: #79f2bf;
}

.acciones {
  grid-column: 1 / -1;
  display: flex;
  gap: 0.6rem;
}

.btn {
  border: 0;
  border-radius: 9px;
  padding: 0.55rem 0.9rem;
  cursor: pointer;
  font-weight: 600;
}

.btn.principal {
  background: linear-gradient(135deg, #ec64b0, #d946ef);
  color: #fff;
}

.btn.secundario {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.btn.pequeno {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  padding: 0.45rem 0.7rem;
  font-size: 0.8rem;
}

.btn.peligro {
  background: rgba(255, 105, 105, 0.2);
  color: #ffb2b2;
}

.lista-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.8rem;
}

.estado {
  color: rgba(255, 255, 255, 0.65);
  margin: 0.3rem 0;
}

.lista {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.item {
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 11px;
  padding: 0.8rem;
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
}

.info h4 {
  margin: 0;
  font-size: 1rem;
}

.info p {
  margin: 0.3rem 0 0.55rem;
  color: rgba(255, 255, 255, 0.72);
  font-size: 0.88rem;
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.chip {
  font-size: 0.75rem;
  padding: 0.22rem 0.5rem;
  border-radius: 999px;
  border: 1px solid rgba(236, 100, 176, 0.45);
  color: #f9a8d4;
}

.item-acciones {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

@media (max-width: 960px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
