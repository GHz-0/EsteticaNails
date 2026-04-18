<template>
  <div class="mx-auto w-full max-w-[1440px] px-3 pb-5 pt-4 sm:px-5 lg:px-7">
    <header
      class="mb-4 rounded-3xl border border-fuchsia-200/15 bg-slate-950/60 px-4 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] backdrop-blur-xl sm:px-5"
    >
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p
            class="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-200/70"
          >
            Centro de Analitica
          </p>
          <h1
            class="font-display text-2xl font-semibold tracking-tight text-fuchsia-50 sm:text-3xl"
          >
            Panel de Reportes
          </h1>
          <p class="mt-1 text-sm text-slate-300">
            {{ resumenPeriodo }}
          </p>
        </div>

        <button
          class="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-fuchsia-500 to-pink-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-pink-500/25 transition-all hover:-translate-y-0.5 hover:shadow-pink-500/35 disabled:cursor-not-allowed disabled:opacity-70"
          :disabled="cargando"
          @click="cargarDatos"
        >
          {{ cargando ? "Actualizando..." : "Actualizar panel" }}
        </button>
      </div>

      <div class="mt-4 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="preset in presetsFechas"
            :key="preset.valor"
            :class="[
              'rounded-xl border px-3 py-2 text-xs font-semibold tracking-wide transition-all sm:text-sm',
              tipoFecha === preset.valor
                ? 'border-fuchsia-300/70 bg-fuchsia-400/20 text-fuchsia-100 shadow-md shadow-fuchsia-500/20'
                : 'border-fuchsia-100/15 bg-slate-900/55 text-slate-300 hover:border-fuchsia-200/40 hover:text-fuchsia-100',
            ]"
            @click="cambiarFecha(preset.valor)"
          >
            {{ preset.label }}
          </button>
        </div>

        <div
          v-if="tipoFecha === 'personalizado'"
          class="grid gap-2 rounded-2xl border border-fuchsia-100/15 bg-slate-900/50 p-2 sm:grid-cols-2"
        >
          <label class="grid gap-1 text-xs font-medium text-slate-300">
            Desde
            <input
              v-model.lazy="fechaPersonalizada.inicio"
              type="date"
              class="rounded-lg border border-fuchsia-200/20 bg-slate-950/70 px-2 py-1.5 text-sm text-slate-100 outline-none transition focus:border-fuchsia-300/60 focus:ring-2 focus:ring-fuchsia-400/25"
            />
          </label>
          <label class="grid gap-1 text-xs font-medium text-slate-300">
            Hasta
            <input
              v-model.lazy="fechaPersonalizada.fin"
              type="date"
              class="rounded-lg border border-fuchsia-200/20 bg-slate-950/70 px-2 py-1.5 text-sm text-slate-100 outline-none transition focus:border-fuchsia-300/60 focus:ring-2 focus:ring-fuchsia-400/25"
            />
          </label>
        </div>
      </div>
    </header>

    <div
      v-if="error"
      class="mb-4 rounded-2xl border border-rose-300/35 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-100"
    >
      ❌ {{ error }}
    </div>

    <section class="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <TarjetaMetrica
        titulo="Total Citas"
        :valor="kpis.totalCitas"
        :icono="cargando ? '⏳' : '📅'"
      />
      <TarjetaMetrica
        titulo="Cancelaciones"
        :valor="kpis.cancelaciones"
        :icono="cargando ? '⏳' : '❌'"
      />
      <TarjetaMetrica
        titulo="Ingresos"
        :valor="kpis.ingresos"
        formato="moneda"
        :icono="cargando ? '⏳' : '💰'"
      />
      <TarjetaMetrica
        titulo="Clientes Únicos"
        :valor="kpis.clientesUnicos"
        :icono="cargando ? '⏳' : '👤'"
      />
      <TarjetaMetrica
        titulo="Clientes Activos"
        :valor="kpis.clientesActivos"
        :icono="cargando ? '⏳' : '👥'"
      />
      <TarjetaMetrica
        titulo="Stock Crítico"
        :valor="kpis.stockCritico"
        :icono="cargando ? '⏳' : '⚠️'"
      />
    </section>

    <section class="mb-4">
      <GraficoLinea
        titulo="Ingresos por período"
        subtitulo="Comportamiento diario de ingresos estimados"
        :datos="serieIngresos"
        :cargando="cargando"
        :error="error"
        formato="moneda"
      />
    </section>

    <section class="grid grid-cols-1 gap-3 xl:grid-cols-2">
      <TablaReporte
        titulo="Top 10 Clientes"
        subtitulo="Ordenados por gasto total"
        :columnas="colClientesTab"
        :datos="topClientes"
        :cargando="cargando"
        :error="error"
      />

      <TablaReporte
        titulo="Top 10 Servicios"
        subtitulo="Servicios más vendidos en el período"
        :columnas="colServiciosTab"
        :datos="topServicios"
        :cargando="cargando"
        :error="error"
      />

      <TablaReporte
        titulo="Productos Críticos"
        subtitulo="Stock bajo (menor a 5 unidades)"
        :columnas="colInventarioTab"
        :datos="productosCriticos"
        :cargando="cargando"
        :error="error"
      />

      <TablaReporte
        titulo="Eficiencia de Empleados"
        subtitulo="Tasa de completación de citas"
        :columnas="colEmpleadosTab"
        :datos="eficienciaEmpleados"
        :cargando="cargando"
        :error="error"
      />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import TarjetaMetrica from "@/compartido/componentes/TarjetaMetrica.vue";
import TablaReporte from "@/compartido/componentes/TablaReporte.vue";
import GraficoLinea from "@/compartido/componentes/GraficoLinea.vue";
import {
  obtenerKPIs,
  obtenerSerieIngresos,
  obtenerTopClientes,
  obtenerProductosCriticos,
  obtenerEficienciaEmpleados,
  obtenerTopServicios,
} from "@/nucleo/firebase/reportes";

// Estado
const cargando = ref(true);
const error = ref(null);

const tipoFecha = ref("mes-actual");
const fechaPersonalizada = ref({
  inicio: new Date().toISOString().split("T")[0],
  fin: new Date().toISOString().split("T")[0],
});

// KPIs y datos
const kpis = ref({
  totalCitas: 0,
  cancelaciones: 0,
  ingresos: 0,
  clientesUnicos: 0,
  clientesActivos: 0,
  stockCritico: 0,
  serviciosActivos: 0,
});

const periodoActual = ref({ inicio: new Date(), fin: new Date() });
const serieIngresos = ref([]);
const topClientes = ref([]);
const topServicios = ref([]);
const productosCriticos = ref([]);
const eficienciaEmpleados = ref([]);

// Presets de fechas
const presetsFechas = [
  { valor: "hoy", label: "Hoy" },
  { valor: "7-dias", label: "Últimos 7 días" },
  { valor: "30-dias", label: "Últimos 30 días" },
  { valor: "mes-actual", label: "Este mes" },
  { valor: "personalizado", label: "Personalizado" },
];

// Definición de columnas para tablas
const colClientesTab = [
  { key: "nombre", label: "Cliente", tipo: "texto" },
  { key: "citas", label: "Citas", tipo: "numero", alineacion: "centro" },
  { key: "gasto", label: "Gasto Total", tipo: "moneda", alineacion: "derecha" },
];

const colServiciosTab = [
  { key: "nombre", label: "Servicio", tipo: "texto" },
  { key: "cantidad", label: "Vendidas", tipo: "numero", alineacion: "centro" },
  { key: "ingresos", label: "Ingresos", tipo: "moneda", alineacion: "derecha" },
];

const colInventarioTab = [
  { key: "nombre", label: "Producto", tipo: "texto" },
  { key: "cantidad", label: "Stock", tipo: "numero", alineacion: "centro" },
  {
    key: "precioVenta",
    label: "Precio Venta",
    tipo: "moneda",
    alineacion: "derecha",
  },
];

const colEmpleadosTab = [
  { key: "nombre", label: "Empleado", tipo: "texto" },
  { key: "total", label: "Citas", tipo: "numero", alineacion: "centro" },
  {
    key: "completadas",
    label: "Completadas",
    tipo: "numero",
    alineacion: "centro",
  },
  {
    key: "eficiencia",
    label: "Eficiencia",
    tipo: "porcentaje",
    alineacion: "derecha",
  },
];

const resumenPeriodo = computed(() => {
  return `Datos desde ${formatearFecha(periodoActual.value.inicio)} hasta ${formatearFecha(periodoActual.value.fin)}`;
});

// Métodos
function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString("es-MX");
}

function cambiarFecha(tipo) {
  tipoFecha.value = tipo;
  cargarDatos();
}

async function cargarDatos() {
  cargando.value = true;
  error.value = null;

  try {
    const params =
      tipoFecha.value === "personalizado"
        ? {
            tipo: "personalizado",
            fechaInicio: new Date(fechaPersonalizada.value.inicio),
            fechaFin: new Date(fechaPersonalizada.value.fin),
          }
        : { tipo: tipoFecha.value };

    // Cargar en paralelo
    const [kpisData, serie, clientes, servicios, criticos, eficiencia] =
      await Promise.all([
        obtenerKPIs(params.tipo, params.fechaInicio, params.fechaFin),
        obtenerSerieIngresos(params.tipo, params.fechaInicio, params.fechaFin),
        obtenerTopClientes(
          10,
          params.tipo,
          params.fechaInicio,
          params.fechaFin,
        ),
        obtenerTopServicios(
          10,
          params.tipo,
          params.fechaInicio,
          params.fechaFin,
        ),
        obtenerProductosCriticos(10),
        obtenerEficienciaEmpleados(
          params.tipo,
          params.fechaInicio,
          params.fechaFin,
        ),
      ]);

    kpis.value = kpisData;
    serieIngresos.value = serie;
    topClientes.value = clientes;
    topServicios.value = servicios;
    productosCriticos.value = criticos;
    eficienciaEmpleados.value = eficiencia;
    periodoActual.value = kpisData.periodo;
  } catch (err) {
    error.value = "Error cargando reportes. Verifica permisos de Firestore.";
    console.error(err);
  } finally {
    cargando.value = false;
  }
}

// Cargar datos al montar
onMounted(cargarDatos);
</script>
