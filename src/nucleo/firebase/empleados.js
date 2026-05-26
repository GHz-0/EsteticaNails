import { getFirebaseDb, firebaseConfig } from "./client.js";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  getDocs,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const db = getFirebaseDb();

function iniciales(nombre = "") {
  return nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");
}

/**
 * Obtiene todos los empleados (usuarios con rol === "empleado")
 */
export async function obtenerEmpleados() {
  try {
    const usuariosRef = collection(db, "users");
    const q = query(usuariosRef, where("rol", "==", "empleado"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error obteniendo empleados:", error);
    return [];
  }
}

/**
 * Crea un empleado en Firebase Auth y guarda su perfil en Firestore
 */
export async function crearEmpleado(datos, password) {
  let tempApp = null;
  try {
    // 1. Crear usuario en Firebase Auth usando una instancia secundaria
    tempApp = initializeApp(firebaseConfig, "temp-auth-app");
    const tempAuth = getAuth(tempApp);
    const cred = await createUserWithEmailAndPassword(tempAuth, datos.email, password);
    const uid = cred.user.uid;

    // 2. Guardar perfil en la colección users de Firestore
    const userRef = doc(db, "users", uid);
    const perfil = {
      uid,
      nombre: datos.nombre,
      email: datos.email,
      rol: "empleado",
      avatar: iniciales(datos.nombre),
      estado: datos.estado || "activo",
      telefono: datos.telefono || "",
      especialidad: datos.especialidad || "",
      horario: datos.horario || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(userRef, perfil);
    return perfil;
  } catch (error) {
    console.error("Error creando empleado:", error);
    throw error;
  } finally {
    if (tempApp) {
      try {
        await deleteApp(tempApp);
      } catch (err) {
        console.error("Error eliminando app temporal:", err);
      }
    }
  }
}

/**
 * Actualiza el perfil de un empleado en Firestore
 */
export async function actualizarEmpleado(empleadoId, datos) {
  try {
    const userRef = doc(db, "users", empleadoId);
    const updateData = {
      nombre: datos.nombre,
      estado: datos.estado,
      telefono: datos.telefono || "",
      especialidad: datos.especialidad || "",
      horario: datos.horario || "",
      avatar: iniciales(datos.nombre),
      updatedAt: serverTimestamp(),
    };
    await updateDoc(userRef, updateData);
    return { id: empleadoId, ...updateData };
  } catch (error) {
    console.error("Error actualizando empleado:", error);
    throw error;
  }
}

/**
 * Elimina un empleado de Firestore
 */
export async function eliminarEmpleado(empleadoId) {
  try {
    const userRef = doc(db, "users", empleadoId);
    await deleteDoc(userRef);
    return true;
  } catch (error) {
    console.error("Error eliminando empleado:", error);
    throw error;
  }
}
