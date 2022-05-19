<template>
  <div>
    <pwa-install/> <!-- Componente che chiede all'utente se vuole aggiungere il sito web alla sua homepage -->
    <b-container class="mt-10">
      <b-row>
        <b-card
          style="max-width: 50rem;"
          class="container card_container">
          <b-card-header class="text-center bg-transparent"> <!-- Logo del progetto -->
            <img :src="'/img/logo/logo_75x75.png'" alt="logo">
            <h4 class="mt-2">Find a locker</h4>
          </b-card-header>
          <b-form @submit.stop.prevent class="mt-4">
            <!-- Input email -->
            <b-form-group
              label="Email"
              label-for="inputEmail"
              invalid-feedback="Email formalmente errata"
              :state="validationEmail">
              <b-form-input
                id="inputEmail"
                class="inputCustomPrimary"
                placeholder="Inserisci la mail"
                autofocus
                type="email"
                :state="validationEmail"
                :formatter="value => value.toLowerCase()"
                v-model="jsonData.email"
                @keyup.enter="onLogin"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              class="mt-4"
              label="Password"
              label-for="inputPassword">
              <!-- Input password -->
              <b-form-input
                id="inputPassword"
                class="inputCustomPrimary"
                :type="typePwd"
                placeholder="Inserisci la password"
                v-model="jsonData.password"
                @keyup.enter="onLogin"></b-form-input>
              <!-- Mostra in chiaro o nasconde la password inserita -->
              <span class="float-right mr-2">
                <b-link class="anchorPwd" @click.prevent="showHidePwd">{{ textPwd }}</b-link>
              </span>
            </b-form-group>
            <!-- Recupero della password -->
            <b-form-group class="mt-10">
              <b-link class="anchorPwd" @click.prevent="recuperaPassword">Hai dimenticato la password?</b-link>
            </b-form-group>
            <!-- Button accedi -->
            <b-form-group class="mt-4 text-center">
              <b-button @click="onLogin" class="btnCustomPrimary">Accedi
              </b-button>
            </b-form-group>
          </b-form>
        </b-card>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import PwaInstall from '@/components/PWAPrompt/PwaInstall';
import axios from 'axios';
import {
  BRow,
  BContainer,
  BCard,
  BCardHeader,
  BForm,
  BFormGroup,
  BButton,
  BLink,
  BFormInput,
} from 'bootstrap-vue';
//import LoadingPlugin from 'vue-loading-overlay';
//import 'vue-loading-overlay/dist/vue-loading.css';
const regexEmail = /^[A-z0-9.+_-]+@[A-z0-9._-]+\.[A-z]{2,6}$/;

export default {
  components: {
    PwaInstall,
    BRow,
    BContainer,
    BCard,
    BCardHeader,
    BForm,
    BFormGroup,
    BButton,
    BLink,
    BFormInput,
    //LoadingPlugin
  },
  data() {
    return {
      jsonData: {
        email: '',
        password: ''
      },
      typePwd: 'password', // utilizzata per cambiare il type della input relativa alla password
      textPwd: 'mostra password', // testo visualizzato per la funzione mostra/nascondi password
      isLoading: false,
    }
  },
  methods: {
    onLogin: function () { // Metodo che viene chiamato quando si clicca su accedi
      if (this.validationEmail === false) // Controlla se l'email è formalmente valida
        return;
      // this.isLoading = true;
      const loadingOverlay = this.showLoadingOverlay(); // Mette in primo piano il loading circle
      // HTTP POST per eseguire la login
      axios.post(`${process.env.VUE_APP_URL_BACKEND}/login`, this.jsonData, {
        headers: {
          "Accept-Version": '1.0.0',
        }
      })
        .then((response) => {
          // this.isLoading = false;
          this.hideLoadingOverlay(loadingOverlay); // Rimuove dal primo piano il loading circle
          if (response.data.success) { // L'API ha risposto correttamente
            if (response.data.data.auth) { // Login avvenuta con successo
              // Salva il jwt token restituito dall'api di login
              sessionStorage.setItem('tokenPlm', response.data.data.token);
              this.$router.push('/home/armadi'); // Redirect alla homepage
            } else
              this.$alert({ // Autenticazione fallita
                title: 'Attenzione',
                content: 'Autenticazione non riuscita. Riprova più tardi'
              });
          } else
            this.$alert({
              title: 'Attenzione',
              content: response.data.msg
            });
        })
        .catch((err) => {
          this.hideLoadingOverlay(loadingOverlay);
          console.log("login", err);
        })
    },
    showHidePwd() {
      if (this.typePwd === 'password') {
        this.typePwd = 'text';
        this.textPwd = 'nascondi password';
      } else {
        this.typePwd = 'password';
        this.textPwd = 'mostra password';
      }
    },
    recuperaPassword() {
      /*
      Metodo utilizzato per la funzionalità di recupero password.
      Viene visualizzato all'utente una input dove inserire l'indirizzo di posta elettronica
      a cui sarà inviata la mail di recupero password
       */
      this.$prompt({
        title: 'Recupero password',
        content: 'Inserisci la tua email per avviare l\'operazione di recupero password',
        validates (value) {
          return value === '' ? null : regexEmail.test(value) ? null : 'L\'indirizzo email non è formalmente corretto'
        }
      })
      .then(value => {
        axios.post(`${process.env.VUE_APP_URL_BACKEND}/recuperopwd`, { email: value }, {
          headers: {
            "Accept-Version": '1.0.0',
          }
        })
        .then(response => {
          this.$alert({
            title: response.data.success ? 'Recupero password' : 'Attenzione',
            content: response.data.success ? response.data.data : response.data.msg
          });
        })
        .catch(() => {
          this.$alert({
            title: 'Attenzione',
            content: 'Si è verificato un errore. Riprova più tardi'
          });
        })
      })
      .catch(() => {

      })
    }
  },
  computed: {
    validationEmail() {
      if (this.jsonData.email === '')
        return null;
      return this.jsonData.email.match(regexEmail) != null ? null : false
    },
  }
}
</script>

<style scoped>
img {
  width: 75px;
  height: auto;
}

.anchorPwd:link, .anchorPwd:visited {
  text-decoration: none;
  color: #0b769a;
}

.anchorPwd:hover {
  text-decoration: underline;
  color: #0b769a;
}
</style>