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
        </div>
      </div>
    </section>

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
import { computed } from "vue";
import { useAuthStore } from "@/nucleo/estado/auth";

const auth = useAuthStore();

const usuario = computed(() => auth.usuario || {});

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
</script>
