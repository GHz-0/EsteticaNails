<template>
  <div class="dashboard">
    <div class="admin-banner">
      <div class="banner-left">
        <p class="banner-label">Panel de administración</p>
        <h1 class="banner-titulo">Resumen operativo</h1>
        <p class="banner-fecha">{{ fechaHoy }}</p>
      </div>
      <div class="banner-right">
        <div class="banner-highlight">
          <span class="highlight-val"
            >${{ ingresosMes.toLocaleString("es-MX") }}</span
          >
          <span class="highlight-lbl">Ingresos estimados del mes</span>
        </div>
      </div>
    </div>

    <div class="kpis-grid">
      <div class="kpi-card">
        <div class="kpi-valor">{{ citasMes }}</div>
        <div class="kpi-titulo">Citas este mes</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-valor">{{ clientesActivos }}</div>
        <div class="kpi-titulo">Clientes activos</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-valor">{{ serviciosActivos }}</div>
        <div class="kpi-titulo">Servicios disponibles</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-valor">{{ cancelacionesMes }}</div>
        <div class="kpi-titulo">Cancelaciones del mes</div>
      </div>
    </div>

    <div class="bottom-grid">
      <section class="seccion card">
        <h2 class="seccion-titulo">Top servicios del mes</h2>
        <p v-if="cargando" class="estado">Cargando...</p>
        <p v-else-if="!topServicios.length" class="estado">
          Aún no hay citas registradas para calcular ranking.
        </p>
        <ul v-else class="top-servicios">
          <li
            v-for="(item, idx) in topServicios"
            :key="item.servicioId"
            class="top-item"
          >
            <span class="top-num">#{{ idx + 1 }}</span>
            <div class="top-info">
              <p class="top-nombre">{{ item.nombre }}</p>
              <p class="top-citas">{{ item.citas }} citas</p>
            </div>
            <span class="top-ingreso"
              >${{ item.ingreso.toLocaleString("es-MX") }}</span
            >
          </li>
        </ul>
      </section>

      <section class="seccion card">
        <h2 class="seccion-titulo">Actividad reciente</h2>
        <p v-if="cargando" class="estado">Cargando...</p>
        <p v-else-if="!actividad.length" class="estado">
          Aún no hay actividad reciente.
        </p>
        <ul v-else class="actividad-list">
          <li
            v-for="evento in actividad"
            :key="evento.id"
            class="actividad-item"
          >
            <span class="act-icono">{{ evento.icono }}</span>
            <div class="act-info">
              <p class="act-desc">{{ evento.desc }}</p>
              <p class="act-tiempo">{{ evento.tiempo }}</p>
            </div>
          </li>
        </ul>
      </section>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
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
    .slice(0, 5);
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

const actividad = computed(() => {
  return citasConFecha.value
    .slice()
    .sort((a, b) => b.fechaObj - a.fechaObj)
    .slice(0, 6)
    .map((cita) => ({
      id: cita.id,
      icono: cita.estado === "cancelada" ? "❌" : "📅",
      desc: `Cita ${cita.estado || "pendiente"} · ${cita.hora || "sin hora"}`,
      tiempo: tiempoRelativo(cita.fechaObj),
    }));
});
</script>

<style scoped>
.dashboard {
  max-width: 1000px;
  color: #fff;
}

.admin-banner {
  background: linear-gradient(135deg, #f9a8d4 0%, #fbcfe8 45%, #fce7f3 100%);
  border-radius: 20px;
  padding: 1.4rem 1.7rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.banner-label {
  margin: 0;
  font-size: 0.78rem;
  color: rgba(157, 23, 77, 0.7);
}

.banner-titulo {
  margin: 0.2rem 0;
  color: #831843;
  font-size: 1.55rem;
}

.banner-fecha {
  margin: 0;
  color: rgba(157, 23, 77, 0.62);
  text-transform: capitalize;
}

.banner-highlight {
  background: rgba(255, 255, 255, 0.55);
  border-radius: 12px;
  padding: 0.8rem 1.1rem;
  text-align: right;
}

.highlight-val {
  color: #9d174d;
  font-weight: 700;
  display: block;
}

.highlight-lbl {
  color: rgba(157, 23, 77, 0.72);
  font-size: 0.75rem;
}

.kpis-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.8rem;
  margin-bottom: 1rem;
}

.kpi-card {
  background: rgba(249, 168, 212, 0.08);
  border: 1px solid rgba(249, 168, 212, 0.2);
  border-radius: 12px;
  padding: 0.9rem 1rem;
}

.kpi-valor {
  font-size: 1.3rem;
  color: #f9a8d4;
  font-weight: 700;
}

.kpi-titulo {
  font-size: 0.76rem;
  color: rgba(255, 255, 255, 0.6);
}

.bottom-grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 1rem;
}

.card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(249, 168, 212, 0.15);
  border-radius: 14px;
  padding: 1rem;
}

.seccion-titulo {
  margin: 0 0 0.75rem;
  font-size: 0.96rem;
}

.estado {
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
}

.top-servicios,
.actividad-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.top-item,
.actividad-item {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
}

.top-num {
  color: #f9a8d4;
  font-weight: 700;
  min-width: 28px;
}

.top-info {
  flex: 1;
}

.top-nombre,
.act-desc {
  margin: 0;
  font-size: 0.86rem;
}

.top-citas,
.act-tiempo {
  margin: 0;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
}

.top-ingreso {
  color: #f9a8d4;
  font-weight: 600;
  font-size: 0.85rem;
}

.act-icono {
  font-size: 1rem;
}

.error {
  margin-top: 1rem;
  color: #ff9696;
}

@media (max-width: 980px) {
  .kpis-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .bottom-grid {
    grid-template-columns: 1fr;
  }
}
</style>
