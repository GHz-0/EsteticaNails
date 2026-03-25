import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

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

    return { usuario, token, cargando, error, estaAutenticado, rol, esUsuario, esEmpleado, esAdmin, tieneRol, login, logout, limpiarError }
})