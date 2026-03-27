<template>
  <div class="inicio-page">
    <div class="ambient-bg" aria-hidden="true">
      <div class="glow glow-a"></div>
      <div class="glow glow-b"></div>
      <div class="glow glow-c"></div>
      <div class="mesh"></div>
    </div>

    <header class="topbar">
      <div class="brand">
        <div class="brand-seal">NB</div>
        <div>
          <p class="brand-kicker">Beauty Studio</p>
          <span class="brand-name">Nails Bere</span>
        </div>
      </div>

      <nav class="top-actions" aria-label="Acciones principales">
        <RouterLink to="/login" class="btn btn-soft">Iniciar sesion</RouterLink>
        <RouterLink to="/registro" class="btn btn-solid">Registrarme</RouterLink>
      </nav>
    </header>

    <main>
      <section class="hero">
        <div class="hero-copy">
          <p class="eyebrow">Experiencia beauty con estilo</p>

          <h1 class="hero-title">
            Color, brillo y
            <span>actitud</span>
            para tu siguiente cita
          </h1>

          <p class="hero-text">
            Un espacio pensado para consentirte con manicure, faciales,
            maquillaje y peinado en una atmosfera mas fresca, femenina y
            memorable.
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
            <article class="highlight-card">
              <span class="highlight-value">+500</span>
              <span class="highlight-label">Clientas felices</span>
            </article>
            <article class="highlight-card">
              <span class="highlight-value">4.9</span>
              <span class="highlight-label">Valoracion media</span>
            </article>
            <article class="highlight-card">
              <span class="highlight-value">6</span>
              <span class="highlight-label">Servicios top</span>
            </article>
          </div>
        </div>

        <div class="hero-visual" aria-hidden="true">
          <article class="main-panel">
            <img :src="imagenesUi.cta" alt="Manicure profesional" />
            <div class="panel-copy">
              <p class="panel-kicker">Favorito del mes</p>
              <h2>Summer Gloss</h2>
              <span>Acabados luminosos y tonos con mucha personalidad</span>
            </div>
          </article>

          <article class="floating-card top-card">
            <span class="floating-kicker">Tendencia</span>
            <strong>Coral Peach</strong>
            <small>El tono mas pedido esta temporada</small>
          </article>

          <article class="floating-card bottom-card">
            <span class="floating-value">30%</span>
            <small>Off en tu primera cita online</small>
          </article>
        </div>
      </section>

      <section class="promo-strip" aria-label="Promociones destacadas">
        <div class="promo-chip">Agenda online</div>
        <p>Promos activas en manicure, facial express y maquillaje social.</p>
        <RouterLink to="/registro" class="promo-link">Ver promociones</RouterLink>
      </section>

      <section class="section">
        <header class="section-head">
          <div>
            <p class="section-kicker">Favoritas del mes</p>
            <h2>Promociones que roban miradas</h2>
          </div>
          <RouterLink to="/registro" class="section-link">Apartar lugar</RouterLink>
        </header>

        <div class="promo-grid">
          <article
            v-for="(promo, i) in promociones"
            :key="promo.titulo"
            class="promo-card"
            :class="{ featured: promo.destacada }"
            :style="{ '--delay': `${i * 80}ms` }"
          >
            <div class="promo-image">
              <img :src="promo.imagen" :alt="promo.titulo" />
            </div>

            <div class="promo-content">
              <p class="promo-title">{{ promo.titulo }}</p>
              <p class="promo-desc">{{ promo.desc }}</p>
              <div class="promo-prices">
                <span class="price-before">{{ promo.antes }}</span>
                <span class="price-now">{{ promo.ahora }}</span>
              </div>
            </div>

            <span v-if="promo.destacada" class="promo-badge">Top</span>
          </article>
        </div>
      </section>

      <section class="section">
        <header class="section-head">
          <div>
            <p class="section-kicker">Menu beauty</p>
            <h2>Servicios para elevar tu estilo</h2>
          </div>
        </header>

        <div class="service-grid">
          <article
            v-for="(servicio, i) in servicios"
            :key="servicio.titulo"
            class="service-card"
            :style="{ '--delay': `${i * 70}ms` }"
          >
            <img :src="servicio.imagen" :alt="servicio.titulo" class="service-image" />

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

      <section class="section">
        <header class="section-head centered">
          <div>
            <p class="section-kicker">Ellas ya lo vivieron</p>
            <h2>Opiniones que enamoran</h2>
          </div>
        </header>

        <div class="testimonial-grid">
          <article
            v-for="(testimonio, i) in testimonios"
            :key="testimonio.nombre"
            class="testimonial-card"
            :class="{ accent: i === 1 }"
          >
            <span class="stars" aria-hidden="true">★★★★★</span>
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
        <article v-for="beneficio in beneficios" :key="beneficio.titulo" class="benefit-card">
          <span class="benefit-icon">{{ beneficio.icono }}</span>
          <h4>{{ beneficio.titulo }}</h4>
          <p>{{ beneficio.texto }}</p>
        </article>
      </section>

      <section class="final-cta">
        <div class="final-copy">
          <p class="section-kicker">Tu glow-up empieza aqui</p>
          <h2>Tu proxima cita puede ser tu mejor version</h2>
          <p>
            Crea tu cuenta y accede a promociones exclusivas, agenda rapida y
            una experiencia beauty mucho mas personalizada.
          </p>
        </div>

        <RouterLink to="/registro" class="btn btn-dark btn-lg">
          Crear cuenta gratis
        </RouterLink>
      </section>
    </main>

    <footer class="footer">
      <span class="footer-brand">Nails Bere</span>
      <span class="footer-copy">Chiapas · © {{ anioActual }}</span>
    </footer>
  </div>
</template>

<script setup>
const anioActual = new Date().getFullYear();

const imagenesUi = {
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
    desc: "Limpieza profunda e hidratacion",
    antes: "$350",
    ahora: "$250",
    destacada: false,
  },
  {
    imagen: "/img/inicio/promo-maquillaje.jpg",
    titulo: "Maquillaje + Peinado",
    desc: "Ideal para eventos, fotos y graduaciones",
    antes: "$600",
    ahora: "$450",
    destacada: false,
  },
  {
    imagen: "/img/inicio/promo-color.jpg",
    titulo: "Color completo",
    desc: "Tinte mas tratamiento de brillo",
    antes: "$700",
    ahora: "$520",
    destacada: true,
  },
];

const servicios = [
  {
    imagen: "/img/inicio/servicio-corte.jpg",
    titulo: "Corte y peinado",
    descripcion: "Un look pensado para resaltar tu estilo y tu rostro.",
    precio: "Desde $150",
    duracion: "45 min",
  },
  {
    imagen: "/img/inicio/servicio-color.jpg",
    titulo: "Color y tratamientos",
    descripcion: "Coloracion, matices y nutricion para un acabado brillante.",
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
    duracion: "2 a 3 h",
  },
];

const testimonios = [
  {
    nombre: "Daniela R.",
    texto: "Me encanto la atencion y mis unas quedaron preciosas. Ya aparte mi siguiente cita.",
    servicio: "Manicure Gel",
  },
  {
    nombre: "Sofia M.",
    texto: "El facial express me dejo la piel super luminosa y el lugar se siente hermoso desde que entras.",
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
    icono: "Glow",
    titulo: "Atencion cercana",
    texto: "Escuchamos tu idea y la convertimos en un look que si se siente tuyo.",
  },
  {
    icono: "Style",
    titulo: "Ambiente fotogenico",
    texto: "Una experiencia visual mas fresca, femenina y llena de estilo.",
  },
  {
    icono: "Easy",
    titulo: "Agenda sencilla",
    texto: "Aparta tu cita en pocos pasos y recibe promociones especiales.",
  },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Prata&family=Manrope:wght@400;500;600;700;800&display=swap");

.inicio-page {
  --bg-top: #fff7f3;
  --bg-bottom: #ffe8ea;
  --surface: rgba(255, 255, 255, 0.68);
  --surface-strong: rgba(255, 255, 255, 0.9);
  --line: rgba(137, 63, 85, 0.12);
  --text: #42242e;
  --muted: #7a5a65;
  --peach: #ff9a76;
  --melon: #ffc28f;
  --berry: #d6517d;
  --pink: #ff8fb1;
  --rose: #f56ea7;
  --gold: #f5c86b;
  --dark: #2f1d25;

  min-height: 100vh;
  padding: 1.25rem;
  overflow-x: hidden;
  position: relative;
  color: var(--text);
  font-family: "Manrope", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(255, 154, 118, 0.55), transparent 22%),
    radial-gradient(circle at top right, rgba(245, 110, 167, 0.2), transparent 25%),
    linear-gradient(180deg, var(--bg-top) 0%, var(--bg-bottom) 100%);
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
  opacity: 0.85;
}

.glow-a {
  width: 320px;
  height: 320px;
  top: 0;
  left: -4%;
  background: rgba(255, 154, 118, 0.45);
}

.glow-b {
  width: 360px;
  height: 360px;
  top: 24%;
  right: 0;
  background: rgba(245, 110, 167, 0.18);
}

.glow-c {
  width: 280px;
  height: 280px;
  bottom: 8%;
  left: 22%;
  background: rgba(255, 194, 143, 0.5);
}

.mesh {
  position: absolute;
  inset: 0;
  opacity: 0.2;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.35) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.35) 1px, transparent 1px);
  background-size: 52px 52px;
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
  margin-bottom: 1.5rem;
  padding: 1rem 1.15rem;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: var(--surface);
  backdrop-filter: blur(18px);
}

.brand {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.brand-seal {
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 18px;
  color: #fff;
  font-size: 0.9rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  background: linear-gradient(135deg, var(--berry), var(--peach));
  box-shadow: 0 12px 28px rgba(214, 81, 125, 0.24);
}

.brand-kicker {
  margin: 0 0 0.18rem;
  color: var(--berry);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.brand-name {
  font-family: "Prata", serif;
  font-size: 1.42rem;
}

.top-actions {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 999px;
  padding: 0.82rem 1.35rem;
  font-weight: 800;
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease,
    background 0.22s ease,
    color 0.22s ease,
    border-color 0.22s ease;
}

.btn:hover {
  transform: translateY(-2px);
}

.btn-solid {
  color: #fff;
  background: linear-gradient(135deg, var(--berry), var(--peach));
  box-shadow: 0 16px 34px rgba(214, 81, 125, 0.26);
}

.btn-soft {
  color: var(--text);
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.54);
}

.btn-outline {
  color: var(--berry);
  border: 1px solid rgba(214, 81, 125, 0.28);
  background: transparent;
}

.btn-dark {
  color: #fff;
  background: var(--dark);
  box-shadow: 0 16px 34px rgba(47, 29, 37, 0.2);
}

.btn-lg {
  padding: 0.95rem 1.65rem;
}

.hero {
  display: grid;
  grid-template-columns: minmax(0, 1.04fr) minmax(320px, 0.96fr);
  gap: 2rem;
  align-items: center;
  padding: 1.5rem 0 3rem;
}

.eyebrow,
.section-kicker {
  margin: 0 0 0.75rem;
  color: var(--berry);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.hero-title {
  max-width: 8.5ch;
  margin: 0;
  font-family: "Prata", serif;
  font-size: clamp(3rem, 7vw, 5.5rem);
  line-height: 0.96;
}

.hero-title span {
  color: var(--berry);
}

.hero-text {
  max-width: 560px;
  margin: 1.25rem 0 0;
  color: var(--muted);
  font-size: 1.04rem;
  line-height: 1.75;
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
  border: 1px solid var(--line);
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.58);
  box-shadow: 0 14px 28px rgba(90, 52, 67, 0.06);
}

.highlight-value {
  display: block;
  color: var(--berry);
  font-family: "Prata", serif;
  font-size: 1.7rem;
}

.highlight-label {
  display: block;
  margin-top: 0.25rem;
  color: var(--muted);
  font-size: 0.81rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.hero-visual {
  position: relative;
  min-height: 580px;
}

.main-panel {
  position: absolute;
  inset: 0 1.5rem 2rem 0;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.88);
  border-radius: 34px;
  box-shadow: 0 28px 58px rgba(90, 52, 67, 0.14);
}

.main-panel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.panel-copy {
  position: absolute;
  left: 1.2rem;
  right: 1.2rem;
  bottom: 1.2rem;
  padding: 1rem 1.15rem;
  border-radius: 24px;
  background: rgba(255, 250, 247, 0.8);
  backdrop-filter: blur(14px);
}

.panel-copy h2 {
  margin: 0.2rem 0;
  font-family: "Prata", serif;
  font-size: 1.65rem;
}

.panel-copy span,
.panel-kicker,
.floating-kicker,
.promo-desc,
.author-service,
.benefit-card p,
.final-copy p {
  color: var(--muted);
}

.panel-kicker,
.floating-kicker {
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.floating-card {
  position: absolute;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  background: rgba(255, 250, 247, 0.86);
  backdrop-filter: blur(14px);
  box-shadow: 0 18px 40px rgba(90, 52, 67, 0.12);
}

.floating-card strong {
  display: block;
  margin: 0.3rem 0 0.15rem;
  font-size: 1.18rem;
}

.floating-card small {
  display: block;
  line-height: 1.45;
}

.top-card {
  top: 1rem;
  right: 0;
}

.bottom-card {
  bottom: 0;
  left: 2rem;
}

.floating-value {
  display: block;
  color: var(--berry);
  font-family: "Prata", serif;
  font-size: 2rem;
}

.promo-strip {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2.5rem;
  padding: 1rem 1.2rem;
  border: 1px solid rgba(255, 255, 255, 0.72);
  border-radius: 26px;
  background: linear-gradient(135deg, rgba(255, 194, 143, 0.84), rgba(255, 143, 177, 0.4));
}

.promo-strip p {
  margin: 0;
  font-weight: 700;
}

.promo-chip {
  padding: 0.52rem 0.9rem;
  border-radius: 999px;
  color: var(--berry);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.72);
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

.promo-grid,
.service-grid,
.testimonial-grid {
  display: grid;
  gap: 1rem;
}

.promo-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.promo-card,
.service-card,
.testimonial-card,
.benefit-card {
  animation: rise 0.55s ease both;
  animation-delay: var(--delay, 0ms);
}

.promo-card {
  position: relative;
  padding: 1rem;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.66);
  box-shadow: 0 16px 30px rgba(90, 52, 67, 0.06);
}

.promo-card.featured {
  background: linear-gradient(180deg, rgba(255, 233, 234, 0.94), rgba(255, 255, 255, 0.84));
}

.promo-image {
  height: 182px;
  overflow: hidden;
  border-radius: 22px;
  margin-bottom: 0.95rem;
}

.promo-image img,
.service-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.promo-title,
.author-name,
.benefit-card h4 {
  margin: 0;
  font-weight: 800;
}

.promo-prices {
  display: flex;
  align-items: end;
  gap: 0.55rem;
  margin-top: 0.85rem;
}

.price-before {
  color: var(--muted);
  font-size: 0.88rem;
  text-decoration: line-through;
}

.price-now {
  color: var(--berry);
  font-family: "Prata", serif;
  font-size: 1.55rem;
}

.promo-badge {
  position: absolute;
  top: 1.08rem;
  right: 1.08rem;
  padding: 0.45rem 0.82rem;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--gold), var(--pink));
  color: var(--dark);
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
}

.service-grid {
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.service-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: rgba(255, 255, 255, 0.66);
  box-shadow: 0 16px 30px rgba(90, 52, 67, 0.06);
}

.service-image {
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
  padding: 0.34rem 0.72rem;
  border-radius: 999px;
  color: var(--berry);
  font-size: 0.76rem;
  font-weight: 800;
  background: rgba(255, 194, 143, 0.32);
}

.service-body p {
  margin: 0.8rem 0;
  color: var(--muted);
  line-height: 1.65;
}

.service-meta {
  display: flex;
  justify-content: space-between;
  gap: 0.8rem;
  color: var(--muted);
  font-size: 0.81rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.testimonial-grid {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.testimonial-card {
  padding: 1.35rem;
  border: 1px solid var(--line);
  border-radius: 26px;
  background: rgba(255, 255, 255, 0.72);
}

.testimonial-card.accent {
  background: linear-gradient(180deg, rgba(255, 194, 143, 0.36), rgba(255, 255, 255, 0.9));
}

.stars {
  color: var(--gold);
  letter-spacing: 0.16em;
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
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
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

.benefit-card {
  padding: 1.3rem 1.1rem;
  border: 1px solid var(--line);
  border-radius: 26px;
  text-align: center;
  background: rgba(255, 255, 255, 0.64);
}

.benefit-icon {
  display: inline-grid;
  place-items: center;
  min-width: 58px;
  height: 58px;
  margin-bottom: 0.8rem;
  padding: 0 0.85rem;
  border-radius: 18px;
  color: var(--berry);
  font-size: 0.88rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: linear-gradient(135deg, rgba(255, 194, 143, 0.42), rgba(255, 255, 255, 0.95));
}

.final-cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.6rem;
  padding: 1.6rem;
  border-radius: 32px;
  color: #fff;
  background: linear-gradient(135deg, var(--berry), #eb6c6d 60%, var(--melon) 100%);
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

.footer-brand {
  color: var(--text);
  font-weight: 800;
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
    display: grid;
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .inicio-page {
    padding: 0.85rem;
  }

  .topbar {
    padding: 0.9rem;
  }

  .top-actions,
  .hero-actions {
    width: 100%;
  }

  .top-actions .btn,
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

  .top-card,
  .bottom-card {
    position: static;
    margin-top: 0.8rem;
  }

  .hero-visual {
    min-height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation: none !important;
    transition: none !important;
    scroll-behavior: auto !important;
  }
}
</style>
