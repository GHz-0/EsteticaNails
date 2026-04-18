<template>
  <article
    class="overflow-hidden rounded-2xl border border-fuchsia-200/15 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl"
  >
    <header
      class="mb-3 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"
    >
      <h3
        class="font-display text-base font-semibold tracking-tight text-fuchsia-50"
      >
        {{ titulo }}
      </h3>
      <p v-if="subtitulo" class="text-xs font-medium text-slate-400">
        {{ subtitulo }}
      </p>
    </header>

    <div
      v-if="cargando"
      class="grid min-h-36 place-items-center rounded-xl border border-fuchsia-100/10 bg-slate-900/45 text-sm font-medium text-slate-300"
    >
      ⏳ Cargando gráfica...
    </div>
    <div
      v-else-if="error"
      class="grid min-h-36 place-items-center rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 text-center text-sm text-rose-100"
    >
      ❌ {{ error }}
    </div>
    <div
      v-else-if="!datos || datos.length === 0"
      class="grid min-h-36 place-items-center rounded-xl border border-fuchsia-100/10 bg-slate-900/45 text-sm font-medium text-slate-300"
    >
      ℹ️ Sin datos para graficar
    </div>

    <svg
      v-else
      class="mt-2 block min-h-[220px] w-full"
      viewBox="0 0 800 300"
      preserveAspectRatio="xMidYMid meet"
    >
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

      <polyline
        :points="puntosLinea"
        fill="none"
        stroke="#f9a8d4"
        stroke-width="2.5"
      />

      <circle
        v-for="(punto, i) in puntos"
        :key="i"
        :cx="punto.x"
        :cy="punto.y"
        r="4"
        fill="#f9a8d4"
      />

      <text
        v-for="(etiqueta, i) in etiquetasX"
        :key="`x-${i}`"
        :x="etiqueta.x"
        :y="270"
        text-anchor="middle"
        font-size="11"
        fill="rgba(255,255,255,0.5)"
        class="[dominant-baseline:hanging]"
      >
        {{ etiqueta.texto }}
      </text>

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

      <rect
        v-for="(punto, i) in puntos"
        :key="`hover-${i}`"
        :x="punto.x - 30"
        :y="punto.y - 40"
        width="60"
        height="30"
        fill="rgba(0,0,0,0.8)"
        rx="4"
        class="transition-opacity duration-200"
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
        style="opacity: 0; pointer-events: none"
      >
        {{ formatearValor(datos[i].valor) }}
      </text>
    </svg>
  </article>
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
    return `$${Number(valor).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`;
  }
  return String(valor);
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

const puntosLinea = computed(() =>
  puntos.value.map((p) => `${p.x},${p.y}`).join(" "),
);

const etiquetasX = computed(() => {
  if (!props.datos || props.datos.length === 0) return [];

  const margenIzq = 60;
  const ancho = 800 - margenIzq - 20;
  const escalaX = ancho / (props.datos.length - 1 || 1);
  const paso = props.datos.length > 14 ? 5 : props.datos.length > 7 ? 3 : 1;

  return props.datos
    .map((d, i) => {
      if (i % paso === 0 || i === props.datos.length - 1) {
        const x = margenIzq + i * escalaX;
        const fechaPart = d.fecha ? d.fecha.substring(5) : String(i);
        return { x, texto: fechaPart };
      }
      return null;
    })
    .filter((x) => x);
});

const etiquetasY = computed(() => {
  const { min, max } = minMax.value;
  const rango = max - min;
  const paso = Math.max(
    1,
    Math.pow(10, Math.floor(Math.log10(rango / 4 || 1))),
  );
  const inicio = Math.ceil(min / paso) * paso;

  const etiquetas = [];
  for (let v = inicio; v <= max; v += paso) {
    const y = 10 + (300 - 60) - ((v - min) / (rango || 1)) * (300 - 60);
    etiquetas.push({
      y,
      texto: formatearValor(v),
    });
  }

  return etiquetas;
});
</script>
