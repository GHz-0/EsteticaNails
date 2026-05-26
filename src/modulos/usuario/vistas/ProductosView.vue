<template>
  <main class="mx-auto w-full max-w-[1180px] px-3 pb-8 pt-4 sm:px-4 lg:px-5">
    <!-- Header de la Tienda -->
    <header
      class="relative overflow-hidden rounded-[1.75rem] border border-fuchsia-100/12 bg-[rgba(6,8,14,0.84)] px-5 py-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:px-7"
    >
      <span class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ead7a1]/70 to-transparent" />
      <div class="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-[#ead7a1]/80">
            Tienda Nails Bere
          </p>
          <h1 class="font-display mt-1 text-[2.35rem] font-semibold leading-none text-fuchsia-50 sm:text-[3rem]">
            Productos de Estética
          </h1>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-fuchsia-100/64">
            Adquiere esmaltes, geles, tratamientos y productos de cuidado para recibir directo en la comodidad de tu hogar.
          </p>
        </div>

        <!-- Carrito Flotante / Contador -->
        <button
          @click="abrirCarrito = true"
          class="relative flex items-center gap-2 rounded-2xl border border-fuchsia-100/12 bg-white/5 px-4 py-3 hover:border-fuchsia-200/30 transition text-left"
        >
          <span class="text-lg">🛒</span>
          <div>
            <p class="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-fuchsia-100/45">
              Mi Carrito
            </p>
            <p class="text-sm font-bold text-[#f6e7bc]">
              {{ totalItemsCarrito }} items · {{ formatoMoneda(totalCarrito) }}
            </p>
          </div>
          <span
            v-if="totalItemsCarrito > 0"
            class="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-pink-500 text-[0.68rem] font-bold text-white shadow-lg"
          >
            {{ totalItemsCarrito }}
          </span>
        </button>
      </div>
    </header>

    <!-- Contenido: Buscador y Catálogo -->
    <section class="mt-6 grid gap-4 lg:grid-cols-[1fr_280px] items-start">
      <!-- Grid de Productos -->
      <div>
        <!-- Buscador y Filtros -->
        <div class="mb-4 flex flex-wrap gap-2.5">
          <input
            v-model.trim="buscar"
            type="search"
            placeholder="Buscar productos por nombre o marca..."
            class="min-h-10 flex-1 rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3.5 text-xs text-fuchsia-50 outline-none transition placeholder:text-fuchsia-100/28 focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
          />
          <select
            v-model="categoriaSeleccionada"
            class="min-h-10 rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3.5 text-xs text-fuchsia-50 outline-none transition focus:border-[#ead7a1]/55 focus:ring-2 focus:ring-[#ead7a1]/15"
          >
            <option value="todas">Todas las categorías</option>
            <option v-for="cat in categorias" :key="cat" :value="cat">
              {{ capitalizar(cat) }}
            </option>
          </select>
        </div>

        <div v-if="cargando" class="rounded-[1.4rem] border border-fuchsia-100/10 bg-slate-950/35 p-12 text-center text-sm text-fuchsia-100/58">
          Cargando productos de la tienda...
        </div>
        <div v-else-if="!productosFiltrados.length" class="rounded-[1.4rem] border border-fuchsia-100/10 bg-slate-950/35 p-12 text-center text-sm text-fuchsia-100/58">
          No encontramos productos disponibles con los filtros actuales.
        </div>

        <!-- Grid -->
        <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="p in productosFiltrados"
            :key="p.id"
            class="overflow-hidden rounded-[1.25rem] border border-fuchsia-100/10 bg-white/[0.035] shadow-[0_18px_45px_rgba(0,0,0,0.2)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-fuchsia-200/28"
          >
            <!-- Imagen decorativa del producto -->
            <div class="relative h-40 bg-slate-950/40 flex items-center justify-center">
              <span class="absolute right-2.5 top-2.5 rounded-full bg-slate-950/60 px-2 py-0.5 text-[0.62rem] font-bold text-[#f6e7bc]">
                Stock: {{ p.cantidad }}
              </span>
              <!-- Ilustración/icono grande -->
              <span class="text-5xl select-none">{{ iconoProducto(p.categoria) }}</span>
            </div>

            <div class="p-4">
              <div class="flex items-center justify-between gap-2">
                <span class="text-[0.65rem] font-bold uppercase tracking-wider text-fuchsia-300/60">
                  {{ p.marca }}
                </span>
                <span class="rounded-full border border-fuchsia-100/12 bg-white/5 px-2 py-0.5 text-[0.6rem] font-medium text-slate-300">
                  {{ p.categoria }}
                </span>
              </div>

              <h3 class="font-display mt-1 text-[1.2rem] font-semibold text-fuchsia-50 truncate">
                {{ p.nombre }}
              </h3>

              <div class="mt-4 flex items-center justify-between gap-3">
                <span class="font-ingresos-libre text-lg font-bold text-[#f6e7bc]">
                  {{ formatoMoneda(p.precioVenta) }}
                </span>

                <!-- Agregar al carrito -->
                <button
                  v-if="p.cantidad > 0"
                  @click="agregarAlCarrito(p)"
                  class="rounded-full border border-fuchsia-300/30 bg-fuchsia-300/10 px-3.5 py-1.5 text-xs font-bold text-fuchsia-50 transition hover:border-[#ead7a1]/40"
                >
                  Agregar
                </button>
                <span v-else class="text-xs font-semibold text-rose-300">
                  Agotado
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>

      <!-- Resumen / Checkout Rápido -->
      <aside
        class="rounded-[1.4rem] border border-fuchsia-100/10 bg-white/[0.035] p-4 shadow-[0_20px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:p-5"
      >
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ead7a1]/75">
          Resumen
        </p>
        <h2 class="font-display mt-1 text-[1.5rem] font-semibold text-fuchsia-50">
          Mi Compra
        </h2>

        <div v-if="carrito.length === 0" class="mt-4 py-8 text-center text-xs text-fuchsia-100/40">
          Tu carrito está vacío. Agrega productos de la lista para comprar.
        </div>

        <div v-else class="mt-4 grid gap-3">
          <!-- Items del carrito -->
          <div class="grid gap-2 border-b border-fuchsia-100/10 pb-3">
            <div
              v-for="item in carrito"
              :key="item.id"
              class="flex justify-between items-center gap-2 text-xs text-slate-300"
            >
              <div class="min-w-0 flex-1">
                <p class="font-semibold text-fuchsia-100 truncate">{{ item.nombre }}</p>
                <p class="text-slate-500">{{ item.cantidad }} x {{ formatoMoneda(item.precioVenta) }}</p>
              </div>
              <div class="flex gap-1 shrink-0">
                <button
                  @click="cambiarCantidad(item.id, -1)"
                  class="h-6 w-6 rounded bg-white/5 border border-fuchsia-100/10 text-xs font-bold"
                >
                  -
                </button>
                <button
                  @click="cambiarCantidad(item.id, 1)"
                  class="h-6 w-6 rounded bg-white/5 border border-fuchsia-100/10 text-xs font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="flex justify-between text-sm font-bold text-fuchsia-50">
            <span>Total:</span>
            <span class="text-[#f6e7bc]">{{ formatoMoneda(totalCarrito) }}</span>
          </div>

          <button
            @click="abrirCheckout = true"
            class="mt-2 min-h-10 w-full rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-300/24 via-pink-400/22 to-[#ead7a1]/18 px-4 text-xs font-bold text-fuchsia-50 shadow hover:-translate-y-0.5 hover:border-[#ead7a1]/45"
          >
            Proceder al Checkout
          </button>
        </div>
      </aside>
    </section>

    <!-- Modal de Checkout -->
    <div
      v-if="abrirCheckout"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/72 p-3 backdrop-blur-sm"
    >
      <div
        class="w-full max-w-[480px] rounded-3xl border border-fuchsia-100/12 bg-[rgba(10,12,22,0.92)] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto"
      >
        <header class="mb-4 flex items-center justify-between border-b border-fuchsia-100/10 pb-3">
          <h2 class="font-display text-xl font-semibold text-fuchsia-50">
            Finalizar Compra
          </h2>
          <button @click="abrirCheckout = false" class="text-slate-400 hover:text-white">
            ✕
          </button>
        </header>

        <form @submit.prevent="procesarCheckout" class="grid gap-3.5">
          <!-- Dirección de envío -->
          <label class="grid gap-1 text-xs font-semibold text-slate-300">
            Dirección Completa de Envío *
            <input
              v-model.trim="datosCheckout.direccionEnvio"
              type="text"
              required
              placeholder="Calle, Número, Colonia, C.P."
              class="rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3 py-2 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
            />
          </label>

          <!-- Método de pago -->
          <label class="grid gap-1 text-xs font-semibold text-slate-300">
            Método de Pago *
            <select
              v-model="datosCheckout.metodoPago"
              required
              class="min-h-9 rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
            >
              <option value="online">Tarjeta Online (Pago seguro)</option>
              <option value="fisico">Físico (Efectivo al recibir - se acumula saldo pendiente)</option>
            </select>
          </label>

          <!-- Formulario de tarjeta (Si es online) -->
          <div
            v-if="datosCheckout.metodoPago === 'online'"
            class="grid gap-3 rounded-2xl border border-fuchsia-100/10 bg-slate-950/50 p-3.5"
          >
            <p class="text-[0.62rem] font-bold uppercase tracking-wider text-[#ead7a1]">
              Simulador de Tarjeta
            </p>

            <label class="grid gap-0.5 text-[0.68rem] font-semibold text-slate-400">
              Número de Tarjeta
              <input
                v-model="datosCheckout.tarjetaNumero"
                type="text"
                required
                maxlength="16"
                placeholder="16 dígitos"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
              />
            </label>

            <div class="grid grid-cols-2 gap-2">
              <label class="grid gap-0.5 text-[0.68rem] font-semibold text-slate-400">
                Fecha Vence (MM/AA)
                <input
                  v-model="datosCheckout.tarjetaVence"
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
                  v-model="datosCheckout.tarjetaCvv"
                  type="password"
                  required
                  maxlength="3"
                  placeholder="3 dígitos"
                  class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
                />
              </label>
            </div>
          </div>

          <!-- Total a Pagar -->
          <div class="rounded-xl bg-slate-950/60 p-3 flex justify-between items-center text-xs">
            <span class="text-slate-400">Total Compra:</span>
            <span class="font-bold text-[#f6e7bc] text-sm">{{ formatoMoneda(totalCarrito) }}</span>
          </div>

          <!-- Alertas -->
          <p
            v-if="checkoutError"
            class="rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100"
          >
            {{ checkoutError }}
          </p>
          <p
            v-if="checkoutExito"
            class="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100"
          >
            {{ checkoutExito }}
          </p>

          <div class="flex gap-2">
            <button
              type="submit"
              class="flex-1 min-h-9 rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-300/24 via-pink-400/22 to-[#ead7a1]/18 px-4 text-xs font-bold text-fuchsia-50 shadow disabled:opacity-50"
              :disabled="procesando"
            >
              {{ procesando ? "Procesando..." : "Confirmar Compra" }}
            </button>
            <button
              type="button"
              @click="abrirCheckout = false"
              class="rounded-full border border-fuchsia-100/18 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200"
              :disabled="procesando"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { obtenerInventario } from "@/nucleo/firebase/inventario";
import { realizarCompra } from "@/nucleo/firebase/pagos";

const cargando = ref(true);
const procesando = ref(false);
const productos = ref([]);
const carrito = ref([]);

const buscar = ref("");
const categoriaSeleccionada = ref("todas");

const abrirCarrito = ref(false);
const abrirCheckout = ref(false);
const checkoutError = ref("");
const checkoutExito = ref("");

const datosCheckout = ref({
  direccionEnvio: "",
  metodoPago: "online",
  tarjetaNumero: "",
  tarjetaVence: "",
  tarjetaCvv: "",
});

// Obtener categorías únicas
const categorias = computed(() => {
  const cats = productos.value.map((p) => p.categoria).filter(Boolean);
  return [...new Set(cats)];
});

// Filtrar catálogo de productos
const productosFiltrados = computed(() => {
  const t = buscar.value.toLowerCase().trim();
  return productos.value.filter((p) => {
    const coincideTexto =
      !t ||
      p.nombre?.toLowerCase().includes(t) ||
      p.marca?.toLowerCase().includes(t);
    const coincideCategoria =
      categoriaSeleccionada.value === "todas" ||
      p.categoria === categoriaSeleccionada.value;
    return coincideTexto && coincideCategoria;
  });
});

// Estadísticas del carrito
const totalItemsCarrito = computed(() =>
  carrito.value.reduce((acc, item) => acc + item.cantidad, 0)
);

const totalCarrito = computed(() =>
  carrito.value.reduce((acc, item) => acc + item.precioVenta * item.cantidad, 0)
);

// Cargar catálogo de inventario
async function cargarProductos() {
  cargando.value = true;
  try {
    const inv = await obtenerInventario();
    // Solo mostrar productos con precioVenta > 0 y stock > 0
    productos.value = inv.filter((p) => p.precioVenta > 0 && p.cantidad > 0);
  } catch (error) {
    console.error("Error al cargar productos de la tienda:", error);
  } finally {
    cargando.value = false;
  }
}

// Carrito
function agregarAlCarrito(producto) {
  const itemExistente = carrito.value.find((item) => item.id === producto.id);
  if (itemExistente) {
    if (itemExistente.cantidad < producto.cantidad) {
      itemExistente.cantidad += 1;
    } else {
      alert(`No puedes agregar más de este producto. Stock disponible: ${producto.cantidad}`);
    }
  } else {
    carrito.value.push({
      ...producto,
      cantidad: 1,
    });
  }
}

function cambiarCantidad(id, delta) {
  const item = carrito.value.find((item) => item.id === id);
  if (!item) return;

  const stockLimit = productos.value.find((p) => p.id === id)?.cantidad || 0;
  const nuevaCant = item.cantidad + delta;

  if (nuevaCant <= 0) {
    carrito.value = carrito.value.filter((item) => item.id !== id);
  } else if (nuevaCant > stockLimit) {
    alert(`No hay suficiente stock. Límite: ${stockLimit}`);
  } else {
    item.cantidad = nuevaCant;
  }
}

// Checkout
async function procesarCheckout() {
  checkoutError.value = "";
  checkoutExito.value = "";

  if (carrito.value.length === 0) {
    checkoutError.value = "Tu carrito está vacío.";
    return;
  }

  if (datosCheckout.value.metodoPago === "online") {
    // Validar tarjeta
    const num = datosCheckout.value.tarjetaNumero.trim();
    const cvv = datosCheckout.value.tarjetaCvv.trim();
    if (num.length !== 16 || Number.isNaN(Number(num))) {
      checkoutError.value = "Número de tarjeta inválido. Debe tener 16 dígitos.";
      return;
    }
    if (cvv.length !== 3 || Number.isNaN(Number(cvv))) {
      checkoutError.value = "CVV inválido. Debe tener 3 dígitos.";
      return;
    }
  }

  procesando.value = true;
  try {
    await realizarCompra({
      productos: carrito.value,
      metodoPago: datosCheckout.value.metodoPago,
      direccionEnvio: datosCheckout.value.direccionEnvio,
    });

    checkoutExito.value = "¡Compra realizada con éxito!";
    carrito.value = [];
    setTimeout(async () => {
      abrirCheckout.value = false;
      await cargarProductos();
      checkoutExito.value = "";
    }, 2500);
  } catch (error) {
    checkoutError.value = `Error en el checkout: ${error.message}`;
  } finally {
    procesando.value = false;
  }
}

// Ilustración del icono por categoría
function iconoProducto(cat = "") {
  const c = cat.toLowerCase();
  if (c.includes("esmalte") || c.includes("unas")) return "💅";
  if (c.includes("gel") || c.includes("base")) return "🧴";
  if (c.includes("herramienta") || c.includes("broca")) return "🛠️";
  if (c.includes("solvente") || c.includes("acetona")) return "🧪";
  return "🌸";
}

function formatoMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-MX")}`;
}

function capitalizar(val = "") {
  return val.charAt(0).toUpperCase() + val.slice(1);
}

onMounted(cargarProductos);
</script>

<style scoped>
h1, h2, h3 {
  font-family: "Cormorant Garamond", Georgia, serif;
}
</style>
