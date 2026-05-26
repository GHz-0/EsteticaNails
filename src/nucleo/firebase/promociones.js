import { getFirebaseDb } from "@/nucleo/firebase/client";
import { getFirebaseStorage } from "@/nucleo/firebase/client";
import {
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const COLECCION = "promociones";

/**
 * Obtiene todas las promociones (para admin).
 * Ordenadas por fecha de creación descendente.
 */
export async function obtenerPromociones() {
  const db = getFirebaseDb();
  const q = query(
    collection(db, COLECCION),
    orderBy("creadaEn", "desc"),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({
    id: d.id,
    ...d.data(),
    fechaInicio: d.data().fechaInicio?.toDate?.() || null,
    fechaFin: d.data().fechaFin?.toDate?.() || null,
    creadaEn: d.data().creadaEn?.toDate?.() || null,
  }));
}

/**
 * Obtiene solo promociones activas y no expiradas.
 * Para uso público (landing, dashboard usuario).
 */
export async function obtenerPromocionesActivas() {
  const db = getFirebaseDb();
  const q = query(
    collection(db, COLECCION),
    where("activa", "==", true),
    orderBy("creadaEn", "desc"),
  );
  const snap = await getDocs(q);
  const ahora = new Date();

  return snap.docs
    .map((d) => ({
      id: d.id,
      ...d.data(),
      fechaInicio: d.data().fechaInicio?.toDate?.() || null,
      fechaFin: d.data().fechaFin?.toDate?.() || null,
      creadaEn: d.data().creadaEn?.toDate?.() || null,
    }))
    .filter((promo) => {
      // Si tiene fecha de fin, verificar que no haya expirado
      if (promo.fechaFin && promo.fechaFin < ahora) return false;
      return true;
    });
}

/**
 * Crea una nueva promoción en Firestore.
 */
export async function crearPromocion(data) {
  const db = getFirebaseDb();
  const payload = {
    titulo: data.titulo || "",
    descripcion: data.descripcion || "",
    precioAntes: Number(data.precioAntes || 0),
    precioAhora: Number(data.precioAhora || 0),
    categoria: data.categoria || "general",
    destacada: Boolean(data.destacada),
    activa: data.activa !== undefined ? Boolean(data.activa) : true,
    fechaInicio: data.fechaInicio
      ? Timestamp.fromDate(new Date(data.fechaInicio))
      : Timestamp.now(),
    fechaFin: data.fechaFin
      ? Timestamp.fromDate(new Date(data.fechaFin))
      : null,
    imagenUrl: data.imagenUrl || "",
    imagenPath: data.imagenPath || "",
    creadaEn: Timestamp.now(),
  };

  const docRef = await addDoc(collection(db, COLECCION), payload);
  return { id: docRef.id, ...payload };
}

/**
 * Actualiza una promoción existente.
 */
export async function actualizarPromocion(id, data) {
  const db = getFirebaseDb();
  const ref = doc(db, COLECCION, id);

  const payload = { ...data };

  // Convertir fechas a Timestamp si vienen como string/Date
  if (payload.fechaInicio && !(payload.fechaInicio instanceof Timestamp)) {
    payload.fechaInicio = Timestamp.fromDate(new Date(payload.fechaInicio));
  }
  if (payload.fechaFin === null || payload.fechaFin === "") {
    payload.fechaFin = null;
  } else if (payload.fechaFin && !(payload.fechaFin instanceof Timestamp)) {
    payload.fechaFin = Timestamp.fromDate(new Date(payload.fechaFin));
  }

  await updateDoc(ref, payload);
}

/**
 * Elimina una promoción.
 */
export async function eliminarPromocion(id) {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, COLECCION, id));
}

/**
 * Sube una imagen de promoción a Firebase Storage.
 * @returns {{ imagenUrl: string, imagenPath: string }}
 */
export async function subirImagenPromocion(promoId, archivo) {
  if (!archivo) throw new Error("No se proporcionó archivo.");

  if (!archivo.type?.startsWith("image/")) {
    const err = new Error("El archivo debe ser una imagen.");
    err.code = "INVALID_IMAGE_TYPE";
    throw err;
  }

  if (archivo.size > 5 * 1024 * 1024) {
    const err = new Error("La imagen no debe superar 5MB.");
    err.code = "IMAGE_TOO_LARGE";
    throw err;
  }

  const storage = getFirebaseStorage();
  const extension = archivo.name.split(".").pop() || "jpg";
  const path = `promociones/${promoId}/${Date.now()}.${extension}`;
  const ref = storageRef(storage, path);

  await uploadBytes(ref, archivo);
  const url = await getDownloadURL(ref);

  return { imagenUrl: url, imagenPath: path };
}

/**
 * Elimina una imagen de promoción de Firebase Storage.
 */
export async function eliminarImagenPromocion(path) {
  if (!path) return;
  try {
    const storage = getFirebaseStorage();
    const ref = storageRef(storage, path);
    await deleteObject(ref);
  } catch (e) {
    // Si la imagen no existe, no lanzar error
    if (e?.code !== "storage/object-not-found") {
      console.warn("Error eliminando imagen de promoción:", e);
    }
  }
}
