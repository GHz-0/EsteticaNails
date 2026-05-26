<template>
  <main class="mx-auto w-full max-w-[1180px] px-3 pb-8 pt-4 sm:px-4 lg:px-5">
    <section
      class="relative overflow-hidden rounded-[1.75rem] border border-fuchsia-100/12 bg-[rgba(6,8,14,0.82)] shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl"
    >
      <img
        src="/img/inicio/cta.jpg"
        alt=""
        class="absolute inset-0 h-full w-full object-cover opacity-28"
      />
      <div class="absolute inset-0 bg-gradient-to-r from-[#05060b] via-[#05060b]/82 to-[#05060b]/44" />
      <div class="relative grid gap-6 px-5 py-7 sm:px-7 lg:grid-cols-[1fr_310px] lg:items-end">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-[#ead7a1]/85">
            Bienvenida de vuelta
          </p>
          <h1 class="font-display mt-2 text-[2.4rem] font-semibold leading-none text-fuchsia-50 sm:text-[3.4rem]">
            {{ nombreCorto }}
          </h1>
          <p class="mt-3 max-w-xl text-sm leading-6 text-fuchsia-100/72">
            Agenda tu proxima cita, revisa tus servicios favoritos y mantente al dia con Nails Bere.
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <RouterLink
              to="/usuario/servicios"
              class="rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-300/24 via-pink-400/22 to-[#ead7a1]/18 px-5 py-2.5 text-sm font-bold text-fuchsia-50 shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:border-[#ead7a1]/45"
            >
              Explorar servicios
            </RouterLink>
            <RouterLink
              to="/usuario/mis-citas"
              class="rounded-full border border-fuchsia-100/14 bg-white/5 px-5 py-2.5 text-sm font-bold text-fuchsia-100/80 transition hover:border-fuchsia-200/35 hover:text-fuchsia-50"
            >
              Mis citas
            </RouterLink>
          </div>
        </div>

        <article
          class="rounded-[1.35rem] border border-fuchsia-100/12 bg-slate-950/62 p-4 shadow-[0_18px_45px_rgba(0,0,0,0.28)]"
        >
          <p class="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[#ead7a1]/75">
            Proxima cita
          </p>
          <div v-if="proximaCita" class="mt-3">
            <h2 class="font-display text-[1.4rem] font-semibold text-fuchsia-50">
              {{ proximaCita.servicio }}
            </h2>
            <p class="mt-2 text-sm text-fuchsia-100/65">
              {{ proximaCita.fecha }} · {{ proximaCita.hora }}
            </p>
            <p class="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-fuchsia-100/42">
              {{ proximaCita.empleada }}
            </p>
            <span
              class="mt-4 inline-flex rounded-full border border-emerald-300/25 bg-emerald-400/10 px-3 py-1 text-xs font-bold text-emerald-100"
            >
              Confirmada
            </span>
          </div>
          <div v-else class="mt-3">
            <h2 class="font-display text-[1.35rem] font-semibold text-fuchsia-50">
              Sin citas pendientes
            </h2>
            <p class="mt-2 text-sm leading-6 text-fuchsia-100/58">
              Elige un servicio y reserva el horario que mejor te quede.
            </p>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-4 grid gap-3 sm:grid-cols-3">
      <article
        v-for="stat in stats"
        :key="stat.titulo"
        class="rounded-[1.25rem] border border-fuchsia-100/10 bg-white/[0.035] p-4 shadow-[0_18px_45px_rgba(0,0,0,0.2)] backdrop-blur-xl"
      >
        <div class="flex items-center justify-between gap-3">
          <p class="text-xs font-bold uppercase tracking-[0.16em] text-fuchsia-100/48">
            {{ stat.titulo }}
          </p>
          <span class="grid h-9 w-9 place-items-center rounded-full border border-[#ead7a1]/22 bg-[#ead7a1]/10 text-[#f6e7bc]">
            {{ stat.icono }}
          </span>
        </div>
        <p class="font-ingresos-libre mt-3 text-[1.8rem] font-bold leading-none text-fuchsia-50">
          {{ stat.valor }}
        </p>
      </article>
    </section>

    <!-- ── PROMOCIONES ACTIVAS ── -->
    <section v-if="promos.length" class="mt-6">
      <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-[#ead7a1]/80">
            Ofertas especiales
          </p>
          <h2 class="font-display mt-1 text-[2rem] font-semibold leading-none text-fuchsia-50">
            Promociones para ti
          </h2>
        </div>
      </div>

      <div class="flex gap-3 overflow-x-auto pb-2" style="scrollbar-width: thin; scrollbar-color: rgba(249,168,212,0.2) transparent;">
        <article
          v-for="promo in promos"
          :key="promo.id"
          class="group relative flex w-[300px] flex-shrink-0 gap-3 overflow-hidden rounded-[1.25rem] border border-fuchsia-100/10 bg-white/[0.035] p-3 shadow-[0_18px_45px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-fuchsia-200/28"
        >
          <span
            v-if="promo.destacada"
            class="absolute right-2 top-2 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-2 py-0.5 text-[0.6rem] font-extrabold uppercase text-white shadow-lg"
          >
            Popular ★
          </span>

          <img
            :src="promo.imagenUrl || '/img/inicio/cta.jpg'"
            :alt="promo.titulo"
            class="h-20 w-20 flex-shrink-0 rounded-xl object-cover transition group-hover:scale-105"
          />

          <div class="flex min-w-0 flex-1 flex-col justify-between">
            <div>
              <h3 class="font-display truncate text-[1.05rem] font-semibold text-fuchsia-50">
                {{ promo.titulo }}
              </h3>
              <p class="mt-1 line-clamp-2 text-[0.72rem] leading-4 text-fuchsia-100/52">
                {{ promo.descripcion }}
              </p>
            </div>
            <div class="mt-2 flex items-center gap-2">
              <span
                v-if="promo.precioAntes"
                class="text-xs text-fuchsia-100/40 line-through"
              >
                ${{ promo.precioAntes }}
              </span>
              <span class="font-ingresos-libre text-lg font-bold text-[#f6e7bc]">
                ${{ promo.precioAhora }}
              </span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mt-6">
      <div class="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.22em] text-[#ead7a1]/80">
            Recomendados
          </p>
          <h2 class="font-display mt-1 text-[2rem] font-semibold leading-none text-fuchsia-50">
            Servicios para ti
          </h2>
        </div>
        <RouterLink
          to="/usuario/servicios"
          class="text-sm font-bold text-fuchsia-100/70 transition hover:text-[#f6e7bc]"
        >
          Ver todos
        </RouterLink>
      </div>

      <div v-if="!serviciosDestacados.length" class="rounded-[1.25rem] border border-fuchsia-100/10 bg-white/[0.035] p-6 text-sm text-fuchsia-100/58">
        Aun no hay servicios disponibles.
      </div>

      <div v-else class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <article
          v-for="servicio in serviciosDestacados"
          :key="servicio.id"
          class="overflow-hidden rounded-[1.25rem] border border-fuchsia-100/10 bg-white/[0.035] shadow-[0_18px_45px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-fuchsia-200/28"
        >
          <img
            :src="imagenServicio(servicio)"
            :alt="servicio.nombre"
            class="h-36 w-full object-cover"
          />
          <div class="p-4">
            <h3 class="font-display text-[1.25rem] font-semibold text-fuchsia-50">
              {{ servicio.nombre }}
            </h3>
            <p class="mt-2 line-clamp-2 text-sm leading-6 text-fuchsia-100/52">
              {{ servicio.descripcion || "Atencion personalizada en Nails Bere." }}
            </p>
            <div class="mt-4 flex items-center justify-between gap-3">
              <span class="font-ingresos-libre text-lg font-bold text-[#f6e7bc]">
                {{ formatoMoneda(servicio.precio) }}
              </span>
              <RouterLink
                to="/usuario/servicios"
                class="rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-3 py-1.5 text-xs font-bold text-fuchsia-50 transition hover:border-[#ead7a1]/40"
              >
                Agendar
              </RouterLink>
            </div>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/nucleo/estado/auth";
import { obtenerServicios } from "@/nucleo/firebase/servicios";
import { obtenerMisCitas } from "@/nucleo/firebase/citas";
import { obtenerPromocionesActivas } from "@/nucleo/firebase/promociones";

const auth = useAuthStore();
const servicios = ref([]);
const citas = ref([]);
const promos = ref([]);

const nombreCorto = computed(
  () => auth.usuario?.nombre?.split(" ")[0] || "Clienta",
);

onMounted(async () => {
  try {
    const [listaServicios, listaCitas, listaPromos] = await Promise.all([
      obtenerServicios(),
      obtenerMisCitas(),
      obtenerPromocionesActivas(),
    ]);
    servicios.value = listaServicios;
    citas.value = listaCitas;
    promos.value = listaPromos;
  } catch (error) {
    console.error("Error cargando datos del panel:", error);
  }
});

const citasActivas = computed(() =>
  citas.value.filter((cita) => cita.estado !== "cancelada"),
);

const proximaCita = computed(() => {
  const ahora = new Date();
  const candidatas = citasActivas.value
    .map((cita) => {
      const fecha = cita.fecha instanceof Date ? cita.fecha : new Date(cita.fecha);
      return { ...cita, fechaObj: fecha };
    })
    .filter((cita) => cita.fechaObj instanceof Date && !Number.isNaN(cita.fechaObj.getTime()))
    .filter((cita) => cita.fechaObj >= ahora)
    .sort((a, b) => a.fechaObj - b.fechaObj);

  if (!candidatas.length) return null;

  const cita = candidatas[0];
  const servicio = servicios.value.find((item) => item.id === cita.servicioId);

  return {
    servicio: servicio?.nombre || "Servicio",
    fecha: cita.fechaObj.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    }),
    hora: cita.hora || "--:--",
    empleada: cita.empleadaNombre || "Por asignar",
  };
});

const stats = computed(() => {
  const hoy = new Date();
  const citasMes = citasActivas.value.filter((cita) => {
    const fecha = cita.fecha instanceof Date ? cita.fecha : new Date(cita.fecha);
    return (
      fecha instanceof Date &&
      !Number.isNaN(fecha.getTime()) &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  }).length;

  const serviciosUsados = new Set(
    citasActivas.value.map((cita) => cita.servicioId).filter(Boolean),
  ).size;

  return [
    { titulo: "Citas este mes", valor: String(citasMes), icono: "◷" },
    { titulo: "Servicios usados", valor: String(serviciosUsados), icono: "✦" },
    { titulo: "Puntos acumulados", valor: String(citasActivas.value.length * 40), icono: "◇" },
  ];
});

const serviciosDestacados = computed(() => servicios.value.slice(0, 4));

function formatoMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-MX")}`;
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
