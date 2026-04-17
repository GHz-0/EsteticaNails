<template>
  <div class="tabla-reporte">
    <div class="tabla-header">
      <h3>{{ titulo }}</h3>
      <p v-if="subtitulo" class="subtitulo">{{ subtitulo }}</p>
    </div>

    <div v-if="cargando" class="estado">⏳ Cargando datos...</div>
    <div v-else-if="error" class="estado error">❌ {{ error }}</div>
    <div v-else-if="!datos || datos.length === 0" class="estado">
      ℹ️ Sin registros para mostrar
    </div>

    <div v-else class="tabla-wrapper">
      <table class="tabla">
        <thead>
          <tr>
            <th
              v-for="col in columnas"
              :key="col.key"
              :class="col.alineacion || 'izquierda'"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="fila in datos" :key="fila.id || fila">
            <td
              v-for="col in columnas"
              :key="col.key"
              :class="col.alineacion || 'izquierda'"
            >
              {{ formatearCelda(fila[col.key], col.tipo) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    required: true,
  },
  subtitulo: {
    type: String,
    default: null,
  },
  columnas: {
    type: Array,
    required: true,
    // Ej: [
    //   { key: "nombre", label: "Nombre", tipo: "texto" },
    //   { key: "gasto", label: "Gasto", tipo: "moneda", alineacion: "derecha" },
    // ]
  },
  datos: {
    type: Array,
    default: () => [],
  },
  cargando: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
});

function formatearCelda(valor, tipo) {
  if (valor === null || valor === undefined) return "—";

  switch (tipo) {
    case "moneda":
      return `$${Number(valor).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`;
    case "porcentaje":
      return `${valor}%`;
    case "fecha":
      return new Date(valor).toLocaleDateString("es-MX");
    default:
      return String(valor);
  }
}
</script>

<style scoped>
.tabla-reporte {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1rem;
  color: #fff;
  overflow: hidden;
}

.tabla-header h3 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  font-weight: 600;
}

.tabla-header .subtitulo {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.estado {
  padding: 1.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.estado.error {
  color: #ff8f8f;
}

.tabla-wrapper {
  overflow-x: auto;
  margin-top: 0.8rem;
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.tabla thead {
  border-bottom: 1px solid rgba(249, 168, 212, 0.25);
}

.tabla th {
  padding: 0.7rem 0.8rem;
  text-align: left;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.04em;
}

.tabla th.derecha {
  text-align: right;
}

.tabla th.centro {
  text-align: center;
}

.tabla tbody tr {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background-color 0.15s ease;
}

.tabla tbody tr:hover {
  background-color: rgba(249, 168, 212, 0.06);
}

.tabla td {
  padding: 0.8rem;
  color: rgba(255, 255, 255, 0.9);
}

.tabla td.derecha {
  text-align: right;
  font-weight: 600;
  color: #f9a8d4;
}

.tabla td.centro {
  text-align: center;
}

@media (max-width: 768px) {
  .tabla {
    font-size: 0.8rem;
  }

  .tabla th,
  .tabla td {
    padding: 0.5rem;
  }
}
</style>
