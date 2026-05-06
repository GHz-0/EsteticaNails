<template>
  <PlantillaBase
    rol-tema="admin"
    etiqueta-rol="Administrador"
    :nav-items="navItems"
  >
    <template #titulo>
      <RouterView v-slot="{ route }">
        <span class="title-content">
          <span
            v-if="iconoParaRuta(route.name)?.iconoSvg"
            class="title-icon title-icon--svg"
            v-html="iconoParaRuta(route.name).iconoSvg"
          ></span>
          <span v-else class="title-icon">
            {{ iconoParaRuta(route.name)?.icono || route.meta.icono }}
          </span>
          <span>{{ route.meta.titulo }}</span>
        </span>
      </RouterView>
    </template>
  </PlantillaBase>
</template>

<script setup>
import PlantillaBase from "@/compartido/componentes/PlantillaBase.vue";

const homeIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
</svg>`;

const navItems = [
  { name: "admin-dashboard", titulo: "Panel Admin", iconoSvg: homeIconSvg },
  { name: "admin-reportes", titulo: "Reportes", icono: "📊" },
  { name: "admin-empleados", titulo: "Empleados", icono: "👨‍💼" },
  { name: "admin-servicios", titulo: "Servicios", icono: "🛠️" },
  { name: "admin-config", titulo: "Configuración", icono: "⚙️" },
];

function iconoParaRuta(routeName) {
  return navItems.find((item) => item.name === routeName);
}
</script>

<style scoped>
.title-content {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
}

.title-icon {
  display: inline-grid;
  place-items: center;
  width: 1.35rem;
  height: 1.35rem;
  color: #f6e7bc;
}

.title-icon--svg :deep(svg) {
  width: 1.25rem;
  height: 1.25rem;
  stroke-width: 2;
}
</style>
