import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import http from "./utils/http";
import api from "./api/index";
import dateFormat from "./utils/dateFormat";
import store from "./store";

Vue.config.productionTip = false;
Vue.prototype.$http = http;
Vue.prototype.$api = api;
Date.prototype.Format = dateFormat;

const app = new Vue({
  router,
  store,
  render: h => h(App)
});

app.$mount("#app");
