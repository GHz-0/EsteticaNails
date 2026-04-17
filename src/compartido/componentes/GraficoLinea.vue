<template>
  <div class="grafico-contenedor">
    <div class="grafico-header">
      <h3>{{ titulo }}</h3>
      <p v-if="subtitulo" class="subtitulo">{{ subtitulo }}</p>
    </div>

    <div v-if="cargando" class="estado">⏳ Cargando gráfica...</div>
    <div v-else-if="error" class="estado error">❌ {{ error }}</div>
    <div v-else-if="!datos || datos.length === 0" class="estado">
      ℹ️ Sin datos para graficar
    </div>

    <svg
      v-else
      class="grafico-svg"
      viewBox="0 0 800 300"
      preserveAspectRatio="xMidYMid meet"
    >
      <!-- Grid de fondo -->
      <defs>
        <pattern id="grid" width="80" height="30" patternUnits="userSpaceOnUse">
          <path
            d="M 80 0 L 0 0 0 30"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            stroke-width="1"
          />
        </pattern>
      </defs>
      <rect width="800" height="300" fill="url(#grid)" />

      <!-- Ejes -->
      <line
        x1="60"
        y1="10"
        x2="60"
        y2="250"
        stroke="rgba(255,255,255,0.15)"
        stroke-width="2"
      />
      <line
        x1="60"
        y1="250"
        x2="780"
        y2="250"
        stroke="rgba(255,255,255,0.15)"
        stroke-width="2"
      />

      <!-- Puntos y línea -->
      <polyline
        :points="puntosLinea"
        fill="none"
        stroke="#f9a8d4"
        stroke-width="2.5"
      />

      <!-- Puntos (círculos) -->
      <circle
        v-for="(punto, i) in puntos"
        :key="i"
        :cx="punto.x"
        :cy="punto.y"
        r="4"
        fill="#f9a8d4"
      />

      <!-- Etiquetas eje X -->
      <text
        v-for="(etiqueta, i) in etiquetasX"
        :key="`x-${i}`"
        :x="etiqueta.x"
        :y="270"
        text-anchor="middle"
        font-size="11"
        fill="rgba(255,255,255,0.5)"
        class="etiqueta-x"
      >
        {{ etiqueta.texto }}
      </text>

      <!-- Etiquetas eje Y (valores) -->
      <text
        v-for="(valor, i) in etiquetasY"
        :key="`y-${i}`"
        x="50"
        :y="valor.y + 5"
        text-anchor="end"
        font-size="11"
        fill="rgba(255,255,255,0.5)"
      >
        {{ valor.texto }}
      </text>

      <!-- Tooltips en hover -->
      <rect
        v-for="(punto, i) in puntos"
        :key="`hover-${i}`"
        :x="punto.x - 30"
        :y="punto.y - 40"
        width="60"
        height="30"
        fill="rgba(0,0,0,0.8)"
        rx="4"
        class="tooltip"
        style="opacity: 0; pointer-events: none"
      />
      <text
        v-for="(punto, i) in puntos"
        :key="`tooltip-text-${i}`"
        :x="punto.x"
        :y="punto.y - 20"
        text-anchor="middle"
        font-size="10"
        fill="#f9a8d4"
        font-weight="600"
        class="tooltip-text"
        style="opacity: 0; pointer-events: none"
      >
        {{ formatearValor(datos[i].valor) }}
      </text>
    </svg>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  titulo: {
    type: String,
    required: true,
  },
  subtitulo: {
    type: String,
    default: null,
  },
  datos: {
    type: Array,
    default: () => [],
    // Ej: [
    //   { fecha: "2026-04-01", valor: 1500 },
    //   { fecha: "2026-04-02", valor: 2300 },
    // ]
  },
  cargando: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: null,
  },
  formato: {
    type: String,
    enum: ["numero", "moneda"],
    default: "moneda",
  },
});

function formatearValor(valor) {
  if (props.formato === "moneda") {
    return `$${valor.toLocaleString("es-MX", { maximumFractionDigits: 0 })}`;
  }
  return valor.toString();
}

const minMax = computed(() => {
  if (!props.datos || props.datos.length === 0) return { min: 0, max: 100 };
  const valores = props.datos.map((d) => d.valor || 0);
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const padding = (max - min) * 0.15 || 100;
  return {
    min: Math.max(0, min - padding),
    max: max + padding,
  };
});

const puntos = computed(() => {
  if (!props.datos || props.datos.length === 0) return [];

  const margenIzq = 60;
  const margenDer = 20;
  const margenArr = 10;
  const margenAb = 50;

  const ancho = 800 - margenIzq - margenDer;
  const alto = 300 - margenArr - margenAb;
  const escalaX = ancho / (props.datos.length - 1 || 1);
  const escalaY = alto / (minMax.value.max - minMax.value.min || 1);

  return props.datos.map((d, i) => {
    const x = margenIzq + i * escalaX;
    const y = margenArr + alto - (d.valor - minMax.value.min) * escalaY;
    return { x, y };
  });
});

const puntosLinea = computed(() => {
  return puntos.value.map((p) => `${p.x},${p.y}`).join(" ");
});

const etiquetasX = computed(() => {
  if (!props.datos || props.datos.length === 0) return [];

  const margenIzq = 60;
  const ancho = 800 - margenIzq - 20;
  const escalaX = ancho / (props.datos.length - 1 || 1);

  // Mostrar cada 3ro o cada 5to si hay muchos puntos
  const paso = props.datos.length > 14 ? 5 : props.datos.length > 7 ? 3 : 1;

  return props.datos
    .map((d, i) => {
      if (i % paso === 0 || i === props.datos.length - 1) {
        const x = margenIzq + i * escalaX;
        const fechaPart = d.fecha ? d.fecha.substring(5) : i; // MM-DD o número
        return { x, texto: fechaPart };
      }
      return null;
    })
    .filter((x) => x);
});

const etiquetasY = computed(() => {
  const { min, max } = minMax.value;
  const rango = max - min;
  const paso = Math.pow(10, Math.floor(Math.log10(rango / 4)));
  const inicio = Math.ceil(min / paso) * paso;

  const etiquetas = [];
  for (let v = inicio; v <= max; v += paso) {
    const y = 10 + (300 - 60) - ((v - min) / rango) * (300 - 60);
    etiquetas.push({
      y,
      texto: formatearValor(v),
    });
  }
  return etiquetas;
});
</script>

<style scoped>
.grafico-contenedor {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1rem;
  color: #fff;
}

.grafico-header h3 {
  margin: 0 0 0.4rem;
  font-size: 1rem;
  font-weight: 600;
}

.grafico-header .subtitulo {
  margin: 0;
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.4);
}

.estado {
  padding: 1.5rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
}

.estado.error {
  color: #ff8f8f;
}

.grafico-svg {
  width: 100%;
  height: auto;
  min-height: 250px;
  margin-top: 0.8rem;
  display: block;
}

.etiqueta-x {
  dominant-baseline: hanging;
}

.tooltip {
  transition: opacity 0.2s ease;
}

.grafico-svg circle:hover + .tooltip {
  opacity: 1;
}

@media (max-width: 768px) {
  .grafico-svg {
    min-height: 200px;
  }
}
</style>
