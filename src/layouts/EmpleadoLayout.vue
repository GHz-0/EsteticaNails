<template>
  <BaseLayout rol-tema="empleado" etiqueta-rol="Empleada" :nav-items="navItems">
    <template #titulo>
      <RouterView v-slot="{ route }">{{ route.meta.icono }} {{ route.meta.titulo }}</RouterView>
    </template>
  </BaseLayout>
</template>

<script setup>
import BaseLayout from '@/components/common/BaseLayout.vue'

const navItems = [
  { name: 'empleado-dashboard', titulo: 'Panel',         icono: '🏠' },
  { name: 'empleado-citas',     titulo: 'Gestión Citas', icono: '📋' },
  { name: 'empleado-clientes',  titulo: 'Clientes',      icono: '👥' },

]
</script>