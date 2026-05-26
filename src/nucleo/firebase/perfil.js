import { getFirebaseDb, getFirebaseStorage } from "./client.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

const db = getFirebaseDb();
const storage = getFirebaseStorage();

function extensionArchivo(nombre = "", tipo = "") {
  const extensionNombre = nombre.split(".").pop()?.toLowerCase();
  if (extensionNombre && extensionNombre !== nombre) return extensionNombre;
  const extensionTipo = tipo.split("/").pop()?.toLowerCase();
  return extensionTipo || "jpg";
}

function validarImagenAvatar(archivo) {
  if (!archivo) return;
  if (!archivo.type?.startsWith("image/")) {
    const err = new Error("El archivo debe ser una imagen.");
    err.code = "INVALID_IMAGE_TYPE";
    throw err;
  }
  if (archivo.size > 2 * 1024 * 1024) {
    const err = new Error("La imagen no debe superar 2MB.");
    err.code = "IMAGE_TOO_LARGE";
    throw err;
  }
}

/**
 * Sube la imagen del avatar del usuario a Firebase Storage y retorna su URL
 */
export async function subirAvatarUsuario(uid, archivo) {
  validarImagenAvatar(archivo);

  const extension = extensionArchivo(archivo.name, archivo.type);
  const path = `usuarios/${uid}/avatar.${extension}`;
  const refImagen = storageRef(storage, path);

  // Subir imagen
  await uploadBytes(refImagen, archivo, {
    contentType: archivo.type || "image/jpeg",
  });

  const url = await getDownloadURL(refImagen);
  return { avatarUrl: url, avatarPath: path };
}

/**
 * Obtiene el documento de perfil completo de un usuario
 */
export async function obtenerPerfilCompleto(uid) {
  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return null;
    return snap.data();
  } catch (error) {
    console.error("Error obteniendo perfil completo:", error);
    return null;
  }
}
