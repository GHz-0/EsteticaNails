<template>
  <div class="mx-auto w-full max-w-[940px] px-3 pb-5 pt-4 sm:px-4 lg:px-5">
    <section
      class="relative mb-4 overflow-hidden rounded-[1.75rem] border border-fuchsia-100/12 bg-[rgba(6,8,14,0.84)] px-4 py-4 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-5"
    >
      <span
        class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ead7a1]/70 to-transparent"
      />
      <span
        class="pointer-events-none absolute -right-20 top-[-4rem] h-40 w-40 rounded-full bg-fuchsia-400/10 blur-3xl"
      />

      <div class="grid gap-4 lg:grid-cols-[1.4fr_1fr] lg:items-center">
        <div>
          <p
            class="mb-1 text-xs font-semibold uppercase tracking-[0.28em] text-[#ead7a1]/80"
          >
            Panel de administracion
          </p>
          <h1
            class="font-display text-[2.05rem] font-semibold leading-none tracking-tight text-fuchsia-50 sm:text-[2.6rem]"
          >
            Resumen operativo
          </h1>
          <p
            class="mt-2 max-w-2xl text-sm capitalize leading-6 text-slate-300/90"
          >
            {{ fechaHoy }}
          </p>
        </div>

        <div
          class="rounded-2xl border border-[#ead7a1]/20 bg-gradient-to-br from-[#ead7a1]/18 via-fuchsia-300/12 to-fuchsia-400/5 px-5 py-4 shadow-[0_14px_40px_rgba(0,0,0,0.24)]"
        >
          <div class="flex items-center gap-4">
            <p
              :class="fontIngresosClass"
              class="text-[1.84rem] font-semibold leading-none tracking-tight text-[#f6e7bc] sm:text-[2.18rem]"
            >
              ${{ ingresosMes.toLocaleString("es-MX") }}
            </p>
            <p
              class="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[#ead7a1]/80"
            >
              Ingresos estimados<br />del mes
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl flex items-center justify-between gap-3"
      >
        <p class="text-[1.5rem] font-semibold text-fuchsia-100 flex-shrink-0">
          {{ citasMes }}
        </p>
        <p
          class="text-xs uppercase tracking-[0.12em] text-slate-400 text-right"
        >
          Citas este mes
        </p>
      </article>

      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl flex items-center justify-between gap-3"
      >
        <p class="text-[1.5rem] font-semibold text-fuchsia-100 flex-shrink-0">
          {{ clientesActivos }}
        </p>
        <p
          class="text-xs uppercase tracking-[0.12em] text-slate-400 text-right"
        >
          Clientes activos
        </p>
      </article>

      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl flex items-center justify-between gap-3"
      >
        <p class="text-[1.5rem] font-semibold text-fuchsia-100 flex-shrink-0">
          {{ serviciosActivos }}
        </p>
        <p
          class="text-xs uppercase tracking-[0.12em] text-slate-400 text-right"
        >
          Servicios disponibles
        </p>
      </article>

      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl flex items-center justify-between gap-3"
      >
        <p class="text-[1.5rem] font-semibold text-fuchsia-100 flex-shrink-0">
          {{ cancelacionesMes }}
        </p>
        <p
          class="text-xs uppercase tracking-[0.12em] text-slate-400 text-right"
        >
          Cancelaciones del mes
        </p>
      </article>
    </section>

    <section class="grid grid-cols-1 gap-3 xl:grid-cols-[1fr_1fr_1fr]">
      <!-- Top Servicios -->
      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <h2 class="font-display text-[1.1rem] font-semibold text-fuchsia-50">
          Top servicios
        </h2>

        <p v-if="cargando" class="mt-3 text-xs text-slate-300">Cargando...</p>
        <p v-else-if="!topServicios.length" class="mt-3 text-xs text-slate-300">
          Sin citas aún.
        </p>

        <ul v-else class="mt-3 space-y-2">
          <li
            v-for="(item, idx) in topServicios"
            :key="item.servicioId"
            class="flex items-center gap-2 rounded-lg border border-fuchsia-100/10 bg-white/5 px-2.5 py-2"
          >
            <span
              class="grid h-7 w-7 place-items-center rounded-full border border-[#ead7a1]/30 bg-[#ead7a1]/10 text-[0.65rem] font-bold text-[#f6e7bc]"
            >
              {{ idx + 1 }}
            </span>

            <div class="min-w-0 flex-1">
              <p class="truncate text-xs font-semibold text-fuchsia-50">
                {{ item.nombre }}
              </p>
              <p class="text-[0.7rem] text-slate-400">{{ item.citas }} citas</p>
            </div>

            <span class="text-xs font-bold text-[#f6e7bc]">
              ${{ item.ingreso.toLocaleString("es-MX") }}
            </span>
          </li>
        </ul>
      </article>

      <!-- Clientes Destacados -->
      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <h2 class="font-display text-[1.1rem] font-semibold text-fuchsia-50">
          Clientes top
        </h2>

        <p v-if="cargando" class="mt-3 text-xs text-slate-300">Cargando...</p>
        <p v-else-if="!topClientes.length" class="mt-3 text-xs text-slate-300">
          Sin clientes aún.
        </p>

        <ul v-else class="mt-3 space-y-2">
          <li
            v-for="(cliente, idx) in topClientes"
            :key="cliente.id"
            class="rounded-lg border border-fuchsia-100/10 bg-white/5 px-2.5 py-2"
          >
            <div class="flex items-center justify-between">
              <div class="min-w-0 flex-1">
                <p class="truncate text-xs font-semibold text-fuchsia-50">
                  {{ cliente.nombre }}
                </p>
                <p class="text-[0.7rem] text-slate-400">
                  {{ cliente.citasCount }} citas
                </p>
              </div>
              <span
                class="ml-1 text-xs font-bold text-[#ead7a1]"
                :title="`Puntuación: ${cliente.score || 0}`"
              >
                ⭐ {{ cliente.score || 0 }}
              </span>
            </div>
          </li>
        </ul>
      </article>

      <!-- Citas Pendientes -->
      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <h2 class="font-display text-[1.1rem] font-semibold text-fuchsia-50">
          Citas recientes
        </h2>

        <p v-if="cargando" class="mt-3 text-xs text-slate-300">Cargando...</p>
        <p
          v-else-if="!citasPendientes.length"
          class="mt-3 text-xs text-slate-300"
        >
          Sin citas recientes.
        </p>

        <ul v-else class="mt-3 space-y-2">
          <li
            v-for="cita in citasPendientes"
            :key="cita.id"
            class="rounded-lg border border-fuchsia-100/10 bg-white/5 px-2.5 py-2"
          >
            <div class="flex items-center justify-between gap-2 mb-1">
              <p class="truncate text-xs font-semibold text-fuchsia-50">
                {{ cita.servicioNombre }} <span class="text-slate-400">·</span>
                {{ cita.clienteNombre }}
              </p>
              <span class="flex-shrink-0 text-sm">
                {{ cita.estado === "cancelada" ? "❌" : "✓" }}
              </span>
            </div>
            <p class="text-[0.7rem] text-slate-400">
              {{ cita.empleadoNombre }} · {{ cita.fechaHora }}
            </p>
          </li>
        </ul>
      </article>
    </section>

    <p
      v-if="error"
      class="mt-4 rounded-xl border border-rose-300/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { getFirebaseDb } from "@/nucleo/firebase/client";

const db = getFirebaseDb();

const cargando = ref(true);
const error = ref("");

const servicios = ref([]);
const citas = ref([]);
const usuarios = ref([]);

const fechaHoy = new Date().toLocaleDateString("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const FUENTE_INGRESOS = "libre";
const FONT_INGRESOS = {
  cormorant: "font-display",
  playfair: "font-ingresos-playfair",
  manrope: "font-ingresos-manrope",
  libre: "font-ingresos-libre",
  spectral: "font-ingresos-spectral",
  lora: "font-ingresos-lora",
  eb: "font-ingresos-eb",
};
const fontIngresosClass = FONT_INGRESOS[FUENTE_INGRESOS] || "font-display";

onMounted(async () => {
  try {
    const [snapServicios, snapCitas, snapUsers] = await Promise.all([
      getDocs(collection(db, "servicios")),
      getDocs(collection(db, "citas")),
      getDocs(collection(db, "users")),
    ]);

    servicios.value = snapServicios.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    citas.value = snapCitas.docs.map((d) => ({ id: d.id, ...d.data() }));
    usuarios.value = snapUsers.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (e) {
    error.value =
      "No se pudieron cargar métricas del panel. Revisa permisos y reglas.";
    console.error(e);
  } finally {
    cargando.value = false;
  }
});

const citasConFecha = computed(() =>
  citas.value
    .map((c) => {
      const fechaObj = c?.fecha?.toDate ? c.fecha.toDate() : new Date(c.fecha);
      return { ...c, fechaObj };
    })
    .filter(
      (c) => c.fechaObj instanceof Date && !Number.isNaN(c.fechaObj.getTime()),
    ),
);

const rangoMesActual = computed(() => {
  const ahora = new Date();
  return { mes: ahora.getMonth(), anio: ahora.getFullYear() };
});

const citasDelMes = computed(() =>
  citasConFecha.value.filter(
    (c) =>
      c.fechaObj.getMonth() === rangoMesActual.value.mes &&
      c.fechaObj.getFullYear() === rangoMesActual.value.anio,
  ),
);

const citasMes = computed(() => citasDelMes.value.length);

const cancelacionesMes = computed(
  () => citasDelMes.value.filter((c) => c.estado === "cancelada").length,
);

const clientesActivos = computed(
  () =>
    usuarios.value.filter((u) => u.rol === "usuario" && u.estado !== "inactivo")
      .length,
);

const serviciosActivos = computed(() => servicios.value.length);

const precioServicioMap = computed(() => {
  const m = new Map();
  for (const s of servicios.value) m.set(s.id, Number(s.precio || 0));
  return m;
});

const ingresosMes = computed(() => {
  return citasDelMes.value
    .filter((c) => c.estado !== "cancelada")
    .reduce(
      (acc, c) => acc + (precioServicioMap.value.get(c.servicioId) || 0),
      0,
    );
});

const topServicios = computed(() => {
  const agg = new Map();
  for (const c of citasDelMes.value.filter((x) => x.estado !== "cancelada")) {
    const key = c.servicioId || "sin-servicio";
    const prev = agg.get(key) || { servicioId: key, citas: 0, ingreso: 0 };
    prev.citas += 1;
    prev.ingreso += precioServicioMap.value.get(key) || 0;
    agg.set(key, prev);
  }

  const nombrePorId = new Map(servicios.value.map((s) => [s.id, s.nombre]));

  return [...agg.values()]
    .map((item) => ({
      ...item,
      nombre: nombrePorId.get(item.servicioId) || "Servicio no encontrado",
    }))
    .sort((a, b) => b.citas - a.citas)
    .slice(0, 3);
});

function tiempoRelativo(fecha) {
  const diff = Date.now() - fecha.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "Hace unos segundos";
  if (min < 60) return `Hace ${min} min`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `Hace ${hrs} h`;
  const dias = Math.floor(hrs / 24);
  return `Hace ${dias} d`;
}

const citasPendientes = computed(() => {
  const userMap = new Map(usuarios.value.map((u) => [u.id, u]));
  const servicioMap = new Map(servicios.value.map((s) => [s.id, s.nombre]));

  return citasConFecha.value
    .slice()
    .sort((a, b) => b.fechaObj - a.fechaObj)
    .slice(0, 3)
    .map((cita) => {
      const usuario = userMap.get(cita.usuarioId);
      const empleado = cita.empleadoId ? userMap.get(cita.empleadoId) : null;

      // Formato de fecha y hora
      const fechaFormato = cita.fechaObj.toLocaleDateString("es-MX", {
        month: "short",
        day: "numeric",
      });
      const horaFormato = cita.hora || "sin hora";

      return {
        id: cita.id,
        estado: cita.estado,
        servicioNombre:
          servicioMap.get(cita.servicioId) || "Servicio no encontrado",
        clienteNombre: usuario?.nombre || "Cliente desconocido",
        empleadoNombre: empleado?.nombre || "Empleado asignado",
        fechaHora: `${fechaFormato} · ${horaFormato}`,
      };
    });
});

const topClientes = computed(() => {
  const agg = new Map();
  const userMap = new Map(usuarios.value.map((u) => [u.id, u]));

  // Contar citas por cliente
  for (const c of citasDelMes.value.filter((x) => x.estado !== "cancelada")) {
    const userId = c.usuarioId;
    const prev = agg.get(userId) || {
      id: userId,
      citasCount: 0,
      score: 0,
    };
    prev.citasCount += 1;
    agg.set(userId, prev);
  }

  // Agregar datos del usuario (nombre, puntaje)
  return [...agg.values()]
    .map((item) => {
      const usuario = userMap.get(item.id);
      return {
        ...item,
        nombre: usuario?.nombre || "Cliente desconocido",
        score: usuario?.score || usuario?.rating || 0,
      };
    })
    .sort((a, b) => b.citasCount - a.citasCount)
    .slice(0, 3);
});
</script>
