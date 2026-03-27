## Estructura del proyecto

```text
src/
  compartido/
    componentes/
      PlantillaBase.vue       # Layout base compartido para roles
    composables/
      usePermisos.js          # Lógica reutilizable de permisos
  modulos/
    autenticacion/
      vistas/
        InicioSesionView.vue
        AccesoDenegadoView.vue
        NoEncontradoView.vue
    usuario/
      layouts/
        UsuarioLayout.vue
      vistas/
        PanelView.vue
        ServiciosView.vue
        CitasView.vue
        PerfilView.vue
    empleado/
      layouts/
        EmpleadoLayout.vue
      vistas/
        PanelView.vue
        GestionCitasView.vue
        ClientesView.vue
        PerfilView.vue
    administracion/
      layouts/
        AdministradorLayout.vue
      vistas/
        PanelView.vue
        ReportesView.vue
        EmpleadosView.vue
        ServiciosView.vue
        ConfiguracionView.vue
  nucleo/
    router/
      index.js                # Rutas y guardas de navegación
    estado/
      auth.js                 # Estado global de autenticación (Pinia)
  main.js                     # Punto de entrada
```