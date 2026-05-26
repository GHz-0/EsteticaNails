<template>
  <main class="mx-auto w-full max-w-[1080px] px-3 pb-8 pt-4 sm:px-4 lg:px-5">
    <section
      class="relative overflow-hidden rounded-[1.75rem] border border-fuchsia-100/12 bg-[rgba(6,8,14,0.84)] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-7"
    >
      <span class="pointer-events-none absolute -right-20 top-[-5rem] h-52 w-52 rounded-full bg-fuchsia-400/12 blur-3xl" />
      <span class="pointer-events-none absolute -left-16 bottom-[-5rem] h-48 w-48 rounded-full bg-[#ead7a1]/8 blur-3xl" />

      <div class="relative grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside
          class="rounded-[1.4rem] border border-fuchsia-100/10 bg-slate-950/50 p-5 text-center shadow-[0_18px_45px_rgba(0,0,0,0.24)] flex flex-col items-center"
        >
          <!-- Imagen de Perfil Circular -->
          <div
            class="relative overflow-hidden grid h-28 w-28 place-items-center rounded-full border border-[#ead7a1]/25 bg-gradient-to-br from-fuchsia-300/24 to-[#ead7a1]/14 font-display text-[2.5rem] font-semibold text-[#f6e7bc]"
          >
            <img
              v-if="usuario.avatar && usuario.avatar.startsWith('http')"
              :src="usuario.avatar"
              alt="Avatar"
              class="h-full w-full object-cover"
            />
            <span v-else>{{ usuario.avatar || inicialesUsuario }}</span>

            <!-- Spinner al subir imagen -->
            <div
              v-if="subiendoAvatar"
              class="absolute inset-0 bg-black/70 flex items-center justify-center"
            >
              <span class="animate-spin text-fuchsia-100 text-lg">⏳</span>
            </div>
          </div>

          <!-- Selector de imagen oculto -->
          <label
            class="mt-3.5 inline-flex items-center gap-1 cursor-pointer text-xs font-bold text-[#ead7a1] hover:underline"
          >
            <span>Cambiar imagen</span>
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="subirAvatar"
              :disabled="subiendoAvatar"
            />
          </label>

          <h1 class="font-display mt-4 text-[2rem] font-semibold leading-none text-fuchsia-50">
            {{ usuario.nombre || "Usuario" }}
          </h1>
          <p class="mt-2 text-sm text-fuchsia-100/55 break-all">{{ usuario.email }}</p>
          <span
            class="mt-4 inline-flex rounded-full border border-[#ead7a1]/24 bg-[#ead7a1]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-[#f6e7bc]"
          >
            {{ usuario.rol || "usuario" }}
          </span>
        </aside>

        <div>
          <!-- Pestañas de Navegación del Perfil -->
          <div class="flex flex-wrap gap-2 border-b border-fuchsia-100/10 pb-3 mb-5">
            <button
              @click="pestañaActiva = 'datos'"
              class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition border"
              :class="pestañaActiva === 'datos' ? 'bg-[#ead7a1]/15 text-[#f6e7bc] border-[#ead7a1]/25' : 'text-slate-400 border-transparent hover:text-white'"
            >
              👤 Mis Datos
            </button>
            <button
              @click="pestañaActiva = 'tarjetas'"
              class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition border"
              :class="pestañaActiva === 'tarjetas' ? 'bg-[#ead7a1]/15 text-[#f6e7bc] border-[#ead7a1]/25' : 'text-slate-400 border-transparent hover:text-white'"
            >
              💳 Mis Tarjetas
            </button>
            <button
              @click="pestañaActiva = 'saldo'"
              class="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition border"
              :class="pestañaActiva === 'saldo' ? 'bg-[#ead7a1]/15 text-[#f6e7bc] border-[#ead7a1]/25' : 'text-slate-400 border-transparent hover:text-white'"
            >
              💰 Saldo y Pagos
            </button>
          </div>

          <!-- PESTAÑA: DATOS PERSONALES -->
          <div v-if="pestañaActiva === 'datos'" class="grid gap-4 animate-fade">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-[#ead7a1]/80">
                Personalización
              </p>
              <h2 class="font-display mt-1 text-[2.35rem] font-semibold leading-none text-fuchsia-50 sm:text-[3rem]">
                Mis Datos
              </h2>
              <p class="mt-3 text-sm leading-6 text-fuchsia-100/62">
                Modifica tu información personal para que podamos contactarte y enviar tus productos a domicilio.
              </p>
            </div>

            <form @submit.prevent="guardarDatosPersonales" class="grid gap-4 mt-2">
              <div class="grid gap-4 sm:grid-cols-2">
                <label class="grid gap-1 text-xs font-semibold text-fuchsia-100/70">
                  Nombre Completo *
                  <input
                    v-model="formularioDatos.nombre"
                    type="text"
                    required
                    class="min-h-11 rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3.5 text-sm text-fuchsia-50 outline-none transition focus:border-[#ead7a1]/55"
                  />
                </label>
                <label class="grid gap-1 text-xs font-semibold text-fuchsia-100/70">
                  Teléfono *
                  <input
                    v-model="formularioDatos.telefono"
                    type="tel"
                    placeholder="Ej: 5512345678"
                    class="min-h-11 rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3.5 text-sm text-fuchsia-50 outline-none transition focus:border-[#ead7a1]/55"
                  />
                </label>
              </div>
              <label class="grid gap-1 text-xs font-semibold text-fuchsia-100/70">
                Dirección de Envío
                <textarea
                  v-model="formularioDatos.direccionEnvio"
                  rows="3"
                  placeholder="Calle, Número, Colonia, Municipio, Estado, C.P. (para envío de productos a tu hogar)"
                  class="rounded-xl border border-fuchsia-200/15 bg-slate-950/70 px-3.5 py-2 text-sm text-fuchsia-50 outline-none transition focus:border-[#ead7a1]/55"
                />
              </label>

              <div class="flex gap-2 items-center">
                <button
                  type="submit"
                  class="min-h-10 rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-300/24 via-pink-400/22 to-[#ead7a1]/18 px-6 text-xs font-bold text-fuchsia-50 shadow transition hover:-translate-y-0.5"
                  :disabled="guardandoDatos"
                >
                  {{ guardandoDatos ? "Guardando..." : "Guardar Cambios" }}
                </button>
              </div>

              <p v-if="datosExito" class="text-xs text-emerald-400 font-semibold mt-1">
                ✓ {{ datosExito }}
              </p>
              <p v-if="datosError" class="text-xs text-rose-400 font-semibold mt-1">
                ✗ {{ datosError }}
              </p>
            </form>
          </div>

          <!-- PESTAÑA: TARJETAS GUARDADAS -->
          <div v-if="pestañaActiva === 'tarjetas'" class="grid gap-6 animate-fade">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-[#ead7a1]/80">
                Seguridad de pago
              </p>
              <h2 class="font-display mt-1 text-[2.35rem] font-semibold leading-none text-fuchsia-50 sm:text-[3rem]">
                Mis Tarjetas
              </h2>
              <p class="mt-3 text-sm leading-6 text-fuchsia-100/62">
                Guarda tus tarjetas de crédito o débito de forma segura. Tus números se enmascaran automáticamente y nunca almacenamos el CVV.
              </p>
            </div>

            <!-- Listado de tarjetas -->
            <div>
              <div v-if="!usuario.tarjetas?.length" class="rounded-2xl border border-fuchsia-100/10 bg-slate-950/35 p-5 text-sm text-fuchsia-100/58">
                No tienes tarjetas guardadas para compras y reservas rápidas.
              </div>
              <div v-else class="grid gap-3 sm:grid-cols-2">
                <div
                  v-for="tarjeta in usuario.tarjetas"
                  :key="tarjeta.id"
                  class="relative overflow-hidden rounded-2xl border border-fuchsia-100/12 bg-gradient-to-br from-fuchsia-950/20 to-slate-950/80 p-4 shadow-lg backdrop-blur-md"
                >
                  <div class="flex justify-between items-start">
                    <div>
                      <p class="text-[0.6rem] font-bold uppercase tracking-wider text-[#ead7a1]">
                        {{ tarjeta.marca || 'Tarjeta' }}
                      </p>
                      <p class="mt-2 text-base font-mono tracking-widest text-fuchsia-50">
                        {{ tarjeta.numero }}
                      </p>
                    </div>
                    <button
                      @click="eliminarTarjeta(tarjeta.id)"
                      class="text-xs font-bold text-rose-400 hover:text-rose-300 transition"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div class="mt-4 flex justify-between items-end">
                    <div>
                      <p class="text-[0.55rem] uppercase text-slate-500">Titular</p>
                      <p class="text-xs font-semibold text-slate-300">{{ tarjeta.nombre }}</p>
                    </div>
                    <div class="text-right">
                      <p class="text-[0.55rem] uppercase text-slate-500">Vence</p>
                      <p class="text-xs font-semibold text-slate-300">{{ tarjeta.vence }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Formulario agregar tarjeta -->
            <div class="rounded-2xl border border-fuchsia-100/10 bg-white/[0.02] p-4">
              <h3 class="text-xs font-bold uppercase tracking-[0.2em] text-[#ead7a1]/75 mb-3">
                Agregar nueva tarjeta
              </h3>
              <form @submit.prevent="agregarTarjeta" class="grid gap-3.5">
                <label class="grid gap-1 text-[0.68rem] font-semibold text-slate-400">
                  Nombre del Titular *
                  <input
                    v-model="nuevaTarjetaForm.nombre"
                    type="text"
                    required
                    placeholder="Como aparece en la tarjeta"
                    class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
                  />
                </label>
                <div class="grid sm:grid-cols-2 gap-3">
                  <label class="grid gap-1 text-[0.68rem] font-semibold text-slate-400">
                    Número de Tarjeta *
                    <input
                      v-model="nuevaTarjetaForm.numero"
                      type="text"
                      required
                      maxlength="16"
                      placeholder="16 dígitos numéricos"
                      class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
                    />
                  </label>
                  <label class="grid gap-1 text-[0.68rem] font-semibold text-slate-400">
                    Fecha de Vencimiento (MM/AA) *
                    <input
                      v-model="nuevaTarjetaForm.vence"
                      type="text"
                      required
                      maxlength="5"
                      placeholder="MM/AA"
                      class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
                    />
                  </label>
                </div>

                <p v-if="tarjetaError" class="text-xs text-rose-400 font-semibold">
                  ✗ {{ tarjetaError }}
                </p>

                <button
                  type="submit"
                  class="mt-2 min-h-9 rounded-full border border-[#ead7a1]/25 bg-gradient-to-r from-fuchsia-300/24 via-pink-400/22 to-[#ead7a1]/18 px-5 text-xs font-bold text-fuchsia-50 shadow transition hover:-translate-y-0.5 self-start"
                >
                  Guardar Tarjeta
                </button>
              </form>
            </div>
          </div>

          <!-- PESTAÑA: SALDO Y ADEUDOS -->
          <div v-if="pestañaActiva === 'saldo'" class="grid gap-4 animate-fade">
            <div>
              <p class="text-xs font-bold uppercase tracking-[0.28em] text-[#ead7a1]/80">
                Finanzas y cuentas
              </p>
              <h2 class="font-display mt-1 text-[2.35rem] font-semibold leading-none text-fuchsia-50 sm:text-[3rem]">
                Saldo Pendiente
              </h2>
              <p class="mt-3 text-sm leading-6 text-fuchsia-100/62">
                Consulta y liquida el adeudo de tus citas o productos pendientes de pago.
              </p>
            </div>

            <!-- Tarjeta de Saldo Pendiente -->
            <div class="mt-2 rounded-2xl border border-fuchsia-100/12 bg-gradient-to-r from-fuchsia-300/8 via-pink-400/6 to-[#ead7a1]/6 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p class="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#ead7a1]/80">
                  Saldo Pendiente Acumulado
                </p>
                <p class="font-ingresos-libre mt-2 text-[2.2rem] font-bold text-[#f6e7bc]">
                  {{ formatoMoneda(saldoPendiente) }}
                </p>
                <p class="mt-1 text-xs text-slate-400">
                  Corresponde a citas físicas o compras realizadas con pago al recibir.
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

          <!-- Selector de tarjeta guardada para saldar deuda -->
          <label v-if="usuario.tarjetas?.length" class="grid gap-1 text-[0.68rem] font-semibold text-slate-400">
            Pagar con tarjeta guardada
            <select
              @change="seleccionarTarjetaModal"
              class="min-h-9 rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
            >
              <option value="">-- Usar una tarjeta nueva --</option>
              <option
                v-for="tarjeta in usuario.tarjetas"
                :key="tarjeta.id"
                :value="tarjeta.id"
              >
                {{ tarjeta.marca }} terminada en {{ tarjeta.numero.slice(-4) }} ({{ tarjeta.nombre }})
              </option>
            </select>
          </label>

          <label class="grid gap-0.5 text-[0.68rem] font-semibold text-slate-400">
            Número de Tarjeta
            <input
              v-model="tarjetaForm.numero"
              type="text"
              required
              maxlength="16"
              placeholder="16 dígitos"
              class="rounded-lg border border-fuchsia-200/15 bg-slate-950/80 px-2.5 py-1.5 text-xs text-fuchsia-50 outline-none focus:border-[#ead7a1]/55"
              :disabled="tarjetaModalSeleccionadaId !== ''"
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
                :disabled="tarjetaModalSeleccionadaId !== ''"
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
import { computed, onMounted, ref, watch } from "vue";
import { useAuthStore } from "@/nucleo/estado/auth";
import { obtenerSaldoUsuario, pagarSaldo } from "@/nucleo/firebase/pagos";
import { subirAvatarUsuario } from "@/nucleo/firebase/perfil";

const auth = useAuthStore();
const usuario = computed(() => auth.usuario || {});

// Pestaña activa: 'datos', 'tarjetas' o 'saldo'
const pestañaActiva = ref("datos");

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

const tarjetaModalSeleccionadaId = ref("");

// Formulario de datos personales
const formularioDatos = ref({
  nombre: "",
  telefono: "",
  direccionEnvio: "",
});

const guardandoDatos = ref(false);
const datosExito = ref("");
const datosError = ref("");

// Sincronizar formulario con datos de usuario cargados en la sesión
watch(
  usuario,
  (nuevo) => {
    if (nuevo && nuevo.id) {
      formularioDatos.value.nombre = nuevo.nombre || "";
      formularioDatos.value.telefono = nuevo.telefono || "";
      formularioDatos.value.direccionEnvio = nuevo.direccionEnvio || "";
    }
  },
  { immediate: true }
);

// Gestión de foto de perfil
const subiendoAvatar = ref(false);

async function subirAvatar(event) {
  const file = event.target.files[0];
  if (!file) return;

  subiendoAvatar.value = true;
  try {
    const { avatarUrl } = await subirAvatarUsuario(usuario.value.id, file);
    const res = await auth.actualizarPerfil({ avatar: avatarUrl });
    if (!res.ok) {
      alert("Error al actualizar la foto de perfil en la base de datos.");
    }
  } catch (err) {
    console.error(err);
    alert(err.message || "Error al subir avatar.");
  } finally {
    subiendoAvatar.value = false;
  }
}

// Guardar datos básicos
async function guardarDatosPersonales() {
  datosExito.value = "";
  datosError.value = "";
  guardandoDatos.value = true;

  try {
    const res = await auth.actualizarPerfil({
      nombre: formularioDatos.value.nombre.trim(),
      telefono: formularioDatos.value.telefono.trim(),
      direccionEnvio: formularioDatos.value.direccionEnvio.trim(),
    });

    if (res.ok) {
      datosExito.value = "Tus datos se actualizaron correctamente.";
      setTimeout(() => {
        datosExito.value = "";
      }, 3000);
    } else {
      datosError.value = res.mensaje || "Error al guardar los datos.";
    }
  } catch (error) {
    datosError.value = error.message || "Error al guardar.";
  } finally {
    guardandoDatos.value = false;
  }
}

// Gestión de Tarjetas
const nuevaTarjetaForm = ref({
  nombre: "",
  numero: "",
  vence: "",
});
const tarjetaError = ref("");

function detectarMarca(numero) {
  const n = String(numero).replace(/\D/g, "");
  if (n.startsWith("4")) return "Visa";
  if (n.startsWith("5")) return "MasterCard";
  if (n.startsWith("3")) return "American Express";
  return "Tarjeta";
}

async function agregarTarjeta() {
  tarjetaError.value = "";
  const num = nuevaTarjetaForm.value.numero.replace(/\s+/g, "").trim();
  const nom = nuevaTarjetaForm.value.nombre.trim();
  const ven = nuevaTarjetaForm.value.vence.trim();

  if (num.length !== 16 || Number.isNaN(Number(num))) {
    tarjetaError.value = "El número de tarjeta debe tener 16 dígitos.";
    return;
  }
  if (!nom) {
    tarjetaError.value = "Ingresa el nombre del titular.";
    return;
  }
  if (!/^\d{2}\/\d{2}$/.test(ven)) {
    tarjetaError.value = "El vencimiento debe tener formato MM/AA.";
    return;
  }

  try {
    const marca = detectarMarca(num);
    const numeroEnmascarado = `**** **** **** ${num.slice(-4)}`;
    const nuevaTarjeta = {
      id: Date.now().toString(),
      nombre: nom,
      numero: numeroEnmascarado,
      vence: ven,
      marca,
    };

    const tarjetasActuales = [...(usuario.value.tarjetas || [])];
    tarjetasActuales.push(nuevaTarjeta);

    const res = await auth.actualizarPerfil({ tarjetas: tarjetasActuales });
    if (res.ok) {
      nuevaTarjetaForm.value = { nombre: "", numero: "", vence: "" };
    } else {
      tarjetaError.value = res.mensaje || "Error al guardar la tarjeta.";
    }
  } catch (error) {
    tarjetaError.value = error.message || "Error al guardar la tarjeta.";
  }
}

async function eliminarTarjeta(id) {
  if (!confirm("¿Estás segura de que deseas eliminar esta tarjeta?")) return;

  try {
    const tarjetasActuales = (usuario.value.tarjetas || []).filter((t) => t.id !== id);
    const res = await auth.actualizarPerfil({ tarjetas: tarjetasActuales });
    if (!res.ok) {
      alert("Error al eliminar la tarjeta de tu cuenta.");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

function seleccionarTarjetaModal(event) {
  const id = event.target.value;
  tarjetaModalSeleccionadaId.value = id;

  if (!id) {
    tarjetaForm.value = { numero: "", vence: "", cvv: "" };
    return;
  }

  const tarjeta = usuario.value.tarjetas.find((t) => t.id === id);
  if (tarjeta) {
    tarjetaForm.value.numero = tarjeta.numero;
    tarjetaForm.value.vence = tarjeta.vence;
    tarjetaForm.value.cvv = "";
  }
}

const inicialesUsuario = computed(() => {
  return String(usuario.value.nombre || "Usuario")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || "")
    .join("");
});

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

  const esTarjetaGuardada = num.includes("*");

  if (esTarjetaGuardada) {
    if (num.length < 12) {
      pagoError.value = "La tarjeta guardada es inválida.";
      return;
    }
  } else {
    if (num.replace(/\s+/g, "").length !== 16 || Number.isNaN(Number(num.replace(/\s+/g, "")))) {
      pagoError.value = "Número de tarjeta inválido. Debe tener 16 dígitos.";
      return;
    }
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
    tarjetaModalSeleccionadaId.value = "";

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
