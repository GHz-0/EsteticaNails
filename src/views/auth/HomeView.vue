<template>
  <div class="home">
    <nav class="navbar">
      <div class="nav-brand">◈ ServiApp</div>
      <RouterLink to="/login" class="btn-nav">Iniciar sesión →</RouterLink>
    </nav>
    <main class="hero">
      <h1>Servicios de consultoría <br /><span class="accent">a tu alcance</span></h1>
      <p>Agenda, gestiona y controla tus servicios desde un solo lugar.</p>
      <RouterLink to="/login" class="btn-hero">Comenzar ahora</RouterLink>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500&display=swap');
.home { min-height: 100vh; background: #0a0a0f; color: #fff; font-family: 'DM Sans', sans-serif; }
.navbar { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 3rem; }
.nav-brand { font-family: 'Syne', sans-serif; font-size: 1.3rem; font-weight: 800; color: #7c6eff; }
.btn-nav { color: rgba(255,255,255,0.6); text-decoration: none; font-size: 0.9rem; transition: color 0.2s; }
.btn-nav:hover { color: #fff; }
.hero { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 80vh; text-align: center; padding: 2rem; }
h1 { font-family: 'Syne', sans-serif; font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 800; line-height: 1.1; margin: 0 0 1rem; }
.accent { color: #7c6eff; }
p { color: rgba(255,255,255,0.5); font-size: 1.1rem; margin: 0 0 2rem; }
.btn-hero { background: #7c6eff; color: #fff; padding: 0.9rem 2rem; border-radius: 12px; text-decoration: none; font-weight: 600; font-family: 'Syne', sans-serif; transition: background 0.2s; }
.btn-hero:hover { background: #6a5ce8; }
</style>