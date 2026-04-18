import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./nucleo/router";
import { useAuthStore } from "@/nucleo/estado/auth";
import { inicializarServicios } from "@/nucleo/firebase/servicios.js";
import { inicializarInventario } from "@/nucleo/firebase/inventario.js";
import { inicializarCitas } from "@/nucleo/firebase/citas.js";
import "./styles.css";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const auth = useAuthStore(pinia);
auth.inicializarAuth();

// Inicializar datos de prueba cuando el usuario se autentica
auth.$subscribe(async (mutation, state) => {
  if (state.usuario && state.token && state.usuario.rol === "admin") {
    try {
      await inicializarServicios();
      await inicializarInventario();
      await inicializarCitas();
    } catch (error) {
      console.error("Error inicializando datos:", error);
    }
  }
});

app.mount("#app");
