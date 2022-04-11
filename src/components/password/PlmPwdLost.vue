<template>
  <b-container class="mt-10">
    <b-row>
      <b-card style="max-width: 50rem;" class="container card_container">
        <b-card-header class="text-center bg-transparent">
          <h4 class="mt-2">Cambia la tua password</h4>
        </b-card-header>
        <b-form @submit.stop.prevent class="mt-4">
          <b-form-group>
            <p>La password deve rispettare i seguenti vincoli:</p>
            <ul>
              <li>Lunghezza minima 6 caratteri</li>
              <li>Una lettera minuscola</li>
              <li>Una lettera maiuscola</li>
              <li>Un numero</li>
            </ul>
          </b-form-group>
          <b-form-group class="mt-2" label="Password" label-for="password1">
            <b-form-input
              id="password1"
              class="inputCustomPrimary"
              :type="typePwd1"
              :state="validationPwd1"
              placeholder="Inserisci la nuova password"
              v-model="jsonData.pwd"></b-form-input>
            <span class="float-end mr-2">
              <b-link class="anchorPwd" @click.prevent="showHidePwd1">{{ textPwd1 }}</b-link>
            </span>
          </b-form-group>
          <b-form-group class="mt-8" label="Conferma password" label-for="password2">
            <b-form-input
              id="password2"
              class="inputCustomPrimary"
              :type="typePwd2"
              :state="validationPwd2"
              placeholder="Conferma la nuova password"
              v-model="pwd2"></b-form-input>
            <span class="float-right mr-2">
              <b-link class="anchorPwd" @click.prevent="showHidePwd2">{{ textPwd2 }}</b-link>
            </span>
          </b-form-group>
          <b-form-group class="mt-10 text-center">
            <b-button class="btnCustomPrimary" @click="inviaDati" :disabled="!abilitaInvio">Invia</b-button>
          </b-form-group>
        </b-form>
      </b-card>
    </b-row>
  </b-container>
</template>

<script>
import {
  BRow,
  BContainer,
  BCard,
  BCardHeader,
  BForm,
  BFormInput,
  BFormGroup,
  BButton,
  BLink,
} from 'bootstrap-vue';
import axios from 'axios';

export default {
  components: {
    BRow,
    BContainer,
    BCard,
    BCardHeader,
    BForm,
    BFormInput,
    BFormGroup,
    BButton,
    BLink,
  },
  data() {
    return {
      jsonData: {
        pwd: ''
      },
      pwd2: '',
      typePwd1: 'password',
      typePwd2: 'password',
      regexPassword: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/,
    }
  },
  methods: {
    showHidePwd1() {
      this.typePwd1 = this.typePwd1 === 'password' ? 'text' : 'password';
    },
    showHidePwd2() {
      this.typePwd2 = this.typePwd2 === 'password' ? 'text' : 'password';
    },
    inviaDati() {
      const loader = this.showLoadingOverlay();
      axios.post(`${process.env.VUE_APP_URL_BACKEND}/recuperopwd/modifica`, this.jsonData, {
        headers: {
          "Accept-Version": '1.0.0',
        },
        params: {
          token: this.$route.query.tkn
        }
      })
      .then(response => {
        this.hideLoadingOverlay(loader);
        if (!response.data.success)
          this.apiErrorHandler(loader);
        else
          this.$alert({
            title: 'Attenzione',
            content: response.data.data
          });
        this.clearAll();
      })
      .catch(() => {
        this.hideLoadingOverlay(loader);
        this.notificaErrore();
      });
    },
    clearAll() {
      this.jsonData.pwd = '';
      this.pwd2 = '';
    }
  },
  computed: {
    textPwd1() {
      return this.typePwd1 === 'password' ? 'mostra password' : 'nascondi password';
    },
    textPwd2() {
      return this.typePwd2 === 'password' ? 'mostra password' : 'nascondi password';
    },
    validationPwd1() {
      return this.jsonData.pwd === '' ? null : this.regexPassword.test(this.jsonData.pwd);
    },
    validationPwd2() {
      return this.pwd2 === '' ? null : this.pwd2 === this.jsonData.pwd;
    },
    abilitaInvio() {
      return this.jsonData.pwd !== '' && this.validationPwd1 === true && this.validationPwd2 === true;
    }
  }
}
</script>

<style scoped>
.anchorPwd:link, .anchorPwd:visited {
  text-decoration: none;
  color: #0b769a;
}

.anchorPwd:hover {
  text-decoration: underline;
  color: #0b769a;
}
</style>