<template>
  <PlantillaBase
    rol-tema="admin"
    etiqueta-rol="Administrador"
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
  { name: "admin-dashboard", titulo: "Panel Admin", icono: "🏠" },
  { name: "admin-reportes", titulo: "Reportes", icono: "📊" },
  { name: "admin-empleados", titulo: "Empleados", icono: "👨‍💼" },
  { name: "admin-servicios", titulo: "Servicios", icono: "🛠️" },
  { name: "admin-config", titulo: "Configuración", icono: "⚙️" },
];
</script>
