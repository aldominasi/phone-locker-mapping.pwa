import Vue from 'vue'
import App from './App.vue'
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.min.css";
import "/src/assets/custom/style.css";
import router from './router/router';
import './registerServiceWorker'
import vbMsgBox from 'bootstrap-vue-msgbox'

Vue.config.productionTip = false
Vue.use(vbMsgBox);

Vue.mixin({
  methods: {
    apiErrorHandler(response) {
      if (response.data.codError === 2)
        this.$router.replace('/');
      else {
        this.$alert({
          title: 'Attenzione',
          content: 'Si è verificato un errore riprova più tardi'
        });
      }
    }
  }
})

new Vue({
  router: router,
  render: h => h(App),
}).$mount('#app')
