<template>
  <article
    class="group relative overflow-hidden rounded-2xl border border-fuchsia-200/15 bg-slate-950/55 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-fuchsia-300/45 hover:bg-slate-900/70 sm:p-5"
  >
    <span
      class="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-200/55 to-transparent"
    />

    <div class="flex items-start justify-between gap-4">
      <div class="min-w-0 flex-1">
        <p
          class="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-slate-400"
        >
          {{ titulo }}
        </p>
        <p
          class="font-display truncate text-2xl font-semibold text-fuchsia-100 lg:text-3xl"
        >
          {{ formatearValor(valor) }}
        </p>
        <p v-if="subtitulo" class="mt-1 text-xs font-medium text-slate-400">
          {{ subtitulo }}
        </p>
      </div>

      <div
        v-if="icono"
        class="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-fuchsia-200/20 bg-fuchsia-300/10 text-lg text-fuchsia-100/85"
      >
        {{ icono }}
      </div>
    </div>
  </article>
</template>

<script setup>
const props = defineProps({
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
