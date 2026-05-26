import { getFirebaseDb, getFirebaseAuth } from "./client.js";
import { reducirCantidad } from "./inventario.js";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  serverTimestamp,
  increment,
} from "firebase/firestore";

const db = getFirebaseDb();
const auth = getFirebaseAuth();

/**
 * Obtiene las notificaciones del usuario actual
 */
export async function obtenerNotificaciones() {
  try {
    const usuario = auth.currentUser;
    if (!usuario) return [];

    const notifRef = collection(db, "notificaciones");
    const q = query(notifRef, where("usuarioId", "==", usuario.uid));
    const snapshot = await getDocs(q);

    const items = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      fecha: doc.data().createdAt?.toDate?.() || doc.data().createdAt || new Date(),
    }));

    // Ordenar por fecha descendente
    return items.sort((a, b) => b.fecha - a.fecha);
  } catch (error) {
    console.error("Error obteniendo notificaciones:", error);
    return [];
  }
}

/**
 * Crea una nueva notificación en Firestore
 */
export async function crearNotificacion(usuarioId, titulo, mensaje, tipo = "general") {
  try {
    const notifRef = collection(db, "notificaciones");
    await addDoc(notifRef, {
      usuarioId,
      titulo,
      mensaje,
      tipo,
      leida: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creando notificación:", error);
  }
}

/**
 * Marca una notificación como leída
 */
export async function marcarNotificacionLeida(notifId) {
  try {
    const notifRef = doc(db, "notificaciones", notifId);
    await updateDoc(notifRef, { leida: true });
    return true;
  } catch (error) {
    console.error("Error marcando notificación como leída:", error);
    return false;
  }
}

/**
 * Obtiene el saldo pendiente actual del usuario desde Firestore
 */
export async function obtenerSaldoUsuario() {
  try {
    const usuario = auth.currentUser;
    if (!usuario) return 0;

    const userRef = doc(db, "users", usuario.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return 0;

    return Number(snap.data().montoPendiente || 0);
  } catch (error) {
    console.error("Error obteniendo saldo de usuario:", error);
    return 0;
  }
}

/**
 * Realiza la compra de productos sueltos
 */
export async function realizarCompra({ productos, metodoPago, direccionEnvio }) {
  try {
    const usuario = auth.currentUser;
    if (!usuario) throw new Error("Usuario no autenticado");

    // Calcular el monto total de la compra
    const total = productos.reduce((acc, p) => acc + p.precioVenta * p.cantidad, 0);

    // 1. Reducir stock del inventario
    for (const p of productos) {
      await reducirCantidad(p.id, p.cantidad);
    }

    // 2. Registrar la compra/pedido
    const comprasRef = collection(db, "compras");
    const compraDoc = await addDoc(comprasRef, {
      usuarioId: usuario.uid,
      productos: productos.map((p) => ({
        productoId: p.id,
        nombre: p.nombre,
        cantidad: p.cantidad,
        precioVenta: p.precioVenta,
      })),
      total,
      metodoPago,
      estadoPago: metodoPago === "online" ? "completado" : "pendiente",
      direccionEnvio,
      createdAt: serverTimestamp(),
    });

    // 3. Si el método de pago es físico (efectivo al recibir), sumamos al saldo pendiente del perfil
    if (metodoPago === "fisico") {
      const userRef = doc(db, "users", usuario.uid);
      await updateDoc(userRef, {
        montoPendiente: increment(total),
      });

      // Crear notificación de adeudo
      await crearNotificacion(
        usuario.uid,
        "Cobro pendiente de compra",
        `Has comprado productos por un total de $${total.toLocaleString("es-MX")}. Se enviarán a tu hogar y el monto se registrará como saldo pendiente en tu cuenta.`,
        "pago"
      );
    } else {
      // Crear notificación de pago exitoso
      await crearNotificacion(
        usuario.uid,
        "Compra pagada con éxito",
        `Tu pago de $${total.toLocaleString("es-MX")} se procesó correctamente. Tus productos serán enviados pronto. ¡Gracias por comprar!`,
        "general"
      );
    }

    return { id: compraDoc.id, total };
  } catch (error) {
    console.error("Error realizando la compra:", error);
    throw error;
  }
}

/**
 * Simula el pago del saldo pendiente con tarjeta de crédito/débito
 */
export async function pagarSaldo(monto) {
  try {
    const usuario = auth.currentUser;
    if (!usuario) throw new Error("Usuario no autenticado");

    const userRef = doc(db, "users", usuario.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) throw new Error("Perfil de usuario no encontrado");

    const saldoActual = Number(snap.data().montoPendiente || 0);
    const nuevoSaldo = Math.max(0, saldoActual - monto);

    // Actualizar el saldo en Firestore
    await updateDoc(userRef, {
      montoPendiente: nuevoSaldo,
    });

    // Crear notificación de abono registrado
    await crearNotificacion(
      usuario.uid,
      "Pago de saldo registrado",
      `Hemos procesado tu abono de $${monto.toLocaleString("es-MX")} con tarjeta. Tu nuevo saldo pendiente es de $${nuevoSaldo.toLocaleString("es-MX")}.`,
      "general"
    );

    return nuevoSaldo;
  } catch (error) {
    console.error("Error al pagar saldo:", error);
    throw error;
  }
}
