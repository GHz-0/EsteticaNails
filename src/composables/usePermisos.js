import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function usePermisos() {
    const auth = useAuthStore()

    function puedeVer(...roles) {
        if (!auth.estaAutenticado) return false
        return roles.includes(auth.rol)
    }

    const soloUsuario        = computed(() => auth.esUsuario)
    const soloEmpleado       = computed(() => auth.esEmpleado)
    const soloAdmin          = computed(() => auth.esAdmin)
    const soloEmpleadoOAdmin = computed(() => auth.esEmpleado || auth.esAdmin)
    const autenticado        = computed(() => auth.estaAutenticado)

    return { puedeVer, soloUsuario, soloEmpleado, soloAdmin, soloEmpleadoOAdmin, autenticado, rol: computed(() => auth.rol), usuario: computed(() => auth.usuario) }
}