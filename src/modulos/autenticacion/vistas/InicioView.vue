<template>
  <div class="inicio-page">
    <!-- Animated background particles -->
    <div class="bg-orbs">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- Noise overlay -->
    <div class="noise-overlay"></div>

    <!-- ── TOPBAR ── -->
    <header class="topbar">
      <div class="marca">
        <span class="marca-icon">◈</span>
        <span>Nails Bere</span>
      </div>
      <nav class="acciones-top">
        <RouterLink to="/login" class="btn-link">Iniciar sesión</RouterLink>
        <RouterLink to="/registro" class="btn-principal"
          >Registrarme</RouterLink
        >
      </nav>
    </header>

    <!-- ── HERO ── -->
    <section class="hero">
      <div class="hero-badge">
        <span class="pulse-dot"></span>
        Abierto hoy · Tuxtla Gutiérrez
      </div>

      <h1>
        <span class="line-accent">Belleza</span> que<br />
        habla por ti
      </h1>

      <p class="subtexto">
        Uñas, color, maquillaje y más. Tu próxima cita, a solo unos clics.
      </p>

      <div class="hero-acciones">
        <RouterLink to="/registro" class="btn-principal btn-glow">
          <span>✦</span> Agendar cita
        </RouterLink>
        <RouterLink to="/login" class="btn-ghost">Ya tengo cuenta →</RouterLink>
      </div>

      <!-- Stats row -->
      <div class="stats-row">
        <div class="stat">
          <span class="stat-num">500+</span>
          <span class="stat-lbl">Clientas felices</span>
        </div>
        <div class="stat-div"></div>
        <div class="stat">
          <span class="stat-num">4.9 ★</span>
          <span class="stat-lbl">Valoración</span>
        </div>
        <div class="stat-div"></div>
        <div class="stat">
          <span class="stat-num">6</span>
          <span class="stat-lbl">Servicios</span>
        </div>
      </div>
    </section>

    <!-- ── PROMO BANNER ── -->
    <section class="promo-banner">
      <div class="promo-badge">🔥 Oferta limitada</div>
      <div class="promo-content">
        <p class="promo-titulo">¡Manicure + Facial a precio especial!</p>
        <p class="promo-sub">
          Solo para nuevas clientas · Válido hasta el 30 de abril
        </p>
      </div>
      <RouterLink to="/registro" class="promo-cta">Ver oferta →</RouterLink>
    </section>

    <!-- ── PROMOCIONES ── -->
    <section class="promos-section">
      <div class="section-header">
        <h2>Promociones del mes</h2>
        <span class="section-tag">Abril 2025</span>
      </div>
      <div class="promos-grid">
        <article
          v-for="promo in promociones"
          :key="promo.titulo"
          class="promo-card"
          :class="promo.destacada ? 'promo-destacada' : ''"
        >
          <div class="promo-emoji">{{ promo.icono }}</div>
          <div class="promo-info">
            <p class="promo-card-titulo">{{ promo.titulo }}</p>
            <p class="promo-card-desc">{{ promo.desc }}</p>
          </div>
          <div class="promo-precio">
            <span class="precio-antes">{{ promo.antes }}</span>
            <span class="precio-ahora">{{ promo.ahora }}</span>
          </div>
          <div v-if="promo.destacada" class="promo-hot-tag">⚡ Popular</div>
        </article>
      </div>
    </section>

    <!-- ── SERVICIOS ── -->
    <section class="servicios">
      <div class="section-header">
        <h2>Nuestros servicios</h2>
        <span class="section-tag">Profesionales certificadas</span>
      </div>
      <div class="grid-servicios">
        <article
          v-for="servicio in servicios"
          :key="servicio.titulo"
          class="card-servicio"
        >
          <div class="card-top">
            <div class="icono">{{ servicio.icono }}</div>
            <span class="servicio-precio">{{ servicio.precio }}</span>
          </div>
          <h3>{{ servicio.titulo }}</h3>
          <p>{{ servicio.descripcion }}</p>
          <div class="card-footer">
            <span class="duracion">⏱ {{ servicio.duracion }}</span>
            <span class="card-link">Ver más →</span>
          </div>
        </article>
      </div>
    </section>

    <!-- ── TESTIMONIOS ── -->
    <section class="testimonios">
      <div class="section-header">
        <h2>Lo que dicen nuestras clientas</h2>
      </div>
      <div class="testimonios-grid">
        <article
          v-for="t in testimonios"
          :key="t.nombre"
          class="testimonio-card"
        >
          <div class="estrellas">★★★★★</div>
          <p class="testimonio-texto">"{{ t.texto }}"</p>
          <div class="testimonio-autor">
            <div class="avatar">{{ t.nombre[0] }}</div>
            <div>
              <p class="autor-nombre">{{ t.nombre }}</p>
              <p class="autor-servicio">{{ t.servicio }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ── BENEFICIOS ── -->
    <section class="beneficios">
      <div class="beneficio" v-for="item in beneficios" :key="item.titulo">
        <div class="beneficio-icono">{{ item.icono }}</div>
        <h4>{{ item.titulo }}</h4>
        <p>{{ item.texto }}</p>
      </div>
    </section>

    <!-- ── CTA FINAL ── -->
    <section class="cta-final">
      <div class="cta-inner">
        <p class="cta-eyebrow">¿Lista para brillar?</p>
        <h2>Tu mejor versión<br />te está esperando</h2>
        <p class="cta-sub">
          Regístrate gratis y accede a precios exclusivos para nuevas clientas.
        </p>
        <RouterLink to="/registro" class="btn-principal btn-glow btn-lg">
          <span>✦</span> Crear mi cuenta gratis
        </RouterLink>
      </div>
      <div class="cta-deco">
        <span class="deco-ring ring-1"></span>
        <span class="deco-ring ring-2"></span>
        <span class="deco-emoji">💅</span>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="footer">
      <span class="marca-small">◈ Nails Bere</span>
      <span>Tuxtla Gutiérrez, Chiapas · © 2025</span>
    </footer>
  </div>
</template>

<script setup>
const promociones = [
  {
    icono: "💅✨",
    titulo: "Manicure + Gel",
    desc: "Diseño incluido para nuevas clientas",
    antes: "$280",
    ahora: "$199",
    destacada: true,
  },
  {
    icono: "🌸",
    titulo: "Facial Express",
    desc: "Limpieza profunda + hidratación",
    antes: "$350",
    ahora: "$250",
    destacada: false,
  },
  {
    icono: "💄🎨",
    titulo: "Maquillaje + Peinado",
    desc: "Pack eventos y graduaciones",
    antes: "$600",
    ahora: "$450",
    destacada: false,
  },
  {
    icono: "🌈",
    titulo: "Color completo",
    desc: "Tinte + tratamiento de brillo",
    antes: "$700",
    ahora: "$520",
    destacada: true,
  },
];

const servicios = [
  {
    icono: "✂️",
    titulo: "Corte y peinado",
    descripcion: "Diseño personalizado según tu tipo de rostro y estilo.",
    precio: "Desde $150",
    duracion: "45 min",
  },
  {
    icono: "🎨",
    titulo: "Color y tratamientos",
    descripcion: "Coloración, matices y tratamientos para recuperar brillo.",
    precio: "Desde $350",
    duracion: "90 min",
  },
  {
    icono: "💅",
    titulo: "Uñas",
    descripcion: "Manicure, gel semipermanente y diseños para toda ocasión.",
    precio: "Desde $180",
    duracion: "60 min",
  },
  {
    icono: "💄",
    titulo: "Maquillaje",
    descripcion: "Maquillaje social y profesional para eventos especiales.",
    precio: "Desde $300",
    duracion: "75 min",
  },
  {
    icono: "🧖",
    titulo: "Faciales",
    descripcion: "Limpieza e hidratación para una piel fresca y luminosa.",
    precio: "Desde $250",
    duracion: "50 min",
  },
  {
    icono: "🌸",
    titulo: "Paquetes",
    descripcion: "Combina servicios y obtén mejores precios.",
    precio: "Desde $450",
    duracion: "2–3 h",
  },
];

const testimonios = [
  {
    nombre: "Daniela R.",
    texto:
      "Me encantó la atención y mis uñas quedaron perfectas. ¡Ya agendé mi próxima cita!",
    servicio: "Manicure Gel",
  },
  {
    nombre: "Sofía M.",
    texto:
      "El facial express es increíble. Mi piel quedó súper luminosa y el precio es muy accesible.",
    servicio: "Facial Express",
  },
  {
    nombre: "Valeria T.",
    texto:
      "Para mi graduación me hicieron el maquillaje y el peinado. Quedé espectacular, gracias!",
    servicio: "Maquillaje + Peinado",
  },
];

const beneficios = [
  {
    icono: "🎯",
    titulo: "Atención personalizada",
    texto: "Te asesoramos según tus objetivos y preferencias de estilo.",
  },
  {
    icono: "📅",
    titulo: "Agenda simple",
    texto: "Solicita tus citas sin complicarte y en pocos pasos.",
  },
  {
    icono: "🏅",
    titulo: "Profesionales certificadas",
    texto: "Equipo experto en tendencias y cuidado integral.",
  },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&display=swap");

/* ── VARIABLES ── */
:root {
  --pink: #f472b6;
  --pink-deep: #ec4899;
  --pink-soft: #fbcfe8;
  --rose: #be185d;
  --bg: #0c070d;
  --surface: rgba(255, 255, 255, 0.04);
  --border: rgba(249, 168, 212, 0.18);
  --border-soft: rgba(255, 255, 255, 0.1);
  --text: #fff;
  --muted: rgba(255, 255, 255, 0.6);
}

/* ── BASE ── */
.inicio-page {
  min-height: 100vh;
  color: var(--text);
  background: #0c070d;
  font-family: "DM Sans", sans-serif;
  padding: 0 1.2rem 3rem;
  overflow-x: hidden;
  position: relative;
}

/* ── BACKGROUND ── */
.bg-orbs {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.35;
  animation: orb-drift 18s ease-in-out infinite alternate;
}

.orb-1 {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, #be185d, transparent 70%);
  top: -120px;
  left: -120px;
  animation-duration: 20s;
}
.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #9d174d, transparent 70%);
  top: 40%;
  right: -100px;
  animation-duration: 25s;
  animation-delay: -8s;
}
.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, #7c3aed44, transparent 70%);
  bottom: 10%;
  left: 30%;
  animation-duration: 22s;
  animation-delay: -4s;
}

@keyframes orb-drift {
  from {
    transform: translate(0, 0) scale(1);
  }
  to {
    transform: translate(40px, 30px) scale(1.08);
  }
}

.noise-overlay {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
  background-size: 200px;
}

/* All sections sit above bg */
header,
section,
footer {
  position: relative;
  z-index: 2;
}

/* ── TOPBAR ── */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.4rem 0.2rem 1rem;
}

.marca {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: "Playfair Display", serif;
  font-weight: 900;
  font-size: 1.3rem;
  color: var(--pink-soft);
  letter-spacing: 0.01em;
}

.marca-icon {
  color: var(--pink);
  font-size: 1.5rem;
}

.acciones-top {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

/* ── BUTTONS ── */
.btn-principal,
.btn-ghost,
.btn-link {
  text-decoration: none;
  border-radius: 100px;
  padding: 0.6rem 1.1rem;
  font-weight: 600;
  font-size: 0.88rem;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-principal {
  background: linear-gradient(135deg, #f472b6, #ec4899, #be185d);
  background-size: 200% 200%;
  color: #fff;
  box-shadow: 0 0 0 0 rgba(236, 72, 153, 0);
  animation: gradient-shift 4s ease infinite;
}

@keyframes gradient-shift {
  0%,
  100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.btn-glow {
  box-shadow:
    0 4px 24px rgba(236, 72, 153, 0.4),
    0 0 0 1px rgba(244, 114, 182, 0.3);
}

.btn-glow:hover {
  box-shadow:
    0 6px 32px rgba(236, 72, 153, 0.6),
    0 0 0 1px rgba(244, 114, 182, 0.5);
  transform: translateY(-1px);
}

.btn-lg {
  padding: 0.85rem 1.8rem;
  font-size: 1rem;
}

.btn-ghost {
  color: rgba(255, 255, 255, 0.85);
  border: 1px solid var(--border-soft);
  background: transparent;
}

.btn-ghost:hover {
  background: rgba(255, 255, 255, 0.06);
}

.btn-link {
  color: rgba(255, 255, 255, 0.75);
  border: 1px solid var(--border-soft);
  background: rgba(255, 255, 255, 0.04);
}

.btn-link:hover {
  background: rgba(255, 255, 255, 0.08);
}

/* ── HERO ── */
.hero {
  padding: 2rem 0 2.5rem;
  max-width: 860px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(244, 114, 182, 0.12);
  border: 1px solid rgba(244, 114, 182, 0.3);
  border-radius: 100px;
  padding: 0.35rem 0.9rem;
  font-size: 0.8rem;
  color: var(--pink-soft);
  margin-bottom: 1.4rem;
}

.pulse-dot {
  width: 7px;
  height: 7px;
  background: #4ade80;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.5);
  }
  50% {
    box-shadow: 0 0 0 5px rgba(74, 222, 128, 0);
  }
}

h1 {
  font-family: "Playfair Display", serif;
  font-size: clamp(2.6rem, 7vw, 4.8rem);
  line-height: 1.05;
  margin: 0 0 1rem;
  letter-spacing: -0.01em;
}

.line-accent {
  font-style: italic;
  background: linear-gradient(135deg, #f9a8d4, #f472b6, #ec4899);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtexto {
  color: var(--muted);
  font-size: 1.08rem;
  max-width: 560px;
  line-height: 1.6;
}

.hero-acciones {
  margin-top: 1.6rem;
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  align-items: center;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-top: 2.2rem;
  flex-wrap: wrap;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.stat-num {
  font-family: "Playfair Display", serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--pink-soft);
  line-height: 1;
}

.stat-lbl {
  font-size: 0.78rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stat-div {
  width: 1px;
  height: 36px;
  background: var(--border-soft);
}

/* ── PROMO BANNER ── */
.promo-banner {
  background: linear-gradient(
    135deg,
    rgba(190, 24, 93, 0.25),
    rgba(244, 114, 182, 0.12)
  );
  border: 1px solid rgba(244, 114, 182, 0.35);
  border-radius: 18px;
  padding: 1rem 1.4rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2.5rem;
  position: relative;
  overflow: hidden;
}

.promo-banner::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, rgba(244, 114, 182, 0.08), transparent);
  pointer-events: none;
}

.promo-badge {
  background: var(--pink-deep);
  color: #fff;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 0.3rem 0.8rem;
  border-radius: 100px;
  white-space: nowrap;
  letter-spacing: 0.03em;
}

.promo-content {
  flex: 1;
  min-width: 180px;
}

.promo-titulo {
  font-family: "Playfair Display", serif;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0;
}

.promo-sub {
  color: var(--muted);
  font-size: 0.82rem;
  margin: 0.2rem 0 0;
}

.promo-cta {
  text-decoration: none;
  color: var(--pink-soft);
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  border-bottom: 1px solid rgba(251, 207, 232, 0.4);
  padding-bottom: 1px;
  transition: color 0.2s;
}

.promo-cta:hover {
  color: #fff;
}

/* ── SECTION HEADER ── */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.2rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.section-header h2 {
  font-family: "Playfair Display", serif;
  font-size: 1.7rem;
  font-weight: 700;
  margin: 0;
}

.section-tag {
  background: rgba(244, 114, 182, 0.12);
  border: 1px solid var(--border);
  color: var(--pink-soft);
  font-size: 0.75rem;
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  letter-spacing: 0.04em;
}

/* ── PROMOS GRID ── */
.promos-section {
  margin-bottom: 3rem;
}

.promos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 0.9rem;
}

.promo-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.1rem;
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
  position: relative;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  overflow: hidden;
}

.promo-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 32px rgba(236, 72, 153, 0.18);
}

.promo-destacada {
  background: linear-gradient(
    135deg,
    rgba(190, 24, 93, 0.18),
    rgba(244, 114, 182, 0.08)
  );
  border-color: rgba(244, 114, 182, 0.4);
}

.promo-emoji {
  font-size: 1.8rem;
  line-height: 1;
  flex-shrink: 0;
}

.promo-info {
  flex: 1;
}

.promo-card-titulo {
  font-weight: 600;
  font-size: 0.95rem;
  margin: 0 0 0.25rem;
}

.promo-card-desc {
  color: var(--muted);
  font-size: 0.8rem;
  margin: 0;
}

.promo-precio {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  gap: 0.1rem;
}

.precio-antes {
  color: var(--muted);
  font-size: 0.78rem;
  text-decoration: line-through;
}

.precio-ahora {
  font-family: "Playfair Display", serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--pink-soft);
}

.promo-hot-tag {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  color: #fff;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.18rem 0.55rem;
  border-radius: 100px;
  letter-spacing: 0.04em;
}

/* ── SERVICIOS ── */
.servicios {
  margin-bottom: 3rem;
}

.grid-servicios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.9rem;
}

.card-servicio {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  transition:
    border-color 0.2s,
    transform 0.2s;
}

.card-servicio:hover {
  border-color: rgba(244, 114, 182, 0.45);
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.icono {
  font-size: 1.6rem;
}

.servicio-precio {
  font-size: 0.78rem;
  color: var(--pink-soft);
  background: rgba(244, 114, 182, 0.12);
  border: 1px solid rgba(244, 114, 182, 0.2);
  border-radius: 100px;
  padding: 0.18rem 0.6rem;
  white-space: nowrap;
}

.card-servicio h3 {
  font-family: "Playfair Display", serif;
  font-size: 1.05rem;
  font-weight: 700;
  margin: 0.2rem 0 0;
}

.card-servicio p {
  color: var(--muted);
  font-size: 0.84rem;
  line-height: 1.5;
  margin: 0;
  flex: 1;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.6rem;
  padding-top: 0.7rem;
  border-top: 1px solid var(--border-soft);
}

.duracion {
  font-size: 0.77rem;
  color: var(--muted);
}

.card-link {
  font-size: 0.8rem;
  color: var(--pink);
  font-weight: 600;
  cursor: pointer;
}

/* ── TESTIMONIOS ── */
.testimonios {
  margin-bottom: 3rem;
}

.testimonios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.9rem;
}

.testimonio-card {
  background: var(--surface);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  transition: transform 0.2s;
}

.testimonio-card:hover {
  transform: translateY(-2px);
}

.estrellas {
  color: #f59e0b;
  font-size: 0.88rem;
  letter-spacing: 0.08em;
}

.testimonio-texto {
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
  flex: 1;
}

.testimonio-autor {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #be185d, #f472b6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.autor-nombre {
  font-weight: 600;
  font-size: 0.88rem;
  margin: 0;
}

.autor-servicio {
  color: var(--muted);
  font-size: 0.78rem;
  margin: 0;
}

/* ── BENEFICIOS ── */
.beneficios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.9rem;
  margin-bottom: 3rem;
}

.beneficio {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-soft);
  border-radius: 16px;
  padding: 1.1rem;
  transition: border-color 0.2s;
}

.beneficio:hover {
  border-color: var(--border);
}

.beneficio-icono {
  font-size: 1.5rem;
  margin-bottom: 0.6rem;
}

.beneficio h4 {
  margin: 0 0 0.3rem;
  color: var(--pink-soft);
  font-size: 0.95rem;
  font-weight: 600;
}

.beneficio p {
  color: var(--muted);
  font-size: 0.84rem;
  margin: 0;
}

/* ── CTA FINAL ── */
.cta-final {
  background: linear-gradient(
    135deg,
    rgba(190, 24, 93, 0.2),
    rgba(244, 114, 182, 0.1),
    rgba(124, 58, 237, 0.08)
  );
  border: 1px solid rgba(244, 114, 182, 0.3);
  border-radius: 24px;
  padding: 2.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  position: relative;
  overflow: hidden;
}

.cta-inner {
  flex: 1;
  min-width: 260px;
}

.cta-eyebrow {
  color: var(--pink);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 600;
  margin: 0 0 0.6rem;
}

.cta-final h2 {
  font-family: "Playfair Display", serif;
  font-size: clamp(1.6rem, 4vw, 2.4rem);
  margin: 0 0 0.7rem;
  line-height: 1.15;
}

.cta-sub {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0 0 1.4rem;
  max-width: 420px;
}

.cta-deco {
  position: relative;
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deco-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(244, 114, 182, 0.25);
  animation: ring-spin 12s linear infinite;
}

.ring-1 {
  width: 100px;
  height: 100px;
}

.ring-2 {
  width: 140px;
  height: 140px;
  border-color: rgba(244, 114, 182, 0.12);
  animation-duration: 18s;
  animation-direction: reverse;
}

@keyframes ring-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.deco-emoji {
  font-size: 3rem;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* ── FOOTER ── */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0.2rem;
  border-top: 1px solid var(--border-soft);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.marca-small {
  font-family: "Playfair Display", serif;
  color: var(--pink-soft);
  font-weight: 700;
}

.footer span {
  color: var(--muted);
  font-size: 0.82rem;
}
</style>
