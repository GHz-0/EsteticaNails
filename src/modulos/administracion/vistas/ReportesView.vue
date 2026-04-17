<template>
  <div class="reportes-dashboard">
    <!-- Filtros globales -->
    <div class="filtros-seccion">
      <div class="filtros-botones">
        <button
          v-for="preset in presetsFechas"
          :key="preset.valor"
          :class="{ activo: tipoFecha === preset.valor }"
          class="btn-filtro"
          @click="cambiarFecha(preset.valor)"
        >
          {{ preset.label }}
        </button>
      </div>

      <div v-if="tipoFecha === 'personalizado'" class="filtro-rango">
        <label
          >Desde:
          <input v-model.lazy="fechaPersonalizada.inicio" type="date" />
        </label>
        <label
          >Hasta:
          <input v-model.lazy="fechaPersonalizada.fin" type="date" />
        </label>
      </div>

      <button class="btn-actualizar" :disabled="cargando" @click="cargarDatos">
        {{ cargando ? "Cargando..." : "Actualizar" }}
      </button>
    </div>

    <!-- Mensaje de error general -->
    <div v-if="error" class="error-banner">❌ {{ error }}</div>

    <!-- KPIs Grid -->
    <div class="kpis-grid">
      <TarjetaMetrica
        titulo="Total Citas"
        :valor="kpis.totalCitas"
        :icono="cargando ? '⏳' : '📅'"
        :cargando="cargando"
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
    </div>

    <!-- Gráfica de ingresos -->
    <section class="seccion">
      <GraficoLinea
        titulo="Ingresos por Período"
        subtitulo="Distribución diaria de ingresos estimados"
        :datos="serieIngresos"
        :cargando="cargando"
        :error="error"
        formato="moneda"
      />
    </section>

    <!-- Tablas de operación -->
    <div class="tablas-grid">
      <!-- Top Clientes -->
      <section class="seccion">
        <TablaReporte
          titulo="Top 10 Clientes"
          subtitulo="Ordenados por gasto total"
          :columnas="colClientesTab"
          :datos="topClientes"
          :cargando="cargando"
          :error="error"
        />
      </section>

      <!-- Top Servicios -->
      <section class="seccion">
        <TablaReporte
          titulo="Top 10 Servicios"
          subtitulo="Servicios más vendidos en el período"
          :columnas="colServiciosTab"
          :datos="topServicios"
          :cargando="cargando"
          :error="error"
        />
      </section>
    </div>

    <div class="tablas-grid">
      <!-- Stock Crítico -->
      <section class="seccion">
        <TablaReporte
          titulo="Productos Críticos"
          subtitulo="Stock bajo (menor a 5 unidades)"
          :columnas="colInventarioTab"
          :datos="productosCriticos"
          :cargando="cargando"
          :error="error"
        />
      </section>

      <!-- Eficiencia Empleados -->
      <section class="seccion">
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

    <!-- Pie de página con info del período -->
    <div class="info-periodo">
      <p>
        Mostrando datos desde
        <strong>{{ formatearFecha(periodoActual.inicio) }}</strong> hasta
        <strong>{{ formatearFecha(periodoActual.fin) }}</strong>
      </p>
    </div>
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

<style scoped>
.reportes-dashboard {
  color: #fff;
  max-width: 1400px;
  margin: 0 auto;
}

/* Filtros */
.filtros-seccion {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 168, 212, 0.2);
  border-radius: 12px;
}

.filtros-botones {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-filtro {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(249, 168, 212, 0.2);
  color: rgba(255, 255, 255, 0.6);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s ease;
}

.btn-filtro:hover {
  border-color: rgba(249, 168, 212, 0.4);
  color: #f9a8d4;
}

.btn-filtro.activo {
  background: linear-gradient(135deg, #f472b6, #ec4899);
  border-color: #ec4899;
  color: #fff;
}

.filtro-rango {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
}

.filtro-rango label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filtro-rango input {
  padding: 0.4rem 0.6rem;
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(249, 168, 212, 0.3);
  border-radius: 6px;
  color: #fff;
  font-size: 0.8rem;
}

.btn-actualizar {
  background: linear-gradient(135deg, #f472b6, #ec4899);
  border: none;
  color: #fff;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.btn-actualizar:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.3);
}

.btn-actualizar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Error banner */
.error-banner {
  background: rgba(255, 100, 100, 0.1);
  border: 1px solid rgba(255, 100, 100, 0.3);
  border-radius: 10px;
  padding: 1rem;
  color: #fca5a5;
  margin-bottom: 1rem;
}

/* KPIs Grid */
.kpis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

/* Secciones y tablas */
.seccion {
  margin-bottom: 1.5rem;
}

.tablas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

/* Info del período */
.info-periodo {
  padding: 0.8rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Responsive */
@media (max-width: 1024px) {
  .tablas-grid {
    grid-template-columns: 1fr;
  }

  .filtro-rango {
    flex-direction: column;
    width: 100%;
  }
}

@media (max-width: 640px) {
  .kpis-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .filtros-seccion {
    flex-direction: column;
    align-items: stretch;
  }

  .filtros-botones {
    width: 100%;
  }

  .btn-filtro {
    flex: 1;
  }
}
</style>
