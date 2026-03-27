<template>
  <div class="dashboard">
    <!-- Banner del salón -->
    <div class="salon-banner">
      <div class="banner-overlay">
        <div class="banner-content">
          <p class="banner-saludo">Bienvenida de vuelta,</p>
          <h1 class="banner-nombre">
            {{ auth.usuario?.nombre?.split(" ")[0] }} ✨
          </h1>
          <p class="banner-sub">¿Qué servicio te gustaría hoy?</p>
        </div>
        <div class="banner-deco">
          <span class="deco-circle c1">💄</span>
          <span class="deco-circle c2">✂️</span>
          <span class="deco-circle c3">💅</span>
          <span class="deco-circle c4">🌸</span>
        </div>
      </div>
    </div>

    <!-- Próxima cita destacada -->
    <div v-if="proximaCita" class="proxima-cita-card">
      <div class="proxima-left">
        <span class="proxima-label">📅 Tu próxima cita</span>
        <p class="proxima-servicio">{{ proximaCita.servicio }}</p>
        <p class="proxima-info">
          {{ proximaCita.fecha }} · {{ proximaCita.hora }}
        </p>
      </div>
      <div class="proxima-right">
        <span class="proxima-empleada">👩 {{ proximaCita.empleada }}</span>
        <span class="proxima-badge">Confirmada</span>
      </div>
    </div>

    <!-- Tarjetas resumen -->
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.titulo" class="stat-card">
        <div class="stat-emoji">{{ stat.icono }}</div>
        <div class="stat-data">
          <span class="stat-valor">{{ stat.valor }}</span>
          <span class="stat-titulo">{{ stat.titulo }}</span>
        </div>
      </div>
    </div>

    <!-- Servicios recomendados -->
    <section class="seccion">
      <div class="seccion-header">
        <h2 class="seccion-titulo">🌸 Servicios para ti</h2>
        <RouterLink to="/usuario/servicios" class="ver-todos"
          >Ver todos →</RouterLink
        >
      </div>
      <div class="servicios-grid">
        <div v-for="s in serviciosDestacados" :key="s.id" class="servicio-card">
          <div class="servicio-emoji">{{ s.icono }}</div>
          <div class="servicio-body">
            <h3 class="servicio-nombre">{{ s.nombre }}</h3>
            <p class="servicio-desc">{{ s.desc }}</p>
            <div class="servicio-footer">
              <span class="servicio-precio">{{ s.precio }}</span>
              <RouterLink to="/usuario/servicios" class="btn-agendar"
                >Agendar</RouterLink
              >
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/nucleo/estado/auth";
import { obtenerServicios } from "@/nucleo/firebase/servicios";
import { obtenerMisCitas } from "@/nucleo/firebase/citas";

const auth = useAuthStore();

const servicios = ref([]);
const citas = ref([]);

const ICONOS_CATEGORIA = {
  manos: "💅",
  pies: "🦶",
  diseño: "🎨",
  extensiones: "✨",
};

onMounted(async () => {
  try {
    const [listaServicios, listaCitas] = await Promise.all([
      obtenerServicios(),
      obtenerMisCitas(),
    ]);
    servicios.value = listaServicios;
    citas.value = listaCitas;
  } catch (error) {
    console.error("Error cargando datos del panel:", error);
  }
});

const citasActivas = computed(() =>
  citas.value.filter((c) => c.estado !== "cancelada"),
);

const proximaCita = computed(() => {
  const ahora = new Date();
  const candidatas = citasActivas.value
    .map((cita) => {
      const fecha =
        cita.fecha instanceof Date ? cita.fecha : new Date(cita.fecha);
      return { ...cita, fechaObj: fecha };
    })
    .filter(
      (cita) =>
        cita.fechaObj instanceof Date && !Number.isNaN(cita.fechaObj.getTime()),
    )
    .filter((cita) => cita.fechaObj >= ahora)
    .sort((a, b) => a.fechaObj - b.fechaObj);

  if (!candidatas.length) return null;

  const cita = candidatas[0];
  const servicio = servicios.value.find((s) => s.id === cita.servicioId);

  return {
    servicio: servicio?.nombre || "Servicio",
    fecha: cita.fechaObj.toLocaleDateString("es-MX", {
      weekday: "long",
      day: "2-digit",
      month: "short",
    }),
    hora: cita.hora || "--:--",
    empleada: cita.empleadaNombre || "Por asignar",
  };
});

const stats = computed(() => {
  const hoy = new Date();
  const citasMes = citasActivas.value.filter((cita) => {
    const fecha =
      cita.fecha instanceof Date ? cita.fecha : new Date(cita.fecha);
    return (
      fecha instanceof Date &&
      !Number.isNaN(fecha.getTime()) &&
      fecha.getMonth() === hoy.getMonth() &&
      fecha.getFullYear() === hoy.getFullYear()
    );
  }).length;

  const serviciosUsados = new Set(
    citasActivas.value.map((cita) => cita.servicioId).filter(Boolean),
  ).size;

  const puntos = citasActivas.value.length * 40;

  return [
    { titulo: "Citas este mes", valor: String(citasMes), icono: "📅" },
    { titulo: "Servicios usados", valor: String(serviciosUsados), icono: "✨" },
    { titulo: "Puntos acumulados", valor: String(puntos), icono: "🌸" },
  ];
});

const serviciosDestacados = computed(() =>
  servicios.value.slice(0, 4).map((s) => ({
    id: s.id,
    icono: ICONOS_CATEGORIA[s.categoria] || "💄",
    nombre: s.nombre,
    desc: s.descripcion,
    precio: `$${s.precio}`,
  })),
);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500&display=swap");

.dashboard {
  max-width: 960px;
  font-family: "DM Sans", sans-serif;
}

/* ── Banner ─────────────────────────────────────── */
.salon-banner {
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 1.2rem;
  background: linear-gradient(
    135deg,
    #f9a8d4 0%,
    #fbcfe8 40%,
    #fce7f3 70%,
    #fdf2f8 100%
  );
  position: relative;
  min-height: 160px;
}

.banner-overlay {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2rem 2rem;
  position: relative;
  z-index: 1;
}

.banner-saludo {
  font-size: 0.85rem;
  color: rgba(157, 23, 77, 0.7);
  margin: 0 0 0.2rem;
  letter-spacing: 0.03em;
}

.banner-nombre {
  font-family: "Playfair Display", serif;
  font-size: 2rem;
  font-weight: 700;
  color: #831843;
  margin: 0 0 0.4rem;
  line-height: 1.1;
}

.banner-sub {
  font-size: 0.88rem;
  color: rgba(157, 23, 77, 0.6);
  margin: 0;
}

.banner-deco {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  position: relative;
}

.deco-circle {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.6);
}

.c1 {
  animation: float 3s ease-in-out infinite;
}
.c2 {
  animation: float 3s ease-in-out infinite 0.5s;
}
.c3 {
  animation: float 3s ease-in-out infinite 1s;
}
.c4 {
  animation: float 3s ease-in-out infinite 1.5s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

/* ── Próxima cita ────────────────────────────────── */
.proxima-cita-card {
  background: linear-gradient(
    135deg,
    rgba(249, 168, 212, 0.15),
    rgba(251, 207, 232, 0.1)
  );
  border: 1px solid rgba(249, 168, 212, 0.4);
  border-radius: 16px;
  padding: 1.1rem 1.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.proxima-label {
  font-size: 0.72rem;
  color: #f472b6;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin: 0 0 0.3rem;
}

.proxima-servicio {
  font-family: "Playfair Display", serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 0.2rem;
}

.proxima-info {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.45);
  margin: 0;
}

.proxima-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.4rem;
}

.proxima-empleada {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.5);
}

.proxima-badge {
  background: rgba(249, 168, 212, 0.2);
  border: 1px solid rgba(249, 168, 212, 0.4);
  color: #f9a8d4;
  font-size: 0.7rem;
  padding: 0.2rem 0.7rem;
  border-radius: 20px;
}

/* ── Stats ───────────────────────────────────────── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.85rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: rgba(249, 168, 212, 0.07);
  border: 1px solid rgba(249, 168, 212, 0.2);
  border-radius: 14px;
  padding: 1rem 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  transition: border-color 0.2s;
}

.stat-card:hover {
  border-color: rgba(249, 168, 212, 0.4);
}

.stat-emoji {
  font-size: 1.6rem;
}

.stat-valor {
  display: block;
  font-family: "Playfair Display", serif;
  font-size: 1.4rem;
  font-weight: 700;
  color: #f9a8d4;
  line-height: 1;
}

.stat-titulo {
  font-size: 0.72rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 0.2rem;
  display: block;
}

/* ── Servicios destacados ────────────────────────── */
.seccion {
  margin-top: 0.5rem;
}

.seccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.seccion-titulo {
  font-family: "Playfair Display", serif;
  font-size: 1.15rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.ver-todos {
  font-size: 0.8rem;
  color: #f9a8d4;
  text-decoration: none;
  transition: color 0.2s;
}

.ver-todos:hover {
  color: #f472b6;
}

.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 0.85rem;
}

.servicio-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(249, 168, 212, 0.15);
  border-radius: 16px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  transition:
    border-color 0.2s,
    transform 0.2s;
}

.servicio-card:hover {
  border-color: rgba(249, 168, 212, 0.35);
  transform: translateY(-2px);
}

.servicio-emoji {
  font-size: 1.8rem;
}

.servicio-nombre {
  font-family: "Playfair Display", serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.servicio-desc {
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0.2rem 0 0;
  line-height: 1.4;
}

.servicio-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.servicio-precio {
  font-family: "Playfair Display", serif;
  font-size: 1rem;
  font-weight: 700;
  color: #f9a8d4;
}

.btn-agendar {
  background: linear-gradient(135deg, #f472b6, #ec4899);
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 0.35rem 0.85rem;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: opacity 0.2s;
  font-family: "DM Sans", sans-serif;
}

.btn-agendar:hover {
  opacity: 0.85;
}
</style>
