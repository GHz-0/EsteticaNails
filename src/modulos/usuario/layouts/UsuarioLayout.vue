<template>
  <PlantillaBase
    rol-tema="usuario"
    etiqueta-rol="Usuario"
    :nav-items="navItems"
  >
    <template #titulo>
      <RouterView v-slot="{ route }"
        >{{ route.meta.icono }} {{ route.meta.titulo }}</RouterView
      >
    </template>
  </PlantillaBase>
</template>

<script setup>
import PlantillaBase from "@/compartido/componentes/PlantillaBase.vue";

const navItems = [
  { name: "usuario-dashboard", titulo: "Mi Panel", icono: "🏠" },
  { name: "usuario-servicios", titulo: "Servicios", icono: "🛍️" },
  { name: "usuario-citas", titulo: "Mis Citas", icono: "📅" },
];
</script>
