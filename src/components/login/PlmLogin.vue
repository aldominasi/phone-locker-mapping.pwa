<template>
  <div>
    <pwa-install/>
    <b-container class="mt-10">
      <b-row>
        <b-card
          style="max-width: 50rem;"
          class="container card_container">
          <b-card-header class="text-center bg-transparent">
            <img :src="'/img/logo/logo_75x75.png'" alt="logo">
            <h4 class="mt-2">Find a locker</h4>
          </b-card-header>
          <b-form @submit.stop.prevent class="mt-4">
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
              ></b-form-input>
            </b-form-group>
            <b-form-group
              class="mt-4"
              label="Password"
              label-for="inputPassword">
              <b-form-input
                id="inputPassword"
                class="inputCustomPrimary"
                type="password"
                placeholder="Inserisci la password"
                v-model="jsonData.password"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              class="mt-4">
              <b-link
                class="anchorPwd"
                href="/#/">Hai dimenticato la password?</b-link>
            </b-form-group>
            <b-form-group
              class="mt-4 text-center">
              <b-button
                @click="onLogin"
                class="btnLogin">Accedi</b-button>
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
  BFormInput
} from 'bootstrap-vue'

export default {
  components:{
    PwaInstall,
    BRow,
    BContainer,
    BCard,
    BCardHeader,
    BForm,
    BFormGroup,
    BButton,
    BLink,
    BFormInput
  },
  data() {
    return {
      jsonData: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    onLogin: function () {
      if (this.validationEmail === false)
        return;
      axios.post(`${process.env.VUE_APP_URL_BACKEND}/login`, this.jsonData, {
        headers: {
          "Accept-Version": '1.0.0',
        }
      })
      .then((response) => {
        if (response.data.success) {
          if (response.data.data.auth) {
            sessionStorage.setItem('tokenPlm', response.data.data.token);
            this.$router.push('/home/armadi');
          }
        }
        else
          console.log("ERRORE LOGIN", response.data.msg);
      })
      .catch((err) => {
        console.log(err);
      })
    }
  },
  computed: {
    validationEmail() {
      if (this.jsonData.email === '')
        return null;
      const regexEmail = /^[A-z0-9.+_-]+@[A-z0-9._-]+\.[A-z]{2,6}$/;
      return this.jsonData.email.match(regexEmail) != null ? null : false
    },
  }
}
</script>

<style scoped>
.btnLogin {
  color: #0b769a;
  border-color: #0b769a;
  background-color: transparent;
  font-family: NotoSerifDisplay,serif
}
.btnLogin:focus {
  box-shadow: 0 0 0 0 transparent;
}
.btnLogin:active {
  background-color: #0b769a;
  color: white;
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