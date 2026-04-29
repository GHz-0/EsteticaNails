<template>
  <main class="min-h-screen overflow-hidden bg-[#05060b] text-fuchsia-50">
    <div
      class="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_12%_8%,rgba(249,168,212,0.15),transparent_34%),radial-gradient(circle_at_88%_18%,rgba(234,215,161,0.11),transparent_30%),linear-gradient(160deg,#090a12_0%,#05060b_100%)]"
      aria-hidden="true"
    />

    <section class="relative mx-auto w-full max-w-[1180px] px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <header
        class="rounded-[1.4rem] border border-fuchsia-200/10 bg-white/[0.035] px-4 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:px-5"
      >
        <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p class="text-xs font-bold uppercase tracking-[0.28em] text-[#ead7a1]/80">
              Catálogo de servicios
            </p>
            <h1 class="font-display mt-1 text-[2.2rem] font-semibold leading-none tracking-tight text-fuchsia-50 sm:text-[3rem]">
              Nails Bere
            </h1>

            <div class="mt-3 flex flex-wrap items-center gap-2">
              <span class="font-ingresos-libre text-2xl font-bold text-[#f6e7bc]">4.9</span>
              <span class="flex text-[1rem] leading-none text-[#f6c56f]" aria-label="4.9 estrellas">
                <span v-for="estrella in 5" :key="estrella">★</span>
              </span>
              <span class="text-sm font-semibold text-fuchsia-100/80">500+ clientas felices</span>
            </div>
          </div>

          <nav class="flex flex-wrap items-center gap-2 text-sm font-bold">
            <button
              type="button"
              class="rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-300/24 via-pink-400/22 to-[#ead7a1]/18 px-5 py-3 text-fuchsia-50 shadow-lg shadow-black/25 transition hover:-translate-y-0.5 hover:border-[#ead7a1]/45"
              @click="irAListaServicios"
            >
              Reserva ahora
            </button>
            <a href="#valoraciones" class="rounded-full px-3 py-3 text-fuchsia-100/72 transition hover:text-[#f6e7bc]">
              Valoraciones
            </a>
            <a href="#sobre" class="rounded-full px-3 py-3 text-fuchsia-100/72 transition hover:text-[#f6e7bc]">
              Sobre
            </a>
          </nav>
        </div>
      </header>

      <section class="mt-5 overflow-hidden rounded-[1.4rem] border border-fuchsia-100/10 bg-white/[0.035] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
        <div class="grid h-[255px] grid-cols-1 gap-2 sm:h-[330px] md:grid-cols-[1.2fr_0.9fr]">
          <figure
            v-for="foto in fotosHero"
            :key="foto.src"
            class="relative h-full overflow-hidden rounded-[1rem] bg-slate-950"
          >
            <img :src="foto.src" :alt="foto.alt" class="h-full w-full object-cover" />
            <span class="absolute inset-0 bg-gradient-to-t from-[#05060b]/50 via-transparent to-transparent" />
          </figure>
        </div>
      </section>

      <section class="mt-5 grid gap-3 rounded-[1.2rem] border border-fuchsia-100/10 bg-white/[0.035] px-4 py-4 text-sm font-semibold text-fuchsia-50/88 backdrop-blur-xl">
        <p class="flex items-center gap-3">
          <span class="grid h-7 w-7 place-items-center rounded-full border border-[#ead7a1]/25 bg-[#ead7a1]/10 text-[#f6e7bc]">⌖</span>
          Chiapas · Atención personalizada en salón
        </p>
        <p class="flex items-center gap-3">
          <span class="grid h-7 w-7 place-items-center rounded-full border border-fuchsia-200/20 bg-fuchsia-300/10 text-fuchsia-100">◷</span>
          Abierto hoy · Agenda tu cita en línea
        </p>
      </section>

      <div class="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-fuchsia-300/20">
        <div class="h-full w-[58%] rounded-full bg-gradient-to-r from-[#ead7a1] via-[#f9a8d4] to-[#c570b0]" />
      </div>

      <section
        v-if="servicioDestacado"
        class="mt-3 grid items-center gap-4 rounded-[1.2rem] border border-fuchsia-100/10 bg-white/[0.035] px-4 py-5 backdrop-blur-xl md:grid-cols-[1.1fr_1.5fr_auto_auto]"
      >
        <h2 class="text-sm font-extrabold uppercase tracking-[0.12em] text-[#ead7a1]">
          Recomendado para ti
        </h2>
        <div>
          <h3 class="text-base font-bold text-fuchsia-50">{{ servicioDestacado.nombre }}</h3>
          <p class="mt-2 text-sm text-fuchsia-100/70">
            {{ formatoDuracion(servicioDestacado.duracion) }}
            <button class="ml-2 font-extrabold text-[#f6e7bc]" type="button">¿Qué incluye?</button>
          </p>
        </div>
        <p class="font-ingresos-libre text-right text-lg font-bold text-[#f6e7bc]">
          {{ formatoMoneda(servicioDestacado.precio) }}
        </p>
        <button
          type="button"
          class="justify-self-start rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 py-2 text-sm font-extrabold text-fuchsia-50 transition hover:-translate-y-0.5 hover:border-[#ead7a1]/45 hover:bg-fuchsia-300/16 md:justify-self-end"
          @click="agendar(servicioDestacado)"
        >
          Seleccionar
        </button>
      </section>

      <section id="servicios" class="pt-8">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ead7a1]/80">
          ¿Buscas algo específico?
        </p>
        <h2 class="font-display mt-1 text-[2rem] font-semibold leading-none text-fuchsia-50">
          Lista de servicios
        </h2>

        <div class="mt-6 rounded-[1.35rem] border border-fuchsia-100/10 bg-white/[0.035] px-4 py-5 shadow-[0_18px_50px_rgba(0,0,0,0.2)] backdrop-blur-xl sm:px-6">
          <div class="flex gap-3 overflow-x-auto pb-1">
            <button
              v-for="categoria in categoriasVisibles"
              :key="categoria.valor"
              type="button"
              class="grid h-[92px] min-w-[132px] place-items-center rounded-2xl border px-4 text-center text-xs font-bold shadow-[0_14px_30px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:border-[#ead7a1]/40"
              :class="categoriaActiva === categoria.valor ? 'border-[#ead7a1]/45 bg-gradient-to-br from-fuchsia-300/18 to-[#ead7a1]/12 text-fuchsia-50' : 'border-fuchsia-100/10 bg-slate-950/45 text-fuchsia-100/60'"
              @click="categoriaActiva = categoria.valor"
            >
              <span class="text-2xl leading-none text-[#f6e7bc]">{{ categoria.icono }}</span>
              <span>{{ categoria.etiqueta }}</span>
            </button>
          </div>
        </div>

        <div v-if="cargando" class="py-10 text-sm font-semibold text-fuchsia-100/55">
          Cargando servicios...
        </div>

        <div v-else-if="servicios.length === 0" class="py-10 text-sm font-semibold text-fuchsia-100/55">
          No hay servicios disponibles.
        </div>

        <div v-else class="mt-6 grid gap-8 lg:grid-cols-[285px_1fr]">
          <aside class="hidden lg:block">
            <div class="overflow-hidden rounded-[1.2rem] border border-fuchsia-100/10 bg-white/[0.035] backdrop-blur-xl">
              <button
                v-for="categoria in categoriasLateral"
                :key="categoria.valor"
                type="button"
                class="flex w-full items-center justify-between border-b border-fuchsia-100/8 px-4 py-3 text-left text-sm font-semibold transition last:border-b-0"
                :class="categoriaActiva === categoria.valor ? 'bg-fuchsia-300/10 text-[#f6e7bc]' : 'text-fuchsia-50/78 hover:bg-white/[0.04]'"
                @click="categoriaActiva = categoria.valor"
              >
                <span>{{ categoria.etiqueta }}</span>
                <span class="text-fuchsia-100/45">({{ contarPorCategoria(categoria.valor) }})</span>
              </button>
            </div>
          </aside>

          <div class="overflow-hidden rounded-[1.2rem] border border-fuchsia-100/10 bg-white/[0.035] backdrop-blur-xl">
            <p v-if="serviciosFiltrados.length === 0" class="px-5 py-8 text-sm font-semibold text-fuchsia-100/55">
              No hay servicios en esta categoría.
            </p>

            <article
              v-for="servicio in serviciosFiltrados"
              :key="servicio.id"
              class="grid gap-4 border-b border-fuchsia-100/10 px-5 py-5 last:border-b-0 md:grid-cols-[120px_1fr_auto_auto]"
            >
              <img
                :src="imagenServicio(servicio)"
                :alt="servicio.nombre"
                class="h-28 w-full rounded-[1rem] border border-fuchsia-100/10 object-cover shadow-[0_14px_30px_rgba(0,0,0,0.22)] md:h-24"
              />
              <div>
                <h3 class="text-base font-extrabold text-fuchsia-50">{{ servicio.nombre }}</h3>
                <p class="mt-2 text-sm text-fuchsia-100/68">
                  {{ formatoDuracion(servicio.duracion) }}
                  <button type="button" class="ml-2 font-extrabold text-[#f6e7bc]">¿Qué incluye?</button>
                </p>
                <p v-if="servicio.descripcion" class="mt-2 max-w-2xl text-sm leading-6 text-fuchsia-100/50">
                  {{ servicio.descripcion }}
                </p>
              </div>
              <p class="font-ingresos-libre text-lg font-bold text-[#f6e7bc]">
                {{ formatoMoneda(servicio.precio) }}
              </p>
              <button
                type="button"
                class="h-10 rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-4 text-sm font-extrabold text-fuchsia-50 transition hover:-translate-y-0.5 hover:border-[#ead7a1]/45 hover:bg-fuchsia-300/16"
                @click="agendar(servicio)"
              >
                Seleccionar
              </button>
            </article>
          </div>
        </div>
      </section>

      <section id="sobre" class="pt-12">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ead7a1]/80">
          Belleza que habla por ti
        </p>
        <h2 class="font-display mt-1 text-[2rem] font-semibold leading-none text-fuchsia-50">
          Nuestro trabajo
        </h2>
        <div class="mt-5 grid gap-4 md:grid-cols-[1.45fr_2fr]">
          <img
            :src="galeriaTrabajo[0].src"
            :alt="galeriaTrabajo[0].alt"
            class="h-[350px] w-full rounded-[1.2rem] border border-fuchsia-100/10 object-cover shadow-[0_18px_50px_rgba(0,0,0,0.22)] md:h-[430px]"
          />
          <div class="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <img
              v-for="foto in galeriaTrabajo.slice(1)"
              :key="foto.src"
              :src="foto.src"
              :alt="foto.alt"
              class="h-[165px] w-full rounded-[1.1rem] border border-fuchsia-100/10 object-cover shadow-[0_14px_34px_rgba(0,0,0,0.18)] md:h-[207px]"
            />
          </div>
        </div>
      </section>

      <section id="valoraciones" class="pt-12">
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ead7a1]/80">
          Lo dicen ellas
        </p>
        <h2 class="font-display mt-1 text-[2rem] font-semibold leading-none text-fuchsia-50">
          Clientas que nos aman
        </h2>
        <div class="mt-5 grid gap-4 md:grid-cols-3">
          <article
            v-for="opinion in opiniones"
            :key="opinion.nombre"
            class="rounded-[1.2rem] border border-fuchsia-100/10 bg-white/[0.035] p-5 backdrop-blur-xl"
          >
            <p class="text-[#f6c56f]">★★★★★</p>
            <h3 class="mt-3 font-bold text-fuchsia-50">{{ opinion.nombre }}</h3>
            <p class="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#ead7a1]/70">
              {{ opinion.servicio }}
            </p>
            <p class="mt-3 text-sm leading-6 text-fuchsia-100/58">{{ opinion.texto }}</p>
          </article>
        </div>
      </section>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { obtenerServicios } from "@/nucleo/firebase/servicios.js";
import { useRouter } from "vue-router";

const servicios = ref([]);
const cargando = ref(true);
const categoriaActiva = ref("todas");
const router = useRouter();

const fotosHero = [
  {
    src: "/img/inicio/cta.jpg",
    alt: "Servicio de belleza en Nails Bere",
  },
  {
    src: "/img/inicio/promo-manicure.jpg",
    alt: "Manicure con diseño personalizado",
  },
];

const galeriaTrabajo = [
  { src: "/img/inicio/promo-manicure.jpg", alt: "Manicure gel con diseño" },
  { src: "/img/inicio/servicio-unas.jpg", alt: "Uñas cuidadas con acabado profesional" },
  { src: "/img/inicio/servicio-color.jpg", alt: "Color y tratamiento de brillo" },
  { src: "/img/inicio/servicio-facial.jpg", alt: "Facial hidratante" },
  { src: "/img/inicio/promo-color.jpg", alt: "Servicio de color completo" },
  { src: "/img/inicio/servicio-maquillaje.jpg", alt: "Maquillaje social" },
  { src: "/img/inicio/promo-facial.jpg", alt: "Facial express" },
];

const opiniones = [
  {
    nombre: "Daniela R.",
    texto: "Me encantó la atención y mis uñas quedaron perfectas. ¡Ya agendé mi próxima cita!",
    servicio: "Manicure Gel",
  },
  {
    nombre: "Sofía M.",
    texto: "El facial express es increíble. Mi piel quedó súper luminosa y el precio es muy accesible.",
    servicio: "Facial Express",
  },
  {
    nombre: "Valeria T.",
    texto: "Para mi graduación me hicieron el maquillaje y el peinado. Quedé espectacular, ¡gracias!",
    servicio: "Maquillaje + Peinado",
  },
];

const categoriasBase = [
  { valor: "todas", etiqueta: "Todas", icono: "✦" },
  { valor: "manos", etiqueta: "Uñas", icono: "◌" },
  { valor: "pies", etiqueta: "Pedicura", icono: "⌁" },
  { valor: "facial", etiqueta: "Facial", icono: "✧" },
  { valor: "cabello", etiqueta: "Cabello", icono: "❊" },
  { valor: "eventos", etiqueta: "Eventos", icono: "◇" },
  { valor: "diseno", etiqueta: "Diseño", icono: "⋆" },
  { valor: "extensiones", etiqueta: "Extensiones", icono: "＋" },
  { valor: "otros", etiqueta: "Otros", icono: "•" },
];

const serviciosNormalizados = computed(() =>
  servicios.value.map((servicio) => ({
    ...servicio,
    categoriaNormalizada: normalizarCategoria(servicio.categoria),
  })),
);

const servicioDestacado = computed(() => servicios.value[0] || null);

const categoriasConServicios = computed(() => {
  const existentes = new Set(
    serviciosNormalizados.value.map((servicio) => servicio.categoriaNormalizada),
  );
  return categoriasBase.filter(
    (categoria) => categoria.valor === "todas" || existentes.has(categoria.valor),
  );
});

const categoriasVisibles = computed(() =>
  categoriasConServicios.value.length > 1
    ? categoriasConServicios.value
    : categoriasBase.slice(0, 6),
);

const categoriasLateral = computed(() =>
  categoriasVisibles.value.filter((categoria) => categoria.valor !== "todas"),
);

const serviciosFiltrados = computed(() => {
  if (categoriaActiva.value === "todas") return serviciosNormalizados.value;
  return serviciosNormalizados.value.filter(
    (servicio) => servicio.categoriaNormalizada === categoriaActiva.value,
  );
});

onMounted(async () => {
  try {
    servicios.value = await obtenerServicios();
  } catch (error) {
    console.error("Error cargando servicios:", error);
  } finally {
    cargando.value = false;
  }
});

function normalizarCategoria(categoria = "") {
  const valor = String(categoria)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  if (["unas", "una", "uñas", "uña", "manicura", "manos"].includes(valor)) return "manos";
  if (["pedicura", "pies"].includes(valor)) return "pies";
  if (["facial", "faciales", "piel"].includes(valor)) return "facial";
  if (["cabello", "color", "corte"].includes(valor)) return "cabello";
  if (["evento", "eventos", "maquillaje", "peinado"].includes(valor)) return "eventos";
  if (["diseno", "diseño", "decoracion", "decoración"].includes(valor)) return "diseno";
  if (["extension", "extensiones"].includes(valor)) return "extensiones";
  return valor || "otros";
}

function contarPorCategoria(categoria) {
  return serviciosNormalizados.value.filter(
    (servicio) => servicio.categoriaNormalizada === categoria,
  ).length;
}

function formatoDuracion(valor) {
  const minutos = Number(valor || 0);
  if (minutos >= 60) {
    const horas = Math.floor(minutos / 60);
    const restantes = minutos % 60;
    return restantes ? `${horas} hora ${restantes} minutos` : `${horas} hora`;
  }
  return `${minutos || 15} minutos`;
}

function formatoMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-MX")}`;
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

function irAListaServicios() {
  document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" });
}

const agendar = (servicio) => {
  sessionStorage.setItem("servicioSeleccionado", JSON.stringify(servicio));
  router.push("/usuario/mis-citas");
};
</script>
