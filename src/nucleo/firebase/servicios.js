import { getFirebaseDb } from "./client.js";
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirebaseDb();

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

/**
 * Crea un nuevo servicio (solo admin)
 */
export async function crearServicio(datos) {
  try {
    const serviciosRef = collection(db, "servicios");
    const docRef = await addDoc(serviciosRef, {
      ...datos,
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
    const servicioRef = doc(db, "servicios", servicioId);
    await updateDoc(servicioRef, {
      ...datos,
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
