<template>
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <b-card>
            <b-card-header class="text-center bg-transparent">
              <h3>Crea utente</h3>
            </b-card-header>
            <b-card-body>
              <b-row>
                <b-col cols="12">
                  <b-form novalidate>
                    <b-row class="mt-2">
                      <b-col sm="12" md="6" lg="6" xl="6">
                        <b-form-input
                            placeholder="Inserisci nome"
                            class="inputCustomSecondary"
                            v-model="jsonData.nome"></b-form-input>
                      </b-col>
                      <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                        <b-form-input
                            placeholder="Inserisci cognome"
                            class="inputCustomSecondary"
                            v-model="jsonData.cognome"></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col sm="12" md="6" lg="6" xl="6">
                        <b-form-input
                            placeholder="Inserisci Email"
                            type="email"
                            :state="emailValidation"
                            class="inputCustomSecondary"
                            v-model="jsonData.email"></b-form-input>
                      </b-col>
                      <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                        <b-form-input
                            placeholder="Inserisci cellulare"
                            class="inputCustomSecondary"
                            :state="cellulareValidation"
                            v-model="jsonData.numeroCellulare"></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col sm="12" md="6" lg="6" xl="6">
                        <b-form-input
                          v-model="jsonData.password"
                          :state="passwordValidation"
                          placeholder="Inserisci password"
                          :type="typePwd"
                          class="inputCustomSecondary"></b-form-input>
                        <span class="float-right mr-2">
                          <b-link class="anchorPwd" @click.prevent="showHidePwd">{{ textPwd }}</b-link>
                        </span>
                      </b-col>
                      <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                        <b-form-input
                          v-model="confermaPassword"
                          :state="confermaPasswordValidation"
                          placeholder="Conferma password"
                          :type="typeConfermaPwd"
                          class="inputCustomSecondary"></b-form-input>
                        <span class="float-right mr-2">
                          <b-link class="anchorPwd" @click.prevent="showHideConfermaPwd">{{ textConfermaPwd }}</b-link>
                        </span>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12">
                        <b-form-select
                            v-model="jsonData.ruolo"
                            :options="optionsRuolo"
                            class="form-control selectCustomPrimary">
                          <template #first>
                            <b-form-select-option :value="null" disabled>Scegli il ruolo</b-form-select-option>
                          </template>
                        </b-form-select>
                      </b-col>
                      <b-col cols="12" class="text-right">
                        <span class="small">* Tutti i campi sono obbligatori</span>
                      </b-col>
                    </b-row>
                    <b-row class="mt-3">
                      <b-col class="text-center">
                        <b-button class="btnCustomPrimary" :disabled="!abilitaRegistrazione" @click="registra">Registra</b-button>
                      </b-col>
                    </b-row>
                  </b-form>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import {
  BContainer,
  BRow,
  BCol,
  BCard,
  BLink,
  BCardHeader,
  BCardBody,
  BForm,
  BFormInput,
  BFormSelect,
  BFormSelectOption,
  BButton,
} from 'bootstrap-vue';
import axios from 'axios';

export default {
  name: 'PlmRegistraUtente',
  components: {
    BContainer,
    BRow,
    BCol,
    BCard,
    BLink,
    BCardHeader,
    BCardBody,
    BForm,
    BFormInput,
    BFormSelect,
    BFormSelectOption,
    BButton,
  },
  data() {
    return {
      jsonData: {
        email: '',
        numeroCellulare: '',
        nome: '',
        cognome: '',
        ruolo: null,
        password: ''
      },
      typePwd: 'password',
      textPwd: 'mostra password',
      typeConfermaPwd: 'password',
      textConfermaPwd: 'mostra password',
      confermaPassword: '',
      optionsRuolo: [],
      regexEmail: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
      regexNumeroCell: /^\d*$/,
      regexPassword: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/
    }
  },
  mounted() {
    this.getRuoli();
  },
  methods: {
    getRuoli() {
      const loader = this.showLoadingOverlay();
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/ruoli`, {
        headers: {'Accept-Version': '1.0.0'},
      })
          .then(response => {
            this.hideLoadingOverlay(loader);
            if (response.data.success)
              this.optionsRuolo = response.data.data.map(item => item._id);
          })
          .catch(() => {
            this.hideLoadingOverlay(loader);
            this.notificaErrore();
          });
    },
    registra() {
      const loader = this.showLoadingOverlay();
      axios.post(`${process.env.VUE_APP_URL_BACKEND}/utenti`, this.jsonData, {
        headers: {'Accept-Version': '1.0.0'},
        params: {
          token: sessionStorage.getItem('tokenPlm'),
        }
      })
        .then(response => {
          this.hideLoadingOverlay(loader);
          if (!response.data.success)
            this.apiErrorHandler();
          else
            this.$alert({
              title: 'Congratulazioni',
              content: 'La registrazione dell\'utente è avvenuta correttamente'
            });
          this.clearAll();
        })
        .catch(() => {
        this.hideLoadingOverlay(loader);
        this.notificaErrore();
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
    showHideConfermaPwd() {
      if (this.typeConfermaPwd === 'password') {
        this.typeConfermaPwd = 'text';
        this.textConfermaPwd = 'nascondi password';
      } else {
        this.typeConfermaPwd = 'password';
        this.textConfermaPwd = 'mostra password';
      }
    },
    clearAll() {
      for (const prop in this.jsonData)
        this.jsonData[prop] = prop === 'ruolo' ? null : '';
      this.confermaPassword = '';
    }
  },
  computed: {
    emailValidation() {
      return this.jsonData.email === '' ? null : this.regexEmail.test(this.jsonData.email);
    },
    cellulareValidation() {
      return this.jsonData.numeroCellulare === '' ? null : this.regexNumeroCell.test(this.jsonData.numeroCellulare);
    },
    abilitaRegistrazione() {
      return this.emailValidation === true && this.jsonData.nome && this.jsonData.cognome && this.cellulareValidation === true && this.jsonData.ruolo && this.passwordValidation === true && this.confermaPasswordValidation === true;
    },
    passwordValidation() {
      return this.jsonData.password === '' ? null : this.regexPassword.test(this.jsonData.password);
    },
    confermaPasswordValidation() {
      return this.confermaPassword === '' ? null : this.jsonData.password === this.confermaPassword;
    }
  }
}
</script>

<style scoped>

</style>