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

export async function obtenerEmpleados() {
try {
    const snap = await getDocs(collection(db, "empleados"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
} catch (error) {
    console.error("Error obteniendo empleados:", error);
    return [];
}
}

export async function obtenerEmpleado(id) {
try {
    const snap = await getDoc(doc(db, "empleados", id));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() };
} catch (error) {
    console.error("Error obteniendo empleado:", error);
    return null;
}
}

export async function crearEmpleado(datos) {
try {
    const ref = await addDoc(collection(db, "empleados"), {
    ...datos,
    creadoEn: serverTimestamp(),
    actualizadoEn: serverTimestamp(),
    });
    return { id: ref.id, ...datos };
} catch (error) {
    console.error("Error creando empleado:", error);
    throw error;
}
}

export async function actualizarEmpleado(id, datos) {
try {
    await updateDoc(doc(db, "empleados", id), {
    ...datos,
    actualizadoEn: serverTimestamp(),
    });
    return { id, ...datos };
} catch (error) {
    console.error("Error actualizando empleado:", error);
    throw error;
}
}

export async function eliminarEmpleado(id) {
try {
    await deleteDoc(doc(db, "empleados", id));
    return true;
} catch (error) {
    console.error("Error eliminando empleado:", error);
    throw error;
}
}