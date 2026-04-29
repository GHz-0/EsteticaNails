<template>
  <section class="mx-auto w-full max-w-[1180px] px-3 pb-5 pt-4 sm:px-4 lg:px-5">
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
            Catalogo de servicios
          </p>
          <h1
            class="font-display text-[2.05rem] font-semibold leading-none tracking-tight text-fuchsia-50 sm:text-[2.6rem]"
          >
            Gestion de Servicios
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-300/90">
            Administra categoria, precio, duracion y descripcion con una vista
            limpia y completa.
          </p>
        </div>

        <div class="grid gap-2 sm:grid-cols-2">
          <div
            class="rounded-2xl border border-fuchsia-100/12 bg-white/5 px-4 py-3 text-right"
          >
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400"
            >
              Total servicios
            </p>
            <p
              class="font-ingresos-libre text-[1.3rem] font-semibold text-fuchsia-100"
            >
              {{ totalServicios }}
            </p>
          </div>
          <div
            class="rounded-2xl border border-fuchsia-100/12 bg-white/5 px-4 py-3 text-right"
          >
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400"
            >
              Precio promedio
            </p>
            <p
              class="font-ingresos-libre text-[1.3rem] font-semibold text-[#f6e7bc]"
            >
              {{ formatoMoneda(precioPromedio) }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <section class="grid grid-cols-1 items-stretch gap-3">
      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-3.5 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <div
          class="mb-2.5 rounded-xl border border-fuchsia-100/12 bg-white/5 px-3 py-3"
        >
          <div class="flex items-start justify-between gap-2">
            <div>
              <p
                class="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-slate-400"
              >
                Registro y Edición
              </p>
              <h2
                class="mt-1 font-display text-[1.05rem] font-semibold text-fuchsia-50"
              >
                {{ editandoId ? "Editar servicio" : "Nuevo servicio" }}
              </h2>
              <p class="mt-1 text-[0.72rem] leading-5 text-slate-300/85">
                {{
                  formularioAbierto
                    ? "Registra aqui un nuevo servicio o edita uno existente y guarda los cambios."
                    : "Registra aqui un nuevo servicio o edita uno existente desde la lista."
                }}
              </p>
            </div>

            <span
              class="rounded-full border border-[#ead7a1]/30 bg-[#ead7a1]/10 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#f6e7bc]"
            >
              {{ editandoId ? "Edicion" : "Alta" }}
            </span>
          </div>

          <div class="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-400/20 via-pink-400/18 to-[#ead7a1]/14 px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-wide text-fuchsia-50 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-[#ead7a1]/45"
              @click="toggleFormularioServicio"
            >
              {{
                formularioAbierto
                  ? "Ocultar formulario"
                  : editandoId
                    ? "Continuar edicion"
                    : "Agregar servicio"
              }}
            </button>

            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-fuchsia-100/16 bg-white/5 px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-wide text-slate-100 transition-all hover:border-fuchsia-200/35 hover:text-fuchsia-50"
              :disabled="!servicios.length"
              @click="toggleSelectorEdicion"
            >
              {{
                selectorEdicionAbierto ? "Cerrar selector" : "Editar servicio"
              }}
            </button>
          </div>

          <div
            v-if="selectorEdicionAbierto"
            class="mt-2 rounded-xl border border-fuchsia-100/12 bg-slate-950/55 p-2.5"
          >
            <label
              class="grid gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-400"
            >
              Elegir servicio
              <select
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-[0.8rem] text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
                :value="servicioEdicionId"
                :disabled="!servicios.length"
                @change="alElegirServicioEdicion"
              >
                <option value="" disabled>Selecciona un servicio</option>
                <option
                  v-for="servicio in servicios"
                  :key="servicio.id"
                  :value="servicio.id"
                >
                  {{ servicio.nombre }} ·
                  {{ etiquetaCategoria(servicio.categoria) }}
                </option>
              </select>
            </label>
            <p class="mt-1.5 text-[0.68rem] leading-5 text-slate-400">
              Al elegir uno, se cargará en el formulario para editarlo.
            </p>
          </div>

          <div class="mt-2 grid grid-cols-2 gap-1.5">
            <div
              class="rounded-lg border border-fuchsia-100/12 bg-slate-950/50 px-2.5 py-2"
            >
              <p
                class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-slate-400"
              >
                En catalogo
              </p>
              <p
                class="mt-0.5 font-ingresos-libre text-[0.98rem] text-fuchsia-100"
              >
                {{ totalServicios }}
              </p>
            </div>
            <div
              class="rounded-lg border border-fuchsia-100/12 bg-slate-950/50 px-2.5 py-2"
            >
              <p
                class="text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-slate-400"
              >
                Visibles
              </p>
              <p
                class="mt-0.5 font-ingresos-libre text-[0.98rem] text-[#f6e7bc]"
              >
                {{ serviciosFiltrados.length }}
              </p>
            </div>
          </div>
        </div>

        <Transition
          @before-enter="antesEntrarFormulario"
          @enter="entrarFormulario"
          @before-leave="antesSalirFormulario"
          @leave="salirFormulario"
        >
          <form
            v-if="formularioAbierto"
            class="grid gap-2 overflow-hidden sm:grid-cols-2 lg:grid-cols-4"
            @submit.prevent="guardarServicio"
          >
            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Nombre
              <input
                v-model.trim="form.nombre"
                type="text"
                required
                maxlength="80"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Categoria
              <select
                v-model="form.categoria"
                required
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              >
                <option v-for="cat in categorias" :key="cat" :value="cat">
                  {{ etiquetaCategoria(cat) }}
                </option>
              </select>
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Precio (MXN)
              <input
                v-model.number="form.precio"
                type="number"
                min="1"
                step="1"
                required
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Duracion (min)
              <input
                v-model.number="form.duracion"
                type="number"
                min="5"
                step="5"
                required
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300 sm:col-span-2 lg:col-span-4">
              Descripcion
              <textarea
                v-model.trim="form.descripcion"
                rows="3"
                maxlength="280"
                required
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              ></textarea>
            </label>

            <div
              class="grid gap-3 rounded-xl border border-fuchsia-100/12 bg-slate-950/45 p-3 sm:col-span-2 sm:grid-cols-[180px_minmax(0,1fr)] lg:col-span-4"
            >
              <img
                :src="imagenPreviewUrl || form.imagenUrl || imagenPorCategoria(form.categoria)"
                alt="Vista previa del servicio"
                class="h-32 w-full rounded-lg object-cover sm:h-full"
              />
              <div class="grid min-w-0 content-center gap-2">
                <label class="grid gap-1 text-xs font-medium text-slate-300">
                  Foto del servicio
                  <input
                    type="file"
                    accept="image/*"
                    class="block w-full min-w-0 max-w-full rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-100 file:mr-3 file:rounded-full file:border-0 file:bg-fuchsia-300/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-fuchsia-100"
                    @change="alSeleccionarImagen"
                  />
                </label>
                <p class="max-w-full text-[0.68rem] leading-5 text-slate-400">
                  Sube una imagen JPG, PNG o WebP de hasta 5MB. Si no subes una,
                  se mostrara una foto de respaldo segun la categoria.
                </p>
                <button
                  v-if="imagenArchivo || form.imagenUrl"
                  type="button"
                  class="w-fit rounded-full border border-fuchsia-100/18 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold text-slate-200 transition-all hover:border-fuchsia-200/40"
                  @click="quitarImagenSeleccionada"
                >
                  Quitar foto
                </button>
              </div>
            </div>

            <p
              v-if="error"
              class="rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-100 sm:col-span-2 lg:col-span-4"
            >
              {{ error }}
            </p>
            <p
              v-if="ok"
              class="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-100 sm:col-span-2 lg:col-span-4"
            >
              {{ ok }}
            </p>

            <div class="flex flex-wrap gap-2 pt-1 sm:col-span-2 lg:col-span-4">
              <button
                type="submit"
                class="inline-flex items-center justify-center rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-400/20 via-pink-400/18 to-[#ead7a1]/14 px-4 py-1.5 text-[0.72rem] font-semibold tracking-wide text-fuchsia-50 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-[#ead7a1]/45 disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="guardando"
              >
                {{
                  guardando
                    ? "Guardando..."
                    : editandoId
                      ? "Actualizar"
                      : "Crear"
                }}
              </button>
              <button
                v-if="editandoId"
                type="button"
                class="rounded-full border border-fuchsia-100/18 bg-white/5 px-4 py-1.5 text-[0.72rem] font-semibold tracking-wide text-slate-200 transition-all hover:border-fuchsia-200/40 hover:text-fuchsia-50"
                :disabled="guardando"
                @click="cancelarEdicion"
              >
                Cancelar edicion
              </button>
            </div>
          </form>
        </Transition>
      </article>

      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-3.5 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <div class="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <h2 class="font-display text-[1.1rem] font-semibold text-fuchsia-50">
            Servicios registrados
          </h2>
          <button
            class="rounded-full border border-fuchsia-100/18 bg-white/5 px-3 py-1.5 text-[0.72rem] font-semibold tracking-wide text-slate-200 transition-all hover:border-fuchsia-200/40 hover:text-fuchsia-50 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="cargando"
            @click="cargarServicios"
          >
            {{ cargando ? "Actualizando..." : "Refrescar" }}
          </button>
        </div>

        <div class="mb-2.5 grid gap-1.5 sm:grid-cols-[1fr_180px]">
          <input
            v-model.trim="filtroTexto"
            type="text"
            placeholder="Buscar por nombre..."
            class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-[0.82rem] text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
          />
          <select
            v-model="filtroCategoria"
            class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-[0.82rem] text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
          >
            <option value="todas">Todas las categorias</option>
            <option v-for="cat in categorias" :key="cat" :value="cat">
              {{ etiquetaCategoria(cat) }}
            </option>
          </select>
        </div>

        <p v-if="cargando" class="text-xs text-slate-300">
          Cargando servicios...
        </p>
        <p v-else-if="!servicios.length" class="text-xs text-slate-300">
          No hay servicios registrados.
        </p>
        <p
          v-else-if="!serviciosFiltrados.length"
          class="text-xs text-slate-300"
        >
          No hay resultados con los filtros aplicados.
        </p>

        <ul v-else class="grid gap-2 md:grid-cols-2">
          <li
            v-for="servicio in serviciosFiltrados"
            :key="servicio.id"
            role="button"
            tabindex="0"
            class="rounded-xl border border-fuchsia-100/12 bg-white/5 px-2.5 py-2.5 transition-all hover:border-fuchsia-200/35 hover:bg-white/7"
            @click="editar(servicio)"
            @keydown.enter.prevent="editar(servicio)"
            @keydown.space.prevent="editar(servicio)"
          >
            <div class="flex flex-wrap items-start justify-between gap-1.5">
              <img
                :src="servicio.imagenUrl || imagenPorCategoria(servicio.categoria)"
                :alt="servicio.nombre"
                class="h-14 w-14 rounded-lg object-cover"
              />
              <div class="min-w-0 flex-1">
                <h3
                  class="truncate text-[0.82rem] font-semibold text-fuchsia-50"
                >
                  {{ servicio.nombre }}
                </h3>
                <p class="mt-0.5 text-[0.72rem] leading-4 text-slate-300/90">
                  {{ servicio.descripcion }}
                </p>
              </div>

              <div class="flex gap-1">
                <button
                  class="rounded-lg border border-rose-300/30 bg-rose-500/10 px-2 py-1 text-[0.68rem] font-semibold text-rose-100 transition-all hover:border-rose-300/50"
                  @click.stop="eliminar(servicio)"
                >
                  Eliminar
                </button>
              </div>
            </div>

            <div class="mt-1.5 flex flex-wrap gap-1">
              <span
                class="rounded-full border border-fuchsia-100/15 bg-fuchsia-400/10 px-2 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-fuchsia-200"
              >
                {{ etiquetaCategoria(servicio.categoria) }}
              </span>
              <span
                class="rounded-full border border-[#ead7a1]/25 bg-[#ead7a1]/10 px-2 py-1 text-[0.66rem] font-semibold text-[#f6e7bc]"
              >
                {{ formatoMoneda(servicio.precio) }}
              </span>
              <span
                class="rounded-full border border-slate-300/20 bg-slate-800/35 px-2 py-1 text-[0.66rem] font-semibold text-slate-200"
              >
                {{ servicio.duracion }} min
              </span>
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
  actualizarServicio,
  crearServicio,
  eliminarServicio,
  eliminarImagenServicio,
  limpiarDuplicadosServicios,
  obtenerServicios,
  subirImagenServicio,
} from "@/nucleo/firebase/servicios";

const categorias = ["manos", "pies", "diseño", "extensiones", "otros"];

const cargando = ref(false);
const guardando = ref(false);
const servicios = ref([]);
const editandoId = ref(null);
const error = ref("");
const ok = ref("");
const filtroTexto = ref("");
const filtroCategoria = ref("todas");
const duplicadosDepurados = ref(false);
const formularioAbierto = ref(false);
const selectorEdicionAbierto = ref(false);
const servicioEdicionId = ref("");
const imagenArchivo = ref(null);
const imagenPreviewUrl = ref("");
const imagenPathAEliminar = ref("");

const formVacio = () => ({
  nombre: "",
  categoria: "manos",
  precio: 250,
  duracion: 30,
  descripcion: "",
  imagenUrl: "",
  imagenPath: "",
});

const form = ref(formVacio());

const serviciosFiltrados = computed(() => {
  const texto = filtroTexto.value.trim().toLowerCase();
  return servicios.value.filter((servicio) => {
    const coincideTexto =
      !texto || (servicio.nombre || "").toLowerCase().includes(texto);
    const coincideCategoria =
      filtroCategoria.value === "todas" ||
      servicio.categoria === filtroCategoria.value;
    return coincideTexto && coincideCategoria;
  });
});

const totalServicios = computed(() => servicios.value.length);

const precioPromedio = computed(() => {
  if (!servicios.value.length) return 0;
  const total = servicios.value.reduce(
    (acc, item) => acc + Number(item.precio || 0),
    0,
  );
  return Math.round(total / servicios.value.length);
});

function etiquetaCategoria(categoria) {
  const etiquetas = {
    manos: "Manos",
    pies: "Pies",
    diseño: "Diseño",
    extensiones: "Extensiones",
    otros: "Otros",
  };
  return etiquetas[categoria] || "Otros";
}

function formatoMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-MX")}`;
}

function normalizarCategoriaImagen(categoria = "") {
  return String(categoria)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function imagenPorCategoria(categoria = "") {
  const valor = normalizarCategoriaImagen(categoria);
  const imagenes = {
    manos: "/img/inicio/servicio-unas.jpg",
    unas: "/img/inicio/servicio-unas.jpg",
    pies: "/img/inicio/promo-manicure.jpg",
    diseno: "/img/inicio/promo-manicure.jpg",
    extensiones: "/img/inicio/servicio-unas.jpg",
    facial: "/img/inicio/servicio-facial.jpg",
    cabello: "/img/inicio/servicio-color.jpg",
    eventos: "/img/inicio/servicio-maquillaje.jpg",
  };
  return imagenes[valor] || "/img/inicio/cta.jpg";
}

function liberarPreviewImagen() {
  if (imagenPreviewUrl.value) {
    URL.revokeObjectURL(imagenPreviewUrl.value);
  }
  imagenPreviewUrl.value = "";
}

function alSeleccionarImagen(evento) {
  limpiarMensajes();
  const archivo = evento.target.files?.[0] || null;
  liberarPreviewImagen();
  imagenArchivo.value = null;

  if (!archivo) return;

  if (!archivo.type?.startsWith("image/")) {
    error.value = "El archivo debe ser una imagen.";
    evento.target.value = "";
    return;
  }

  if (archivo.size > 5 * 1024 * 1024) {
    error.value = "La imagen no debe superar 5MB.";
    evento.target.value = "";
    return;
  }

  imagenArchivo.value = archivo;
  imagenPreviewUrl.value = URL.createObjectURL(archivo);
}

function quitarImagenSeleccionada() {
  liberarPreviewImagen();
  imagenArchivo.value = null;
  imagenPathAEliminar.value = form.value.imagenPath || imagenPathAEliminar.value;
  form.value.imagenUrl = "";
  form.value.imagenPath = "";
}

function limpiarMensajes() {
  error.value = "";
  ok.value = "";
}

function validarFormulario() {
  if (!form.value.nombre || !form.value.descripcion) {
    error.value = "Completa nombre y descripcion.";
    return false;
  }
  if (!Number.isFinite(form.value.precio) || form.value.precio <= 0) {
    error.value = "El precio debe ser mayor a 0.";
    return false;
  }
  if (!Number.isFinite(form.value.duracion) || form.value.duracion <= 0) {
    error.value = "La duracion debe ser mayor a 0.";
    return false;
  }
  return true;
}

async function cargarServicios() {
  cargando.value = true;
  limpiarMensajes();
  try {
    if (!duplicadosDepurados.value) {
      const resultado = await limpiarDuplicadosServicios();
      duplicadosDepurados.value = true;
      if (resultado.eliminados > 0) {
        ok.value = `Se limpiaron ${resultado.eliminados} servicios duplicados.`;
      }
    }

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
  formularioAbierto.value = true;
  selectorEdicionAbierto.value = false;
  servicioEdicionId.value = servicio.id;
  ok.value = "Editando servicio desde el formulario.";
  form.value = {
    nombre: servicio.nombre || "",
    categoria: categorias.includes(servicio.categoria)
      ? servicio.categoria
      : "otros",
    precio: Number(servicio.precio || 0),
    duracion: Number(servicio.duracion || 0),
    descripcion: servicio.descripcion || "",
    imagenUrl: servicio.imagenUrl || "",
    imagenPath: servicio.imagenPath || "",
  };
  liberarPreviewImagen();
  imagenArchivo.value = null;
  imagenPathAEliminar.value = "";
}

function cancelarEdicion() {
  editandoId.value = null;
  formularioAbierto.value = false;
  form.value = formVacio();
  servicioEdicionId.value = "";
  liberarPreviewImagen();
  imagenArchivo.value = null;
  imagenPathAEliminar.value = "";
  limpiarMensajes();
}

function toggleFormularioServicio() {
  if (editandoId.value) {
    formularioAbierto.value = true;
    return;
  }

  selectorEdicionAbierto.value = false;

  formularioAbierto.value = !formularioAbierto.value;

  if (!formularioAbierto.value) {
    form.value = formVacio();
    limpiarMensajes();
  }
}

function toggleSelectorEdicion() {
  selectorEdicionAbierto.value = !selectorEdicionAbierto.value;
  if (selectorEdicionAbierto.value) {
    formularioAbierto.value = false;
  } else {
    servicioEdicionId.value = "";
  }
}

function alElegirServicioEdicion(evento) {
  const id = evento.target.value;
  const servicio = servicios.value.find((item) => item.id === id);
  if (!servicio) return;

  editar(servicio);
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
    imagenUrl: form.value.imagenUrl || "",
    imagenPath: form.value.imagenPath || "",
  };

  try {
    let servicioGuardadoId = editandoId.value;
    let payloadFinal = { ...payload };

    if (editandoId.value) {
      if (imagenArchivo.value) {
        const imagenAnteriorPath = form.value.imagenPath || imagenPathAEliminar.value;
        const imagen = await subirImagenServicio(editandoId.value, imagenArchivo.value);
        payloadFinal = { ...payloadFinal, ...imagen };
        await eliminarImagenServicio(imagenAnteriorPath);
      } else if (imagenPathAEliminar.value) {
        await eliminarImagenServicio(imagenPathAEliminar.value);
      }
      await actualizarServicio(editandoId.value, payloadFinal);
      ok.value = "Servicio actualizado correctamente.";
    } else {
      const creado = await crearServicio(payloadFinal);
      servicioGuardadoId = creado.id;
      if (imagenArchivo.value) {
        const imagen = await subirImagenServicio(servicioGuardadoId, imagenArchivo.value);
        payloadFinal = { ...payloadFinal, ...imagen };
        await actualizarServicio(servicioGuardadoId, payloadFinal);
      }
      ok.value = "Servicio creado correctamente.";
    }
    cancelarEdicion();
    await cargarServicios();
  } catch (e) {
    if (e?.code === "DUPLICATE_SERVICE") {
      error.value = "Ya existe un servicio con ese nombre y categoria.";
    } else if (
      e?.code === "storage/unauthorized" ||
      e?.code === "storage/canceled" ||
      e?.code === "storage/retry-limit-exceeded" ||
      e?.code === "STORAGE_UPLOAD_TIMEOUT"
    ) {
      error.value =
        "No se pudo subir la foto. Revisa las reglas de Firebase Storage y vuelve a intentar.";
    } else if (e?.code === "INVALID_IMAGE_TYPE" || e?.code === "IMAGE_TOO_LARGE") {
      error.value = e.message;
    } else {
      error.value =
        "No se pudo guardar el servicio. Verifica permisos de admin.";
    }
    console.error(e);
  } finally {
    guardando.value = false;
  }
}

async function eliminar(servicio) {
  limpiarMensajes();
  const confirmar = window.confirm(
    `¿Eliminar el servicio "${servicio.nombre}"? Esta accion no se puede deshacer.`,
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

function antesEntrarFormulario(elemento) {
  elemento.style.height = "0";
  elemento.style.opacity = "0";
  elemento.style.transform = "translateY(-8px) scale(0.99)";
  elemento.style.overflow = "hidden";
}

function entrarFormulario(elemento, completar) {
  requestAnimationFrame(() => {
    elemento.style.transition =
      "height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1)";
    elemento.style.height = `${elemento.scrollHeight}px`;
    elemento.style.opacity = "1";
    elemento.style.transform = "translateY(0) scale(1)";

    const alTerminar = () => {
      elemento.style.height = "auto";
      elemento.style.overflow = "visible";
      elemento.removeEventListener("transitionend", alTerminar);
      completar();
    };

    elemento.addEventListener("transitionend", alTerminar);
  });
}

function antesSalirFormulario(elemento) {
  elemento.style.height = `${elemento.scrollHeight}px`;
  elemento.style.opacity = "1";
  elemento.style.transform = "translateY(0) scale(1)";
  elemento.style.overflow = "hidden";
}

function salirFormulario(elemento, completar) {
  requestAnimationFrame(() => {
    elemento.style.transition =
      "height 260ms cubic-bezier(0.22, 1, 0.36, 1), opacity 180ms ease, transform 260ms cubic-bezier(0.22, 1, 0.36, 1)";
    void elemento.offsetHeight;
    elemento.style.height = "0";
    elemento.style.opacity = "0";
    elemento.style.transform = "translateY(-8px) scale(0.99)";

    const alTerminar = () => {
      elemento.removeEventListener("transitionend", alTerminar);
      completar();
    };

    elemento.addEventListener("transitionend", alTerminar);
  });
}
</script>
