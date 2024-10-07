import { createApp } from "vue";
import App from "./App.vue";
import router from "./router"; // 確保這裡路徑正確
import store from "./store"; // 引入 store

createApp(App).use(router).use(store).mount("#app");
// const app = createApp(App);
// app.use(store); // 使用 Vuex
// app.mount("#app");
