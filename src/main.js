import Vue from 'vue'
import App from './App.vue'
//import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.min.css";
import "/src/assets/custom/style.css";
import router from './router/router';
//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
// import "@fortawesome/fontawesome-free/css/all.css";
// import "@fortawesome/fontawesome-free/js/all";
import './registerServiceWorker'

//Vue.use(BootstrapVue);
//Vue.use(BootstrapVueIcons);
//Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
