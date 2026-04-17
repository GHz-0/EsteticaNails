<template>
  <div class="tarjeta-metrica">
    <div class="contenido">
      <div class="etiqueta">{{ titulo }}</div>
      <div class="valor">{{ formatearValor(valor) }}</div>
      <p v-if="subtitulo" class="subtitulo">{{ subtitulo }}</p>
    </div>
    <div v-if="icono" class="icono">{{ icono }}</div>
  </div>
</template>

<script setup>
defineProps({
  titulo: {
    type: String,
    required: true,
  },
  valor: {
    type: [String, Number],
    required: true,
  },
  subtitulo: {
    type: String,
    default: null,
  },
  icono: {
    type: String,
    default: null,
  },
  formato: {
    type: String,
    enum: ["numero", "moneda", "porcentaje"],
    default: "numero",
  },
});

function formatearValor(val) {
  if (typeof val === "string") return val;

  switch (props.formato) {
    case "moneda":
      return `$${val.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`;
    case "porcentaje":
      return `${val}%`;
    default:
      return val.toString();
  }
}
</script>

<style scoped>
.tarjeta-metrica {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(249, 168, 212, 0.2);
  border-radius: 14px;
  padding: 1.2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  transition: all 0.25s ease;
}

.tarjeta-metrica:hover {
  border-color: rgba(249, 168, 212, 0.4);
  background: rgba(249, 168, 212, 0.08);
}

.contenido {
  flex: 1;
}

.etiqueta {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.valor {
  font-size: 1.8rem;
  font-weight: 700;
  color: #f9a8d4;
  margin-bottom: 0.3rem;
}

.subtitulo {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.icono {
  font-size: 2rem;
  opacity: 0.3;
  margin-left: 1rem;
}

@media (max-width: 640px) {
  .tarjeta-metrica {
    padding: 0.9rem;
  }

  .valor {
    font-size: 1.4rem;
  }

  .icono {
    font-size: 1.5rem;
    margin-left: 0.5rem;
  }
}
</style>
