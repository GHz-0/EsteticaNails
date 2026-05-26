import { defineStore } from "pinia";
import { ref, computed } from "vue";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/nucleo/firebase/client";

export const ROLES = {
  USUARIO: "usuario",
  EMPLEADO: "empleado",
  ADMIN: "admin",
};

function iniciales(nombre = "") {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

function mapFirebaseError(err) {
  const code = err?.code || "";
  const mensajes = {
    "auth/invalid-credential": "Credenciales incorrectas.",
    "auth/user-not-found": "La cuenta no existe.",
    "auth/wrong-password": "La contraseña es incorrecta.",
    "auth/invalid-email": "Correo electrónico inválido.",
    "auth/email-already-in-use": "Ese correo ya está registrado.",
    "auth/weak-password": "La contraseña debe tener al menos 6 caracteres.",
    "auth/too-many-requests": "Demasiados intentos. Intenta más tarde.",
    "auth/network-request-failed": "Error de red. Revisa tu conexión.",
  };
  return mensajes[code] || err?.message || "Ocurrió un error al autenticar.";
}

function normalizarEmail(email = "") {
  return String(email).trim().toLowerCase();
}

function esCorreoAdmin(email = "") {
  const lista = String(import.meta.env.VITE_ADMIN_EMAILS || "")
    .split(",")
    .map((item) => normalizarEmail(item))
    .filter(Boolean);
  return lista.includes(normalizarEmail(email));
}

export const useAuthStore = defineStore("auth", () => {
  const usuario = ref(JSON.parse(localStorage.getItem("usuario") || "null"));
  const token = ref(localStorage.getItem("token") || null);
  const cargando = ref(false);
  const error = ref(null);
  const authInicializado = ref(false);

  const estaAutenticado = computed(() => !!token.value && !!usuario.value);
  const rol = computed(() => usuario.value?.rol || null);
  const esUsuario = computed(() => rol.value === "usuario");
  const esEmpleado = computed(() => rol.value === "empleado");
  const esAdmin = computed(() => rol.value === "admin");

  function tieneRol(...roles) {
    return roles.includes(rol.value);
  }

  function persistirSesion() {
    if (usuario.value && token.value) {
      localStorage.setItem("usuario", JSON.stringify(usuario.value));
      localStorage.setItem("token", token.value);
      return;
    }
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }

  async function obtenerPerfilDesdeFirestore(firebaseUser) {
    const db = getFirebaseDb();
    const ref = doc(db, "users", firebaseUser.uid);
    const snap = await getDoc(ref);
    const rolInicial = esCorreoAdmin(firebaseUser.email)
      ? ROLES.ADMIN
      : ROLES.USUARIO;

    const nombreBase =
      firebaseUser.displayName ||
      firebaseUser.email?.split("@")[0] ||
      "Usuario";
    const perfilDefault = {
      uid: firebaseUser.uid,
      nombre: nombreBase,
      email: firebaseUser.email,
      rol: rolInicial,
      avatar: iniciales(nombreBase),
      estado: "activo",
    };

    if (!snap.exists()) {
      await setDoc(ref, {
        ...perfilDefault,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return perfilDefault;
    }

    const data = snap.data();
    let perfil = {
      uid: firebaseUser.uid,
      nombre: data.nombre || nombreBase,
      email: data.email || firebaseUser.email,
      rol: data.rol || ROLES.USUARIO,
      avatar: data.avatar || iniciales(data.nombre || nombreBase),
      estado: data.estado || "activo",
      telefono: data.telefono || "",
      direccionEnvio: data.direccionEnvio || "",
      tarjetas: data.tarjetas || [],
      montoPendiente: data.montoPendiente || 0,
    };

    // Bootstrap opcional: si el correo está en VITE_ADMIN_EMAILS, se promueve a admin.
    if (esCorreoAdmin(perfil.email) && perfil.rol !== ROLES.ADMIN) {
      await updateDoc(ref, {
        rol: ROLES.ADMIN,
        updatedAt: serverTimestamp(),
      });
      perfil = { ...perfil, rol: ROLES.ADMIN };
    }

    return perfil;
  }

  async function login(email, password) {
    cargando.value = true;
    error.value = null;
    try {
      const auth = getFirebaseAuth();
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await cred.user.getIdToken();
      const perfil = await obtenerPerfilDesdeFirestore(cred.user);

      usuario.value = {
        id: perfil.uid,
        nombre: perfil.nombre,
        email: perfil.email,
        rol: perfil.rol,
        avatar: perfil.avatar,
        telefono: perfil.telefono,
        direccionEnvio: perfil.direccionEnvio,
        tarjetas: perfil.tarjetas,
        montoPendiente: perfil.montoPendiente,
      };
      token.value = idToken;
      persistirSesion();
      return { ok: true, rol: perfil.rol };
    } catch (err) {
      const mensaje = mapFirebaseError(err);
      error.value = mensaje;
      return { ok: false, mensaje };
    } finally {
      cargando.value = false;
    }
  }

  async function registrar({ nombre, email, password }) {
    cargando.value = true;
    error.value = null;
    try {
      const auth = getFirebaseAuth();
      const db = getFirebaseDb();

      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: nombre });

      const perfil = {
        uid: cred.user.uid,
        nombre,
        email,
        rol: esCorreoAdmin(email) ? ROLES.ADMIN : ROLES.USUARIO,
        avatar: iniciales(nombre),
        estado: "activo",
        telefono: "",
        direccionEnvio: "",
        tarjetas: [],
        montoPendiente: 0,
      };

      await setDoc(doc(db, "users", cred.user.uid), {
        ...perfil,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      const idToken = await cred.user.getIdToken();
      usuario.value = {
        id: perfil.uid,
        nombre: perfil.nombre,
        email: perfil.email,
        rol: perfil.rol,
        avatar: perfil.avatar,
        telefono: perfil.telefono,
        direccionEnvio: perfil.direccionEnvio,
        tarjetas: perfil.tarjetas,
        montoPendiente: perfil.montoPendiente,
      };
      token.value = idToken;
      persistirSesion();
      return { ok: true, rol: perfil.rol };
    } catch (err) {
      const mensaje = mapFirebaseError(err);
      error.value = mensaje;
      return { ok: false, mensaje };
    } finally {
      cargando.value = false;
    }
  }

  async function logout() {
    try {
      const auth = getFirebaseAuth();
      await signOut(auth);
    } catch {
      // Si falla signOut remoto, limpiamos estado local de todos modos.
    } finally {
      usuario.value = null;
      token.value = null;
      error.value = null;
      persistirSesion();
    }
  }

  function inicializarAuth() {
    if (authInicializado.value) return;
    authInicializado.value = true;

    try {
      const auth = getFirebaseAuth();
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (!firebaseUser) {
          usuario.value = null;
          token.value = null;
          persistirSesion();
          return;
        }

        const idToken = await firebaseUser.getIdToken();
        const perfil = await obtenerPerfilDesdeFirestore(firebaseUser);
        usuario.value = {
          id: perfil.uid,
          nombre: perfil.nombre,
          email: perfil.email,
          rol: perfil.rol,
          avatar: perfil.avatar,
          telefono: perfil.telefono,
          direccionEnvio: perfil.direccionEnvio,
          tarjetas: perfil.tarjetas,
          montoPendiente: perfil.montoPendiente,
        };
        token.value = idToken;
        persistirSesion();
      });
    } catch {
      // Si Firebase no está configurado aún, mantenemos el estado local actual.
    }
  }

  async function actualizarPerfil(datos) {
    cargando.value = true;
    error.value = null;
    try {
      const db = getFirebaseDb();
      const userRef = doc(db, "users", usuario.value.id);
      
      await updateDoc(userRef, {
        ...datos,
        updatedAt: serverTimestamp(),
      });

      // Actualizar el estado local en Pinia
      usuario.value = {
        ...usuario.value,
        ...datos,
      };
      persistirSesion();
      return { ok: true };
    } catch (err) {
      console.error("Error actualizando perfil:", err);
      error.value = err.message;
      return { ok: false, mensaje: err.message };
    } finally {
      cargando.value = false;
    }
  }

  function limpiarError() {
    error.value = null;
  }

  return {
    usuario,
    token,
    cargando,
    error,
    estaAutenticado,
    rol,
    esUsuario,
    esEmpleado,
    esAdmin,
    tieneRol,
    login,
    registrar,
    logout,
    inicializarAuth,
    actualizarPerfil,
    limpiarError,
  };
});
