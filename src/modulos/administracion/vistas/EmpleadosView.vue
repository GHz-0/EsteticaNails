<template>
  <div class="empleados">

    <!-- Vista: Lista -->
    <template v-if="vista === 'lista'">
      <header class="cabecera">
        <div>
          <h2>Gestión de Empleados</h2>
          <p>Administra el equipo, horarios y especialidades.</p>
        </div>
        <button class="btn principal" @click="abrirNuevo">+ Nuevo empleado</button>
      </header>

      <div class="stats-row">
        <div class="stat">
          <span class="stat-val">{{ empleados.filter(e => e.activo).length }}</span>
          <span class="stat-lbl">Activos</span>
        </div>
        <div class="stat">
          <span class="stat-val">{{ countRol('nail_artist') }}</span>
          <span class="stat-lbl">Nail Artists</span>
        </div>
        <div class="stat">
          <span class="stat-val">{{ countRol('recepcionista') }}</span>
          <span class="stat-lbl">Recepcionistas</span>
        </div>
        <div class="stat">
          <span class="stat-val dim">{{ empleados.filter(e => !e.activo).length }}</span>
          <span class="stat-lbl">Inactivos</span>
        </div>
      </div>

      <div class="filtros">
        <input v-model="busqueda" class="buscador" placeholder="🔍  Buscar por nombre..." />
        <select v-model="filtroRol" class="select-filtro">
          <option value="">Todos los roles</option>
          <option value="nail_artist">Nail Artist</option>
          <option value="recepcionista">Recepcionista</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <p v-if="cargando" class="estado">Cargando empleados...</p>
      <p v-else-if="!empleadosFiltrados.length" class="estado">
        {{ busqueda ? `Sin resultados para "${busqueda}"` : 'Aún no hay empleados registrados.' }}
      </p>

      <ul v-else class="lista">
        <li v-for="emp in empleadosFiltrados" :key="emp.id" class="item" :class="{ inactivo: !emp.activo }">
          <div class="item-avatar" :style="{ background: colorAvatar(emp.nombre) }">
            {{ iniciales(emp.nombre) }}
          </div>

          <div class="item-info">
            <h4>{{ emp.nombre }}</h4>
            <div class="item-meta">
              <span class="chip" :class="emp.rol">{{ rolLabel(emp.rol) }}</span>
              <span v-if="emp.telefono" class="meta-tel">📞 {{ emp.telefono }}</span>
            </div>
            <div v-if="emp.especialidades?.length" class="chips-row">
              <span v-for="esp in emp.especialidades" :key="esp" class="chip-esp">{{ esp }}</span>
            </div>
          </div>

          <div class="item-acciones">
            <button
              class="toggle"
              :class="{ activo: emp.activo }"
              :title="emp.activo ? 'Desactivar' : 'Activar'"
              @click="toggleActivo(emp)"
            ><span class="toggle-dot"></span></button>
            <button class="btn pequeno" @click="abrirPerfil(emp)">Ver</button>
            <button class="btn pequeno" @click="abrirEditar(emp)">Editar</button>
            <button class="btn pequeno peligro" @click="confirmarEliminar(emp)">Eliminar</button>
          </div>
        </li>
      </ul>
    </template>

    <!-- Vista: Perfil -->
    <template v-else-if="vista === 'perfil' && empleadoActual">
      <div class="subvista-header">
        <button class="btn-back" @click="vista = 'lista'">← Volver</button>
        <button class="btn secundario" @click="abrirEditar(empleadoActual)">Editar</button>
      </div>

      <div class="perfil-layout">
        <div class="perfil-lado">
          <div class="perfil-avatar" :style="{ background: colorAvatar(empleadoActual.nombre) }">
            {{ iniciales(empleadoActual.nombre) }}
          </div>
          <h3>{{ empleadoActual.nombre }}</h3>
          <span class="chip" :class="empleadoActual.rol">{{ rolLabel(empleadoActual.rol) }}</span>
          <span class="status-pill" :class="empleadoActual.activo ? 'activo' : 'inactivo'">
            {{ empleadoActual.activo ? '● Activo' : '○ Inactivo' }}
          </span>
          <p v-if="empleadoActual.telefono" class="perfil-tel">📞 {{ empleadoActual.telefono }}</p>
          <div v-if="empleadoActual.especialidades?.length" class="perfil-section">
            <p class="section-lbl">Especialidades</p>
            <div class="chips-row">
              <span v-for="esp in empleadoActual.especialidades" :key="esp" class="chip-esp">{{ esp }}</span>
            </div>
          </div>
          <div v-if="empleadoActual.notas" class="perfil-section">
            <p class="section-lbl">Notas</p>
            <p class="notas-txt">{{ empleadoActual.notas }}</p>
          </div>
        </div>

        <div class="perfil-main">
          <div class="panel">
            <h4>Horario semanal</h4>
            <div v-if="empleadoActual.horario" class="horario-lista">
              <div v-for="dia in dias" :key="dia.key" class="horario-fila" :class="{ libre: !empleadoActual.horario[dia.key]?.activo }">
                <span class="dia-nombre">{{ dia.label }}</span>
                <span v-if="empleadoActual.horario[dia.key]?.activo" class="dia-horas">
                  {{ empleadoActual.horario[dia.key].entrada }} – {{ empleadoActual.horario[dia.key].salida }}
                </span>
                <span v-else class="dia-libre">Día libre</span>
              </div>
            </div>
            <p v-else class="estado">Sin horario registrado.</p>
          </div>
        </div>
      </div>
    </template>

    <!-- Vista: Formulario (nuevo / editar) -->
    <template v-else-if="vista === 'formulario'">
      <div class="subvista-header">
        <button class="btn-back" @click="cancelarFormulario">← Volver</button>
        <h3>{{ editandoId ? 'Editar empleado' : 'Nuevo empleado' }}</h3>
      </div>

      <div class="grid-form">
        <div class="formulario-col">

          <div class="campo-grupo">
            <label>Nombre completo *</label>
            <input v-model="form.nombre" type="text" placeholder="Ej. Ana García López" :class="{ error: errores.nombre }" @input="errores.nombre = ''" />
            <span class="campo-error" v-if="errores.nombre">{{ errores.nombre }}</span>
          </div>

          <div class="campo-fila">
            <div class="campo-grupo">
              <label>Teléfono</label>
              <input v-model="form.telefono" type="tel" placeholder="Ej. 961 234 5678" />
            </div>
            <div class="campo-grupo">
              <label>Rol *</label>
              <select v-model="form.rol" :class="{ error: errores.rol }" @change="errores.rol = ''">
                <option value="">Seleccionar...</option>
                <option value="nail_artist">Nail Artist</option>
                <option value="recepcionista">Recepcionista</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div class="campo-grupo">
            <label>Especialidades</label>
            <div class="esp-selector">
              <button
                v-for="esp in especialidadesDisponibles"
                :key="esp"
                type="button"
                class="esp-opcion"
                :class="{ seleccionada: form.especialidades.includes(esp) }"
                @click="toggleEsp(esp)"
              >{{ esp }}</button>
            </div>
          </div>

          <div class="campo-grupo">
            <label>Notas internas</label>
            <textarea v-model="form.notas" rows="3" placeholder="Horario especial, observaciones..."></textarea>
          </div>

          <div class="campo-grupo activo-row">
            <span>Empleado activo</span>
            <button type="button" class="toggle" :class="{ activo: form.activo }" @click="form.activo = !form.activo">
              <span class="toggle-dot"></span>
            </button>
          </div>
        </div>

        <div class="horario-col">
          <div class="campo-grupo">
            <label>Horario semanal</label>
            <div class="horario-editor">
              <div v-for="dia in dias" :key="dia.key" class="horario-fila-edit">
                <button
                  type="button"
                  class="dia-btn"
                  :class="{ activo: form.horario[dia.key]?.activo }"
                  @click="toggleDia(dia.key)"
                >{{ dia.label }}</button>
                <template v-if="form.horario[dia.key]?.activo">
                  <input type="time" v-model="form.horario[dia.key].entrada" class="time-in" />
                  <span class="sep">–</span>
                  <input type="time" v-model="form.horario[dia.key].salida" class="time-in" />
                </template>
                <span v-else class="libre-txt">Libre</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <p v-if="errorGuardar" class="mensaje error">{{ errorGuardar }}</p>

      <div class="form-acciones">
        <button type="button" class="btn secundario" @click="cancelarFormulario">Cancelar</button>
        <button type="button" class="btn principal" :disabled="guardando" @click="guardar">
          {{ guardando ? 'Guardando...' : (editandoId ? 'Guardar cambios' : 'Crear empleado') }}
        </button>
      </div>
    </template>

    <!-- Modal eliminar -->
    <div v-if="empleadoAEliminar" class="modal-overlay" @click.self="empleadoAEliminar = null">
      <div class="modal">
        <h3>¿Eliminar empleado?</h3>
        <p>Se eliminará a <strong>{{ empleadoAEliminar.nombre }}</strong> permanentemente. Esta acción no se puede deshacer.</p>
        <div class="modal-acciones">
          <button class="btn secundario" @click="empleadoAEliminar = null">Cancelar</button>
          <button class="btn peligro" @click="ejecutarEliminar">Sí, eliminar</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted } from "vue";
import {
  obtenerEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from "@/nucleo/firebase/empleados";

// ── Estado principal ──────────────────────────────────────────────
const vista = ref("lista"); // 'lista' | 'perfil' | 'formulario'
const cargando = ref(false);
const guardando = ref(false);
const empleados = ref([]);
const empleadoActual = ref(null);
const empleadoAEliminar = ref(null);
const editandoId = ref(null);
const busqueda = ref("");
const filtroRol = ref("");
const errorGuardar = ref("");
const errores = reactive({ nombre: "", rol: "" });

// ── Constantes ────────────────────────────────────────────────────
const dias = [
  { key: "lun", label: "Lun" },
  { key: "mar", label: "Mar" },
  { key: "mie", label: "Mié" },
  { key: "jue", label: "Jue" },
  { key: "vie", label: "Vie" },
  { key: "sab", label: "Sáb" },
  { key: "dom", label: "Dom" },
];

const especialidadesDisponibles = [
  "Acrílico", "Gel", "Semipermanente", "Nail Art",
  "Press-on", "Esculpido", "Manicure", "Pedicure",
];

const COLORES = ["#C8975A", "#8B6B3D", "#A07840", "#D4A660", "#7A5C2E", "#B8860B"];

// ── Formulario ────────────────────────────────────────────────────
function horarioDefault() {
  return {
    lun: { activo: true, entrada: "09:00", salida: "18:00" },
    mar: { activo: true, entrada: "09:00", salida: "18:00" },
    mie: { activo: true, entrada: "09:00", salida: "18:00" },
    jue: { activo: true, entrada: "09:00", salida: "18:00" },
    vie: { activo: true, entrada: "09:00", salida: "18:00" },
    sab: { activo: true, entrada: "09:00", salida: "14:00" },
    dom: { activo: false, entrada: "09:00", salida: "14:00" },
  };
}

function formVacio() {
  return {
    nombre: "",
    telefono: "",
    rol: "",
    especialidades: [],
    notas: "",
    activo: true,
    horario: horarioDefault(),
  };
}

const form = reactive(formVacio());

// ── Helpers ───────────────────────────────────────────────────────
function colorAvatar(nombre = "") {
  return COLORES[nombre.charCodeAt(0) % COLORES.length];
}

function iniciales(nombre = "") {
  return nombre.trim().split(/\s+/).slice(0, 2).map((n) => n[0]?.toUpperCase() || "").join("");
}

function rolLabel(rol) {
  return { nail_artist: "Nail Artist", recepcionista: "Recepcionista", admin: "Admin" }[rol] || rol;
}

function countRol(rol) {
  return empleados.value.filter((e) => e.rol === rol && e.activo).length;
}

// ── Computed ──────────────────────────────────────────────────────
const empleadosFiltrados = computed(() =>
  empleados.value.filter((e) => {
    const okBusqueda = e.nombre.toLowerCase().includes(busqueda.value.toLowerCase());
    const okRol = !filtroRol.value || e.rol === filtroRol.value;
    return okBusqueda && okRol;
  })
);

// ── Acciones de formulario ────────────────────────────────────────
function toggleEsp(esp) {
  const idx = form.especialidades.indexOf(esp);
  if (idx >= 0) form.especialidades.splice(idx, 1);
  else form.especialidades.push(esp);
}

function toggleDia(key) {
  form.horario[key].activo = !form.horario[key].activo;
}

function validar() {
  let ok = true;
  if (!form.nombre.trim()) { errores.nombre = "El nombre es obligatorio"; ok = false; }
  if (!form.rol) { errores.rol = "Selecciona un rol"; ok = false; }
  return ok;
}

// ── Navegación de vistas ──────────────────────────────────────────
function abrirNuevo() {
  editandoId.value = null;
  errorGuardar.value = "";
  errores.nombre = "";
  errores.rol = "";
  Object.assign(form, formVacio());
  vista.value = "formulario";
}

function abrirEditar(emp) {
  editandoId.value = emp.id;
  errorGuardar.value = "";
  errores.nombre = "";
  errores.rol = "";
  Object.assign(form, {
    nombre: emp.nombre || "",
    telefono: emp.telefono || "",
    rol: emp.rol || "",
    especialidades: [...(emp.especialidades || [])],
    notas: emp.notas || "",
    activo: emp.activo ?? true,
    horario: emp.horario
      ? JSON.parse(JSON.stringify(emp.horario))
      : horarioDefault(),
  });
  vista.value = "formulario";
}

function abrirPerfil(emp) {
  empleadoActual.value = emp;
  vista.value = "perfil";
}

function cancelarFormulario() {
  vista.value = editandoId.value ? "perfil" : "lista";
}

// ── CRUD ──────────────────────────────────────────────────────────
async function cargarEmpleados() {
  cargando.value = true;
  try {
    empleados.value = await obtenerEmpleados();
  } catch (e) {
    console.error(e);
  } finally {
    cargando.value = false;
  }
}

async function guardar() {
  if (!validar()) return;
  guardando.value = true;
  errorGuardar.value = "";
  const datos = {
    nombre: form.nombre.trim(),
    telefono: form.telefono.trim(),
    rol: form.rol,
    especialidades: [...form.especialidades],
    notas: form.notas.trim(),
    activo: form.activo,
    horario: JSON.parse(JSON.stringify(form.horario)),
  };
  try {
    if (editandoId.value) {
      await actualizarEmpleado(editandoId.value, datos);
      const idx = empleados.value.findIndex((e) => e.id === editandoId.value);
      if (idx >= 0) empleados.value[idx] = { id: editandoId.value, ...datos };
      empleadoActual.value = { id: editandoId.value, ...datos };
      vista.value = "perfil";
    } else {
      const nuevo = await crearEmpleado(datos);
      empleados.value.push(nuevo);
      vista.value = "lista";
    }
  } catch (e) {
    errorGuardar.value = "No se pudo guardar. Verifica permisos de Firestore.";
    console.error(e);
  } finally {
    guardando.value = false;
  }
}

async function toggleActivo(emp) {
  const nuevoEstado = !emp.activo;
  await actualizarEmpleado(emp.id, { activo: nuevoEstado });
  emp.activo = nuevoEstado;
}

function confirmarEliminar(emp) {
  empleadoAEliminar.value = emp;
}

async function ejecutarEliminar() {
  try {
    await eliminarEmpleado(empleadoAEliminar.value.id);
    empleados.value = empleados.value.filter((e) => e.id !== empleadoAEliminar.value.id);
    empleadoAEliminar.value = null;
    if (vista.value === "perfil") vista.value = "lista";
  } catch (e) {
    console.error(e);
  }
}

onMounted(cargarEmpleados);
</script>

<style scoped>
.empleados { color: #fff; max-width: 1000px; }

/* Cabecera */
.cabecera { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem; gap: 1rem; flex-wrap: wrap; }
.cabecera h2 { margin: 0; font-family: 'Syne', sans-serif; font-size: 1.6rem; }
.cabecera p { margin: 0.35rem 0 0; color: rgba(255,255,255,0.55); font-size: 0.9rem; }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.75rem; margin-bottom: 1.25rem; }
.stat { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 0.875rem 1rem; }
.stat-val { display: block; font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 700; color: #f9a8d4; }
.stat-val.dim { color: rgba(255,255,255,0.25); }
.stat-lbl { font-size: 0.72rem; color: rgba(255,255,255,0.45); }

/* Filtros */
.filtros { display: flex; gap: 0.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
.buscador { flex: 1; min-width: 180px; background: rgba(0,0,0,0.28); border: 1px solid rgba(255,255,255,0.2); border-radius: 9px; padding: 0.55rem 0.8rem; color: #fff; font-size: 0.875rem; outline: none; }
.buscador::placeholder { color: rgba(255,255,255,0.35); }
.select-filtro { background: rgba(0,0,0,0.28); border: 1px solid rgba(255,255,255,0.2); border-radius: 9px; padding: 0.55rem 0.8rem; color: #fff; font-size: 0.875rem; outline: none; }
.select-filtro option { background: #1a1a1a; }

/* Estado */
.estado { color: rgba(255,255,255,0.55); margin: 0.5rem 0; }

/* Lista */
.lista { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 0.7rem; }
.item { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 14px; padding: 1rem; display: flex; align-items: center; gap: 1rem; transition: border-color 0.2s; }
.item:hover { border-color: rgba(249,168,212,0.25); }
.item.inactivo { opacity: 0.45; }

.item-avatar { width: 44px; height: 44px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 0.85rem; color: #1a1200; flex-shrink: 0; }
.item-info { flex: 1; min-width: 0; }
.item-info h4 { margin: 0 0 4px; font-size: 0.95rem; font-weight: 600; }
.item-meta { display: flex; align-items: center; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 0.4rem; }
.meta-tel { font-size: 0.78rem; color: rgba(255,255,255,0.45); }
.chips-row { display: flex; flex-wrap: wrap; gap: 0.35rem; }

.chip { font-size: 0.7rem; padding: 2px 9px; border-radius: 20px; }
.chip.nail_artist { background: rgba(249,168,212,0.15); color: #f9a8d4; border: 1px solid rgba(249,168,212,0.25); }
.chip.recepcionista { background: rgba(100,160,220,0.15); color: #90c0f0; border: 1px solid rgba(100,160,220,0.2); }
.chip.admin { background: rgba(180,120,240,0.15); color: #c090f0; border: 1px solid rgba(180,120,240,0.2); }
.chip-esp { font-size: 0.68rem; padding: 2px 8px; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: rgba(255,255,255,0.55); }

.item-acciones { display: flex; align-items: center; gap: 0.5rem; flex-shrink: 0; }

/* Toggle */
.toggle { width: 36px; height: 20px; border-radius: 10px; background: rgba(255,255,255,0.1); border: none; cursor: pointer; position: relative; padding: 0; transition: background 0.2s; flex-shrink: 0; }
.toggle.activo { background: rgba(249,168,212,0.35); }
.toggle-dot { position: absolute; top: 3px; left: 3px; width: 14px; height: 14px; border-radius: 50%; background: rgba(255,255,255,0.4); transition: transform 0.2s, background 0.2s; }
.toggle.activo .toggle-dot { transform: translateX(16px); background: #f9a8d4; }

/* Botones */
.btn { border: 0; border-radius: 9px; padding: 0.55rem 0.9rem; cursor: pointer; font-weight: 600; font-size: 0.875rem; }
.btn.principal { background: linear-gradient(135deg, #ec64b0, #d946ef); color: #fff; }
.btn.principal:hover:not(:disabled) { opacity: 0.9; }
.btn.principal:disabled { opacity: 0.55; cursor: not-allowed; }
.btn.secundario { background: rgba(255,255,255,0.1); color: #fff; }
.btn.secundario:hover { background: rgba(255,255,255,0.15); }
.btn.peligro { background: rgba(255,105,105,0.2); color: #ffb2b2; border: none; }
.btn.peligro:hover { background: rgba(255,105,105,0.3); }
.btn.pequeno { background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.75); padding: 0.4rem 0.7rem; font-size: 0.78rem; border: none; }
.btn.pequeno:hover { background: rgba(255,255,255,0.13); }
.btn.pequeno.peligro { background: rgba(255,105,105,0.12); color: #ffb2b2; }
.btn.pequeno.peligro:hover { background: rgba(255,105,105,0.22); }

/* Sub-vista header */
.subvista-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; }
.subvista-header h3 { margin: 0; font-family: 'Syne', sans-serif; font-size: 1.2rem; }
.btn-back { background: none; border: none; color: rgba(255,255,255,0.5); font-size: 0.875rem; cursor: pointer; padding: 0; }
.btn-back:hover { color: #fff; }

/* Perfil */
.perfil-layout { display: grid; grid-template-columns: 220px 1fr; gap: 1.5rem; align-items: start; }
.perfil-lado { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 1.5rem; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; text-align: center; }
.perfil-avatar { width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 1.3rem; color: #1a1200; }
.perfil-lado h3 { margin: 0; font-family: 'Syne', sans-serif; font-size: 1.1rem; }
.status-pill { font-size: 0.75rem; padding: 3px 12px; border-radius: 20px; }
.status-pill.activo { background: rgba(80,200,100,0.1); color: #60d080; border: 1px solid rgba(80,200,100,0.2); }
.status-pill.inactivo { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.1); }
.perfil-tel { font-size: 0.82rem; color: rgba(255,255,255,0.45); margin: 0; }
.perfil-section { width: 100%; text-align: left; }
.section-lbl { font-size: 0.7rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 0.4rem; }
.notas-txt { font-size: 0.8rem; color: rgba(255,255,255,0.4); line-height: 1.6; margin: 0; }

.perfil-main { display: flex; flex-direction: column; gap: 1rem; }
.panel { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 1.25rem; }
.panel h4 { margin: 0 0 1rem; font-family: 'Syne', sans-serif; font-size: 0.95rem; }

.horario-lista { display: flex; flex-direction: column; gap: 0.4rem; }
.horario-fila { display: flex; align-items: center; gap: 1rem; padding: 7px 10px; border-radius: 8px; background: rgba(255,255,255,0.03); }
.horario-fila.libre { opacity: 0.35; }
.dia-nombre { font-size: 0.82rem; font-weight: 500; width: 85px; color: rgba(255,255,255,0.6); }
.dia-horas { font-size: 0.85rem; color: #f9a8d4; font-weight: 500; }
.dia-libre { font-size: 0.78rem; color: rgba(255,255,255,0.25); }

/* Formulario */
.grid-form { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 1.5rem; margin-bottom: 1rem; }
.formulario-col, .horario-col { display: flex; flex-direction: column; gap: 1rem; }
.campo-grupo { display: flex; flex-direction: column; gap: 0.4rem; }
.campo-fila { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.campo-grupo label { font-size: 0.8rem; font-weight: 500; color: rgba(255,255,255,0.5); }

input[type="text"], input[type="tel"], select, textarea {
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 9px;
  padding: 0.6rem 0.75rem;
  background: rgba(0,0,0,0.28);
  color: #fff;
  font-size: 0.875rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  box-sizing: border-box;
}
input:focus, select:focus, textarea:focus { border-color: rgba(249,168,212,0.45); }
input.error, select.error { border-color: rgba(255,100,100,0.5); }
select option { background: #1a1a1a; }
textarea { resize: vertical; }

.campo-error { font-size: 0.75rem; color: #ff9696; }

.activo-row { flex-direction: row; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 9px; padding: 0.6rem 0.8rem; font-size: 0.875rem; }

.esp-selector { display: flex; flex-wrap: wrap; gap: 0.45rem; }
.esp-opcion { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: rgba(255,255,255,0.5); font-size: 0.78rem; padding: 4px 11px; cursor: pointer; transition: all 0.15s; }
.esp-opcion:hover { border-color: rgba(249,168,212,0.3); color: rgba(255,255,255,0.8); }
.esp-opcion.seleccionada { background: rgba(249,168,212,0.12); border-color: rgba(249,168,212,0.4); color: #f9a8d4; }

.horario-editor { display: flex; flex-direction: column; gap: 0.5rem; }
.horario-fila-edit { display: flex; align-items: center; gap: 0.6rem; }
.dia-btn { width: 38px; font-size: 0.72rem; font-weight: 600; padding: 5px 0; border-radius: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.3); cursor: pointer; text-align: center; transition: all 0.15s; }
.dia-btn.activo { background: rgba(249,168,212,0.12); border-color: rgba(249,168,212,0.3); color: #f9a8d4; }
.time-in { width: 88px !important; font-size: 0.78rem !important; padding: 4px 8px !important; }
.sep { color: rgba(255,255,255,0.3); font-size: 0.8rem; }
.libre-txt { font-size: 0.75rem; color: rgba(255,255,255,0.2); }

.form-acciones { display: flex; justify-content: flex-end; gap: 0.75rem; padding-top: 0.25rem; }

.mensaje.error { color: #ff9696; font-size: 0.875rem; margin: 0.5rem 0 0; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 100; backdrop-filter: blur(4px); }
.modal { background: #1c1c1c; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; padding: 2rem; width: 360px; max-width: 90vw; }
.modal h3 { font-family: 'Syne', sans-serif; font-size: 1.1rem; margin: 0 0 0.75rem; }
.modal p { font-size: 0.875rem; color: rgba(255,255,255,0.55); margin: 0 0 1.5rem; line-height: 1.6; }
.modal p strong { color: #fff; }
.modal-acciones { display: flex; justify-content: flex-end; gap: 0.75rem; }

@media (max-width: 680px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .grid-form { grid-template-columns: 1fr; }
  .perfil-layout { grid-template-columns: 1fr; }
  .item-acciones { flex-wrap: wrap; justify-content: flex-end; }
}
</style>