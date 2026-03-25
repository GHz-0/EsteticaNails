<template>
  <div class="inicio-page">
    <header class="topbar">
      <div class="marca">◈ Nails Bere</div>
      <nav class="acciones-top">
        <RouterLink to="/login" class="btn-link">Iniciar sesión</RouterLink>
        <RouterLink to="/registro" class="btn-principal"
          >Registrarme</RouterLink
        >
      </nav>
    </header>

    <section class="hero">
      <p class="etiqueta">Tu espacio de belleza</p>
      <h1>Resalta tu estilo con servicios profesionales de salón</h1>
      <p class="subtexto">
        Corte, color, uñas, maquillaje y cuidado facial en un solo lugar. Agenda
        fácil, atención cálida y resultados que enamoran.
      </p>
      <div class="hero-acciones">
        <RouterLink to="/registro" class="btn-principal"
          >Crear cuenta</RouterLink
        >
        <RouterLink to="/login" class="btn-secundario"
          >Ya tengo cuenta</RouterLink
        >
      </div>
    </section>

    <section class="servicios">
      <h2>Nuestros servicios</h2>
      <div class="grid-servicios">
        <article
          v-for="servicio in servicios"
          :key="servicio.titulo"
          class="card-servicio"
        >
          <div class="icono">{{ servicio.icono }}</div>
          <h3>{{ servicio.titulo }}</h3>
          <p>{{ servicio.descripcion }}</p>
        </article>
      </div>
    </section>

    <section class="beneficios">
      <div class="beneficio" v-for="item in beneficios" :key="item.titulo">
        <h4>{{ item.titulo }}</h4>
        <p>{{ item.texto }}</p>
      </div>
    </section>

    <section class="cta-final">
      <h2>¿Lista para tu próximo cambio?</h2>
      <p>Regístrate en minutos y descubre promociones para nuevas clientas.</p>
      <RouterLink to="/registro" class="btn-principal"
        >Ir a registro</RouterLink
      >
    </section>
  </div>
</template>

<script setup>
const servicios = [
  {
    icono: "✂️",
    titulo: "Corte y peinado",
    descripcion:
      "Diseño de corte personalizado según tu tipo de rostro y estilo.",
  },
  {
    icono: "🎨",
    titulo: "Color y tratamientos",
    descripcion:
      "Coloración, matices y tratamientos para recuperar brillo y salud.",
  },
  {
    icono: "💅",
    titulo: "Uñas",
    descripcion: "Manicure, gel semipermanente y diseños para toda ocasión.",
  },
  {
    icono: "💄",
    titulo: "Maquillaje",
    descripcion: "Maquillaje social y profesional para eventos especiales.",
  },
  {
    icono: "🧖",
    titulo: "Faciales",
    descripcion: "Limpieza e hidratación para una piel fresca y luminosa.",
  },
  {
    icono: "🌸",
    titulo: "Paquetes",
    descripcion:
      "Combina servicios y obtén mejores precios en experiencias completas.",
  },
];

const beneficios = [
  {
    titulo: "Atención personalizada",
    texto: "Te asesoramos según tus objetivos y preferencias.",
  },
  {
    titulo: "Agenda simple",
    texto: "Solicita tus citas sin complicarte y en pocos pasos.",
  },
  {
    titulo: "Profesionales certificadas",
    texto: "Equipo experto en tendencias y cuidado integral.",
  },
];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap");

.inicio-page {
  min-height: 100vh;
  color: #fff;
  background: radial-gradient(
    circle at 10% 10%,
    #341525 0%,
    #12090f 35%,
    #0a0a0f 100%
  );
  font-family: "DM Sans", sans-serif;
  padding: 1.2rem 1.4rem 3rem;
}

.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.marca {
  font-family: "Syne", sans-serif;
  font-weight: 800;
  letter-spacing: 0.02em;
  color: #f9a8d4;
}

.acciones-top {
  display: flex;
  gap: 0.7rem;
}

.hero {
  max-width: 820px;
  margin-bottom: 2rem;
}

.etiqueta {
  color: rgba(249, 168, 212, 0.9);
  font-size: 0.84rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1 {
  font-family: "Syne", sans-serif;
  font-size: clamp(2rem, 5vw, 3.4rem);
  line-height: 1.1;
  margin: 0.5rem 0 0.9rem;
}

.subtexto {
  color: rgba(255, 255, 255, 0.72);
  font-size: 1.03rem;
  max-width: 680px;
}

.hero-acciones {
  margin-top: 1.2rem;
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
}

.btn-principal,
.btn-secundario,
.btn-link {
  text-decoration: none;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  font-weight: 600;
  font-size: 0.9rem;
}

.btn-principal {
  background: linear-gradient(135deg, #f472b6, #ec4899);
  color: #fff;
}

.btn-secundario {
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  background: rgba(255, 255, 255, 0.04);
}

.btn-link {
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.16);
}

.servicios h2,
.cta-final h2 {
  font-family: "Syne", sans-serif;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.grid-servicios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
  gap: 0.8rem;
  margin-bottom: 1.4rem;
}

.card-servicio {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(249, 168, 212, 0.22);
  border-radius: 14px;
  padding: 0.95rem;
}

.icono {
  font-size: 1.35rem;
}

.card-servicio h3 {
  margin: 0.4rem 0 0.3rem;
  font-size: 1rem;
}

.card-servicio p,
.beneficio p,
.cta-final p {
  color: rgba(255, 255, 255, 0.68);
  font-size: 0.86rem;
}

.beneficios {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

.beneficio {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  padding: 0.8rem;
}

.beneficio h4 {
  margin: 0 0 0.3rem;
  color: #fbcfe8;
}

.cta-final {
  background: rgba(249, 168, 212, 0.08);
  border: 1px solid rgba(249, 168, 212, 0.24);
  border-radius: 16px;
  padding: 1.2rem;
}
</style>
