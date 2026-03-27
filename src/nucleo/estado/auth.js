import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// 1. IMPORTAMOS FIREBASE
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

// 2. TUS LLAVES SECRETAS (Pídele este bloque a tu jefe)
const firebaseConfig = {
  apiKey: "LLAVE_DEL_JEFE_AQUI",
  authDomain: "estetica-nails.firebaseapp.com",
  projectId: "estetica-nails",
  storageBucket: "estetica-nails.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456:web:abcdef"
};

// Inicializamos Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const ROLES = {
    USUARIO: 'usuario',
    EMPLEADO: 'empleado',
    ADMIN: 'admin',
}

const MOCK_USERS = [
    { id: 1, nombre: 'Carlos López',  email: 'usuario@demo.com',  password: '123456', rol: 'usuario',  avatar: 'CL' },
    { id: 2, nombre: 'Ana Martínez',  email: 'empleado@demo.com', password: '123456', rol: 'empleado', avatar: 'AM' },
    { id: 3, nombre: 'Dueño Sistema', email: 'admin@demo.com',    password: '123456', rol: 'admin',    avatar: 'DS' },
]

export const useAuthStore = defineStore('auth', () => {
    const usuario  = ref(JSON.parse(localStorage.getItem('usuario')) || null)
    const token    = ref(localStorage.getItem('token') || null)
    const cargando = ref(false)
    const error    = ref(null)

    const estaAutenticado = computed(() => !!token.value && !!usuario.value)
    const rol       = computed(() => usuario.value?.rol || null)
    const esUsuario  = computed(() => rol.value === 'usuario')
    const esEmpleado = computed(() => rol.value === 'empleado')
    const esAdmin    = computed(() => rol.value === 'admin')

    function tieneRol(...roles) { return roles.includes(rol.value) }

    // 3. NUEVA FUNCIÓN: REGISTRAR CON FIREBASE
    async function registrar(email, password, nombre) {
        cargando.value = true
        error.value = null
        try {
            // Mandamos los datos a la nube de Firebase
            const credencial = await createUserWithEmailAndPassword(auth, email, password)
            
            // Creamos el perfil localmente para que inicie sesión de inmediato
            const nuevoUsuario = {
                id: credencial.user.uid,
                nombre: nombre,
                email: email,
                rol: 'usuario', // Por defecto es una clienta normal
                avatar: nombre.substring(0, 2).toUpperCase()
            }

            usuario.value = nuevoUsuario
            token.value = credencial.user.accessToken
            localStorage.setItem('usuario', JSON.stringify(nuevoUsuario))
            localStorage.setItem('token', token.value)

            return { ok: true }
        } catch (err) {
            error.value = err.message
            return { ok: false, mensaje: err.message }
        } finally {
            cargando.value = false
        }
    }

    // Tu login original se queda igualito
    async function login(email, password) {
        cargando.value = true
        error.value = null
        try {
            await new Promise((r) => setTimeout(r, 800))
            const encontrado = MOCK_USERS.find((u) => u.email === email && u.password === password)
            if (!encontrado) throw new Error('Credenciales incorrectas')
            const { password: _, ...datosUsuario } = encontrado
            const mockToken = `mock-token-${datosUsuario.rol}-${Date.now()}`
            usuario.value = datosUsuario
            token.value = mockToken
            localStorage.setItem('usuario', JSON.stringify(datosUsuario))
            localStorage.setItem('token', mockToken)
            return { ok: true, rol: datosUsuario.rol }
        } catch (err) {
            error.value = err.message
            return { ok: false, mensaje: err.message }
        } finally {
            cargando.value = false
        }
    }

    function logout() {
        usuario.value = null
        token.value = null
        error.value = null
        localStorage.removeItem('usuario')
        localStorage.removeItem('token')
    }

    function limpiarError() { error.value = null }

    // 4. EXPORTAMOS LA NUEVA FUNCIÓN AQUÍ AL FINAL
    return { 
        usuario, token, cargando, error, estaAutenticado, rol, esUsuario, esEmpleado, esAdmin, 
        tieneRol, login, logout, limpiarError, registrar // <--- ¡Agregamos 'registrar' aquí!
    }
})