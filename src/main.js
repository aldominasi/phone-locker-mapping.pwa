import Vue from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.min.css";
import "/src/assets/custom/style.css";
import router from './router/router';
import './registerServiceWorker'
import vbMsgBox from 'bootstrap-vue-msgbox'
import apiErrorHandler from '@/utilityMixin/apiErrorHandler';
import notificaErrore from '@/utilityMixin/notificaErrore';

Vue.config.productionTip = false
Vue.use(vbMsgBox);

Vue.mixin({
  methods: {
    apiErrorHandler,
    notificaErrore
  }
})

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
