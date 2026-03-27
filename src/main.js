import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./nucleo/router";
import { useAuthStore } from "@/nucleo/estado/auth";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

const auth = useAuthStore(pinia);
auth.inicializarAuth();

app.mount("#app");
