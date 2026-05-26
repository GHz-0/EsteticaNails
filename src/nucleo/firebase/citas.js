import { getFirebaseDb, getFirebaseAuth } from "./client.js";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const db = getFirebaseDb();
const auth = getFirebaseAuth();

/**
 * Obtiene todas las citas del usuario actual
 */
export async function obtenerMisCitas() {
  try {
    const usuario = auth.currentUser;
    if (!usuario) return [];

    const citasRef = collection(db, "citas");
    const q = query(citasRef, where("usuarioId", "==", usuario.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate?.() || doc.data().fecha,
    }));
  } catch (error) {
    console.error("Error obteniendo mis citas:", error);
    return [];
  }
}

/**
 * Obtiene todas las citas (solo admin/empleado)
 */
export async function obtenerTodasLasCitas() {
  try {
    const citasRef = collection(db, "citas");
    const snapshot = await getDocs(citasRef);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate?.() || doc.data().fecha,
    }));
  } catch (error) {
    console.error("Error obteniendo citas:", error);
    return [];
  }
}

/**
 * Obtiene citas por empleado
 */
export async function obtenerCitasPorEmpleado(empleadoId) {
  try {
    const citasRef = collection(db, "citas");
    const q = query(citasRef, where("empleadoId", "==", empleadoId));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().fecha?.toDate?.() || doc.data().fecha,
    }));
  } catch (error) {
    console.error("Error obteniendo citas por empleado:", error);
    return [];
  }
}

import { crearNotificacion } from "./pagos.js";
import { increment } from "firebase/firestore";

/**
 * Crea una nueva cita
 */
export async function crearCita(datos) {
  try {
    const usuario = auth.currentUser;
    if (!usuario) throw new Error("Usuario no autenticado");

    const estadoPago = datos.metodoPago === "online" ? "completado" : "pendiente";
    const precio = Number(datos.precio || 0);
    const puntos = Number(datos.puntos || 0);

    const citasRef = collection(db, "citas");
    const docRef = await addDoc(citasRef, {
      ...datos,
      usuarioId: usuario.uid,
      estado: "pendiente",
      estadoPago,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Registrar saldo pendiente, puntos e invocar notificaciones según el método de pago
    const userRef = doc(db, "users", usuario.uid);
    if (datos.metodoPago === "fisico") {
      await updateDoc(userRef, {
        montoPendiente: increment(precio),
        score: increment(puntos),
      });

      await crearNotificacion(
        usuario.uid,
        "Cobro pendiente de cita",
        `Has reservado tu cita para ${datos.hora || "el horario seleccionado"}. Al elegir pago físico en sucursal, se ha sumado $${precio.toLocaleString("es-MX")} a tu saldo pendiente. Ganaste +${puntos} puntos por agendar.`,
        "pago"
      );
    } else {
      await updateDoc(userRef, {
        score: increment(puntos),
      });

      await crearNotificacion(
        usuario.uid,
        "Cita pagada y agendada",
        `Confirmamos tu cita para las ${datos.hora || "el horario seleccionado"} con pago en línea procesado exitosamente por $${precio.toLocaleString("es-MX")}. Ganaste +${puntos} puntos por agendar.`,
        "general"
      );
    }

    return {
      id: docRef.id,
      ...datos,
      usuarioId: usuario.uid,
      estado: "pendiente",
      estadoPago,
    };
  } catch (error) {
    console.error("Error creando cita:", error);
    throw error;
  }
}

/**
 * Actualiza una cita
 */
export async function actualizarCita(citaId, datos) {
  try {
    const citaRef = doc(db, "citas", citaId);
    await updateDoc(citaRef, {
      ...datos,
      updatedAt: serverTimestamp(),
    });
    return { id: citaId, ...datos };
  } catch (error) {
    console.error("Error actualizando cita:", error);
    throw error;
  }
}

/**
 * Cambia el estado de una cita
 */
export async function cambiarEstadoCita(citaId, estado) {
  try {
    return await actualizarCita(citaId, { estado });
  } catch (error) {
    console.error("Error cambiando estado de cita:", error);
    throw error;
  }
}

/**
 * Cancela una cita
 */
export async function cancelarCita(citaId, razon = "") {
  try {
    const citaRef = doc(db, "citas", citaId);
    await updateDoc(citaRef, {
      estado: "cancelada",
      razonCancelacion: razon,
      updatedAt: serverTimestamp(),
    });
    return true;
  } catch (error) {
    console.error("Error cancelando cita:", error);
    throw error;
  }
}

/**
 * Elimina una cita
 */
export async function eliminarCita(citaId) {
  try {
    const citaRef = doc(db, "citas", citaId);
    await deleteDoc(citaRef);
    return true;
  } catch (error) {
    console.error("Error eliminando cita:", error);
    throw error;
  }
}

/**
 * Inicializa citas de prueba en Firestore
 */
export async function inicializarCitas() {
  try {
    const citasRef = collection(db, "citas");
    const snapshot = await getDocs(citasRef);

    // Si ya existen citas, no hacer nada
    if (snapshot.docs.length > 0) {
      console.log("Citas ya existen en Firestore");
      return;
    }

    console.log(
      "No se inicializan citas de prueba (deben crearse dinámicamente)",
    );
  } catch (error) {
    console.error("Error inicializando citas:", error);
  }
}
