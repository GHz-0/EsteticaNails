# Vincular el proyecto con Firebase + Vercel

## 1) Instalar dependencias

```bash
npm install
```

## 2) Configurar variables de entorno

Copia `.env.example` a `.env` y pega los valores del SDK web de Firebase:

```bash
cp .env.example .env
```

Variables requeridas:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

## 3) Firebase Console

- Authentication: habilitar **Email/Password**.
- Firestore Database: crear en modo producción.
- Firestore Rules: pegar reglas de `firebase.firestore.rules`.

## 4) Vercel

En tu proyecto Vercel, agrega las mismas variables de entorno (`VITE_FIREBASE_*`) para Production/Preview/Development.

## 5) Ejecutar proyecto

```bash
npm run dev
```

## 6) Flujo actual integrado

- `RegistroView.vue`: crea cuenta en Firebase Auth y documento en `users/{uid}` en Firestore.
- `auth.js`: login real con Firebase Auth y lectura de rol desde `users/{uid}`.
- `main.js`: inicializa sesión persistente con `onAuthStateChanged`.

## 7) Semilla manual inicial sugerida

Crea estos documentos en Firestore:

Colección `services`:

- Corte y peinado
- Uñas
- Maquillaje
- Faciales

Colección `inventory`:

- Monomero 8oz
- Gelish Tono Nude
- Caja de Tips

Si necesitas, se puede automatizar con script de seed usando Admin SDK.
