<template>
  <div class="admin-dashboard">
    <section class="hero-panel">
      <div class="hero-copy">
        <p class="eyebrow">Panel de administracion</p>
        <h1>Resumen operativo</h1>
        <p>{{ fechaHoy }}</p>
      </div>

      <div class="revenue-card">
        <span>Ingresos estimados del mes</span>
        <strong>${{ ingresosMes.toLocaleString("es-MX") }}</strong>
        <small>{{ citasCompletadasMes }} citas activas facturables</small>
      </div>
    </section>

    <section class="metrics-grid" aria-label="Metricas principales">
      <article v-for="card in resumenCards" :key="card.label" class="metric-card">
        <div>
          <span class="metric-icon">{{ card.icon }}</span>
          <p>{{ card.label }}</p>
        </div>
        <strong>{{ card.value }}</strong>
        <small>{{ card.detail }}</small>
      </article>
    </section>

    <section class="dashboard-grid">
      <article class="panel-card schedule-card">
        <div class="section-header">
          <div>
            <p class="eyebrow">Agenda</p>
            <h2>Citas recientes</h2>
          </div>
          <RouterLink :to="{ name: 'admin-reportes' }" class="text-link">
            Ver reportes
          </RouterLink>
        </div>

        <p v-if="cargando" class="empty-state">Cargando citas...</p>
        <p v-else-if="!citasRecientes.length" class="empty-state">
          No hay citas registradas todavia.
        </p>

        <ul v-else class="appointment-list">
          <li v-for="cita in citasRecientes" :key="cita.id">
            <div class="appointment-status" :class="`status-${cita.estadoClase}`">
              {{ cita.estadoTexto }}
            </div>
            <div class="appointment-main">
              <strong>{{ cita.servicioNombre }}</strong>
              <span>{{ cita.clienteNombre }} con {{ cita.empleadoNombre }}</span>
            </div>
            <time>{{ cita.fechaHora }}</time>
          </li>
        </ul>
      </article>

      <aside class="side-stack">
        <article class="panel-card">
          <div class="section-header compact">
            <div>
              <p class="eyebrow">Accesos</p>
              <h2>Gestion rapida</h2>
            </div>
          </div>

          <div class="quick-actions">
            <RouterLink
              v-for="action in accionesRapidas"
              :key="action.name"
              :to="{ name: action.name }"
              class="quick-action"
            >
              <span>{{ action.icon }}</span>
              <div>
                <strong>{{ action.label }}</strong>
                <small>{{ action.detail }}</small>
              </div>
            </RouterLink>
          </div>
        </article>

        <article class="panel-card health-card">
          <div class="section-header compact">
            <div>
              <p class="eyebrow">Estado</p>
              <h2>Operacion del mes</h2>
            </div>
          </div>

          <div class="health-row">
            <span>Tasa de cancelacion</span>
            <strong>{{ tasaCancelacion }}%</strong>
          </div>
          <div class="progress-track">
            <span :style="{ width: `${Math.min(tasaCancelacion, 100)}%` }" />
          </div>
          <p>{{ mensajeOperacion }}</p>
        </article>
      </aside>
    </section>

    <section class="rankings-grid">
      <article class="panel-card">
        <div class="section-header compact">
          <div>
            <p class="eyebrow">Rendimiento</p>
            <h2>Top servicios</h2>
          </div>
        </div>

        <p v-if="cargando" class="empty-state">Cargando servicios...</p>
        <p v-else-if="!topServicios.length" class="empty-state">
          Sin servicios destacados este mes.
        </p>

        <ul v-else class="ranking-list">
          <li v-for="(item, idx) in topServicios" :key="item.servicioId">
            <span class="rank-number">{{ idx + 1 }}</span>
            <div>
              <strong>{{ item.nombre }}</strong>
              <small>{{ item.citas }} citas</small>
            </div>
            <b>${{ item.ingreso.toLocaleString("es-MX") }}</b>
          </li>
        </ul>
      </article>

      <article class="panel-card">
        <div class="section-header compact">
          <div>
            <p class="eyebrow">Clientes</p>
            <h2>Clientes top</h2>
          </div>
        </div>

        <p v-if="cargando" class="empty-state">Cargando clientes...</p>
        <p v-else-if="!topClientes.length" class="empty-state">
          Sin clientes destacados este mes.
        </p>

        <ul v-else class="ranking-list">
          <li v-for="(cliente, idx) in topClientes" :key="cliente.id">
            <span class="rank-number">{{ idx + 1 }}</span>
            <div>
              <strong>{{ cliente.nombre }}</strong>
              <small>{{ cliente.citasCount }} citas este mes</small>
            </div>
            <b>{{ cliente.score || 0 }} pts</b>
          </li>
        </ul>
      </article>
    </section>

    <p v-if="error" class="error-banner">{{ error }}</p>
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

const accionesRapidas = [
  {
    name: "admin-servicios",
    icon: "+",
    label: "Servicios",
    detail: "Precios, catalogo y disponibilidad",
  },
  {
    name: "admin-empleados",
    icon: "#",
    label: "Empleados",
    detail: "Equipo, roles y seguimiento",
  },
  {
    name: "admin-reportes",
    icon: "%",
    label: "Reportes",
    detail: "Ingresos, citas y clientes",
  },
  {
    name: "admin-config",
    icon: "*",
    label: "Configuracion",
    detail: "Ajustes generales del sistema",
  },
];

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
      "No se pudieron cargar metricas del panel. Revisa permisos y reglas.";
    console.error(e);
  } finally {
    cargando.value = false;
  }
});

function obtenerFecha(cita) {
  if (cita?.fecha?.toDate) return cita.fecha.toDate();
  if (cita?.fecha) return new Date(cita.fecha);
  return null;
}

function estadoCita(estado = "") {
  const normalizado = String(estado || "pendiente").toLowerCase();
  if (normalizado.includes("cancel")) {
    return { texto: "Cancelada", clase: "cancelada" };
  }
  if (normalizado.includes("confirm") || normalizado.includes("complet")) {
    return { texto: "Activa", clase: "activa" };
  }
  return { texto: "Pendiente", clase: "pendiente" };
}

const citasConFecha = computed(() =>
  citas.value
    .map((c) => {
      const fechaObj = obtenerFecha(c);
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

const citasCompletadasMes = computed(
  () => citasDelMes.value.filter((c) => c.estado !== "cancelada").length,
);

const clientesActivos = computed(
  () =>
    usuarios.value.filter((u) => u.rol === "usuario" && u.estado !== "inactivo")
      .length,
);

const empleadosActivos = computed(
  () =>
    usuarios.value.filter((u) => u.rol === "empleado" && u.estado !== "inactivo")
      .length,
);

const serviciosActivos = computed(() => servicios.value.length);

const precioServicioMap = computed(() => {
  const m = new Map();
  for (const s of servicios.value) m.set(s.id, Number(s.precio || 0));
  return m;
});

const ingresosMes = computed(() =>
  citasCompletadasMes.value
    ? citasDelMes.value
        .filter((c) => c.estado !== "cancelada")
        .reduce(
          (acc, c) => acc + (precioServicioMap.value.get(c.servicioId) || 0),
          0,
        )
    : 0,
);

const tasaCancelacion = computed(() => {
  if (!citasMes.value) return 0;
  return Math.round((cancelacionesMes.value / citasMes.value) * 100);
});

const mensajeOperacion = computed(() => {
  if (!citasMes.value) return "Aun no hay citas este mes.";
  if (tasaCancelacion.value <= 10) return "La agenda se mantiene estable.";
  if (tasaCancelacion.value <= 25) return "Conviene revisar horarios con mas cambios.";
  return "Hay muchas cancelaciones; revisa seguimiento con clientes.";
});

const resumenCards = computed(() => [
  {
    icon: "01",
    label: "Citas este mes",
    value: citasMes.value,
    detail: `${citasCompletadasMes.value} activas`,
  },
  {
    icon: "02",
    label: "Clientes activos",
    value: clientesActivos.value,
    detail: "Con cuenta habilitada",
  },
  {
    icon: "03",
    label: "Servicios",
    value: serviciosActivos.value,
    detail: "Disponibles en catalogo",
  },
  {
    icon: "04",
    label: "Empleados",
    value: empleadosActivos.value,
    detail: "Equipo activo",
  },
]);

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

const citasRecientes = computed(() => {
  const userMap = new Map(usuarios.value.map((u) => [u.id, u]));
  const servicioMap = new Map(servicios.value.map((s) => [s.id, s.nombre]));

  return citasConFecha.value
    .slice()
    .sort((a, b) => b.fechaObj - a.fechaObj)
    .slice(0, 6)
    .map((cita) => {
      const usuario = userMap.get(cita.usuarioId);
      const empleado = cita.empleadoId ? userMap.get(cita.empleadoId) : null;
      const estado = estadoCita(cita.estado);
      const fechaFormato = cita.fechaObj.toLocaleDateString("es-MX", {
        month: "short",
        day: "numeric",
      });

      return {
        id: cita.id,
        estadoTexto: estado.texto,
        estadoClase: estado.clase,
        servicioNombre:
          servicioMap.get(cita.servicioId) || "Servicio no encontrado",
        clienteNombre: usuario?.nombre || "Cliente desconocido",
        empleadoNombre: empleado?.nombre || "empleado asignado",
        fechaHora: `${fechaFormato} · ${cita.hora || "sin hora"}`,
      };
    });
});

const topClientes = computed(() => {
  const agg = new Map();
  const userMap = new Map(usuarios.value.map((u) => [u.id, u]));

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
    .slice(0, 5);
});
</script>

<style scoped>
.admin-dashboard {
  width: min(100%, 1180px);
  margin: 0 auto;
  display: grid;
  gap: 1rem;
  color: #fff7fb;
}

.hero-panel,
.panel-card,
.metric-card {
  border: 1px solid rgba(249, 168, 212, 0.12);
  background: rgba(8, 10, 18, 0.74);
  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.24);
  backdrop-filter: blur(18px);
}

.hero-panel {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 380px);
  gap: 1rem;
  align-items: stretch;
  border-radius: 8px;
  padding: 1rem;
}

.hero-copy {
  min-height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: clamp(1rem, 3vw, 1.4rem);
  border-radius: 6px;
  background:
    linear-gradient(90deg, rgba(8, 10, 18, 0.42), rgba(8, 10, 18, 0.72)),
    url("/img/inicio/beneficio-agenda.jpg") center/cover;
}

.eyebrow {
  margin: 0 0 0.35rem;
  color: #ead7a1;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.hero-copy h1,
.section-header h2 {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-weight: 600;
}

.hero-copy h1 {
  font-size: clamp(2.2rem, 5vw, 4.1rem);
  line-height: 0.95;
}

.hero-copy p:last-child {
  margin: 0.8rem 0 0;
  color: rgba(255, 247, 251, 0.7);
  font-size: 0.95rem;
  text-transform: capitalize;
}

.revenue-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  border-radius: 6px;
  padding: 1.4rem;
  background: linear-gradient(135deg, rgba(234, 215, 161, 0.18), rgba(249, 168, 212, 0.08));
  border: 1px solid rgba(234, 215, 161, 0.2);
}

.revenue-card span,
.revenue-card small,
.metric-card p,
.metric-card small,
.quick-action small,
.ranking-list small,
.appointment-main span,
.health-card p {
  color: rgba(255, 247, 251, 0.58);
}

.revenue-card strong {
  margin: 0.5rem 0;
  color: #f6e7bc;
  font-size: clamp(2.2rem, 5vw, 3.4rem);
  font-weight: 700;
  line-height: 0.95;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0.8rem;
}

.metric-card {
  min-height: 132px;
  border-radius: 8px;
  padding: 1rem;
}

.metric-card div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.7rem;
}

.metric-icon,
.rank-number {
  display: grid;
  place-items: center;
  border: 1px solid rgba(234, 215, 161, 0.22);
  background: rgba(234, 215, 161, 0.09);
  color: #ead7a1;
  font-weight: 800;
}

.metric-icon {
  width: 34px;
  height: 34px;
  border-radius: 999px;
  font-size: 0.72rem;
}

.metric-card p {
  margin: 0;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-align: right;
  text-transform: uppercase;
}

.metric-card strong {
  display: block;
  margin-top: 1rem;
  font-size: 2rem;
  line-height: 1;
}

.metric-card small {
  display: block;
  margin-top: 0.35rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.75fr);
  gap: 1rem;
}

.rankings-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.side-stack {
  display: grid;
  gap: 1rem;
}

.panel-card {
  border-radius: 8px;
  padding: 1rem;
}

.section-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.65rem;
  line-height: 1;
}

.section-header.compact h2 {
  font-size: 1.35rem;
}

.text-link {
  color: #ead7a1;
  text-decoration: none;
  font-size: 0.84rem;
  font-weight: 800;
}

.appointment-list,
.ranking-list {
  display: grid;
  gap: 0.65rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.appointment-list li,
.ranking-list li,
.quick-action {
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.045);
}

.appointment-list li {
  display: grid;
  grid-template-columns: 86px minmax(0, 1fr) auto;
  gap: 0.8rem;
  align-items: center;
  min-height: 64px;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
}

.appointment-status {
  border-radius: 999px;
  padding: 0.32rem 0.55rem;
  text-align: center;
  font-size: 0.68rem;
  font-weight: 900;
}

.status-activa {
  color: #bbf7d0;
  background: rgba(34, 197, 94, 0.14);
}

.status-pendiente {
  color: #fde68a;
  background: rgba(234, 179, 8, 0.14);
}

.status-cancelada {
  color: #fecaca;
  background: rgba(239, 68, 68, 0.14);
}

.appointment-main {
  min-width: 0;
}

.appointment-main strong,
.appointment-main span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.appointment-list time {
  color: #f6e7bc;
  font-size: 0.82rem;
  font-weight: 800;
  white-space: nowrap;
}

.quick-actions {
  display: grid;
  gap: 0.6rem;
}

.quick-action {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr);
  gap: 0.7rem;
  align-items: center;
  border-radius: 8px;
  padding: 0.75rem;
  color: inherit;
  text-decoration: none;
  transition:
    border-color 0.2s,
    background 0.2s,
    transform 0.2s;
}

.quick-action:hover {
  border-color: rgba(234, 215, 161, 0.2);
  background: rgba(249, 168, 212, 0.08);
  transform: translateY(-1px);
}

.quick-action > span {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 8px;
  color: #f6e7bc;
  background: rgba(249, 168, 212, 0.11);
  font-weight: 900;
}

.quick-action strong,
.quick-action small {
  display: block;
}

.health-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  color: rgba(255, 247, 251, 0.72);
}

.health-row strong {
  color: #f6e7bc;
}

.progress-track {
  height: 10px;
  overflow: hidden;
  border-radius: 999px;
  margin: 0.85rem 0;
  background: rgba(255, 255, 255, 0.08);
}

.progress-track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #ead7a1, #f9a8d4);
}

.ranking-list li {
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) auto;
  gap: 0.75rem;
  align-items: center;
  min-height: 58px;
  border-radius: 8px;
  padding: 0.65rem 0.75rem;
}

.rank-number {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  font-size: 0.78rem;
}

.ranking-list strong,
.ranking-list small {
  display: block;
}

.ranking-list b {
  color: #f6e7bc;
  font-size: 0.88rem;
}

.empty-state,
.error-banner {
  border-radius: 8px;
  padding: 0.9rem 1rem;
  font-size: 0.9rem;
}

.empty-state {
  margin: 0;
  border: 1px dashed rgba(249, 168, 212, 0.18);
  color: rgba(255, 247, 251, 0.62);
  background: rgba(255, 255, 255, 0.035);
}

.error-banner {
  margin: 0;
  border: 1px solid rgba(251, 113, 133, 0.3);
  color: #ffe4e6;
  background: rgba(225, 29, 72, 0.12);
}

@media (max-width: 1040px) {
  .metrics-grid,
  .rankings-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .dashboard-grid,
  .hero-panel {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 680px) {
  .admin-dashboard {
    gap: 0.8rem;
  }

  .metrics-grid,
  .rankings-grid {
    grid-template-columns: 1fr;
  }

  .appointment-list li {
    grid-template-columns: 1fr;
    align-items: start;
  }

  .appointment-status {
    width: max-content;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
