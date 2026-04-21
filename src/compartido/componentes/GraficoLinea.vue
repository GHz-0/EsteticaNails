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
      class="mt-2 block min-h-[220px] w-full"
      viewBox="0 0 800 300"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#f9a8d4" stop-opacity="0.32" />
          <stop offset="58%" stop-color="#f472b6" stop-opacity="0.12" />
          <stop offset="100%" stop-color="#ead7a1" stop-opacity="0.02" />
        </linearGradient>
        <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#f5d0fe" />
          <stop offset="50%" stop-color="#f9a8d4" />
          <stop offset="100%" stop-color="#ead7a1" />
        </linearGradient>
        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0.95 0 1 0 0 0.58 0 0 1 0 0.77 0 0 0 0.45 0"
          />
        </filter>
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
      <rect width="800" height="300" fill="rgba(3,5,10,0.18)" />

      <line
        x1="60"
        y1="10"
        x2="60"
        y2="250"
        stroke="rgba(234,215,161,0.16)"
        stroke-width="2"
      />
      <line
        x1="60"
        y1="250"
        x2="780"
        y2="250"
        stroke="rgba(234,215,161,0.16)"
        stroke-width="2"
      />

      <path :d="areaPath" fill="url(#areaFill)" />

      <polyline
        :points="puntosLinea"
        fill="none"
        stroke="#ffffff"
        stroke-opacity="0.18"
        stroke-width="6"
        stroke-linecap="round"
        stroke-linejoin="round"
        filter="url(#softGlow)"
      />
      <polyline
        :points="puntosLinea"
        fill="none"
        stroke="url(#lineGlow)"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
      />

      <circle
        v-for="(punto, i) in puntos"
        :key="i"
        :cx="punto.x"
        :cy="punto.y"
        r="5"
        fill="#0b1020"
        stroke="#f9a8d4"
        stroke-width="2"
      />

      <text
        v-for="(etiqueta, i) in etiquetasX"
        :key="`x-${i}`"
        :x="etiqueta.x"
        :y="270"
        text-anchor="middle"
        font-size="11"
        fill="rgba(245,208,254,0.55)"
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
        font-weight="600"
        fill="rgba(245,208,254,0.55)"
      >
        {{ valor.texto }}
      </text>

      <g v-for="(punto, i) in puntosConValor" :key="`label-${i}`">
        <rect
          :x="Math.max(0, punto.x - 36)"
          :y="Math.max(18, punto.y - 34)"
          width="72"
          height="18"
          rx="9"
          fill="rgba(6,8,14,0.84)"
          stroke="rgba(234,215,161,0.18)"
        />
        <text
          :x="punto.x"
          :y="Math.max(31, punto.y - 21)"
          text-anchor="middle"
          font-size="10"
          font-weight="800"
          fill="#f6e7bc"
        >
          {{ formatearValor(punto.valor) }}
        </text>
      </g>

      <rect
        v-for="(punto, i) in puntosConValor"
        :key="`hover-${i}`"
        :x="punto.x - 32"
        :y="punto.y - 42"
        width="64"
        height="32"
        fill="rgba(6,8,14,0.92)"
        rx="6"
        style="opacity: 0; pointer-events: none"
      />
      <text
        v-for="(punto, i) in puntosConValor"
        :key="`tooltip-text-${i}`"
        :x="punto.x"
        :y="punto.y - 21"
        text-anchor="middle"
        font-size="10"
        fill="#f6e7bc"
        font-weight="600"
        style="opacity: 0; pointer-events: none"
      >
        {{ formatearValor(punto.valor) }}
      </text>
    </svg>
  </article>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  titulo: { type: String, required: true },
  subtitulo: { type: String, default: null },
  datos: { type: Array, default: () => [] },
  modoEtiquetas: {
    type: String,
    default: "relevantes",
    validator: (value) => ["relevantes", "todos"].includes(value),
  },
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

const escalaGrafico = computed(() => {
  if (!props.datos || props.datos.length === 0) {
    return { min: 0, max: 100, step: 20 };
  }

  const valores = props.datos.map((d) => getValorDato(d));
  const maxValor = Math.max(...valores, 0);
  const minValor = Math.min(...valores, 0);
  const rango = Math.max(1, maxValor - minValor);
  const step = niceNumber(rango / 4, true);
  const min = minValor < 0 ? Math.floor(minValor / step) * step : 0;
  const max = Math.ceil(maxValor / step) * step;

  return { min, max, step };
});

const puntos = computed(() => {
  if (!props.datos || props.datos.length === 0) return [];

  const margenIzq = 60;
  const margenDer = 20;
  const margenArr = 14;
  const margenAb = 50;
  const ancho = 800 - margenIzq - margenDer;
  const alto = 300 - margenArr - margenAb;
  const escalaX = ancho / (props.datos.length - 1 || 1);
  const escalaY =
    alto / (escalaGrafico.value.max - escalaGrafico.value.min || 1);

  return props.datos.map((d, i) => {
    const x = margenIzq + i * escalaX;
    const y =
      margenArr + alto - (getValorDato(d) - escalaGrafico.value.min) * escalaY;
    return { x, y };
  });
});

const puntosLinea = computed(() =>
  puntos.value.map((p) => `${p.x},${p.y}`).join(" "),
);

const areaPath = computed(() => {
  if (!puntos.value.length) return "";
  const baseY = 250;
  const start = `M 60,${baseY} L ${puntos.value[0].x},${puntos.value[0].y}`;
  const body = puntos.value.map((p) => `L ${p.x},${p.y}`).join(" ");
  const end = `L ${puntos.value[puntos.value.length - 1].x},${baseY} Z`;
  return `${start} ${body} ${end}`;
});

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
    .filter(Boolean);
});

const etiquetasY = computed(() => {
  const { min, max, step } = escalaGrafico.value;
  const rango = max - min || 1;
  const inicio = Math.ceil(min / step) * step;

  const etiquetas = [];
  for (let v = inicio; v <= max; v += step) {
    const y = 14 + (300 - 64) - ((v - min) / rango) * (300 - 64);
    etiquetas.push({ y, texto: formatearValor(v) });
  }
  return etiquetas;
});

const puntosConValor = computed(() => {
  const puntosMapeados = puntos.value.map((punto, i) => ({
    ...punto,
    valor: getValorDato(props.datos?.[i]),
  }));

  if (props.modoEtiquetas === "todos") {
    return puntosMapeados;
  }

  return puntosMapeados.filter((punto) => punto.valor > 0);
});
</script>
