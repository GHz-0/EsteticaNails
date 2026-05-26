<template>
  <main class="mx-auto w-full max-w-[1080px] px-3 pb-8 pt-4 sm:px-4 lg:px-5">
    <section
      class="relative overflow-hidden rounded-[1.75rem] border border-fuchsia-100/12 bg-[rgba(6,8,14,0.84)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7"
    >
      <span class="pointer-events-none absolute -right-20 top-[-5rem] h-52 w-52 rounded-full bg-fuchsia-400/12 blur-3xl" />
      <span class="pointer-events-none absolute -left-16 bottom-[-5rem] h-48 w-48 rounded-full bg-[#ead7a1]/8 blur-3xl" />

      <div class="relative grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside
          class="rounded-[1.4rem] border border-fuchsia-100/10 bg-slate-950/50 p-5 text-center shadow-[0_18px_45px_rgba(0,0,0,0.24)]"
        >
          <div
            class="mx-auto grid h-28 w-28 place-items-center rounded-full border border-[#ead7a1]/25 bg-gradient-to-br from-fuchsia-300/24 to-[#ead7a1]/14 font-display text-[2.5rem] font-semibold text-[#f6e7bc]"
          >
            {{ usuario.avatar || inicialesUsuario }}
          </div>
          <h1 class="font-display mt-4 text-[2rem] font-semibold leading-none text-fuchsia-50">
            {{ usuario.nombre || "Usuario" }}
          </h1>
          <p class="mt-2 text-sm text-fuchsia-100/55">{{ usuario.email }}</p>
          <span
            class="mt-4 inline-flex rounded-full border border-[#ead7a1]/24 bg-[#ead7a1]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#f6e7bc]"
          >
            {{ usuario.rol || "usuario" }}
          </span>
        </aside>

        <div>
          <p class="text-xs font-bold uppercase tracking-[0.28em] text-[#ead7a1]/80">
            Mi cuenta
          </p>
          <h2 class="font-display mt-1 text-[2.35rem] font-semibold leading-none text-fuchsia-50 sm:text-[3rem]">
            Perfil de clienta
          </h2>
          <p class="mt-3 max-w-2xl text-sm leading-6 text-fuchsia-100/62">
            Esta informacion se usa para identificar tu cuenta, preparar tus citas y mantener segura tu sesion.
          </p>

          <div class="mt-6 grid gap-3 sm:grid-cols-2">
            <article
              v-for="item in datosPerfil"
              :key="item.label"
              class="rounded-2xl border border-fuchsia-100/10 bg-white/[0.035] p-4"
            >
              <p class="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-fuchsia-100/42">
                {{ item.label }}
              </p>
              <p class="mt-2 break-words text-sm font-semibold text-fuchsia-50">
                {{ item.valor }}
              </p>
            </article>
          </div>

          <!-- Tarjeta de Saldo Pendiente -->
          <div class="mt-4 rounded-2xl border border-fuchsia-100/12 bg-gradient-to-r from-fuchsia-300/8 via-pink-400/6 to-[#ead7a1]/6 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p class="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#ead7a1]/80">
                Saldo Pendiente Acumulado
              </p>
              <p class="font-ingresos-libre mt-2 text-[1.85rem] font-bold text-[#f6e7bc]">
                {{ formatoMoneda(saldoPendiente) }}
              </p>
              <p class="mt-1 text-xs text-slate-400">
                Corresponde a citas físicas o productos a recibir en tu hogar.
              </p>
            </div>
            <button
              v-if="saldoPendiente > 0"
              @click="abrirPagoModal = true"
              class="rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-300/24 via-pink-400/22 to-[#ead7a1]/18 px-5 py-2.5 text-xs font-bold text-fuchsia-50 shadow-lg transition hover:-translate-y-0.5 hover:border-[#ead7a1]/45"
            >
              Pagar Saldo Online
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Modal de Pago de Saldo -->
    <div
      v-if="abrirPagoModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/72 p-3 backdrop-blur-sm"
    >
      <div
        class="w-full max-w-[420px] rounded-3xl border border-fuchsia-100/12 bg-[rgba(10,12,22,0.92)] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.5)]"
      >
        <header class="mb-4 flex items-center justify-between border-b border-fuchsia-100/10 pb-3">
          <h2 class="font-display text-lg font-semibold text-fuchsia-50">
            Pagar Saldo Pendiente
          </h2>
          <button @click="abrirPagoModal = false" class="text-slate-400 hover:text-white">✕</button>
        </header>

        <form @submit.prevent="procesarPago" class="grid gap-3.5">
          <p class="text-xs text-slate-300">
            Estás liquidando tu saldo pendiente de <strong class="text-[#f6e7bc]">{{ formatoMoneda(saldoPendiente) }}</strong>.
          </p>

          <label class="grid gap-0.5 text-[0.68rem] font-semibold text-slate-400">
            Número de Tarjeta
            <input
              v-model="tarjetaForm.numero"
              type="text"
              required
              maxlength="16"
              placeholder="16 dígitos"
              class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
            />
          </label>

          <div class="grid grid-cols-2 gap-2">
            <label class="grid gap-0.5 text-[0.68rem] font-semibold text-slate-400">
              Vence (MM/AA)
              <input
                v-model="tarjetaForm.vence"
                type="text"
                required
                placeholder="MM/AA"
                maxlength="5"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
              />
            </label>

            <label class="grid gap-0.5 text-[0.68rem] font-semibold text-slate-400">
              CVV
              <input
                v-model="tarjetaForm.cvv"
                type="password"
                required
                maxlength="3"
                placeholder="3 dígitos"
                class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
              />
            </label>
          </div>

          <p
            v-if="pagoError"
            class="rounded-xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-100"
          >
            {{ pagoError }}
          </p>
          <p
            v-if="pagoExito"
            class="rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-100"
          >
            {{ pagoExito }}
          </p>

          <div class="flex gap-2">
            <button
              type="submit"
              class="flex-1 min-h-9 rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-300/24 via-pink-400/22 to-[#ead7a1]/18 px-4 text-xs font-bold text-fuchsia-50 shadow disabled:opacity-50"
              :disabled="procesando"
            >
              {{ procesando ? "Procesando..." : "Liquidar Adeudo" }}
            </button>
            <button
              type="button"
              @click="abrirPagoModal = false"
              class="rounded-full border border-fuchsia-100/18 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-200"
              :disabled="procesando"
            >
              Cerrar
            </button>
          </div>
        </form>
      </div>
    </div>

    <section class="mt-4 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
      <article
        class="rounded-[1.4rem] border border-fuchsia-100/10 bg-white/[0.035] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl"
      >
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ead7a1]/75">
          Preferencias
        </p>
        <h2 class="font-display mt-1 text-[1.7rem] font-semibold text-fuchsia-50">
          Experiencia Nails Bere
        </h2>
        <div class="mt-4 grid gap-3 sm:grid-cols-3">
          <div
            v-for="item in preferencias"
            :key="item.titulo"
            class="rounded-2xl border border-fuchsia-100/10 bg-slate-950/38 p-4"
          >
            <span class="grid h-9 w-9 place-items-center rounded-full border border-[#ead7a1]/22 bg-[#ead7a1]/10 text-[#f6e7bc]">
              {{ item.icono }}
            </span>
            <h3 class="mt-3 text-sm font-bold text-fuchsia-50">{{ item.titulo }}</h3>
            <p class="mt-1 text-xs leading-5 text-fuchsia-100/48">{{ item.texto }}</p>
          </div>
        </div>
      </article>

      <article
        class="rounded-[1.4rem] border border-fuchsia-100/10 bg-white/[0.035] p-5 shadow-[0_20px_55px_rgba(0,0,0,0.22)] backdrop-blur-xl"
      >
        <p class="text-xs font-bold uppercase tracking-[0.2em] text-[#ead7a1]/75">
          Acciones
        </p>
        <h2 class="font-display mt-1 text-[1.7rem] font-semibold text-fuchsia-50">
          Atajos
        </h2>
        <div class="mt-4 grid gap-2">
          <RouterLink
            to="/usuario/servicios"
            class="flex items-center justify-between rounded-2xl border border-fuchsia-100/10 bg-slate-950/38 px-4 py-3 text-sm font-bold text-fuchsia-50 transition hover:border-[#ead7a1]/35"
          >
            Explorar servicios
            <span class="text-[#f6e7bc]">→</span>
          </RouterLink>
          <RouterLink
            to="/usuario/mis-citas"
            class="flex items-center justify-between rounded-2xl border border-fuchsia-100/10 bg-slate-950/38 px-4 py-3 text-sm font-bold text-fuchsia-50 transition hover:border-[#ead7a1]/35"
          >
            Ver mis citas
            <span class="text-[#f6e7bc]">→</span>
          </RouterLink>
        </div>
      </article>
    </section>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useAuthStore } from "@/nucleo/estado/auth";
import { obtenerSaldoUsuario, pagarSaldo } from "@/nucleo/firebase/pagos";

const auth = useAuthStore();

const usuario = computed(() => auth.usuario || {});
const saldoPendiente = ref(0);

const abrirPagoModal = ref(false);
const pagoError = ref("");
const pagoExito = ref("");
const procesando = ref(false);

const tarjetaForm = ref({
  numero: "",
  vence: "",
  cvv: "",
});

const inicialesUsuario = computed(() =>
  String(usuario.value.nombre || "Usuario")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || "")
    .join(""),
);

const datosPerfil = computed(() => [
  { label: "Nombre", valor: usuario.value.nombre || "Sin nombre" },
  { label: "Correo", valor: usuario.value.email || "Sin correo" },
  { label: "Rol", valor: usuario.value.rol || "usuario" },
  { label: "Estado", valor: "Cuenta activa" },
]);

const preferencias = [
  {
    icono: "✦",
    titulo: "Agenda simple",
    texto: "Reserva desde servicios y confirma tu cita en pocos pasos.",
  },
  {
    icono: "◇",
    titulo: "Atencion personal",
    texto: "Tus notas ayudan a preparar mejor cada visita.",
  },
  {
    icono: "◷",
    titulo: "Seguimiento",
    texto: "Consulta tus citas activas y tu historial desde el panel.",
  },
];

async function cargarSaldo() {
  saldoPendiente.value = await obtenerSaldoUsuario();
}

async function procesarPago() {
  pagoError.value = "";
  pagoExito.value = "";

  const num = tarjetaForm.value.numero.trim();
  const cvv = tarjetaForm.value.cvv.trim();

  if (num.length !== 16 || Number.isNaN(Number(num))) {
    pagoError.value = "Número de tarjeta inválido. Debe tener 16 dígitos.";
    return;
  }
  if (cvv.length !== 3 || Number.isNaN(Number(cvv))) {
    pagoError.value = "CVV inválido. Debe tener 3 dígitos.";
    return;
  }

  procesando.value = true;
  try {
    const nuevoSaldo = await pagarSaldo(saldoPendiente.value);
    saldoPendiente.value = nuevoSaldo;
    pagoExito.value = "¡Adeudo liquidado con éxito!";
    
    // Resetear formulario
    tarjetaForm.value = { numero: "", vence: "", cvv: "" };
    
    setTimeout(() => {
      abrirPagoModal.value = false;
      pagoExito.value = "";
    }, 2000);
  } catch (error) {
    pagoError.value = `Error en el pago: ${error.message}`;
  } finally {
    procesando.value = false;
  }
}

function formatoMoneda(valor) {
  return `$${Number(valor || 0).toLocaleString("es-MX")}`;
}

onMounted(cargarSaldo);
</script>

<style scoped>
h1, h2, h3 {
  font-family: "Cormorant Garamond", Georgia, serif;
}
</style>
