<template>
  <BaseLayout rol-tema="usuario" etiqueta-rol="Usuario" :nav-items="navItems">
    <template #titulo>
      <RouterView v-slot="{ route }">{{ route.meta.icono }} {{ route.meta.titulo }}</RouterView>
    </template>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/components/common/BaseLayout.vue'

const navItems = [
  { name: 'usuario-dashboard', titulo: 'Mi Panel',  icono: '🏠' },
  { name: 'usuario-servicios', titulo: 'Servicios', icono: '🛍️' },
  { name: 'usuario-citas',     titulo: 'Mis Citas', icono: '📅' },
]
</script>