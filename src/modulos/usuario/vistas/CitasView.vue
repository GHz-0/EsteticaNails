<template>
  <main class="mx-auto w-full max-w-[1180px] px-3 pb-8 pt-4 sm:px-4 lg:px-5">
    <header
      class="relative overflow-hidden rounded-[1.75rem] border border-fuchsia-100/12 bg-[rgba(6,8,14,0.84)] px-5 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-7"
    >
      <span class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ead7a1]/70 to-transparent" />
      <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-[#ead7a1]/80">
            Agenda Nails Bere
          </p>
          <h1 class="font-display mt-1 text-[2.35rem] font-semibold leading-none text-fuchsia-50 sm:text-[3rem]">
            Mis citas
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-fuchsia-100/64">
            Reserva un horario, revisa tus citas activas y cancela cuando necesites ajustar tu agenda.
          </p>
        </div>
        <div class="grid grid-cols-2 gap-2 sm:min-w-[260px]">
          <div class="rounded-2xl border border-fuchsia-100/12 bg-white/5 px-4 py-3 text-right">
            <p class="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-fuchsia-100/45">
              Activas
            </p>
            <p class="font-ingresos-libre text-[1.5rem] font-bold text-fuchsia-50">
              {{ citasActivas }}
            </p>
          </div>
          <div class="rounded-2xl border border-[#ead7a1]/18 bg-[#ead7a1]/8 px-4 py-3 text-right">
            <p class="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#ead7a1]/65">
              Servicios
            </p>
            <p class="font-ingresos-libre text-[1.5rem] font-bold text-[#f6e7bc]">
              {{ servicios.length }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.25fr]">
      <article
        class="rounded-[1.4rem] border border-fuchsia-100/10 bg-white/[0.035] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-5"
      >
        <div class="mb-4">
          <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ead7a1]/75">
            Nueva reserva
          </p>
          <h2 class="font-display mt-1 text-[1.7rem] font-semibold text-fuchsia-50">
            Agendar cita
          </h2>
        </div>

        <form class="grid gap-3" @submit.prevent="crearNuevaCita">
          <label class="grid gap-1 text-xs font-semibold text-fuchsia-100/70">
            Servicio *
            <select
              v-model="nuevaCita.servicioId"
              required
              class="min-h-11 rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3 text-sm text-fuchsia-50 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
            >
              <option value="">Selecciona un servicio</option>
              <option
                v-for="servicio in servicios"
                :key="servicio.id"
                :value="servicio.id"
              >
                {{ servicio.nombre }} - {{ formatoMoneda(servicio.precio) }}
              </option>
            </select>
          </label>

          <div
            v-if="servicioSeleccionado"
            class="grid gap-3 rounded-2xl border border-fuchsia-100/10 bg-slate-950/45 p-3 sm:grid-cols-[96px_1fr]"
          >
            <img
              :src="imagenServicio(servicioSeleccionado)"
              :alt="servicioSeleccionado.nombre"
              class="h-24 w-full rounded-xl object-cover"
            />
            <div>
              <h3 class="font-display text-[1.2rem] font-semibold text-fuchsia-50">
                {{ servicioSeleccionado.nombre }}
              </h3>
              <p class="mt-1 text-sm text-fuchsia-100/55">
                {{ servicioSeleccionado.descripcion || "Servicio personalizado en Nails Bere." }}
              </p>
              <p class="mt-2 font-ingresos-libre text-lg font-bold text-[#f6e7bc]">
                {{ formatoMoneda(servicioSeleccionado.precio) }}
              </p>
            </div>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <label class="grid gap-1 text-xs font-semibold text-fuchsia-100/70">
              Fecha *
              <input
                v-model="nuevaCita.fecha"
                :min="fechaMinima"
                type="date"
                required
                class="min-h-11 rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3 text-sm text-fuchsia-50 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <label class="grid gap-1 text-xs font-semibold text-fuchsia-100/70">
              Hora *
              <input
                v-model="nuevaCita.hora"
                type="time"
                required
                class="min-h-11 rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3 text-sm text-fuchsia-50 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>
          </div>

          <label class="grid gap-1 text-xs font-semibold text-fuchsia-100/70">
            Especialista / Estilista *
            <select
              v-model="nuevaCita.empleadoId"
              required
              class="min-h-11 rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3 text-sm text-fuchsia-50 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
            >
              <option value="">Selecciona especialista</option>
              <option
                v-for="emp in listaEmpleados"
                :key="emp.id"
                :value="emp.id"
              >
                {{ emp.nombre }} ({{ emp.especialidad || 'General' }})
              </option>
            </select>
          </label>

          <label class="grid gap-1 text-xs font-semibold text-fuchsia-100/70">
            Método de Pago *
            <select
              v-model="nuevaCita.metodoPago"
              required
              class="min-h-11 rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3 text-sm text-fuchsia-50 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
            >
              <option value="online">Tarjeta Online (Pago seguro anticipado)</option>
              <option value="fisico">Físico (Pago en sucursal - se acumula saldo pendiente)</option>
            </select>
          </label>

          <!-- Simulador de Tarjeta (Pago Online) -->
          <div
            v-if="nuevaCita.metodoPago === 'online'"
            class="grid gap-3 rounded-2xl border border-fuchsia-100/10 bg-slate-950/50 p-3.5"
          >
            <p class="text-[0.62rem] font-bold uppercase tracking-wider text-[#ead7a1]">
              Simulador de Pago con Tarjeta
            </p>

            <label class="grid gap-0.5 text-[0.68rem] font-semibold text-slate-400">
              Número de Tarjeta
              <input
                v-model="tarjetaForm.numero"
                type="text"
                required
                maxlength="16"
                placeholder="16 dígitos"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
              />
            </label>

            <div class="grid grid-cols-2 gap-2">
              <label class="grid gap-0.5 text-[0.68rem] font-semibold text-slate-400">
                Vence (MM/AA)
                <input
                  v-model="tarjetaForm.vence"
                  type="text"
                  required
                  placeholder="MM/AA"
                  maxlength="5"
                  class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
                />
              </label>

              <label class="grid gap-0.5 text-[0.68rem] font-semibold text-slate-400">
                CVV
                <input
                  v-model="tarjetaForm.cvv"
                  type="password"
                  required
                  maxlength="3"
                  placeholder="3 dígitos"
                  class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
                />
              </label>
            </div>
          </div>

          <label class="grid gap-1 text-xs font-semibold text-fuchsia-100/70">
            Notas
            <textarea
              v-model="nuevaCita.notas"
              rows="4"
              placeholder="Agrega cualquier nota especial..."
              class="rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-sm text-fuchsia-50 outline-none transition placeholder:text-fuchsia-100/28 focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
            />
          </label>

          <button
            type="submit"
            class="min-h-11 rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-300/24 via-pink-400/22 to-[#ead7a1]/18 px-5 text-sm font-bold text-fuchsia-50 shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:border-[#ead7a1]/45 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="enviando"
          >
            {{ enviando ? "Creando..." : "Agendar cita" }}
          </button>

          <p
            v-if="errorCita"
            class="rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100"
          >
            {{ errorCita }}
          </p>
          <p
            v-if="exitoCita"
            class="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100"
          >
            {{ exitoCita }}
          </p>
        </form>
      </article>

      <article
        class="rounded-[1.4rem] border border-fuchsia-100/10 bg-white/[0.035] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-5"
      >
        <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ead7a1]/75">
              Historial
            </p>
            <h2 class="font-display mt-1 text-[1.7rem] font-semibold text-fuchsia-50">
              Tus citas
            </h2>
          </div>
          <button
            type="button"
            class="rounded-full border border-fuchsia-100/14 bg-white/5 px-4 py-2 text-xs font-bold text-fuchsia-100/70 transition hover:border-fuchsia-200/35 hover:text-fuchsia-50"
            @click="cargarCitas"
          >
            Refrescar
          </button>
        </div>

        <div v-if="cargando" class="rounded-xl border border-fuchsia-100/10 bg-slate-950/35 p-5 text-sm text-fuchsia-100/58">
          Cargando citas...
        </div>

        <div v-else-if="misCitas.length === 0" class="rounded-xl border border-fuchsia-100/10 bg-slate-950/35 p-5 text-sm text-fuchsia-100/58">
          No tienes citas agendadas.
        </div>

        <div v-else class="grid gap-3">
          <article
            v-for="cita in misCitas"
            :key="cita.id"
            class="grid gap-3 rounded-2xl border border-fuchsia-100/10 bg-slate-950/38 p-3 transition hover:border-fuchsia-200/25 sm:grid-cols-[86px_1fr_auto]"
            :class="{ 'opacity-55': cita.estado === 'cancelada' }"
          >
            <img
              :src="imagenServicio(cita.servicio)"
              :alt="cita.servicio?.nombre || 'Servicio'"
              class="h-24 w-full rounded-xl object-cover sm:h-full"
            />
            <div>
              <h3 class="font-display text-[1.25rem] font-semibold text-fuchsia-50">
                {{ cita.servicio?.nombre || "Servicio desconocido" }}
              </h3>
              <p class="mt-1 text-sm text-fuchsia-100/60">
                {{ formatearFecha(cita.fecha) }} · {{ cita.hora }}
              </p>
              
              <!-- Detalles de Pago de la Cita -->
              <p class="mt-1.5 flex flex-wrap gap-1.5">
                <span class="rounded bg-white/5 border border-fuchsia-100/10 px-2 py-0.5 text-[0.68rem] text-slate-300">
                  Pago: {{ cita.metodoPago === 'online' ? 'Tarjeta Online' : 'Físico en Sucursal' }}
                </span>
                <span
                  class="rounded px-2 py-0.5 text-[0.68rem] font-bold"
                  :class="cita.estadoPago === 'completado' ? 'bg-emerald-500/10 border border-emerald-300/25 text-emerald-300' : 'bg-rose-500/10 border border-rose-300/25 text-rose-300'"
                >
                  {{ cita.estadoPago === 'completado' ? 'Pagado' : 'Pendiente' }}
                </span>
              </p>

              <p v-if="cita.notas" class="mt-2 text-sm italic leading-6 text-fuchsia-100/46">
                {{ cita.notas }}
              </p>
            </div>
            <div class="flex items-start gap-2 sm:flex-col sm:items-end">
              <span
                class="rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.1em]"
                :class="claseEstado(cita.estado)"
              >
                {{ cita.estado }}
              </span>
              <button
                v-if="cita.estado !== 'cancelada'"
                type="button"
                class="rounded-full border border-rose-300/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-100 transition hover:border-rose-300/50"
                @click="cancelarCita(cita.id)"
              >
                Cancelar
              </button>
            </div>
          </article>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { obtenerServicios } from "@/nucleo/firebase/servicios.js";
import {
  obtenerMisCitas,
  crearCita,
  cancelarCita as cancelarCitaFirebase,
} from "@/nucleo/firebase/citas.js";
import { obtenerEmpleados } from "@/nucleo/firebase/empleados.js";

const servicios = ref([]);
const misCitas = ref([]);
const cargando = ref(true);
const enviando = ref(false);
const errorCita = ref("");
const exitoCita = ref("");

const tarjetaForm = ref({
  numero: "",
  vence: "",
  cvv: "",
});

const listaEmpleados = ref([]);

const nuevaCita = ref({
  servicioId: "",
  fecha: "",
  hora: "",
  notas: "",
  metodoPago: "online",
  empleadoId: "",
});

const fechaMinima = computed(() => new Date().toISOString().slice(0, 10));

const citasActivas = computed(
  () => misCitas.value.filter((cita) => cita.estado !== "cancelada").length,
);

const servicioSeleccionado = computed(() =>
  servicios.value.find((servicio) => servicio.id === nuevaCita.value.servicioId),
);

onMounted(async () => {
  try {
    servicios.value = await obtenerServicios();
    await cargarCitas();
    listaEmpleados.value = await obtenerEmpleados();

    const servicioStorage = sessionStorage.getItem("servicioSeleccionado");
    if (servicioStorage) {
      const servicio = JSON.parse(servicioStorage);
      nuevaCita.value.servicioId = servicio.id;
      sessionStorage.removeItem("servicioSeleccionado");
    }
  } catch (error) {
    console.error("Error cargando datos:", error);
  }
});

async function cargarCitas() {
  cargando.value = true;
  try {
    const citas = await obtenerMisCitas();
    misCitas.value = citas.map((cita) => ({
      ...cita,
      servicio: servicios.value.find((servicio) => servicio.id === cita.servicioId),
    }));
  } catch (error) {
    console.error("Error cargando citas:", error);
  } finally {
    cargando.value = false;
  }
}

async function crearNuevaCita() {
  errorCita.value = "";
  exitoCita.value = "";

  if (!nuevaCita.value.servicioId || !nuevaCita.value.fecha || !nuevaCita.value.hora || !nuevaCita.value.empleadoId) {
    errorCita.value = "Completa todos los campos requeridos, incluyendo la especialista.";
    return;
  }

  if (nuevaCita.value.metodoPago === "online") {
    const num = tarjetaForm.value.numero.trim();
    const cvv = tarjetaForm.value.cvv.trim();
    if (num.length !== 16 || Number.isNaN(Number(num))) {
      errorCita.value = "Número de tarjeta inválido. Debe tener 16 dígitos.";
      return;
    }
    if (cvv.length !== 3 || Number.isNaN(Number(cvv))) {
      errorCita.value = "CVV de tarjeta inválido. Debe tener 3 dígitos.";
      return;
    }
  }

  enviando.value = true;
  try {
    const fechaHora = new Date(`${nuevaCita.value.fecha}T${nuevaCita.value.hora}`);
    const precio = servicioSeleccionado.value?.precio || 0;
    const empleadoObj = listaEmpleados.value.find((e) => e.id === nuevaCita.value.empleadoId);
    const empleadaNombre = empleadoObj ? empleadoObj.nombre : "Por asignar";

    await crearCita({
      servicioId: nuevaCita.value.servicioId,
      fecha: fechaHora,
      hora: nuevaCita.value.hora,
      notas: nuevaCita.value.notas,
      metodoPago: nuevaCita.value.metodoPago,
      precio,
      empleadoId: nuevaCita.value.empleadoId,
      empleadaNombre,
    });

    exitoCita.value = "Cita creada exitosamente.";
    nuevaCita.value = { servicioId: "", fecha: "", hora: "", notas: "", metodoPago: "online", empleadoId: "" };
    tarjetaForm.value = { numero: "", vence: "", cvv: "" };
    await cargarCitas();

    setTimeout(() => {
      exitoCita.value = "";
    }, 3000);
  } catch (error) {
    errorCita.value = `Error al crear la cita: ${error.message}`;
  } finally {
    enviando.value = false;
  }
}

async function cancelarCita(citaId) {
  if (!confirm("¿Estás seguro de que deseas cancelar esta cita?")) return;

  try {
    await cancelarCitaFirebase(citaId, "Cancelada por el usuario");
    await cargarCitas();
  } catch (error) {
    console.error("Error cancelando cita:", error);
  }
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  const date = fecha instanceof Date ? fecha : new Date(fecha);
  return date.toLocaleDateString("es-MX", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatoMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-MX")}`;
}

function claseEstado(estado = "") {
  if (estado === "cancelada") {
    return "border-rose-300/25 bg-rose-500/10 text-rose-100";
  }
  if (estado === "confirmada") {
    return "border-emerald-300/25 bg-emerald-400/10 text-emerald-100";
  }
  return "border-[#ead7a1]/25 bg-[#ead7a1]/10 text-[#f6e7bc]";
}

function normalizarCategoria(categoria = "") {
  return String(categoria)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function imagenPorCategoria(categoria = "") {
  const valor = normalizarCategoria(categoria);
  const imagenes = {
    manos: "/img/inicio/servicio-unas.jpg",
    pies: "/img/inicio/promo-manicure.jpg",
    facial: "/img/inicio/servicio-facial.jpg",
    cabello: "/img/inicio/servicio-color.jpg",
    eventos: "/img/inicio/servicio-maquillaje.jpg",
    diseno: "/img/inicio/promo-manicure.jpg",
    extensiones: "/img/inicio/servicio-unas.jpg",
  };
  return imagenes[valor] || "/img/inicio/cta.jpg";
}

function imagenServicio(servicio) {
  return servicio?.imagenUrl || imagenPorCategoria(servicio?.categoria);
}
</script>
