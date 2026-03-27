<template>
  <div class="inicio-page">
    <!-- Animated background -->
    <div class="bg-layer" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="grain"></div>
      <div class="grid-lines"></div>
    </div>

    <!-- ── TOPBAR ── -->
    <header class="topbar">
      <div class="marca">
        <div class="marca-icon">✦</div>
        <span>Nails Bere</span>
      </div>
      <nav class="acciones-top">
        <RouterLink to="/login" class="btn-outline">Iniciar sesión</RouterLink>
        <RouterLink to="/registro" class="btn-fill">Registrarme</RouterLink>
      </nav>
    </header>

    <!-- ── HERO ── -->
    <section class="hero">
      <div class="hero-left">
        <div class="hero-badge">
          <span class="live-dot"></span>
          Abierto hoy · Chiapas
        </div>

        <h1 class="hero-heading">
          <span class="word-outline">Belleza</span><br />
          que habla<br />
          <em>por ti</em>
        </h1>

        <p class="hero-sub">
          Uñas, color, maquillaje y más.<br />Tu próxima cita, a solo unos clics.
        </p>

        <div class="hero-ctas">
          <RouterLink to="/registro" class="btn-fill btn-lg btn-glow">
            Agendar cita
          </RouterLink>
          <RouterLink to="/login" class="btn-text-link">
            Ya tengo cuenta <span>→</span>
          </RouterLink>
        </div>

        <div class="stats-row">
          <div class="stat">
            <span class="stat-num">500+</span>
            <span class="stat-lbl">Clientas felices</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat">
            <span class="stat-num">4.9★</span>
            <span class="stat-lbl">Valoración</span>
          </div>
          <div class="stat-sep"></div>
          <div class="stat">
            <span class="stat-num">6</span>
            <span class="stat-lbl">Servicios</span>
          </div>
        </div>
      </div>

      <div class="hero-right" aria-hidden="true">
        <div class="hero-visual">
          <div class="visual-card vc-main">
            <img :src="imagenesUi.cta" alt="" />
            <div class="vc-label">
              <span class="vc-dot"></span>
              Manicure Gel · Hoy
            </div>
          </div>
          <div class="visual-card vc-sm vc-top">
            <span class="vc-emoji">💅</span>
            <span class="vc-sm-text">Diseño premium</span>
          </div>
          <div class="visual-card vc-sm vc-bottom">
            <span class="vc-emoji">✨</span>
            <span class="vc-sm-text">+200 diseños</span>
          </div>
          <div class="ring ring-a"></div>
          <div class="ring ring-b"></div>
        </div>
      </div>
    </section>

    <!-- ── PROMO TICKER ── -->
    <div class="ticker-wrap">
      <div class="ticker-track">
        <span v-for="n in 8" :key="n" class="ticker-item">
          ✦ Manicure + Facial &nbsp;·&nbsp; Oferta de Abril &nbsp;·&nbsp; Nuevas clientas
        </span>
      </div>
    </div>

    <!-- ── PROMOCIONES ── -->
    <section class="section promos-section">
      <header class="section-header">
        <div>
          <p class="eyebrow">Abril 2025</p>
          <h2>Promociones del mes</h2>
        </div>
        <RouterLink to="/registro" class="header-link">Ver todas →</RouterLink>
      </header>

      <div class="promos-grid">
        <article
          v-for="(promo, i) in promociones"
          :key="promo.titulo"
          class="promo-card"
          :class="{ 'promo-featured': promo.destacada }"
          :style="{ '--delay': `${i * 80}ms` }"
        >
          <div v-if="promo.destacada" class="hot-badge">Popular ★</div>
          <div class="promo-thumb-wrap">
            <img class="promo-thumb" :src="promo.imagen" :alt="promo.titulo" />
          </div>
          <div class="promo-body">
            <p class="promo-titulo">{{ promo.titulo }}</p>
            <p class="promo-desc">{{ promo.desc }}</p>
          </div>
          <div class="promo-precio-wrap">
            <span class="precio-before">{{ promo.antes }}</span>
            <span class="precio-now">{{ promo.ahora }}</span>
          </div>
        </article>
      </div>
    </section>

    <!-- ── SERVICIOS ── -->
    <section class="section servicios-section">
      <header class="section-header">
        <div>
          <p class="eyebrow">Profesionales certificadas</p>
          <h2>Nuestros servicios</h2>
        </div>
      </header>

      <div class="servicios-grid">
        <article
          v-for="(s, i) in servicios"
          :key="s.titulo"
          class="servicio-card"
          :style="{ '--delay': `${i * 60}ms` }"
        >
          <div class="servicio-img-wrap">
            <img class="servicio-img" :src="s.imagen" :alt="s.titulo" />
            <span class="servicio-precio-tag">{{ s.precio }}</span>
          </div>
          <div class="servicio-body">
            <h3>{{ s.titulo }}</h3>
            <p>{{ s.descripcion }}</p>
          </div>
          <div class="servicio-footer">
            <span class="duracion-pill">⏱ {{ s.duracion }}</span>
            <span class="servicio-link">Reservar →</span>
          </div>
        </article>
      </div>
    </section>

    <!-- ── TESTIMONIOS ── -->
    <section class="section testimonios-section">
      <header class="section-header centered">
        <p class="eyebrow">Lo dicen ellas</p>
        <h2>Clientas que nos aman.</h2>
      </header>

      <div class="testimonios-grid">
        <article
          v-for="(t, i) in testimonios"
          :key="t.nombre"
          class="testimonio-card"
          :class="i === 1 ? 'tcard-featured' : ''"
        >
          <div class="stars">★★★★★</div>
          <p class="t-texto">"{{ t.texto }}"</p>
          <div class="t-autor">
            <div class="t-avatar">{{ t.nombre[0] }}</div>
            <div>
              <p class="t-nombre">{{ t.nombre }}</p>
              <p class="t-servicio">{{ t.servicio }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ── BENEFICIOS ── -->
    <section class="section beneficios-section">
      <div class="beneficios-inner">
        <div class="beneficio" v-for="item in beneficios" :key="item.titulo">
          <div class="beneficio-icon">{{ item.icono }}</div>
          <h4>{{ item.titulo }}</h4>
          <p>{{ item.texto }}</p>
        </div>
      </div>
    </section>

    <!-- ── CTA FINAL ── -->
    <section class="cta-final">
      <div class="cta-glow-bg"></div>
      <p class="cta-eyebrow">¿Lista para brillar?</p>
      <h2 class="cta-heading">Tu mejor versión<br /><em>te está esperando</em></h2>
      <p class="cta-sub">
        Regístrate gratis y accede a precios exclusivos para nuevas clientas.
      </p>
      <RouterLink to="/registro" class="btn-fill btn-lg btn-glow">
        Crear mi cuenta gratis
      </RouterLink>
      <div class="cta-deco-row" aria-hidden="true">
        <span class="cta-sparkle">✦</span>
        <span class="cta-sparkle sm">✦</span>
        <span class="cta-sparkle lg">✦</span>
      </div>
    </section>

    <!-- ── FOOTER ── -->
    <footer class="footer">
      <span class="footer-marca">✦ Nails Bere</span>
      <span class="footer-copy">Chiapas · © 2025</span>
    </footer>
  </div>
</template>

<script setup>
const imagenesUi = {
  logo: "/img/inicio/logo.jpg",
  estrella: "/img/inicio/estrella.jpg",
  cta: "/img/inicio/cta.jpg",
};

const promociones = [
  {
    imagen: "/img/inicio/promo-manicure.jpg",
    titulo: "Manicure + Gel",
    desc: "Diseño incluido para nuevas clientas",
    antes: "$280",
    ahora: "$199",
    destacada: true,
  },
  {
    imagen: "/img/inicio/promo-facial.jpg",
    titulo: "Facial Express",
    desc: "Limpieza profunda + hidratación",
    antes: "$350",
    ahora: "$250",
    destacada: false,
  },
  {
    imagen: "/img/inicio/promo-maquillaje.jpg",
    titulo: "Maquillaje + Peinado",
    desc: "Pack eventos y graduaciones",
    antes: "$600",
    ahora: "$450",
    destacada: false,
  },
  {
    imagen: "/img/inicio/promo-color.jpg",
    titulo: "Color completo",
    desc: "Tinte + tratamiento de brillo",
    antes: "$700",
    ahora: "$520",
    destacada: true,
  },
];

const servicios = [
  {
    imagen: "/img/inicio/servicio-corte.jpg",
    titulo: "Corte y peinado",
    descripcion: "Diseño personalizado según tu tipo de rostro y estilo.",
    precio: "Desde $150",
    duracion: "45 min",
  },
  {
    imagen: "/img/inicio/servicio-color.jpg",
    titulo: "Color y tratamientos",
    descripcion: "Coloración, matices y tratamientos para recuperar brillo.",
    precio: "Desde $350",
    duracion: "90 min",
  },
  {
    imagen: "/img/inicio/servicio-unas.jpg",
    titulo: "Uñas",
    descripcion: "Manicure, gel semipermanente y diseños para toda ocasión.",
    precio: "Desde $180",
    duracion: "60 min",
  },
  {
    imagen: "/img/inicio/servicio-maquillaje.jpg",
    titulo: "Maquillaje",
    descripcion: "Maquillaje social y profesional para eventos especiales.",
    precio: "Desde $300",
    duracion: "75 min",
  },
  {
    imagen: "/img/inicio/servicio-facial.jpg",
    titulo: "Faciales",
    descripcion: "Limpieza e hidratación para una piel fresca y luminosa.",
    precio: "Desde $250",
    duracion: "50 min",
  },
  {
    imagen: "/img/inicio/servicio-paquetes.jpg",
    titulo: "Paquetes",
    descripcion: "Combina servicios y obtén mejores precios.",
    precio: "Desde $450",
    duracion: "2–3 h",
  },
];

const testimonios = [
  {
    nombre: "Daniela R.",
    texto: "Me encantó la atención y mis uñas quedaron perfectas. ¡Ya agendé mi próxima cita!",
    servicio: "Manicure Gel",
  },
  {
    nombre: "Sofía M.",
    texto: "El facial express es increíble. Mi piel quedó súper luminosa y el precio es muy accesible.",
    servicio: "Facial Express",
  },
  {
    nombre: "Valeria T.",
    texto: "Para mi graduación me hicieron el maquillaje y el peinado. Quedé espectacular, ¡gracias!",
    servicio: "Maquillaje + Peinado",
  },
];

const beneficios = [
  {
    icono: "🌸",
    titulo: "Atención personalizada",
    texto: "Te asesoramos según tus objetivos y preferencias de estilo.",
  },
  {
    icono: "📅",
    titulo: "Agenda simple",
    texto: "Solicita tus citas sin complicarte y en pocos pasos.",
  },
  {
    icono: "🏆",
    titulo: "Profesionales certificadas",
    texto: "Equipo experto en tendencias y cuidado integral.",
  },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Cabinet+Grotesk:wght@300;400;500;700;800&display=swap");

/* ══════════════════════════════════════════
   DESIGN TOKENS
══════════════════════════════════════════ */
.inicio-page {
  --c-bg:      #0f080f;
  --c-surface: rgba(255,255,255,0.055);
  --c-border:  rgba(220,140,200,0.22);
  --c-border2: rgba(255,255,255,0.10);

  --c-rose:    #e8a0d4;
  --c-rose-d:  #c570b0;
  --c-rose-dd: #8a2f78;
  --c-gold:    #f0c080;
  --c-text:    #f5eeff;
  --c-muted:   rgba(245,238,255,0.60);

  --r-card:    18px;
  --r-pill:    100px;

  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body:    "Cabinet Grotesk", "DM Sans", sans-serif;

  font-family: var(--font-body);
  color: var(--c-text);
  background: var(--c-bg);
  min-height: 100vh;
  overflow-x: hidden;
  padding: 0 1.25rem 4rem;
  position: relative;
}

/* ══════════════════════════════════════════
   BACKGROUND
══════════════════════════════════════════ */
.bg-layer {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(110px);
}
.orb-1 {
  width: 600px; height: 600px;
  background: radial-gradient(circle, #8a1f7060, transparent 65%);
  top: -160px; left: -160px;
  animation: drift 22s ease-in-out infinite alternate;
}
.orb-2 {
  width: 480px; height: 480px;
  background: radial-gradient(circle, #b0408880, transparent 65%);
  top: 50%; right: -140px;
  animation: drift 28s ease-in-out infinite alternate-reverse;
}
.orb-3 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, #f0a0c040, transparent 65%);
  bottom: 5%; left: 25%;
  animation: drift 20s ease-in-out infinite alternate;
}
@keyframes drift {
  from { transform: translate(0,0) scale(1); }
  to   { transform: translate(30px,20px) scale(1.06); }
}

.grain {
  position: absolute;
  inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(220,140,200,0.04) 1px, transparent 1px),
    linear-gradient(90deg, rgba(220,140,200,0.04) 1px, transparent 1px);
  background-size: 60px 60px;
  mask-image: radial-gradient(ellipse 70% 60% at 50% 0%, black 30%, transparent 100%);
}

header, section, footer, .ticker-wrap {
  position: relative;
  z-index: 2;
}

/* ══════════════════════════════════════════
   TOPBAR
══════════════════════════════════════════ */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 1.2rem;
  margin-bottom: 0;
  border: 1px solid var(--c-border);
  border-radius: 14px;
  background: rgba(15,8,15,0.55);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
}

.marca {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--c-rose);
  letter-spacing: 0.02em;
}

.marca-icon {
  font-size: 1.1rem;
  color: var(--c-gold);
  line-height: 1;
}

.acciones-top {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

/* ══════════════════════════════════════════
   BUTTONS
══════════════════════════════════════════ */
.btn-fill, .btn-outline, .btn-text-link {
  text-decoration: none;
  border-radius: var(--r-pill);
  font-family: var(--font-body);
  font-weight: 700;
  transition: all 0.22s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
}

.btn-fill {
  background: linear-gradient(130deg, #f0b0d8 0%, #d060a8 45%, #7a1f6a 100%);
  background-size: 200% 200%;
  animation: grad-anim 5s ease infinite;
  color: #fff;
  padding: 0.6rem 1.3rem;
  font-size: 0.9rem;
  border: 1px solid rgba(255,180,230,0.30);
  box-shadow: 0 6px 24px rgba(180,60,140,0.28);
}
.btn-fill:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(180,60,140,0.42);
}

@keyframes grad-anim {
  0%,100% { background-position: 0% 50%; }
  50%      { background-position: 100% 50%; }
}

.btn-lg { padding: 0.82rem 1.9rem; font-size: 1rem; }

.btn-glow {
  box-shadow:
    0 6px 28px rgba(194,110,180,0.38),
    0 0 0 1px rgba(220,140,200,0.30);
}

.btn-outline {
  padding: 0.58rem 1.1rem;
  font-size: 0.88rem;
  color: var(--c-rose);
  border: 1px solid var(--c-border);
  background: var(--c-surface);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.09);
  border-color: var(--c-rose-d);
}

.btn-text-link {
  color: rgba(245,238,255,0.75);
  font-size: 0.9rem;
  font-weight: 500;
  padding: 0.5rem 0;
  border: none;
  background: none;
}
.btn-text-link span { transition: transform 0.2s; display: inline-block; }
.btn-text-link:hover span { transform: translateX(4px); }
.btn-text-link:hover { color: var(--c-text); }

/* ══════════════════════════════════════════
   HERO
══════════════════════════════════════════ */
.hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
  padding: 4rem 0 3rem;
  min-height: 70vh;
}

/* Left */
.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(220,140,200,0.12);
  border: 1px solid rgba(220,140,200,0.32);
  border-radius: var(--r-pill);
  padding: 0.32rem 0.9rem;
  font-size: 0.8rem;
  color: var(--c-rose);
  margin-bottom: 1.6rem;
  font-weight: 500;
}

.live-dot {
  width: 7px; height: 7px;
  background: #4ade80;
  border-radius: 50%;
  display: inline-block;
  animation: pulse 2.2s ease infinite;
}
@keyframes pulse {
  0%,100% { box-shadow: 0 0 0 0 rgba(74,222,128,0.55); }
  50%      { box-shadow: 0 0 0 5px rgba(74,222,128,0); }
}

.hero-heading {
  font-family: var(--font-display);
  font-size: clamp(3rem, 6.5vw, 5.2rem);
  font-weight: 700;
  line-height: 1.02;
  margin: 0 0 1.1rem;
  letter-spacing: -0.01em;
}

.word-outline {
  -webkit-text-stroke: 1.5px var(--c-rose);
  color: transparent;
  display: inline-block;
}

.hero-heading em {
  font-style: italic;
  background: linear-gradient(135deg, #ffd8ef, #df8ecf, #b965ab);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-sub {
  color: var(--c-muted);
  font-size: 1.05rem;
  line-height: 1.65;
  margin: 0 0 1.8rem;
  max-width: 440px;
}

.hero-ctas {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  flex-wrap: wrap;
  margin-bottom: 2.4rem;
}

.stats-row {
  display: flex;
  align-items: center;
  gap: 1.4rem;
  flex-wrap: wrap;
}
.stat { display: flex; flex-direction: column; gap: 0.08rem; }
.stat-num {
  font-family: var(--font-display);
  font-size: 1.7rem;
  font-weight: 700;
  color: var(--c-rose);
  line-height: 1;
}
.stat-lbl {
  font-size: 0.73rem;
  color: var(--c-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}
.stat-sep {
  width: 1px;
  height: 32px;
  background: var(--c-border2);
}

/* Right – visual composition */
.hero-right { display: flex; justify-content: flex-end; }

.hero-visual {
  position: relative;
  width: 320px;
  height: 380px;
  flex-shrink: 0;
}

.visual-card {
  position: absolute;
  border-radius: 20px;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(220,140,200,0.28);
  backdrop-filter: blur(12px);
  overflow: hidden;
}

.vc-main {
  inset: 0;
  border-radius: 24px;
  overflow: hidden;
}
.vc-main img {
  width: 100%; height: 100%;
  object-fit: cover;
  opacity: 0.88;
}
.vc-label {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: rgba(10,5,10,0.72);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(220,140,200,0.22);
  border-radius: 12px;
  padding: 0.45rem 0.75rem;
  font-size: 0.8rem;
  color: var(--c-rose);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.vc-dot {
  width: 7px; height: 7px;
  background: #4ade80;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse 2s ease infinite;
}

.vc-sm {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  width: 100px;
  height: 80px;
  backdrop-filter: blur(10px);
}
.vc-top {
  top: -18px;
  right: -28px;
  animation: float 5s ease-in-out infinite;
}
.vc-bottom {
  bottom: 30px;
  left: -28px;
  animation: float 6s ease-in-out infinite 1s;
}
.vc-emoji { font-size: 1.5rem; }
.vc-sm-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--c-rose);
  text-align: center;
}

@keyframes float {
  0%,100% { transform: translateY(0); }
  50%      { transform: translateY(-10px); }
}

.ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(220,140,200,0.18);
  pointer-events: none;
}
.ring-a {
  width: 370px; height: 370px;
  top: -25px; left: -25px;
  animation: spin 30s linear infinite;
}
.ring-b {
  width: 420px; height: 420px;
  top: -50px; left: -50px;
  border-color: rgba(220,140,200,0.09);
  animation: spin 40s linear infinite reverse;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

/* ══════════════════════════════════════════
   TICKER
══════════════════════════════════════════ */
.ticker-wrap {
  width: 100%;
  overflow: hidden;
  border-top: 1px solid var(--c-border);
  border-bottom: 1px solid var(--c-border);
  padding: 0.7rem 0;
  margin-bottom: 3rem;
  background: rgba(255,255,255,0.025);
}

.ticker-track {
  display: flex;
  gap: 0;
  width: max-content;
  animation: ticker 28s linear infinite;
}

.ticker-item {
  font-size: 0.8rem;
  color: var(--c-rose);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 0 2.5rem;
  white-space: nowrap;
}

@keyframes ticker {
  from { transform: translateX(0); }
  to   { transform: translateX(-50%); }
}

/* ══════════════════════════════════════════
   SHARED SECTION STYLES
══════════════════════════════════════════ */
.section { margin-bottom: 4rem; }

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 1.6rem;
  flex-wrap: wrap;
  gap: 0.8rem;
}
.section-header.centered {
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.eyebrow {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.10em;
  color: var(--c-gold);
  font-weight: 700;
  margin: 0 0 0.3rem;
}

.section-header h2 {
  font-family: var(--font-display);
  font-size: clamp(1.6rem, 3.5vw, 2.2rem);
  font-weight: 700;
  margin: 0;
  line-height: 1.1;
}

.header-link {
  text-decoration: none;
  color: var(--c-rose);
  font-size: 0.88rem;
  font-weight: 700;
  border-bottom: 1px solid rgba(220,140,200,0.4);
  padding-bottom: 1px;
  transition: color 0.2s;
}
.header-link:hover { color: #fff; }

/* ══════════════════════════════════════════
   PROMOS GRID
══════════════════════════════════════════ */
.promos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1rem;
}

.promo-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  padding: 1.1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  overflow: hidden;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  animation: fadeUp 0.5s ease both;
  animation-delay: var(--delay, 0ms);
}
.promo-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(220,140,200,0.06) 0%, transparent 60%);
  pointer-events: none;
}
.promo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 36px rgba(180,60,140,0.22);
  border-color: rgba(220,140,200,0.38);
}

.promo-featured {
  background: linear-gradient(135deg,
    rgba(138,47,120,0.20) 0%,
    rgba(220,140,200,0.09) 100%);
  border-color: rgba(220,140,200,0.36);
}

.hot-badge {
  position: absolute;
  top: 0.65rem;
  right: 0.65rem;
  background: linear-gradient(130deg, #f59e0b, #ef4444);
  color: #fff;
  font-size: 0.66rem;
  font-weight: 800;
  padding: 0.18rem 0.55rem;
  border-radius: var(--r-pill);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.promo-thumb-wrap {
  flex-shrink: 0;
  width: 58px; height: 58px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.18);
  box-shadow: 0 4px 14px rgba(0,0,0,0.3);
}
.promo-thumb {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.35s;
}
.promo-card:hover .promo-thumb { transform: scale(1.06); }

.promo-body { flex: 1; min-width: 0; }
.promo-titulo {
  font-weight: 700;
  font-size: 0.95rem;
  margin: 0 0 0.2rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.promo-desc {
  color: var(--c-muted);
  font-size: 0.79rem;
  margin: 0;
}

.promo-precio-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
  gap: 0.08rem;
}
.precio-before {
  font-size: 0.75rem;
  color: var(--c-muted);
  text-decoration: line-through;
}
.precio-now {
  font-family: var(--font-display);
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--c-rose);
  line-height: 1;
}

/* ══════════════════════════════════════════
   SERVICIOS GRID
══════════════════════════════════════════ */
.servicios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 1rem;
}

.servicio-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s;
  animation: fadeUp 0.5s ease both;
  animation-delay: var(--delay, 0ms);
}
.servicio-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 40px rgba(150,50,120,0.25);
  border-color: rgba(220,140,200,0.4);
}

.servicio-img-wrap {
  position: relative;
  height: 140px;
  overflow: hidden;
}
.servicio-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}
.servicio-card:hover .servicio-img { transform: scale(1.07); }

.servicio-precio-tag {
  position: absolute;
  top: 0.7rem;
  right: 0.7rem;
  background: rgba(10,5,10,0.75);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(220,140,200,0.30);
  color: var(--c-rose);
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.22rem 0.65rem;
  border-radius: var(--r-pill);
}

.servicio-body {
  padding: 0.9rem 1rem 0.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.servicio-body h3 {
  font-family: var(--font-display);
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
}
.servicio-body p {
  color: var(--c-muted);
  font-size: 0.83rem;
  line-height: 1.55;
  margin: 0;
  flex: 1;
}

.servicio-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.65rem 1rem 0.9rem;
  border-top: 1px solid var(--c-border2);
  margin-top: auto;
}

.duracion-pill {
  font-size: 0.76rem;
  color: var(--c-muted);
  background: rgba(255,255,255,0.05);
  border: 1px solid var(--c-border2);
  border-radius: var(--r-pill);
  padding: 0.18rem 0.6rem;
}
.servicio-link {
  font-size: 0.82rem;
  color: var(--c-rose-d);
  font-weight: 700;
  cursor: pointer;
  transition: color 0.2s;
}
.servicio-card:hover .servicio-link { color: var(--c-rose); }

/* ══════════════════════════════════════════
   TESTIMONIOS
══════════════════════════════════════════ */
.testimonios-section { margin-bottom: 4rem; }

.testimonios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1rem;
  align-items: start;
}

.testimonio-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border2);
  border-radius: var(--r-card);
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  transition: transform 0.22s, border-color 0.22s;
}
.testimonio-card:hover {
  transform: translateY(-3px);
  border-color: var(--c-border);
}

.tcard-featured {
  background: linear-gradient(135deg,
    rgba(138,47,120,0.20),
    rgba(220,140,200,0.08));
  border-color: rgba(220,140,200,0.34);
  transform: scale(1.02);
}
.tcard-featured:hover { transform: scale(1.02) translateY(-3px); }

.stars {
  color: var(--c-gold);
  font-size: 0.9rem;
  letter-spacing: 0.12em;
}

.t-texto {
  color: rgba(245,238,255,0.85);
  font-size: 0.9rem;
  line-height: 1.65;
  margin: 0;
  flex: 1;
  font-style: italic;
}

.t-autor {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
  padding-top: 0.8rem;
  border-top: 1px solid var(--c-border2);
}

.t-avatar {
  width: 38px; height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9a2f88, #e0a0d0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  flex-shrink: 0;
  color: #fff;
}

.t-nombre {
  font-weight: 700;
  font-size: 0.88rem;
  margin: 0;
}
.t-servicio {
  color: var(--c-muted);
  font-size: 0.77rem;
  margin: 0;
}

/* ══════════════════════════════════════════
   BENEFICIOS
══════════════════════════════════════════ */
.beneficios-section { margin-bottom: 4rem; }

.beneficios-inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}

.beneficio {
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--c-border2);
  border-radius: var(--r-card);
  padding: 1.4rem 1.2rem;
  transition: border-color 0.22s, background 0.22s;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.beneficio:hover {
  border-color: var(--c-border);
  background: rgba(220,140,200,0.06);
}

.beneficio-icon {
  font-size: 2rem;
  margin-bottom: 0.2rem;
  display: block;
}

.beneficio h4 {
  margin: 0;
  color: var(--c-rose);
  font-size: 1rem;
  font-weight: 700;
}
.beneficio p {
  color: var(--c-muted);
  font-size: 0.84rem;
  margin: 0;
  line-height: 1.55;
}

/* ══════════════════════════════════════════
   CTA FINAL
══════════════════════════════════════════ */
.cta-final {
  position: relative;
  text-align: center;
  padding: 4rem 2rem;
  border-radius: 28px;
  border: 1px solid rgba(220,140,200,0.28);
  overflow: hidden;
  margin-bottom: 2.5rem;
}

.cta-glow-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 60% 70% at 50% 50%, rgba(138,47,120,0.30), transparent 70%);
  pointer-events: none;
}

.cta-eyebrow {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--c-gold);
  font-weight: 700;
  margin: 0 0 0.7rem;
  position: relative;
}

.cta-heading {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3.4rem);
  font-weight: 700;
  line-height: 1.1;
  margin: 0 0 0.9rem;
  position: relative;
}
.cta-heading em {
  font-style: italic;
  background: linear-gradient(135deg, #ffd8ef, #df8ecf, #b965ab);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.cta-sub {
  color: var(--c-muted);
  font-size: 0.95rem;
  margin: 0 auto 1.8rem;
  max-width: 400px;
  position: relative;
}

.cta-deco-row {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.cta-sparkle {
  position: absolute;
  color: var(--c-rose-d);
  opacity: 0.45;
  font-size: 1.2rem;
  animation: sparkle 3s ease-in-out infinite;
}
.cta-sparkle:nth-child(1) { top: 20%; left: 8%; animation-delay: 0s; }
.cta-sparkle:nth-child(2) { bottom: 25%; right: 10%; animation-delay: 1s; font-size: 0.9rem; }
.cta-sparkle:nth-child(3) { top: 30%; right: 6%; animation-delay: 1.7s; font-size: 1.5rem; }

@keyframes sparkle {
  0%,100% { opacity: 0.2; transform: scale(0.9) rotate(0deg); }
  50%      { opacity: 0.6; transform: scale(1.1) rotate(20deg); }
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 0.2rem;
  border-top: 1px solid var(--c-border2);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-marca {
  font-family: var(--font-display);
  color: var(--c-rose);
  font-weight: 700;
  font-size: 1rem;
}

.footer-copy {
  color: var(--c-muted);
  font-size: 0.82rem;
}

/* ══════════════════════════════════════════
   ANIMATION
══════════════════════════════════════════ */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ══════════════════════════════════════════
   RESPONSIVE
══════════════════════════════════════════ */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 2.5rem 0 2rem;
    min-height: unset;
  }
  .hero-right { display: none; }
  .hero-heading { font-size: clamp(2.4rem, 9vw, 3.5rem); }
  .tcard-featured { transform: none; }
  .tcard-featured:hover { transform: translateY(-3px); }
  .cta-final { padding: 2.5rem 1.2rem; }
}
</style>