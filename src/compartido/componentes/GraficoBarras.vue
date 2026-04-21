<template>
  <article
    class="overflow-hidden rounded-2xl border border-fuchsia-100/10 bg-[rgba(6,8,14,0.72)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.32)] backdrop-blur-xl"
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
      class="grid min-h-36 place-items-center rounded-xl border border-fuchsia-100/10 bg-white/5 text-sm font-medium text-slate-300"
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
      class="grid min-h-36 place-items-center rounded-xl border border-fuchsia-100/10 bg-white/5 text-sm font-medium text-slate-300"
    >
      ℹ️ Sin datos para graficar
    </div>

    <svg
      v-else
      class="mt-2 block w-full"
      viewBox="0 0 800 340"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f6e7bc" stop-opacity="0.95" />
          <stop offset="45%" stop-color="#f9a8d4" stop-opacity="0.92" />
          <stop offset="100%" stop-color="#ec4899" stop-opacity="0.78" />
        </linearGradient>
        <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f5d0fe" stop-opacity="0.55" />
          <stop offset="100%" stop-color="#f472b6" stop-opacity="0.08" />
        </linearGradient>
        <pattern
          id="gridBars"
          width="80"
          height="34"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 80 0 L 0 0 0 34"
            fill="none"
            stroke="rgba(255,255,255,0.045)"
            stroke-width="1"
          />
        </pattern>
      </defs>

      <rect width="800" height="340" fill="url(#gridBars)" />
      <rect width="800" height="340" fill="rgba(3,5,10,0.18)" />

      <line
        x1="60"
        y1="20"
        x2="60"
        y2="280"
        stroke="rgba(234,215,161,0.16)"
        stroke-width="2"
      />
      <line
        x1="60"
        y1="280"
        x2="780"
        y2="280"
        stroke="rgba(234,215,161,0.16)"
        stroke-width="2"
      />

      <line
        v-for="(tick, i) in etiquetasY"
        :key="`tick-${i}`"
        x1="60"
        :y1="tick.y"
        x2="780"
        :y2="tick.y"
        stroke="rgba(255,255,255,0.045)"
        stroke-width="1"
      />

      <text
        v-for="(tick, i) in etiquetasY"
        :key="`tick-label-${i}`"
        x="50"
        :y="tick.y + 4"
        text-anchor="end"
        font-size="11"
        font-weight="600"
        fill="rgba(245,208,254,0.7)"
      >
        {{ tick.texto }}
      </text>

      <g
        v-for="(barra, i) in barras"
        :key="`bar-${i}`"
        :transform="`translate(${barra.x}, 0)`"
      >
        <rect
          :x="0"
          :y="barra.yGlow"
          :width="barra.ancho"
          :height="barra.altoGlow"
          rx="12"
          fill="url(#barGlow)"
          opacity="0.7"
        />
        <rect
          :x="0"
          :y="barra.y"
          :width="barra.ancho"
          :height="barra.alto"
          rx="12"
          fill="url(#barFill)"
        />
        <rect
          :x="0"
          :y="barra.y"
          :width="barra.ancho"
          :height="barra.alto"
          rx="12"
          fill="rgba(255,255,255,0.04)"
        />

        <rect
          :x="Math.max(0, barra.ancho / 2 - 34)"
          :y="Math.max(24, barra.y - 28)"
          width="68"
          height="18"
          rx="9"
          fill="rgba(6,8,14,0.84)"
          stroke="rgba(234,215,161,0.18)"
        />
        <text
          :x="barra.ancho / 2"
          :y="Math.max(37, barra.y - 15)"
          text-anchor="middle"
          font-size="10"
          font-weight="800"
          fill="#f6e7bc"
        >
          {{ formatearValor(barra.valor) }}
        </text>

        <text
          :x="barra.ancho / 2"
          y="304"
          text-anchor="middle"
          font-size="11"
          fill="rgba(255,255,255,0.6)"
        >
          {{ barra.etiqueta }}
        </text>
      </g>
    </svg>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: null },
  datos: { type: Array, default: () => [] },
  cargando: { type: Boolean, default: false },
  error: { type: String, default: null },
  formato: { type: String, enum: ["numero", "moneda"], default: "moneda" },
});

function getValorDato(dato) {
  return Number(dato?.valor ?? dato?.ingreso ?? 0) || 0;
}

function formatearValor(valor) {
  if (props.formato === "moneda") {
    return `$${Number(valor).toLocaleString("es-MX", { maximumFractionDigits: 0 })}`;
  }
  return String(valor);
}

function niceNumber(value, round) {
  if (value <= 0) return 1;
  const exponent = Math.floor(Math.log10(value));
  const fraction = value / Math.pow(10, exponent);
  let niceFraction;
  if (round) {
    if (fraction < 1.5) niceFraction = 1;
    else if (fraction < 3) niceFraction = 2;
    else if (fraction < 7) niceFraction = 5;
    else niceFraction = 10;
  } else {
    if (fraction <= 1) niceFraction = 1;
    else if (fraction <= 2) niceFraction = 2;
    else if (fraction <= 5) niceFraction = 5;
    else niceFraction = 10;
  }
  return niceFraction * Math.pow(10, exponent);
}

function compactLabel(valor) {
  if (valor >= 1000000) return `${(valor / 1000000).toFixed(1)}M`;
  if (valor >= 1000)
    return `${(valor / 1000).toFixed(valor >= 10000 ? 0 : 1)}k`;
  return String(Math.round(valor));
}

const escala = computed(() => {
  if (!props.datos || props.datos.length === 0)
    return { min: 0, max: 100, step: 20 };
  const valores = props.datos.map((d) => getValorDato(d));
  const maxValor = Math.max(...valores, 0);
  const minValor = Math.min(...valores, 0);
  const rango = Math.max(1, maxValor - minValor);
  const step = niceNumber(rango / 4, true);
  const min = minValor < 0 ? Math.floor(minValor / step) * step : 0;
  const max = Math.ceil(maxValor / step) * step;
  return { min, max, step };
});

const barras = computed(() => {
  if (!props.datos || props.datos.length === 0) return [];

  const min = escala.value.min;
  const max = escala.value.max;
  const alto = 280 - 20;
  const baseY = 280;
  const anchoUtil = 700;
  const separacion = 16;
  const anchoBarra = Math.max(
    36,
    Math.floor(
      (anchoUtil - separacion * (props.datos.length - 1)) / props.datos.length,
    ),
  );
  const totalGrupo =
    props.datos.length * anchoBarra + (props.datos.length - 1) * separacion;
  const inicioX = 60 + Math.max(0, (anchoUtil - totalGrupo) / 2);

  return props.datos.map((dato, indice) => {
    const valor = getValorDato(dato);
    const porcentaje = (valor - min) / (max - min || 1);
    const altoBarra = Math.max(4, porcentaje * alto);
    const x = inicioX + indice * (anchoBarra + separacion);
    const y = baseY - altoBarra;
    return {
      x,
      y,
      yGlow: y - 8,
      altoGlow: altoBarra + 12,
      ancho: anchoBarra,
      alto: altoBarra,
      valor,
      etiqueta: dato.fecha ? dato.fecha.substring(5) : `#${indice + 1}`,
    };
  });
});

const etiquetasY = computed(() => {
  const { min, max, step } = escala.value;
  const etiquetas = [];
  const start = Math.ceil(min / step) * step;
  const usableHeight = 260;
  for (let v = start; v <= max; v += step) {
    const y = 280 - ((v - min) / (max - min || 1)) * usableHeight;
    etiquetas.push({ y, texto: formatearValor(v) });
  }
  return etiquetas;
});
</script>
