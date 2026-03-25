<template>
  <div class="dashboard">

    <!-- Header admin -->
    <div class="admin-banner">
      <div class="banner-left">
        <p class="banner-label">🌸 Panel de administración</p>
        <h1 class="banner-titulo">Salón Estética Belle</h1>
        <p class="banner-fecha">{{ fechaHoy }}</p>
      </div>
      <div class="banner-right">
        <div class="banner-highlight">
          <span class="highlight-val">${{ ingresosMes }}</span>
          <span class="highlight-lbl">Ingresos este mes</span>
          <span class="highlight-trend">↑ 12% vs mes anterior</span>
        </div>
      </div>
    </div>

    <!-- KPIs -->
    <div class="kpis-grid">
      <div v-for="kpi in kpis" :key="kpi.titulo" class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-icono">{{ kpi.icono }}</span>
          <span class="kpi-trend" :class="kpi.subida ? 'up' : 'down'">
            {{ kpi.subida ? '↑' : '↓' }} {{ kpi.trend }}
          </span>
        </div>
        <div class="kpi-valor">{{ kpi.valor }}</div>
        <div class="kpi-titulo">{{ kpi.titulo }}</div>
      </div>
    </div>

    <div class="bottom-grid">
      <!-- Servicios más solicitados -->
      <section class="seccion">
        <h2 class="seccion-titulo">🏆 Top servicios del mes</h2>
        <div class="top-servicios">
          <div v-for="(s, i) in topServicios" :key="s.nombre" class="top-item">
            <span class="top-num" :class="`num-${i+1}`">#{{ i+1 }}</span>
            <div class="top-info">
              <p class="top-nombre">{{ s.nombre }}</p>
              <div class="top-barra-wrap">
                <div class="top-barra" :style="{ width: s.pct + '%' }"></div>
              </div>
            </div>
            <div class="top-datos">
              <span class="top-citas">{{ s.citas }} citas</span>
              <span class="top-ingreso">{{ s.ingreso }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Actividad reciente + equipo -->
      <div class="right-col">
        <section class="seccion">
          <h2 class="seccion-titulo">👩 Mi equipo hoy</h2>
          <div class="equipo-list">
            <div v-for="emp in equipo" :key="emp.nombre" class="equipo-item">
              <div class="equipo-avatar">{{ emp.avatar }}</div>
              <div class="equipo-info">
                <p class="equipo-nombre">{{ emp.nombre }}</p>
                <p class="equipo-esp">{{ emp.especialidad }}</p>
              </div>
              <div class="equipo-citas">
                <span class="equipo-num">{{ emp.citasHoy }}</span>
                <span class="equipo-lbl">hoy</span>
              </div>
            </div>
          </div>
        </section>

        <section class="seccion">
          <h2 class="seccion-titulo">🕐 Actividad reciente</h2>
          <div class="actividad-list">
            <div v-for="a in actividad" :key="a.id" class="actividad-item">
              <span class="act-icono">{{ a.icono }}</span>
              <div class="act-info">
                <p class="act-desc">{{ a.desc }}</p>
                <p class="act-tiempo">{{ a.tiempo }}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

  </div>
</template>

<script setup>
const fechaHoy = new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
const ingresosMes = '24,580'

const kpis = [
  { titulo: 'Citas completadas', valor: '148',  trend: '8%',  subida: true,  icono: '✅' },
  { titulo: 'Clientes activos',  valor: '63',   trend: '5%',  subida: true,  icono: '👤' },
  { titulo: 'Ticket promedio',   valor: '$166', trend: '4%',  subida: true,  icono: '🧾' },
  { titulo: 'Cancelaciones',     valor: '7',    trend: '2%',  subida: false, icono: '❌' },
]

const topServicios = [
  { nombre: 'Corte de cabello',        citas: 48, ingreso: '$12k', pct: 100 },
  { nombre: 'Limpieza facial',          citas: 32, ingreso: '$17.6k', pct: 67 },
  { nombre: 'Manicure semipermanente',  citas: 28, ingreso: '$9k',  pct: 58 },
  { nombre: 'Maquillaje social',        citas: 22, ingreso: '$9.9k', pct: 46 },
]

const equipo = [
  { avatar: 'AM', nombre: 'Ana Martínez',   especialidad: 'Corte & Color', citasHoy: 6 },
  { avatar: 'SR', nombre: 'Sofía Ramírez',  especialidad: 'Facial & Maquillaje', citasHoy: 4 },
  { avatar: 'LG', nombre: 'Laura González', especialidad: 'Uñas & Manicure', citasHoy: 5 },
]

const actividad = [
  { id: 1, icono: '✅', desc: 'Cita confirmada — Carlos López',    tiempo: 'Hace 5 min' },
  { id: 2, icono: '👤', desc: 'Nueva cliente registrada',          tiempo: 'Hace 20 min' },
  { id: 3, icono: '💳', desc: 'Pago recibido — Asesoría $550',     tiempo: 'Hace 1 hora' },
  { id: 4, icono: '🌸', desc: 'Ana completó cita de manicure',     tiempo: 'Hace 2 horas' },
]
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap');

.dashboard { max-width: 1000px; font-family: 'DM Sans', sans-serif; }

/* ── Banner admin ────────────────────────────────── */
.admin-banner {
  background: linear-gradient(135deg, #f9a8d4 0%, #fbcfe8 45%, #fce7f3 100%);
  border-radius: 20px;
  padding: 1.6rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.banner-label {
  font-size: 0.78rem;
  color: rgba(157,23,77,0.65);
  margin: 0 0 0.3rem;
  letter-spacing: 0.04em;
}

.banner-titulo {
  font-family: 'Playfair Display', serif;
  font-size: 1.7rem;
  font-weight: 700;
  color: #831843;
  margin: 0 0 0.3rem;
}

.banner-fecha {
  font-size: 0.78rem;
  color: rgba(157,23,77,0.55);
  margin: 0;
  text-transform: capitalize;
}

.banner-highlight {
  background: rgba(255,255,255,0.5);
  border-radius: 14px;
  padding: 1rem 1.4rem;
  text-align: center;
  backdrop-filter: blur(4px);
}

.highlight-val {
  display: block;
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: #9d174d;
}

.highlight-lbl {
  display: block;
  font-size: 0.72rem;
  color: rgba(157,23,77,0.6);
  margin: 0.1rem 0;
}

.highlight-trend {
  display: block;
  font-size: 0.7rem;
  color: #be185d;
  font-weight: 600;
}

/* ── KPIs ────────────────────────────────────────── */
.kpis-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.85rem;
  margin-bottom: 1.2rem;
}

.kpi-card {
  background: rgba(249,168,212,0.06);
  border: 1px solid rgba(249,168,212,0.18);
  border-radius: 14px;
  padding: 1rem 1.1rem;
  transition: border-color 0.2s;
}

.kpi-card:hover { border-color: rgba(249,168,212,0.35); }

.kpi-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.kpi-icono { font-size: 1.2rem; }

.kpi-trend {
  font-size: 0.68rem;
  padding: 0.12rem 0.45rem;
  border-radius: 20px;
  font-weight: 600;
}

.up   { background: rgba(134,239,172,0.15); color: #86efac; }
.down { background: rgba(255,100,100,0.15); color: #ff6b6b; }

.kpi-valor {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #f9a8d4;
}

.kpi-titulo {
  font-size: 0.72rem;
  color: rgba(255,255,255,0.35);
  margin-top: 0.2rem;
}

/* ── Bottom grid ─────────────────────────────────── */
.bottom-grid {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 1rem;
}

.seccion { margin-bottom: 1rem; }

.seccion-titulo {
  font-family: 'Playfair Display', serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.85rem;
}

/* ── Top servicios ───────────────────────────────── */
.top-servicios {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(249,168,212,0.15);
  border-radius: 14px;
  padding: 1rem 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.top-item { display: flex; align-items: center; gap: 0.8rem; }

.top-num {
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  font-weight: 700;
  min-width: 24px;
}

.num-1 { color: #f9a8d4; }
.num-2 { color: rgba(249,168,212,0.65); }
.num-3 { color: rgba(249,168,212,0.45); }
.num-4 { color: rgba(249,168,212,0.3); }

.top-info { flex: 1; }

.top-nombre {
  font-size: 0.82rem;
  color: #fff;
  margin: 0 0 0.25rem;
}

.top-barra-wrap {
  height: 3px;
  background: rgba(255,255,255,0.07);
  border-radius: 2px;
}

.top-barra {
  height: 100%;
  background: linear-gradient(90deg, #f472b6, #f9a8d4);
  border-radius: 2px;
  transition: width 0.5s ease;
}

.top-datos { text-align: right; }

.top-citas {
  display: block;
  font-size: 0.68rem;
  color: rgba(255,255,255,0.35);
}

.top-ingreso {
  display: block;
  font-family: 'Playfair Display', serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #f9a8d4;
}

/* ── Right col ───────────────────────────────────── */
.right-col { display: flex; flex-direction: column; gap: 1rem; }

/* Equipo */
.equipo-list {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(249,168,212,0.15);
  border-radius: 14px;
  overflow: hidden;
}

.equipo-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: background 0.15s;
}

.equipo-item:last-child { border-bottom: none; }
.equipo-item:hover { background: rgba(249,168,212,0.04); }

.equipo-avatar {
  width: 32px;
  height: 32px;
  background: rgba(249,168,212,0.15);
  border: 1px solid rgba(249,168,212,0.3);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: #f9a8d4;
  flex-shrink: 0;
}

.equipo-info { flex: 1; }

.equipo-nombre {
  font-size: 0.82rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.equipo-esp {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.35);
  margin: 0.1rem 0 0;
}

.equipo-citas { text-align: center; }

.equipo-num {
  display: block;
  font-family: 'Playfair Display', serif;
  font-size: 1rem;
  font-weight: 700;
  color: #f9a8d4;
}

.equipo-lbl {
  font-size: 0.62rem;
  color: rgba(255,255,255,0.3);
}

/* Actividad */
.actividad-list {
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(249,168,212,0.15);
  border-radius: 14px;
  overflow: hidden;
}

.actividad-item {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.7rem 1rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.actividad-item:last-child { border-bottom: none; }

.act-icono { font-size: 1rem; flex-shrink: 0; }

.act-desc {
  font-size: 0.78rem;
  color: rgba(255,255,255,0.75);
  margin: 0;
}

.act-tiempo {
  font-size: 0.68rem;
  color: rgba(255,255,255,0.3);
  margin: 0.1rem 0 0;
}
</style>