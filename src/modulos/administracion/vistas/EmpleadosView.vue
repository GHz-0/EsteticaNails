<template>
  <section class="mx-auto w-full max-w-[1180px] px-3 pb-5 pt-4 sm:px-4 lg:px-5">
    <!-- Header con estadísticas -->
    <header
      class="relative mb-4 overflow-hidden rounded-[1.75rem] border border-fuchsia-100/12 bg-[rgba(6,8,14,0.84)] px-4 py-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-5"
    >
      <span
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ead7a1]/70 to-transparent"
      />
      <span
        class="pointer-events-none absolute -right-20 top-[-4rem] h-40 w-40 rounded-full bg-fuchsia-400/10 blur-3xl"
      />

      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            class="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#ead7a1]/80"
          >
            Administración de Personal
          </p>
          <h1
            class="font-display text-[2.05rem] font-semibold leading-none tracking-tight text-fuchsia-50 sm:text-[2.6rem]"
          >
            Gestión de Empleados
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-300/90">
            Registra nuevos miembros del equipo, edita sus especialidades, horarios y estado laboral.
          </p>
        </div>

        <div class="grid gap-2 grid-cols-2 sm:grid-cols-3">
          <div
            class="rounded-2xl border border-fuchsia-100/12 bg-white/5 px-4 py-3 text-right"
          >
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400"
            >
              Total Equipo
            </p>
            <p
              class="font-ingresos-libre text-[1.3rem] font-semibold text-fuchsia-100"
            >
              {{ totalEmpleados }}
            </p>
          </div>
          <div
            class="rounded-2xl border border-fuchsia-100/12 bg-white/5 px-4 py-3 text-right"
          >
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400"
            >
              Activos
            </p>
            <p
              class="font-ingresos-libre text-[1.3rem] font-semibold text-emerald-300"
            >
              {{ empleadosActivos }}
            </p>
          </div>
          <div
            class="rounded-2xl border border-fuchsia-100/12 bg-white/5 px-4 py-3 text-right col-span-2 sm:col-span-1"
          >
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400"
            >
              Inactivos
            </p>
            <p
              class="font-ingresos-libre text-[1.3rem] font-semibold text-rose-300"
            >
              {{ empleadosInactivos }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- Cuerpo principal -->
    <section class="grid grid-cols-1 gap-4 lg:grid-cols-12 items-start">
      <!-- Formulario para agregar / editar empleado (4 de 12 columnas en pantallas grandes) -->
      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:col-span-5"
      >
        <div class="mb-4 rounded-xl border border-fuchsia-100/12 bg-white/5 p-3">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p
                class="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-slate-400"
              >
                Registro y Edición
              </p>
              <h2
                class="mt-1 font-display text-[1.1rem] font-semibold text-fuchsia-50"
              >
                {{ editandoId ? "Editar empleado" : "Nuevo empleado" }}
              </h2>
            </div>
            <span
              class="rounded-full border px-2.5 py-0.5 text-[0.66rem] font-semibold uppercase tracking-[0.14em]"
              :class="
                editandoId
                  ? 'border-[#ead7a1]/30 bg-[#ead7a1]/10 text-[#f6e7bc]'
                  : 'border-fuchsia-400/30 bg-fuchsia-400/10 text-fuchsia-200'
              "
            >
              {{ editandoId ? "Edición" : "Alta" }}
            </span>
          </div>
          <p class="mt-2 text-xs leading-5 text-slate-400">
            {{
              editandoId
                ? "Actualiza los datos del empleado. Nota: por seguridad, el email y la contraseña no son editables desde esta vista."
                : "Llena los campos para crear la cuenta de acceso y perfil del nuevo empleado."
            }}
          </p>
        </div>

        <form @submit.prevent="guardar" class="grid gap-3.5">
          <!-- Campos de Login (Solo al crear) -->
          <div v-if="!editandoId" class="grid gap-3.5 border-b border-fuchsia-100/10 pb-4">
            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Correo Electrónico (Acceso)
              <input
                v-model.trim="form.email"
                type="email"
                required
                placeholder="ejemplo@correo.com"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Contraseña Temporal
              <input
                v-model="form.password"
                type="password"
                required
                minlength="6"
                placeholder="Mínimo 6 caracteres"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>
          </div>

          <!-- Datos de Perfil (Siempre visibles) -->
          <label class="grid gap-1 text-xs font-medium text-slate-300">
            Nombre Completo
            <input
              v-model.trim="form.nombre"
              type="text"
              required
              placeholder="Nombre del empleado"
              class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
            />
          </label>

          <div class="grid grid-cols-2 gap-3">
            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Teléfono
              <input
                v-model.trim="form.telefono"
                type="tel"
                placeholder="10 dígitos"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Estado
              <select
                v-model="form.estado"
                required
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </label>
          </div>

          <label class="grid gap-1 text-xs font-medium text-slate-300">
            Especialidad
            <input
              v-model.trim="form.especialidad"
              type="text"
              placeholder="Ej. Manicurista, Estilista"
              class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
            />
          </label>

          <label class="grid gap-1 text-xs font-medium text-slate-300">
            Horario Laboral
            <input
              v-model.trim="form.horario"
              type="text"
              placeholder="Ej. Lun a Vie 9:00 - 18:00"
              class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
            />
          </label>

          <!-- Alertas de estado -->
          <p
            v-if="error"
            class="rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-100"
          >
            ⚠️ {{ error }}
          </p>
          <p
            v-if="ok"
            class="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-100"
          >
            ✨ {{ ok }}
          </p>

          <div class="flex flex-wrap gap-2 pt-2">
            <button
              type="submit"
              class="flex-1 inline-flex items-center justify-center rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-400/20 via-pink-400/18 to-[#ead7a1]/14 px-4 py-2 text-xs font-semibold tracking-wide text-fuchsia-50 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-[#ead7a1]/45 disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="guardando"
            >
              {{ guardando ? "Guardando..." : editandoId ? "Actualizar Empleado" : "Crear Empleado" }}
            </button>
            <button
              v-if="editandoId"
              type="button"
              class="rounded-full border border-fuchsia-100/18 bg-white/5 px-4 py-2 text-xs font-semibold tracking-wide text-slate-200 transition-all hover:border-fuchsia-200/40 hover:text-fuchsia-50"
              :disabled="guardando"
              @click="cancelarEdicion"
            >
              Cancelar
            </button>
          </div>
        </form>
      </article>

      <!-- Listado de empleados (8 de 12 columnas en pantallas grandes) -->
      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:col-span-7"
      >
        <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 class="font-display text-[1.25rem] font-semibold text-fuchsia-50">
            Personal Registrado
          </h2>
          <button
            class="rounded-full border border-fuchsia-100/18 bg-white/5 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-slate-200 transition-all hover:border-fuchsia-200/40 hover:text-fuchsia-50 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="cargando"
            @click="cargar"
          >
            {{ cargando ? "Actualizando..." : "Refrescar Lista" }}
          </button>
        </div>

        <!-- Filtros -->
        <div class="mb-4 grid gap-2 sm:grid-cols-[1fr_150px]">
          <input
            v-model.trim="filtroTexto"
            type="text"
            placeholder="Buscar por nombre o correo..."
            class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
          />
          <select
            v-model="filtroEstado"
            class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
          >
            <option value="todos">Todos</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
        </div>

        <!-- Listado -->
        <div v-if="cargando" class="py-10 text-center text-sm text-slate-400">
          Cargando personal...
        </div>
        <div v-else-if="!empleados.length" class="py-10 text-center text-sm text-slate-400">
          No hay empleados registrados en el sistema.
        </div>
        <div v-else-if="!empleadosFiltrados.length" class="py-10 text-center text-sm text-slate-400">
          No se encontraron empleados que coincidan con la búsqueda.
        </div>
        <ul v-else class="grid gap-3">
          <li
            v-for="emp in empleadosFiltrados"
            :key="emp.id"
            class="rounded-xl border border-fuchsia-100/12 bg-white/5 p-3.5 transition-all hover:border-fuchsia-200/30 hover:bg-white/7"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-center gap-3">
                <!-- Avatar / Iniciales -->
                <div
                  class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#ead7a1]/30 bg-[#ead7a1]/10 text-xs font-bold text-[#f6e7bc]"
                >
                  {{ emp.avatar || "EP" }}
                </div>
                <div class="min-w-0">
                  <h3 class="truncate text-sm font-semibold text-fuchsia-50">
                    {{ emp.nombre }}
                  </h3>
                  <p class="truncate text-xs text-slate-400">{{ emp.email }}</p>
                </div>
              </div>

              <!-- Estado -->
              <span
                class="rounded-full border px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider"
                :class="
                  emp.estado === 'activo'
                    ? 'border-emerald-300/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-rose-300/30 bg-rose-500/10 text-rose-300'
                "
              >
                {{ emp.estado }}
              </span>
            </div>

            <!-- Detalles del empleado -->
            <div class="mt-3.5 grid gap-2 rounded-lg bg-slate-950/30 p-2.5 text-xs text-slate-300">
              <div class="flex justify-between">
                <span class="text-slate-500">Especialidad:</span>
                <span class="font-medium text-slate-200">{{ emp.especialidad || 'No asignada' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Teléfono:</span>
                <span class="font-medium text-slate-200">{{ emp.telefono || 'No registrado' }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-slate-500">Horario:</span>
                <span class="font-medium text-[#f6e7bc]">{{ emp.horario || 'No asignado' }}</span>
              </div>
            </div>

            <!-- Acciones -->
            <div class="mt-3.5 flex justify-end gap-2 border-t border-fuchsia-100/5 pt-2.5">
              <button
                class="rounded-full border border-fuchsia-100/16 bg-white/5 px-3 py-1.5 text-[0.7rem] font-semibold text-slate-200 transition hover:border-[#ead7a1]/40 hover:text-fuchsia-50"
                @click="editar(emp)"
              >
                Editar
              </button>
              <button
                class="rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1.5 text-[0.7rem] font-semibold text-rose-100 transition hover:border-rose-300/50 hover:bg-rose-500/20"
                @click="eliminar(emp)"
              >
                Eliminar
              </button>
            </div>
          </li>
        </ul>
      </article>
    </section>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import {
  obtenerEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from "@/nucleo/firebase/empleados";

// Estados
const cargando = ref(false);
const guardando = ref(false);
const empleados = ref([]);
const editandoId = ref(null);
const error = ref("");
const ok = ref("");

// Filtros
const filtroTexto = ref("");
const filtroEstado = ref("todos");

// Inicializador de formulario
const formVacio = () => ({
  email: "",
  password: "",
  nombre: "",
  telefono: "",
  estado: "activo",
  especialidad: "",
  horario: "",
});

const form = ref(formVacio());

// Computadas para estadísticas
const totalEmpleados = computed(() => empleados.value.length);
const empleadosActivos = computed(
  () => empleados.value.filter((e) => e.estado === "activo").length
);
const empleadosInactivos = computed(
  () => empleados.value.filter((e) => e.estado === "inactivo").length
);

// Filtrado de lista
const empleadosFiltrados = computed(() => {
  const texto = filtroTexto.value.trim().toLowerCase();
  return empleados.value.filter((emp) => {
    const coincideTexto =
      !texto ||
      (emp.nombre || "").toLowerCase().includes(texto) ||
      (emp.email || "").toLowerCase().includes(texto);
    const coincideEstado =
      filtroEstado.value === "todos" || emp.estado === filtroEstado.value;
    return coincideTexto && coincideEstado;
  });
});

// Cargar empleados
async function cargar() {
  cargando.value = true;
  limpiarMensajes();
  try {
    empleados.value = await obtenerEmpleados();
  } catch (e) {
    error.value = "Error al obtener la lista de empleados.";
    console.error(e);
  } finally {
    cargando.value = false;
  }
}

// Limpiar mensajes
function limpiarMensajes() {
  error.value = "";
  ok.value = "";
}

// Iniciar edición
function editar(emp) {
  limpiarMensajes();
  editandoId.value = emp.id;
  form.value = {
    email: emp.email || "",
    password: "", // Contraseña no editable
    nombre: emp.nombre || "",
    telefono: emp.telefono || "",
    estado: emp.estado || "activo",
    especialidad: emp.especialidad || "",
    horario: emp.horario || "",
  };
}

// Cancelar edición
function cancelarEdicion() {
  editandoId.value = null;
  form.value = formVacio();
  limpiarMensajes();
}

// Validar formulario
function validar() {
  if (!form.value.nombre) {
    error.value = "El nombre es obligatorio.";
    return false;
  }
  if (!editandoId.value) {
    if (!form.value.email || !form.value.password) {
      error.value = "El correo y contraseña temporal son obligatorios.";
      return false;
    }
    if (form.value.password.length < 6) {
      error.value = "La contraseña debe tener al menos 6 caracteres.";
      return false;
    }
  }
  return true;
}

// Guardar (Crear o Editar)
async function guardar() {
  limpiarMensajes();
  if (!validar()) return;

  guardando.value = true;
  try {
    if (editandoId.value) {
      // Editar
      await actualizarEmpleado(editandoId.value, {
        nombre: form.value.nombre,
        telefono: form.value.telefono,
        estado: form.value.estado,
        especialidad: form.value.especialidad,
        horario: form.value.horario,
      });
      ok.value = "Empleado actualizado correctamente.";
    } else {
      // Crear
      await crearEmpleado(
        {
          nombre: form.value.nombre,
          email: form.value.email,
          telefono: form.value.telefono,
          estado: form.value.estado,
          especialidad: form.value.especialidad,
          horario: form.value.horario,
        },
        form.value.password
      );
      ok.value = "Empleado registrado y cuenta creada correctamente.";
    }
    cancelarEdicion();
    await cargar();
  } catch (e) {
    if (e.code === "auth/email-already-in-use") {
      error.value = "El correo ya está registrado en Firebase Auth.";
    } else if (e.code === "auth/invalid-email") {
      error.value = "El formato del correo es inválido.";
    } else if (e.code === "auth/weak-password") {
      error.value = "La contraseña es muy débil.";
    } else {
      error.value = e.message || "Error al intentar guardar el empleado.";
    }
    console.error(e);
  } finally {
    guardando.value = false;
  }
}

// Eliminar
async function eliminar(emp) {
  limpiarMensajes();
  const confirmar = window.confirm(
    `¿Estás seguro de eliminar a "${emp.nombre}" del sistema? Esta acción no se puede deshacer y perderá su acceso.`
  );
  if (!confirmar) return;

  try {
    await eliminarEmpleado(emp.id);
    ok.value = "Empleado eliminado correctamente.";
    if (editandoId.value === emp.id) cancelarEdicion();
    await cargar();
  } catch (e) {
    error.value = "No se pudo eliminar el empleado.";
    console.error(e);
  }
}

onMounted(cargar);
</script>

<style scoped>
/* Fuentes estilizadas del proyecto */
h1, h2 {
  font-family: "Cormorant Garamond", Georgia, serif;
}
</style>