# .

This template should help get you started developing with Vue 3 in Vite.

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

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
