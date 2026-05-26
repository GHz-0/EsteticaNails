import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

export const firebaseConfig = {
  apiKey: "AIzaSyBZQgjFNHNaVOXh-GpFWhqZu7IzGLvVU48",
  authDomain: "nailsbere.firebaseapp.com",
  projectId: "nailsbere",
  storageBucket: "nailsbere.firebasestorage.app",
  messagingSenderId: "443819455697",
  appId: "1:443819455697:web:09ca24f597992abe6101f0",
};

function validarConfig() {
  const faltantes = Object.entries(firebaseConfig)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (faltantes.length > 0) {
    throw new Error(
      `Config Firebase incompleta. Variables faltantes: ${faltantes.join(", ")}`,
    );
  }
}

export function getFirebaseApp() {
  validarConfig();
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getFirebaseDb() {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}
