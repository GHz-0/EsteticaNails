<template>
  <main class="mx-auto w-full max-w-[980px] px-3 pb-8 pt-4 sm:px-4 lg:px-5">
    <!-- Header -->
    <header
      class="relative overflow-hidden rounded-[1.75rem] border border-fuchsia-100/12 bg-[rgba(6,8,14,0.84)] px-5 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-7"
    >
      <span class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ead7a1]/70 to-transparent" />
      <div class="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-[#ead7a1]/80">
            Avisos Nails Bere
          </p>
          <h1 class="font-display mt-1 text-[2.35rem] font-semibold leading-none text-fuchsia-50 sm:text-[3rem]">
            Mis Notificaciones
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-fuchsia-100/64">
            Revisa tus recordatorios de citas pendientes, notificaciones de adeudos y actualizaciones de pedidos.
          </p>
        </div>

        <button
          type="button"
          class="rounded-full border border-fuchsia-100/14 bg-white/5 px-4 py-2 text-xs font-bold text-fuchsia-100/70 transition hover:border-fuchsia-200/35 hover:text-fuchsia-50 shrink-0"
          @click="cargarNotificaciones"
          :disabled="cargando"
        >
          {{ cargando ? "Cargando..." : "Refrescar" }}
        </button>
      </div>
    </header>

    <!-- Lista de Notificaciones -->
    <section class="mt-6">
      <div v-if="cargando" class="rounded-[1.4rem] border border-fuchsia-100/10 bg-slate-950/35 p-12 text-center text-sm text-fuchsia-100/58">
        Buscando notificaciones nuevas...
      </div>

      <div v-else-if="notificaciones.length === 0" class="rounded-[1.4rem] border border-fuchsia-100/10 bg-slate-950/35 p-12 text-center text-sm text-fuchsia-100/58">
        <span class="text-3xl block mb-3">🔔</span>
        No tienes ninguna notificación por el momento.
      </div>

      <div v-else class="grid gap-3">
        <article
          v-for="n in notificaciones"
          :key="n.id"
          class="relative rounded-2xl border p-4 shadow-[0_12px_36px_rgba(0,0,0,0.18)] backdrop-blur-xl transition hover:bg-white/5 sm:p-5"
          :class="[
            n.leida
              ? 'border-fuchsia-100/8 bg-white/[0.015] opacity-64'
              : 'border-fuchsia-200/22 bg-white/[0.045] border-l-4 border-l-[#ead7a1]',
            bordePorTipo(n.tipo)
          ]"
        >
          <!-- Indicador No Leída -->
          <span
            v-if="!n.leida"
            class="absolute right-4 top-4 flex h-2 w-2 rounded-full bg-pink-500"
          />

          <div class="flex items-start gap-4">
            <!-- Icono por tipo -->
            <span class="text-2xl select-none shrink-0">{{ iconoNotificacion(n.tipo) }}</span>
            
            <div class="min-w-0 flex-1">
              <header class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h3 class="text-sm font-bold text-fuchsia-50">
                  {{ n.titulo }}
                </h3>
                <time class="text-[0.68rem] text-slate-500 font-medium">
                  {{ formatearFecha(n.fecha) }}
                </time>
              </header>
              <p class="mt-2 text-xs leading-5 text-slate-300">
                {{ n.mensaje }}
              </p>

              <!-- Botón Marcar Leída -->
              <div v-if="!n.leida" class="mt-3 flex justify-end">
                <button
                  @click="marcarComoLeida(n.id)"
                  class="rounded-full border border-fuchsia-300/20 bg-fuchsia-400/5 px-3 py-1 text-[0.66rem] font-bold text-[#f6e7bc] transition hover:border-[#ead7a1]/40"
                >
                  Marcar como leída
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { obtenerNotificaciones, marcarNotificacionLeida } from "@/nucleo/firebase/pagos";

const cargando = ref(true);
const notificaciones = ref([]);

async function cargarNotificaciones() {
  cargando.value = true;
  try {
    notificaciones.value = await obtenerNotificaciones();
  } catch (error) {
    console.error("Error al cargar notificaciones:", error);
  } finally {
    cargando.value = false;
  }
}

async function marcarComoLeida(id) {
  const exito = await marcarNotificacionLeida(id);
  if (exito) {
    // Actualizar localmente
    const notif = notificaciones.value.find((item) => item.id === id);
    if (notif) notif.leida = true;
  }
}

function iconoNotificacion(tipo = "") {
  if (tipo === "pago") return "💰";
  if (tipo === "cita") return "📅";
  return "🔔";
}

function bordePorTipo(tipo = "") {
  if (tipo === "pago") return "hover:border-[#ead7a1]/30";
  if (tipo === "cita") return "hover:border-fuchsia-300/30";
  return "hover:border-slate-500/20";
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  const d = fecha instanceof Date ? fecha : new Date(fecha);
  return d.toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

onMounted(cargarNotificaciones);
</script>

<style scoped>
h1, h3 {
  font-family: "Cormorant Garamond", Georgia, serif;
}
</style>
