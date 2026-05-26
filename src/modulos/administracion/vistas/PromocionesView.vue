<template>
  <section class="mx-auto w-full max-w-[1180px] px-3 pb-5 pt-4 sm:px-4 lg:px-5">
    <!-- ── HEADER ── -->
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
            Gestion de promociones
          </p>
          <h1
            class="font-display text-[2.05rem] font-semibold leading-none tracking-tight text-fuchsia-50 sm:text-[2.6rem]"
          >
            Promociones
          </h1>
          <p class="mt-2 max-w-2xl text-sm leading-6 text-slate-300/90">
            Crea, edita y administra las promociones que se muestran en la
            pagina principal y el panel de tus clientas.
          </p>
        </div>

        <div class="grid gap-2 sm:grid-cols-2">
          <div
            class="rounded-2xl border border-fuchsia-100/12 bg-white/5 px-4 py-3 text-right"
          >
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400"
            >
              Total
            </p>
            <p
              class="font-ingresos-libre text-[1.3rem] font-semibold text-fuchsia-100"
            >
              {{ promociones.length }}
            </p>
          </div>
          <div
            class="rounded-2xl border border-fuchsia-100/12 bg-white/5 px-4 py-3 text-right"
          >
            <p
              class="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400"
            >
              Activas
            </p>
            <p
              class="font-ingresos-libre text-[1.3rem] font-semibold text-[#f6e7bc]"
            >
              {{ promocionesActivas }}
            </p>
          </div>
        </div>
      </div>
    </header>

    <!-- ── CONTENIDO ── -->
    <section class="grid grid-cols-1 items-stretch gap-3">
      <!-- Formulario -->
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
                {{ editandoId ? "Editar promoción" : "Nueva promoción" }}
              </h2>
              <p class="mt-1 text-[0.72rem] leading-5 text-slate-300/85">
                {{
                  formularioAbierto
                    ? "Completa los datos de la promoción y guarda los cambios."
                    : "Crea una nueva promoción o edita una existente desde la lista."
                }}
              </p>
            </div>

            <span
              class="rounded-full border border-[#ead7a1]/30 bg-[#ead7a1]/10 px-2.5 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#f6e7bc]"
            >
              {{ editandoId ? "Edición" : "Alta" }}
            </span>
          </div>

          <div class="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              class="inline-flex items-center justify-center rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-400/20 via-pink-400/18 to-[#ead7a1]/14 px-3.5 py-1.5 text-[0.7rem] font-semibold tracking-wide text-fuchsia-50 shadow-lg shadow-black/20 transition-all hover:-translate-y-0.5 hover:border-[#ead7a1]/45"
              @click="toggleFormulario"
            >
              {{
                formularioAbierto
                  ? "Ocultar formulario"
                  : editandoId
                    ? "Continuar edición"
                    : "Agregar promoción"
              }}
            </button>
          </div>
        </div>

        <!-- Formulario expandible -->
        <Transition
          @before-enter="antesEntrar"
          @enter="entrar"
          @before-leave="antesSalir"
          @leave="salir"
        >
          <form
            v-if="formularioAbierto"
            class="grid gap-2 overflow-hidden sm:grid-cols-2 lg:grid-cols-4"
            @submit.prevent="guardarPromocion"
          >
            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Título
              <input
                v-model.trim="form.titulo"
                type="text"
                required
                maxlength="80"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Categoría
              <select
                v-model="form.categoria"
                required
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              >
                <option v-for="cat in categorias" :key="cat.valor" :value="cat.valor">
                  {{ cat.etiqueta }}
                </option>
              </select>
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Precio anterior (MXN)
              <input
                v-model.number="form.precioAntes"
                type="number"
                min="0"
                step="1"
                required
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Precio actual (MXN)
              <input
                v-model.number="form.precioAhora"
                type="number"
                min="1"
                step="1"
                required
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300 sm:col-span-2 lg:col-span-4">
              Descripción
              <textarea
                v-model.trim="form.descripcion"
                rows="2"
                maxlength="200"
                required
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              ></textarea>
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Fecha inicio
              <input
                v-model="form.fechaInicio"
                type="date"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <label class="grid gap-1 text-xs font-medium text-slate-300">
              Fecha fin (opcional)
              <input
                v-model="form.fechaFin"
                type="date"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
              />
            </label>

            <div class="flex items-end gap-4 sm:col-span-2">
              <label class="flex items-center gap-2 text-xs font-medium text-slate-300">
                <input
                  v-model="form.destacada"
                  type="checkbox"
                  class="h-4 w-4 rounded border-fuchsia-200/30 bg-slate-950/70 accent-fuchsia-400"
                />
                Destacada (Popular)
              </label>

              <label class="flex items-center gap-2 text-xs font-medium text-slate-300">
                <input
                  v-model="form.activa"
                  type="checkbox"
                  class="h-4 w-4 rounded border-fuchsia-200/30 bg-slate-950/70 accent-emerald-400"
                />
                Activa
              </label>
            </div>

            <!-- Imagen -->
            <div
              class="grid gap-3 rounded-xl border border-fuchsia-100/12 bg-slate-950/45 p-3 sm:col-span-2 sm:grid-cols-[180px_minmax(0,1fr)] lg:col-span-4"
            >
              <img
                :src="imagenPreviewUrl || form.imagenUrl || '/img/inicio/cta.jpg'"
                alt="Vista previa de la promoción"
                class="h-32 w-full rounded-lg object-cover sm:h-full"
              />
              <div class="grid min-w-0 content-center gap-2">
                <label class="grid gap-1 text-xs font-medium text-slate-300">
                  Foto de la promoción
                  <input
                    type="file"
                    accept="image/*"
                    class="block w-full min-w-0 max-w-full rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-xs text-slate-100 file:mr-3 file:rounded-full file:border-0 file:bg-fuchsia-300/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-fuchsia-100"
                    @change="alSeleccionarImagen"
                  />
                </label>
                <p class="max-w-full text-[0.68rem] leading-5 text-slate-400">
                  Sube una imagen JPG, PNG o WebP de hasta 5MB. Si no subes una,
                  se mostrara una imagen de respaldo.
                </p>
                <button
                  v-if="imagenArchivo || form.imagenUrl"
                  type="button"
                  class="w-fit rounded-full border border-fuchsia-100/18 bg-white/5 px-3 py-1 text-[0.68rem] font-semibold text-slate-200 transition-all hover:border-fuchsia-200/40"
                  @click="quitarImagen"
                >
                  Quitar foto
                </button>
              </div>
            </div>

            <!-- Mensajes -->
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

            <!-- Acciones -->
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
                Cancelar edición
              </button>
            </div>
          </form>
        </Transition>
      </article>

      <!-- ── LISTA DE PROMOCIONES ── -->
      <article
        class="rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-3.5 shadow-[0_20px_55px_rgba(0,0,0,0.28)] backdrop-blur-xl"
      >
        <div class="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <h2 class="font-display text-[1.1rem] font-semibold text-fuchsia-50">
            Promociones registradas
          </h2>
          <button
            class="rounded-full border border-fuchsia-100/18 bg-white/5 px-3 py-1.5 text-[0.72rem] font-semibold tracking-wide text-slate-200 transition-all hover:border-fuchsia-200/40 hover:text-fuchsia-50 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="cargando"
            @click="cargarPromociones"
          >
            {{ cargando ? "Actualizando..." : "Refrescar" }}
          </button>
        </div>

        <!-- Filtros -->
        <div class="mb-2.5 grid gap-1.5 sm:grid-cols-[1fr_180px]">
          <input
            v-model.trim="filtroTexto"
            type="text"
            placeholder="Buscar por titulo..."
            class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-[0.82rem] text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
          />
          <select
            v-model="filtroEstado"
            class="rounded-lg border border-fuchsia-200/15 bg-slate-950/70 px-2.5 py-1.5 text-[0.82rem] text-slate-100 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
          >
            <option value="todas">Todas</option>
            <option value="activas">Activas</option>
            <option value="inactivas">Inactivas</option>
            <option value="destacadas">Destacadas</option>
          </select>
        </div>

        <!-- Estados de carga -->
        <p v-if="cargando" class="text-xs text-slate-300">
          Cargando promociones...
        </p>
        <p v-else-if="!promociones.length" class="text-xs text-slate-300">
          No hay promociones registradas.
        </p>
        <p
          v-else-if="!promocionesFiltradas.length"
          class="text-xs text-slate-300"
        >
          No hay resultados con los filtros aplicados.
        </p>

        <!-- Grid de promos -->
        <ul v-else class="grid gap-2 md:grid-cols-2">
          <li
            v-for="promo in promocionesFiltradas"
            :key="promo.id"
            role="button"
            tabindex="0"
            class="rounded-xl border border-fuchsia-100/12 bg-white/5 px-2.5 py-2.5 transition-all hover:border-fuchsia-200/35 hover:bg-white/7"
            @click="editar(promo)"
            @keydown.enter.prevent="editar(promo)"
            @keydown.space.prevent="editar(promo)"
          >
            <div class="flex items-start gap-3">
              <img
                :src="promo.imagenUrl || '/img/inicio/cta.jpg'"
                :alt="promo.titulo"
                class="h-16 w-16 flex-shrink-0 rounded-lg object-cover"
              />

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-1.5">
                  <h3
                    class="truncate text-[0.82rem] font-semibold text-fuchsia-50"
                  >
                    {{ promo.titulo }}
                  </h3>
                  <div class="flex flex-shrink-0 gap-1">
                    <button
                      class="rounded-lg border px-2 py-1 text-[0.68rem] font-semibold transition-all"
                      :class="
                        promo.activa
                          ? 'border-emerald-300/30 bg-emerald-500/10 text-emerald-100 hover:border-emerald-300/50'
                          : 'border-amber-300/30 bg-amber-500/10 text-amber-100 hover:border-amber-300/50'
                      "
                      @click.stop="toggleActiva(promo)"
                    >
                      {{ promo.activa ? "Activa" : "Inactiva" }}
                    </button>
                    <button
                      class="rounded-lg border border-rose-300/30 bg-rose-500/10 px-2 py-1 text-[0.68rem] font-semibold text-rose-100 transition-all hover:border-rose-300/50"
                      @click.stop="eliminar(promo)"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
                <p class="mt-0.5 text-[0.72rem] leading-4 text-slate-300/90">
                  {{ promo.descripcion }}
                </p>
              </div>
            </div>

            <div class="mt-1.5 flex flex-wrap gap-1">
              <span
                class="rounded-full border border-fuchsia-100/15 bg-fuchsia-400/10 px-2 py-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-fuchsia-200"
              >
                {{ etiquetaCategoria(promo.categoria) }}
              </span>
              <span
                v-if="promo.precioAntes"
                class="rounded-full border border-slate-300/20 bg-slate-800/35 px-2 py-1 text-[0.66rem] font-semibold text-slate-400 line-through"
              >
                ${{ promo.precioAntes }}
              </span>
              <span
                class="rounded-full border border-[#ead7a1]/25 bg-[#ead7a1]/10 px-2 py-1 text-[0.66rem] font-semibold text-[#f6e7bc]"
              >
                ${{ promo.precioAhora }}
              </span>
              <span
                v-if="promo.destacada"
                class="rounded-full border border-amber-400/30 bg-gradient-to-r from-amber-500/15 to-rose-500/15 px-2 py-1 text-[0.66rem] font-bold uppercase tracking-[0.1em] text-amber-200"
              >
                ★ Popular
              </span>
              <span
                v-if="promo.fechaFin"
                class="rounded-full border border-slate-300/20 bg-slate-800/35 px-2 py-1 text-[0.66rem] font-semibold text-slate-300"
              >
                Hasta {{ formatoFecha(promo.fechaFin) }}
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
  obtenerPromociones,
  crearPromocion,
  actualizarPromocion,
  eliminarPromocion,
  subirImagenPromocion,
  eliminarImagenPromocion,
} from "@/nucleo/firebase/promociones";

const categorias = [
  { valor: "unas", etiqueta: "Uñas" },
  { valor: "facial", etiqueta: "Facial" },
  { valor: "cabello", etiqueta: "Cabello" },
  { valor: "maquillaje", etiqueta: "Maquillaje" },
  { valor: "eventos", etiqueta: "Eventos" },
  { valor: "general", etiqueta: "General" },
];

const cargando = ref(false);
const guardando = ref(false);
const promociones = ref([]);
const editandoId = ref(null);
const error = ref("");
const ok = ref("");
const filtroTexto = ref("");
const filtroEstado = ref("todas");
const formularioAbierto = ref(false);
const imagenArchivo = ref(null);
const imagenPreviewUrl = ref("");
const imagenPathAEliminar = ref("");

const formVacio = () => ({
  titulo: "",
  descripcion: "",
  precioAntes: 0,
  precioAhora: 0,
  categoria: "general",
  destacada: false,
  activa: true,
  fechaInicio: new Date().toISOString().split("T")[0],
  fechaFin: "",
  imagenUrl: "",
  imagenPath: "",
});

const form = ref(formVacio());

const promocionesActivas = computed(
  () => promociones.value.filter((p) => p.activa).length,
);

const promocionesFiltradas = computed(() => {
  const texto = filtroTexto.value.trim().toLowerCase();
  return promociones.value.filter((promo) => {
    const coincideTexto =
      !texto || (promo.titulo || "").toLowerCase().includes(texto);
    const coincideEstado =
      filtroEstado.value === "todas" ||
      (filtroEstado.value === "activas" && promo.activa) ||
      (filtroEstado.value === "inactivas" && !promo.activa) ||
      (filtroEstado.value === "destacadas" && promo.destacada);
    return coincideTexto && coincideEstado;
  });
});

function etiquetaCategoria(valor) {
  const cat = categorias.find((c) => c.valor === valor);
  return cat ? cat.etiqueta : "General";
}

function formatoFecha(fecha) {
  if (!fecha) return "";
  const d = fecha instanceof Date ? fecha : new Date(fecha);
  return d.toLocaleDateString("es-MX", { day: "numeric", month: "short" });
}

function limpiarMensajes() {
  error.value = "";
  ok.value = "";
}

function liberarPreview() {
  if (imagenPreviewUrl.value) {
    URL.revokeObjectURL(imagenPreviewUrl.value);
  }
  imagenPreviewUrl.value = "";
}

function alSeleccionarImagen(evento) {
  limpiarMensajes();
  const archivo = evento.target.files?.[0] || null;
  liberarPreview();
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

function quitarImagen() {
  liberarPreview();
  imagenArchivo.value = null;
  imagenPathAEliminar.value = form.value.imagenPath || imagenPathAEliminar.value;
  form.value.imagenUrl = "";
  form.value.imagenPath = "";
}

function toggleFormulario() {
  if (editandoId.value) {
    formularioAbierto.value = true;
    return;
  }
  formularioAbierto.value = !formularioAbierto.value;
  if (!formularioAbierto.value) {
    form.value = formVacio();
    limpiarMensajes();
  }
}

function editar(promo) {
  limpiarMensajes();
  editandoId.value = promo.id;
  formularioAbierto.value = true;
  ok.value = "Editando promoción desde el formulario.";
  form.value = {
    titulo: promo.titulo || "",
    descripcion: promo.descripcion || "",
    precioAntes: Number(promo.precioAntes || 0),
    precioAhora: Number(promo.precioAhora || 0),
    categoria: promo.categoria || "general",
    destacada: Boolean(promo.destacada),
    activa: promo.activa !== undefined ? Boolean(promo.activa) : true,
    fechaInicio: promo.fechaInicio
      ? (promo.fechaInicio instanceof Date ? promo.fechaInicio : new Date(promo.fechaInicio))
          .toISOString()
          .split("T")[0]
      : "",
    fechaFin: promo.fechaFin
      ? (promo.fechaFin instanceof Date ? promo.fechaFin : new Date(promo.fechaFin))
          .toISOString()
          .split("T")[0]
      : "",
    imagenUrl: promo.imagenUrl || "",
    imagenPath: promo.imagenPath || "",
  };
  liberarPreview();
  imagenArchivo.value = null;
  imagenPathAEliminar.value = "";
}

function cancelarEdicion() {
  editandoId.value = null;
  formularioAbierto.value = false;
  form.value = formVacio();
  liberarPreview();
  imagenArchivo.value = null;
  imagenPathAEliminar.value = "";
  limpiarMensajes();
}

async function cargarPromociones() {
  cargando.value = true;
  limpiarMensajes();
  try {
    promociones.value = await obtenerPromociones();
  } catch (e) {
    error.value = "No se pudieron cargar las promociones.";
    console.error(e);
  } finally {
    cargando.value = false;
  }
}

function validarFormulario() {
  if (!form.value.titulo || !form.value.descripcion) {
    error.value = "Completa título y descripción.";
    return false;
  }
  if (!Number.isFinite(form.value.precioAhora) || form.value.precioAhora <= 0) {
    error.value = "El precio actual debe ser mayor a 0.";
    return false;
  }
  return true;
}

async function guardarPromocion() {
  limpiarMensajes();
  if (!validarFormulario()) return;

  guardando.value = true;

  const payload = {
    titulo: form.value.titulo,
    descripcion: form.value.descripcion,
    precioAntes: Number(form.value.precioAntes),
    precioAhora: Number(form.value.precioAhora),
    categoria: form.value.categoria,
    destacada: form.value.destacada,
    activa: form.value.activa,
    fechaInicio: form.value.fechaInicio || null,
    fechaFin: form.value.fechaFin || null,
    imagenUrl: form.value.imagenUrl || "",
    imagenPath: form.value.imagenPath || "",
  };

  try {
    let promoId = editandoId.value;
    let payloadFinal = { ...payload };

    if (editandoId.value) {
      if (imagenArchivo.value) {
        const pathAnterior = form.value.imagenPath || imagenPathAEliminar.value;
        const imagen = await subirImagenPromocion(editandoId.value, imagenArchivo.value);
        payloadFinal = { ...payloadFinal, ...imagen };
        await eliminarImagenPromocion(pathAnterior);
      } else if (imagenPathAEliminar.value) {
        await eliminarImagenPromocion(imagenPathAEliminar.value);
      }
      await actualizarPromocion(editandoId.value, payloadFinal);
      ok.value = "Promoción actualizada correctamente.";
    } else {
      const creada = await crearPromocion(payloadFinal);
      promoId = creada.id;
      if (imagenArchivo.value) {
        const imagen = await subirImagenPromocion(promoId, imagenArchivo.value);
        payloadFinal = { ...payloadFinal, ...imagen };
        await actualizarPromocion(promoId, payloadFinal);
      }
      ok.value = "Promoción creada correctamente.";
    }
    cancelarEdicion();
    await cargarPromociones();
  } catch (e) {
    error.value =
      "No se pudo guardar la promoción. Verifica permisos de admin.";
    console.error(e);
  } finally {
    guardando.value = false;
  }
}

async function eliminar(promo) {
  limpiarMensajes();
  const confirmar = window.confirm(
    `¿Eliminar la promoción "${promo.titulo}"? Esta acción no se puede deshacer.`,
  );
  if (!confirmar) return;

  try {
    if (promo.imagenPath) {
      await eliminarImagenPromocion(promo.imagenPath);
    }
    await eliminarPromocion(promo.id);
    ok.value = "Promoción eliminada correctamente.";
    if (editandoId.value === promo.id) cancelarEdicion();
    await cargarPromociones();
  } catch (e) {
    error.value =
      "No se pudo eliminar la promoción. Verifica permisos de admin.";
    console.error(e);
  }
}

async function toggleActiva(promo) {
  limpiarMensajes();
  try {
    await actualizarPromocion(promo.id, { activa: !promo.activa });
    ok.value = promo.activa
      ? "Promoción desactivada."
      : "Promoción activada.";
    await cargarPromociones();
  } catch (e) {
    error.value = "No se pudo cambiar el estado de la promoción.";
    console.error(e);
  }
}

onMounted(cargarPromociones);

// ── Animaciones de transición (mismo patrón que ServiciosView) ──
function antesEntrar(el) {
  el.style.height = "0";
  el.style.opacity = "0";
  el.style.transform = "translateY(-8px) scale(0.99)";
  el.style.overflow = "hidden";
}

function entrar(el, done) {
  requestAnimationFrame(() => {
    el.style.transition =
      "height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.height = `${el.scrollHeight}px`;
    el.style.opacity = "1";
    el.style.transform = "translateY(0) scale(1)";

    const onEnd = () => {
      el.style.height = "auto";
      el.style.overflow = "visible";
      el.removeEventListener("transitionend", onEnd);
      done();
    };
    el.addEventListener("transitionend", onEnd);
  });
}

function antesSalir(el) {
  el.style.height = `${el.scrollHeight}px`;
  el.style.overflow = "hidden";
}

function salir(el, done) {
  requestAnimationFrame(() => {
    el.style.transition =
      "height 260ms cubic-bezier(0.55, 0, 1, 0.45), opacity 180ms ease, transform 260ms ease";
    el.style.height = "0";
    el.style.opacity = "0";
    el.style.transform = "translateY(-8px) scale(0.99)";

    const onEnd = () => {
      el.removeEventListener("transitionend", onEnd);
      done();
    };
    el.addEventListener("transitionend", onEnd);
  });
}
</script>
