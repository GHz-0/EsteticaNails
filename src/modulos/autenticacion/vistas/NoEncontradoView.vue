<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-code">404</div>
      <h1>Página no encontrada</h1>
      <p>La ruta que buscas no existe.</p>
      <button class="btn-back" @click="router.push('/')">← Ir al inicio</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400&display=swap');
.error-page { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0a0f; font-family: 'DM Sans', sans-serif; color: #fff; }
.error-content { text-align: center; }
.error-code { font-family: 'Syne', sans-serif; font-size: 7rem; font-weight: 800; color: rgba(96,165,250,0.3); line-height: 1; }
h1 { font-family: 'Syne', sans-serif; font-size: 1.8rem; margin: 0.5rem 0; }
p  { color: rgba(255,255,255,0.4); margin-bottom: 2rem; }
.btn-back { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 0.7rem 1.5rem; border-radius: 10px; cursor: pointer; font-size: 0.9rem; transition: background 0.2s; }
.btn-back:hover { background: rgba(255,255,255,0.1); }
</style>