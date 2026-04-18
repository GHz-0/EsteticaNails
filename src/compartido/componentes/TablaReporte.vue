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
      class="grid min-h-32 place-items-center rounded-xl border border-fuchsia-100/10 bg-slate-900/45 text-sm font-medium text-slate-300"
    >
      ⏳ Cargando datos...
    </div>
    <div
      v-else-if="error"
      class="grid min-h-32 place-items-center rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 text-center text-sm text-rose-100"
    >
      ❌ {{ error }}
    </div>
    <div
      v-else-if="!datos || datos.length === 0"
      class="grid min-h-32 place-items-center rounded-xl border border-fuchsia-100/10 bg-slate-900/45 text-sm font-medium text-slate-300"
    >
      ℹ️ Sin registros para mostrar
    </div>

    <div
      v-else
      class="overflow-x-auto rounded-xl border border-fuchsia-100/10 bg-slate-900/40"
    >
      <table class="min-w-full border-collapse text-sm text-slate-100">
        <thead>
          <tr class="border-b border-fuchsia-200/15 bg-slate-800/55">
            <th
              v-for="col in columnas"
              :key="col.key"
              :class="[
                'px-3 py-2 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-300',
                classAlineacion(col.alineacion),
              ]"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="fila in datos"
            :key="fila.id || fila"
            class="border-b border-fuchsia-100/7 transition-colors hover:bg-fuchsia-300/6"
          >
            <td
              v-for="col in columnas"
              :key="col.key"
              :class="[
                'px-3 py-2.5 text-sm text-slate-100',
                classAlineacion(col.alineacion),
                col.tipo === 'moneda' ? 'font-semibold text-fuchsia-100' : '',
              ]"
            >
              {{ formatearCelda(fila[col.key], col.tipo) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
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

function classAlineacion(alineacion) {
  switch (alineacion) {
    case "derecha":
      return "text-right";
    case "centro":
      return "text-center";
    default:
      return "text-left";
  }
}
</script>
