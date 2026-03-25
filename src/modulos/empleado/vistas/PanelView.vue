<template>
  <div class="dashboard">
    <!-- Header de bienvenida -->
    <div class="welcome-banner">
      <div class="welcome-left">
        <p class="welcome-label">🌸 Hola de nuevo,</p>
        <h1 class="welcome-nombre">
          {{ auth.usuario?.nombre?.split(" ")[0] }}
        </h1>
        <p class="welcome-fecha">
          {{ fechaHoy }} · {{ citasHoy.length }} citas programadas
        </p>
      </div>
      <div class="welcome-stats">
        <div v-for="s in resumen" :key="s.titulo" class="mini-stat">
          <span class="mini-val">{{ s.valor }}</span>
          <span class="mini-lbl">{{ s.titulo }}</span>
        </div>
      </div>
    </div>

    <!-- Citas del día -->
    <section class="seccion">
      <h2 class="seccion-titulo">📋 Agenda de hoy</h2>
      <div class="agenda-list">
        <div
          v-for="cita in citasHoy"
          :key="cita.id"
          class="agenda-item"
          :class="`estado-${cita.estado}`"
        >
          <div class="agenda-hora">
            <span class="hora-txt">{{ cita.hora }}</span>
            <span class="duracion-txt">{{ cita.duracion }}</span>
          </div>
          <div class="agenda-linea" :class="`linea-${cita.estado}`"></div>
          <div class="agenda-info">
            <p class="agenda-servicio">{{ cita.servicio }}</p>
            <p class="agenda-cliente">👤 {{ cita.cliente }}</p>
          </div>
          <div class="agenda-acciones">
            <span class="estado-pill" :class="`pill-${cita.estado}`">{{
              cita.etiqueta
            }}</span>
            <button
              v-if="cita.estado === 'pendiente'"
              class="btn-confirmar"
              @click="confirmar(cita)"
            >
              Confirmar
            </button>
            <button
              v-if="cita.estado === 'confirmada'"
              class="btn-completar"
              @click="completar(cita)"
            >
              Completar
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Métricas del mes -->
    <section class="seccion">
      <h2 class="seccion-titulo">📊 Mi desempeño este mes</h2>
      <div class="metricas-grid">
        <div v-for="m in metricas" :key="m.titulo" class="metrica-card">
          <span class="metrica-icono">{{ m.icono }}</span>
          <span class="metrica-valor">{{ m.valor }}</span>
          <span class="metrica-titulo">{{ m.titulo }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/nucleo/estado/auth";

const auth = useAuthStore();

const fechaHoy = new Date().toLocaleDateString("es-MX", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const resumen = [
  { titulo: "Hoy", valor: "6" },
  { titulo: "Semana", valor: "24" },
  { titulo: "Mes", valor: "98" },
];

const citasHoy = ref([
  {
    id: 1,
    hora: "9:00",
    duracion: "45min",
    servicio: "Corte de cabello",
    cliente: "Carlos López",
    estado: "completada",
    etiqueta: "Completada",
  },
  {
    id: 2,
    hora: "10:00",
    duracion: "1hr",
    servicio: "Limpieza facial",
    cliente: "María García",
    estado: "confirmada",
    etiqueta: "Confirmada",
  },
  {
    id: 3,
    hora: "12:00",
    duracion: "1hr",
    servicio: "Manicure semipermanente",
    cliente: "Pedro Sánchez",
    estado: "confirmada",
    etiqueta: "Confirmada",
  },
  {
    id: 4,
    hora: "3:00",
    duracion: "1hr",
    servicio: "Maquillaje social",
    cliente: "Lucía Hernández",
    estado: "pendiente",
    etiqueta: "Pendiente",
  },
  {
    id: 5,
    hora: "4:30",
    duracion: "2hrs",
    servicio: "Tinte y coloración",
    cliente: "Rosa Méndez",
    estado: "pendiente",
    etiqueta: "Pendiente",
  },
]);

const metricas = [
  { titulo: "Citas completadas", valor: "98", icono: "✅" },
  { titulo: "Calificación", valor: "4.9⭐", icono: "🌸" },
  { titulo: "Clientes nuevos", valor: "12", icono: "👤" },
  { titulo: "Ingresos generados", valor: "$16,240", icono: "💰" },
];

function confirmar(cita) {
  cita.estado = "confirmada";
  cita.etiqueta = "Confirmada";
}
function completar(cita) {
  cita.estado = "completada";
  cita.etiqueta = "Completada";
}
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

.dashboard {
  max-width: 900px;
  font-family: "DM Sans", sans-serif;
}

/* ── Banner bienvenida ───────────────────────────── */
.welcome-banner {
  background: linear-gradient(135deg, #f9a8d4 0%, #fbcfe8 50%, #fce7f3 100%);
  border-radius: 20px;
  padding: 1.6rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.welcome-label {
  font-size: 0.82rem;
  color: rgba(157, 23, 77, 0.7);
  margin: 0 0 0.2rem;
}

.welcome-nombre {
  font-family: "Playfair Display", serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #831843;
  margin: 0 0 0.3rem;
  line-height: 1.1;
}

.welcome-fecha {
  font-size: 0.78rem;
  color: rgba(157, 23, 77, 0.6);
  margin: 0;
  text-transform: capitalize;
}

.welcome-stats {
  display: flex;
  gap: 1.5rem;
}

.mini-stat {
  text-align: center;
  background: rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  padding: 0.6rem 1rem;
  backdrop-filter: blur(4px);
}

.mini-val {
  display: block;
  font-family: "Playfair Display", serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #9d174d;
  line-height: 1;
}

.mini-lbl {
  font-size: 0.68rem;
  color: rgba(157, 23, 77, 0.6);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ── Sección ─────────────────────────────────────── */
.seccion {
  margin-bottom: 1.5rem;
}

.seccion-titulo {
  font-family: "Playfair Display", serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 1rem;
}

/* ── Agenda ──────────────────────────────────────── */
.agenda-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.agenda-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 168, 212, 0.15);
  border-radius: 14px;
  padding: 0.9rem 1.2rem;
  transition: border-color 0.2s;
}

.agenda-item:hover {
  border-color: rgba(249, 168, 212, 0.3);
}

.agenda-hora {
  text-align: center;
  min-width: 52px;
}

.hora-txt {
  display: block;
  font-family: "Playfair Display", serif;
  font-size: 1rem;
  font-weight: 600;
  color: #f9a8d4;
}

.duracion-txt {
  font-size: 0.65rem;
  color: rgba(255, 255, 255, 0.3);
}

.agenda-linea {
  width: 3px;
  height: 36px;
  border-radius: 2px;
}

.linea-pendiente {
  background: rgba(251, 191, 36, 0.5);
}
.linea-confirmada {
  background: rgba(249, 168, 212, 0.6);
}
.linea-completada {
  background: rgba(134, 239, 172, 0.5);
}

.agenda-info {
  flex: 1;
}

.agenda-servicio {
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.2rem;
}

.agenda-cliente {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.agenda-acciones {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.estado-pill {
  font-size: 0.68rem;
  padding: 0.15rem 0.6rem;
  border-radius: 20px;
  font-weight: 500;
}

.pill-pendiente {
  background: rgba(251, 191, 36, 0.15);
  color: #fbbf24;
}
.pill-confirmada {
  background: rgba(249, 168, 212, 0.15);
  color: #f9a8d4;
}
.pill-completada {
  background: rgba(134, 239, 172, 0.15);
  color: #86efac;
}

.btn-confirmar {
  background: rgba(249, 168, 212, 0.15);
  border: 1px solid rgba(249, 168, 212, 0.35);
  color: #f9a8d4;
  padding: 0.28rem 0.75rem;
  border-radius: 8px;
  font-size: 0.72rem;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  transition: background 0.2s;
}
.btn-confirmar:hover {
  background: rgba(249, 168, 212, 0.25);
}

.btn-completar {
  background: rgba(134, 239, 172, 0.12);
  border: 1px solid rgba(134, 239, 172, 0.3);
  color: #86efac;
  padding: 0.28rem 0.75rem;
  border-radius: 8px;
  font-size: 0.72rem;
  cursor: pointer;
  font-family: "DM Sans", sans-serif;
  transition: background 0.2s;
}
.btn-completar:hover {
  background: rgba(134, 239, 172, 0.22);
}

/* ── Métricas ────────────────────────────────────── */
.metricas-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
}

.metrica-card {
  background: rgba(249, 168, 212, 0.06);
  border: 1px solid rgba(249, 168, 212, 0.18);
  border-radius: 14px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  text-align: center;
  transition: border-color 0.2s;
}

.metrica-card:hover {
  border-color: rgba(249, 168, 212, 0.35);
}

.metrica-icono {
  font-size: 1.5rem;
}

.metrica-valor {
  font-family: "Playfair Display", serif;
  font-size: 1.2rem;
  font-weight: 700;
  color: #f9a8d4;
}

.metrica-titulo {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.35);
}
</style>
