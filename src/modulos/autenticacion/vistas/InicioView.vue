<template>
  <div class="inicio-page">
    <div class="ambient-bg" aria-hidden="true">
      <div class="glow glow-a"></div>
      <div class="glow glow-b"></div>
      <div class="glow glow-c"></div>
      <div class="mesh"></div>
    </div>

    <header class="topbar">
      <div class="marca">
        <div class="marca-sello">NB</div>
        <div>
          <p class="marca-kicker">Beauty Studio</p>
          <span class="marca-nombre">Nails Bere</span>
        </div>
      </div>

      <nav class="acciones-top">
        <RouterLink to="/login" class="btn btn-ghost">Iniciar sesion</RouterLink>
        <RouterLink to="/registro" class="btn btn-solid">Registrarme</RouterLink>
      </nav>
    </header>

    <section class="hero">
      <div class="hero-copy">
        <p class="eyebrow">Tu espacio para verte increible</p>

        <h1 class="hero-title">
          Color, brillo y
          <span>actitud</span>
          en cada cita
        </h1>

        <p class="hero-text">
          Manicure, faciales, maquillaje y peinado en una experiencia con
          energia fresca, femenina y totalmente pensada para consentirte.
        </p>

        <div class="hero-actions">
          <RouterLink to="/registro" class="btn btn-solid btn-lg">
            Reservar ahora
          </RouterLink>
          <RouterLink to="/login" class="btn btn-outline btn-lg">
            Ya tengo cuenta
          </RouterLink>
        </div>

        <div class="hero-highlights">
          <div class="highlight-card">
            <span class="highlight-value">+500</span>
            <span class="highlight-label">Clientas felices</span>
          </div>
          <div class="highlight-card">
            <span class="highlight-value">4.9</span>
            <span class="highlight-label">Valoracion media</span>
          </div>
          <div class="highlight-card">
            <span class="highlight-value">6</span>
            <span class="highlight-label">Experiencias top</span>
          </div>
        </div>
      </div>

      <div class="hero-visual" aria-hidden="true">
        <article class="feature-panel main-panel">
          <img :src="imagenesUi.cta" alt="" />
          <div class="panel-overlay">
            <p class="panel-tag">Look favorito del mes</p>
            <h2>Summer Gloss</h2>
            <span>Acabados luminosos y colores vivos</span>
          </div>
        </article>

        <article class="floating-card card-top">
          <span class="floating-kicker">Tendencia</span>
          <strong>Coral Peach</strong>
          <small>El tono mas pedido</small>
        </article>

        <article class="floating-card card-bottom">
          <span class="floating-number">30%</span>
          <small>Off para nuevas clientas</small>
        </article>
      </div>
    </section>

    <section class="promo-strip">
      <div class="promo-chip">Agenda en linea</div>
      <p>Promociones activas en manicure, facial express y maquillaje social.</p>
      <RouterLink to="/registro" class="promo-link">Ver promos</RouterLink>
    </section>

    <section class="section">
      <header class="section-head">
        <div>
          <p class="section-kicker">Favoritas del mes</p>
          <h2>Promociones para destacar</h2>
        </div>
        <RouterLink to="/registro" class="section-link">Quiero apartar</RouterLink>
      </header>

      <div class="promos-grid">
        <article
          v-for="(promo, i) in promociones"
          :key="promo.titulo"
          class="promo-card"
          :class="{ featured: promo.destacada }"
          :style="{ '--delay': `${i * 90}ms` }"
        >
          <div class="promo-image">
            <img :src="promo.imagen" :alt="promo.titulo" />
          </div>

          <div class="promo-content">
            <p class="promo-name">{{ promo.titulo }}</p>
            <p class="promo-desc">{{ promo.desc }}</p>
            <div class="promo-prices">
              <span class="old-price">{{ promo.antes }}</span>
              <span class="new-price">{{ promo.ahora }}</span>
            </div>
          </div>

          <span v-if="promo.destacada" class="promo-badge">Top</span>
        </article>
      </div>
    </section>

    <section class="section">
      <header class="section-head">
        <div>
          <p class="section-kicker">Nuestro menu beauty</p>
          <h2>Servicios que elevan tu estilo</h2>
        </div>
      </header>

      <div class="services-grid">
        <article
          v-for="(servicio, i) in servicios"
          :key="servicio.titulo"
          class="service-card"
          :style="{ '--delay': `${i * 70}ms` }"
        >
          <img :src="servicio.imagen" :alt="servicio.titulo" class="service-img" />
          <div class="service-body">
            <div class="service-top">
              <h3>{{ servicio.titulo }}</h3>
              <span class="service-price">{{ servicio.precio }}</span>
            </div>
            <p>{{ servicio.descripcion }}</p>
            <div class="service-meta">
              <span>{{ servicio.duracion }}</span>
              <span>Reserva disponible</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="section testimonial-section">
      <header class="section-head centered">
        <p class="section-kicker">Ellas ya lo vivieron</p>
        <h2>Opiniones que enamoran</h2>
      </header>

      <div class="testimonial-grid">
        <article
          v-for="(testimonio, i) in testimonios"
          :key="testimonio.nombre"
          class="testimonial-card"
          :class="{ accent: i === 1 }"
        >
          <span class="stars">★★★★★</span>
          <p class="testimonial-text">"{{ testimonio.texto }}"</p>
          <div class="testimonial-author">
            <div class="avatar">{{ testimonio.nombre[0] }}</div>
            <div>
              <p class="author-name">{{ testimonio.nombre }}</p>
              <p class="author-service">{{ testimonio.servicio }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="benefits-band">
      <article v-for="beneficio in beneficios" :key="beneficio.titulo" class="benefit">
        <span class="benefit-icon">{{ beneficio.icono }}</span>
        <h4>{{ beneficio.titulo }}</h4>
        <p>{{ beneficio.texto }}</p>
      </article>
    </section>

    <section class="final-cta">
      <div class="final-copy">
        <p class="section-kicker">Haz tu glow-up hoy</p>
        <h2>Tu proxima cita puede ser tu mejor version</h2>
        <p>
          Crea tu cuenta y recibe acceso a promociones exclusivas, agenda rapida
          y una experiencia de belleza mucho mas personalizada.
        </p>
      </div>

      <RouterLink to="/registro" class="btn btn-dark btn-lg">
        Crear cuenta gratis
      </RouterLink>
    </section>

    <footer class="footer">
      <span>Nails Bere</span>
      <span>Chiapas · © 2025</span>
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
    desc: "Diseno incluido para nuevas clientas",
    antes: "$280",
    ahora: "$199",
    destacada: true,
  },
  {
    imagen: "/img/inicio/promo-facial.jpg",
    titulo: "Facial Express",
    desc: "Limpieza profunda + hidratacion",
    antes: "$350",
    ahora: "$250",
    destacada: false,
  },
  {
    imagen: "/img/inicio/promo-maquillaje.jpg",
    titulo: "Maquillaje + Peinado",
    desc: "Pack para eventos y graduaciones",
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
    descripcion: "Look personalizado que realza tu estilo y tu rostro.",
    precio: "Desde $150",
    duracion: "45 min",
  },
  {
    imagen: "/img/inicio/servicio-color.jpg",
    titulo: "Color y tratamientos",
    descripcion: "Coloracion, matices y nutricion para un cabello brillante.",
    precio: "Desde $350",
    duracion: "90 min",
  },
  {
    imagen: "/img/inicio/servicio-unas.jpg",
    titulo: "Unas",
    descripcion: "Manicure, gel y disenos para cualquier mood y ocasion.",
    precio: "Desde $180",
    duracion: "60 min",
  },
  {
    imagen: "/img/inicio/servicio-maquillaje.jpg",
    titulo: "Maquillaje",
    descripcion: "Acabados sociales y profesionales con efecto wow.",
    precio: "Desde $300",
    duracion: "75 min",
  },
  {
    imagen: "/img/inicio/servicio-facial.jpg",
    titulo: "Faciales",
    descripcion: "Limpieza, hidratacion y luminosidad para tu piel.",
    precio: "Desde $250",
    duracion: "50 min",
  },
  {
    imagen: "/img/inicio/servicio-paquetes.jpg",
    titulo: "Paquetes",
    descripcion: "Combina servicios y arma una experiencia completa.",
    precio: "Desde $450",
    duracion: "2-3 h",
  },
];

const testimonios = [
  {
    nombre: "Daniela R.",
    texto: "Me encanto la atencion y mis unas quedaron perfectas. Ya reserve mi siguiente cita.",
    servicio: "Manicure Gel",
  },
  {
    nombre: "Sofia M.",
    texto: "El facial express me dejo la piel super luminosa y el lugar se siente precioso desde que entras.",
    servicio: "Facial Express",
  },
  {
    nombre: "Valeria T.",
    texto: "Maquillaje y peinado impecables para mi graduacion. Sali feliz con el resultado.",
    servicio: "Maquillaje + Peinado",
  },
];

const beneficios = [
  {
    icono: "🌺",
    titulo: "Atencion cercana",
    texto: "Escuchamos tu idea y la convertimos en un look que si se siente tuyo.",
  },
  {
    icono: "💫",
    titulo: "Ambiente instagrameable",
    texto: "Una experiencia visual mas fresca, luminosa y llena de estilo.",
  },
  {
    icono: "🗓",
    titulo: "Agenda sencilla",
    texto: "Aparta tu cita en pocos pasos y recibe promociones especiales.",
  },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Prata&family=Manrope:wght@400;500;600;700;800&display=swap");

.inicio-page {
  --bg: #fff7ef;
  --surface: rgba(255, 255, 255, 0.72);
  --surface-strong: #fff9f4;
  --line: rgba(125, 62, 52, 0.12);
  --text: #48271e;
  --muted: #7b5a52;
  --peach: #ff8a6b;
  --melon: #ffb38a;
  --cream: #ffe6cc;
  --berry: #c4476d;
  --gold: #f3b85a;
  --dark: #34201a;

  min-height: 100vh;
  padding: 1.25rem;
  color: var(--text);
  background:
    radial-gradient(circle at top left, rgba(255, 179, 138, 0.7), transparent 26%),
    radial-gradient(circle at bottom right, rgba(196, 71, 109, 0.18), transparent 28%),
    linear-gradient(180deg, #fff8f1 0%, #fff1e7 48%, #ffe9e2 100%);
  font-family: "Manrope", sans-serif;
  overflow-x: hidden;
  position: relative;
}

.ambient-bg {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.glow {
  position: absolute;
  border-radius: 999px;
  filter: blur(90px);
  opacity: 0.75;
}

.glow-a {
  width: 320px;
  height: 320px;
  background: rgba(255, 154, 123, 0.5);
  top: 4%;
  left: -3%;
}

.glow-b {
  width: 320px;
  height: 320px;
  background: rgba(255, 225, 192, 0.95);
  right: 8%;
  top: 24%;
}

.glow-c {
  width: 280px;
  height: 280px;
  background: rgba(196, 71, 109, 0.2);
  right: 0;
  bottom: 10%;
}

.mesh {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.3) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.3) 1px, transparent 1px);
  background-size: 52px 52px;
  opacity: 0.2;
}

.topbar,
.hero,
.promo-strip,
.section,
.benefits-band,
.final-cta,
.footer {
  position: relative;
  z-index: 1;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: rgba(255, 250, 244, 0.66);
  backdrop-filter: blur(18px);
  margin-bottom: 1.2rem;
}

.marca {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.marca-sello {
  width: 50px;
  height: 50px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, var(--berry), var(--peach));
  color: #fff;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.marca-kicker {
  margin: 0 0 0.2rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.67rem;
  color: var(--berry);
  font-weight: 700;
}

.marca-nombre {
  font-family: "Prata", serif;
  font-size: 1.45rem;
}

.acciones-top {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.btn {
  text-decoration: none;
  border-radius: 999px;
  padding: 0.82rem 1.35rem;
  font-weight: 800;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    color 0.22s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-solid {
  color: #fff;
  background: linear-gradient(135deg, var(--berry), var(--peach));
  box-shadow: 0 14px 34px rgba(196, 71, 109, 0.24);
}

.btn-ghost {
  color: var(--text);
  background: rgba(255, 255, 255, 0.46);
  border: 1px solid var(--line);
}

.btn-outline {
  color: var(--berry);
  background: transparent;
  border: 1px solid rgba(196, 71, 109, 0.25);
}

.btn-dark {
  color: #fff;
  background: var(--dark);
  box-shadow: 0 18px 34px rgba(52, 32, 26, 0.18);
}

.btn-lg {
  padding: 0.95rem 1.6rem;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(320px, 0.95fr);
  gap: 2rem;
  align-items: center;
  padding: 2rem 0 3rem;
}

.eyebrow,
.section-kicker {
  margin: 0 0 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--berry);
}

.hero-title {
  margin: 0;
  font-family: "Prata", serif;
  font-size: clamp(3rem, 7vw, 5.6rem);
  line-height: 0.95;
  max-width: 8.5ch;
}

.hero-title span {
  color: var(--berry);
}

.hero-text {
  max-width: 560px;
  margin: 1.3rem 0 0;
  font-size: 1.04rem;
  line-height: 1.75;
  color: var(--muted);
}

.hero-actions {
  display: flex;
  gap: 0.9rem;
  flex-wrap: wrap;
  margin: 1.7rem 0 1.8rem;
}

.hero-highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
  max-width: 760px;
}

.highlight-card {
  padding: 1rem;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid var(--line);
  box-shadow: 0 12px 26px rgba(101, 54, 35, 0.06);
}

.highlight-value {
  display: block;
  font-family: "Prata", serif;
  font-size: 1.7rem;
  color: var(--berry);
}

.highlight-label {
  display: block;
  margin-top: 0.25rem;
  color: var(--muted);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hero-visual {
  position: relative;
  min-height: 580px;
}

.feature-panel {
  overflow: hidden;
  border-radius: 34px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 30px 60px rgba(125, 62, 52, 0.14);
}

.main-panel {
  position: absolute;
  inset: 0 1.5rem 2rem 0;
}

.main-panel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.panel-overlay {
  position: absolute;
  left: 1.25rem;
  right: 1.25rem;
  bottom: 1.25rem;
  padding: 1rem 1.15rem;
  border-radius: 24px;
  background: rgba(255, 250, 244, 0.78);
  backdrop-filter: blur(14px);
}

.panel-overlay h2 {
  margin: 0.15rem 0;
  font-family: "Prata", serif;
  font-size: 1.7rem;
}

.panel-overlay span,
.panel-tag,
.floating-kicker,
.promo-desc,
.author-service,
.benefit p,
.final-copy p {
  color: var(--muted);
}

.panel-tag,
.floating-kicker {
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-size: 0.7rem;
  font-weight: 800;
}

.floating-card {
  position: absolute;
  padding: 1rem 1.1rem;
  border-radius: 24px;
  background: rgba(255, 250, 244, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 40px rgba(125, 62, 52, 0.1);
}

.floating-card strong {
  display: block;
  margin: 0.3rem 0 0.15rem;
  font-size: 1.2rem;
}

.card-top {
  top: 1rem;
  right: 0;
}

.card-bottom {
  bottom: 0;
  left: 2rem;
}

.floating-number {
  display: block;
  font-family: "Prata", serif;
  color: var(--berry);
  font-size: 2rem;
}

.promo-strip {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.2rem;
  margin-bottom: 2.5rem;
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(255, 225, 204, 0.96), rgba(255, 179, 138, 0.7));
  border: 1px solid rgba(255, 255, 255, 0.65);
}

.promo-strip p {
  margin: 0;
  font-weight: 700;
}

.promo-chip {
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.72);
  color: var(--berry);
  font-size: 0.76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.promo-link,
.section-link {
  color: var(--berry);
  font-weight: 800;
  text-decoration: none;
}

.section {
  margin-bottom: 3rem;
}

.section-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 1rem;
  margin-bottom: 1.35rem;
  flex-wrap: wrap;
}

.section-head.centered {
  justify-content: center;
  text-align: center;
}

.section-head h2,
.final-copy h2 {
  margin: 0;
  font-family: "Prata", serif;
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1.08;
}

.promos-grid,
.services-grid,
.testimonial-grid {
  display: grid;
  gap: 1rem;
}

.promos-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.promo-card,
.service-card,
.testimonial-card,
.benefit {
  animation: rise 0.55s ease both;
  animation-delay: var(--delay, 0ms);
}

.promo-card {
  position: relative;
  border-radius: 28px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.64);
  border: 1px solid var(--line);
  box-shadow: 0 16px 30px rgba(101, 54, 35, 0.06);
}

.promo-card.featured {
  background: linear-gradient(180deg, rgba(255, 233, 226, 0.92), rgba(255, 255, 255, 0.8));
}

.promo-image {
  height: 180px;
  border-radius: 22px;
  overflow: hidden;
  margin-bottom: 0.95rem;
}

.promo-image img,
.service-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promo-name,
.author-name,
.benefit h4 {
  margin: 0;
  font-weight: 800;
}

.promo-prices {
  display: flex;
  align-items: end;
  gap: 0.55rem;
  margin-top: 0.85rem;
}

.old-price {
  text-decoration: line-through;
  color: var(--muted);
  font-size: 0.88rem;
}

.new-price {
  font-family: "Prata", serif;
  font-size: 1.55rem;
  color: var(--berry);
}

.promo-badge {
  position: absolute;
  top: 1.1rem;
  right: 1.1rem;
  padding: 0.45rem 0.8rem;
  border-radius: 999px;
  background: var(--berry);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.services-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.service-card {
  overflow: hidden;
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.66);
  border: 1px solid var(--line);
  box-shadow: 0 16px 30px rgba(101, 54, 35, 0.06);
}

.service-img {
  height: 210px;
}

.service-body {
  padding: 1rem;
}

.service-top {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  align-items: start;
}

.service-top h3 {
  margin: 0;
  font-family: "Prata", serif;
  font-size: 1.15rem;
}

.service-price {
  flex-shrink: 0;
  border-radius: 999px;
  padding: 0.35rem 0.72rem;
  background: rgba(255, 179, 138, 0.28);
  color: var(--berry);
  font-size: 0.76rem;
  font-weight: 800;
}

.service-body p {
  margin: 0.8rem 0;
  line-height: 1.65;
  color: var(--muted);
}

.service-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  font-size: 0.82rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.testimonial-grid {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.testimonial-card {
  padding: 1.35rem;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--line);
}

.testimonial-card.accent {
  background: linear-gradient(180deg, rgba(255, 179, 138, 0.32), rgba(255, 255, 255, 0.86));
}

.stars {
  letter-spacing: 0.16em;
  color: var(--gold);
}

.testimonial-text {
  margin: 0.9rem 0 1.15rem;
  line-height: 1.75;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  color: #fff;
  font-weight: 800;
  background: linear-gradient(135deg, var(--berry), var(--peach));
}

.benefits-band {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 3rem;
}

.benefit {
  padding: 1.3rem 1.1rem;
  text-align: center;
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid var(--line);
}

.benefit-icon {
  display: inline-grid;
  place-items: center;
  width: 58px;
  height: 58px;
  border-radius: 18px;
  margin-bottom: 0.8rem;
  background: linear-gradient(135deg, rgba(255, 179, 138, 0.4), rgba(255, 230, 204, 0.95));
  font-size: 1.7rem;
}

.final-cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.6rem;
  margin-bottom: 1.5rem;
  border-radius: 32px;
  background: linear-gradient(135deg, var(--berry), #e96d63 58%, #ffb875 100%);
  color: #fff;
}

.final-cta .section-kicker,
.final-copy p,
.final-copy h2 {
  color: inherit;
}

.footer {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.2rem 0.15rem 1rem;
  color: var(--muted);
  font-size: 0.88rem;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(18px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 920px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .hero-visual {
    min-height: 460px;
  }

  .promo-strip,
  .final-cta {
    grid-template-columns: 1fr;
    display: grid;
  }
}

@media (max-width: 640px) {
  .inicio-page {
    padding: 0.85rem;
  }

  .topbar {
    padding: 0.9rem;
  }

  .acciones-top,
  .hero-actions {
    width: 100%;
  }

  .acciones-top .btn,
  .hero-actions .btn {
    flex: 1;
    text-align: center;
  }

  .hero-highlights {
    grid-template-columns: 1fr;
  }

  .main-panel {
    inset: 0;
  }

  .card-top,
  .card-bottom {
    position: static;
    margin-top: 0.8rem;
  }

  .hero-visual {
    min-height: auto;
  }
}
</style>
