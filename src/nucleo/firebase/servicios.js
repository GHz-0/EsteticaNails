import { getFirebaseDb, getFirebaseStorage } from "./client.js";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref as storageRef,
  uploadBytes,
} from "firebase/storage";

const db = getFirebaseDb();
const storage = getFirebaseStorage();

function normalizarTexto(texto = "") {
  return texto
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function claveServicio(nombre, categoria) {
  return `${normalizarTexto(categoria)}::${normalizarTexto(nombre)}`;
}

function obtenerTimestampMs(servicio) {
  const updated = servicio?.updatedAt;
  const created = servicio?.createdAt;
  if (updated?.toMillis) return updated.toMillis();
  if (created?.toMillis) return created.toMillis();
  return 0;
}

function extensionArchivo(nombre = "", tipo = "") {
  const extensionNombre = nombre.split(".").pop()?.toLowerCase();
  if (extensionNombre && extensionNombre !== nombre) return extensionNombre;
  const extensionTipo = tipo.split("/").pop()?.toLowerCase();
  return extensionTipo || "jpg";
}

function validarImagenServicio(archivo) {
  if (!archivo) return;
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
}

function conTimeoutUpload(promesa, ms = 45000) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      const err = new Error("La subida de la imagen tardo demasiado.");
      err.code = "STORAGE_UPLOAD_TIMEOUT";
      reject(err);
    }, ms);
  });

  return Promise.race([promesa, timeout]).finally(() => clearTimeout(timeoutId));
}

export async function existeServicioDuplicado(
  nombre,
  categoria,
  excludeId = null,
) {
  const serviciosRef = collection(db, "servicios");
  const snapshot = await getDocs(serviciosRef);
  const claveBuscada = claveServicio(nombre, categoria);

  return snapshot.docs.some((snap) => {
    if (excludeId && snap.id === excludeId) return false;
    const data = snap.data();
    return claveServicio(data.nombre, data.categoria) === claveBuscada;
  });
}

export async function limpiarDuplicadosServicios() {
  const serviciosRef = collection(db, "servicios");
  const snapshot = await getDocs(serviciosRef);
  const servicios = snapshot.docs.map((snap) => ({
    id: snap.id,
    ...snap.data(),
  }));

  const grupos = new Map();
  for (const servicio of servicios) {
    const key = claveServicio(servicio.nombre, servicio.categoria);
    const lista = grupos.get(key) || [];
    lista.push(servicio);
    grupos.set(key, lista);
  }

  const idsAEliminar = [];
  for (const lista of grupos.values()) {
    if (lista.length <= 1) continue;
    lista.sort((a, b) => obtenerTimestampMs(b) - obtenerTimestampMs(a));
    idsAEliminar.push(...lista.slice(1).map((item) => item.id));
  }

  if (!idsAEliminar.length) {
    return { gruposConDuplicados: 0, eliminados: 0 };
  }

  const MAX_BATCH = 450;
  let batch = writeBatch(db);
  let ops = 0;
  let commits = 0;

  for (const id of idsAEliminar) {
    batch.delete(doc(db, "servicios", id));
    ops += 1;
    if (ops >= MAX_BATCH) {
      await batch.commit();
      commits += 1;
      batch = writeBatch(db);
      ops = 0;
    }
  }

  if (ops > 0) {
    await batch.commit();
    commits += 1;
  }

  return {
    gruposConDuplicados: [...grupos.values()].filter(
      (lista) => lista.length > 1,
    ).length,
    eliminados: idsAEliminar.length,
    commits,
  };
}

/**
 * Obtiene todos los servicios disponibles
 */
export async function obtenerServicios() {
  try {
    const serviciosRef = collection(db, "servicios");
    const snapshot = await getDocs(serviciosRef);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error obteniendo servicios:", error);
    return [];
  }
}

/**
 * Obtiene un servicio por ID
 */
export async function obtenerServicio(servicioId) {
  try {
    const servicioRef = doc(db, "servicios", servicioId);
    const snapshot = await getDoc(servicioRef);
    if (!snapshot.exists()) return null;
    return {
      id: snapshot.id,
      ...snapshot.data(),
    };
  } catch (error) {
    console.error("Error obteniendo servicio:", error);
    return null;
  }
}

export async function subirImagenServicio(servicioId, archivo) {
  validarImagenServicio(archivo);

  const extension = extensionArchivo(archivo.name, archivo.type);
  const path = `servicios/${servicioId}/${Date.now()}.${extension}`;
  const refImagen = storageRef(storage, path);

  await conTimeoutUpload(
    uploadBytes(refImagen, archivo, {
      contentType: archivo.type || "image/jpeg",
    }),
  );

  const url = await getDownloadURL(refImagen);
  return { imagenUrl: url, imagenPath: path };
}

export async function eliminarImagenServicio(imagenPath) {
  if (!imagenPath) return;

  try {
    await deleteObject(storageRef(storage, imagenPath));
  } catch (error) {
    if (error?.code !== "storage/object-not-found") {
      console.warn("No se pudo eliminar la imagen anterior:", error);
    }
  }
}

/**
 * Crea un nuevo servicio (solo admin)
 */
export async function crearServicio(datos) {
  try {
    const duplicado = await existeServicioDuplicado(
      datos.nombre,
      datos.categoria,
    );
    if (duplicado) {
      const err = new Error(
        "Ya existe un servicio con el mismo nombre y categoria.",
      );
      err.code = "DUPLICATE_SERVICE";
      throw err;
    }

    const serviciosRef = collection(db, "servicios");
    const docRef = await addDoc(serviciosRef, {
      ...datos,
      imagenUrl: datos.imagenUrl || "",
      imagenPath: datos.imagenPath || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...datos };
  } catch (error) {
    console.error("Error creando servicio:", error);
    throw error;
  }
}

/**
 * Actualiza un servicio (solo admin)
 */
export async function actualizarServicio(servicioId, datos) {
  try {
    const duplicado = await existeServicioDuplicado(
      datos.nombre,
      datos.categoria,
      servicioId,
    );
    if (duplicado) {
      const err = new Error(
        "Ya existe un servicio con el mismo nombre y categoria.",
      );
      err.code = "DUPLICATE_SERVICE";
      throw err;
    }

    const servicioRef = doc(db, "servicios", servicioId);
    await updateDoc(servicioRef, {
      ...datos,
      imagenUrl: datos.imagenUrl || "",
      imagenPath: datos.imagenPath || "",
      updatedAt: serverTimestamp(),
    });
    return { id: servicioId, ...datos };
  } catch (error) {
    console.error("Error actualizando servicio:", error);
    throw error;
  }
}

/**
 * Elimina un servicio (solo admin)
 */
export async function eliminarServicio(servicioId) {
  try {
    const servicioRef = doc(db, "servicios", servicioId);
    await deleteDoc(servicioRef);
    return true;
  } catch (error) {
    console.error("Error eliminando servicio:", error);
    throw error;
  }
}

/**
 * Inicializa servicios de prueba en Firestore
 */
export async function inicializarServicios() {
  try {
    const serviciosRef = collection(db, "servicios");
    const snapshot = await getDocs(serviciosRef);

    // Si ya existen servicios, no hacer nada
    if (snapshot.docs.length > 0) {
      console.log("Servicios ya existen en Firestore");
      return;
    }

    const serviciosPrueba = [
      {
        nombre: "Manicura Básica",
        descripcion: "Manicura completa con esmalte",
        precio: 250,
        duracion: 30,
        categoria: "manos",
      },
      {
        nombre: "Manicura Gel",
        descripcion: "Manicura con gel de larga duración",
        precio: 400,
        duracion: 45,
        categoria: "manos",
      },
      {
        nombre: "Pedicura Básica",
        descripcion: "Pedicura completa con esmalte",
        precio: 300,
        duracion: 30,
        categoria: "pies",
      },
      {
        nombre: "Pedicura Gel",
        descripcion: "Pedicura con gel resistente",
        precio: 450,
        duracion: 45,
        categoria: "pies",
      },
      {
        nombre: "Diseño de Uñas",
        descripcion: "Diseño artístico personalizado",
        precio: 500,
        duracion: 60,
        categoria: "diseño",
      },
      {
        nombre: "Extensiones de Uñas",
        descripcion: "Extensiones con acrílico o gel",
        precio: 600,
        duracion: 90,
        categoria: "extensiones",
      },
    ];

    for (const servicio of serviciosPrueba) {
      await addDoc(serviciosRef, {
        ...servicio,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    console.log("Servicios inicializados correctamente");
  } catch (error) {
    console.error("Error inicializando servicios:", error);
  }
}
