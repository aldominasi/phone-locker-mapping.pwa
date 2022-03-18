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
                    <b-form-row>
                      <b-form-input
                        placeholder="Inserisci Email"
                        type="email"
                        :state="emailValidation"
                        class="inputCustomSecondary"
                        v-model="jsonData.email"></b-form-input>
                      <b-row class="mt-2">
                        <b-col sm="12" md="6" lg="6" xl="6">
                          <b-form-input
                            placeholder="Inserisci password"
                            type="password"
                            :state="passwordValidation"
                            class="inputCustomSecondary"
                            aria-describedby="password-help-block"
                            v-model="jsonData.password"></b-form-input>
                          <b-form-text id="password-help-block">
                            Minimo 6 caratteri, lettere minuscole e maiuscole e almeno un numero
                          </b-form-text>
                        </b-col>
                        <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0">
                          <b-form-input
                            placeholder="Conferma password"
                            type="password"
                            :state="confermaPasswordValidation"
                            class="inputCustomSecondary"
                            v-model="confermaPassword"></b-form-input>
                        </b-col>
                      </b-row>
                      <b-row class="mt-2">
                        <b-col sm="12" md="6" lg="6" xl="6">
                          <b-form-input
                            placeholder="Inserisci nome"
                            class="inputCustomSecondary"
                            v-model="jsonData.nome"></b-form-input>
                        </b-col>
                        <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0">
                          <b-form-input
                            placeholder="Inserisci cognome"
                            class="inputCustomSecondary"
                            v-model="jsonData.cognome"></b-form-input>
                        </b-col>
                      </b-row>
                      <b-row class="mt-2">
                        <b-col sm="12" md="6" lg="6" xl="6">
                          <b-form-input
                            placeholder="Inserisci cellulare"
                            class="inputCustomSecondary"
                            v-model="jsonData.numeroCellulare"></b-form-input>
                        </b-col>
                        <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-sm-0 mt-md-0 mt-lg-0 mt-xl-0">
                          <b-form-select
                            v-model="jsonData.ruolo"
                            :options="optionsRuolo"
                            class="form-control selectCustomPrimary">
                            <template #first>
                              <b-form-select-option :value="null" disabled>Scegli il ruolo</b-form-select-option>
                            </template>
                          </b-form-select>
                        </b-col>
                      </b-row>
                      <b-row class="mt-2">
                        <b-col>
                          <b-button class="btnCustomPrimary" :disabled="!abilitaRegistrazione">Registra</b-button>
                        </b-col>
                      </b-row>
                    </b-form-row>
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
  BCardHeader,
  BCardBody,
  BForm,
  BFormRow,
  BFormInput,
  BFormText,
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
    BCardHeader,
    BCardBody,
    BForm,
    BFormRow,
    BFormText,
    BFormInput,
    BFormSelect,
    BFormSelectOption,
    BButton,
  },
  data() {
    return {
      jsonData: {
        email: '',
        password: '',
        numeroCellulare: '',
        nome: '',
        cognome: '',
        ruolo: null,
      },
      confermaPassword: '',
      optionsRuolo: [],
      regexEmail: /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i,
      regexPassword: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/,
      regexNumeroCell: /^\d*$/
    }
  },
  mounted() {
    this.getRuoli();
  },
  methods: {
    getRuoli() {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/ruoli`, {
        headers: { 'Accept-Version': '1.0.0' }
      })
      .then(response => {
        if (!response.data.success)
          return this.$alert({
            title: 'Attenzione',
            content: response.data.msg
          });
        this.optionsRuolo = response.data.data.map(item => item._id);
      })
      .catch(err => {
        console.log(err);
      });
    },
    registra() {
      axios.post(`${process.env.VUE_APP_URL_BACKEND}/utenti`, {
        headers: { 'Accept-Version': '1.0.0' }
      })
      .then(response => {
        if (!response.data.success)
          return this.$alert({
            title: 'Attenzione',
            content: response.data.msg
          });
        this.$alert({
          title: 'Congratulazioni',
          content: 'La registrazione dell\'utente è avvenuta correttamente'
        });
        this.clearAll();
      })
    },
    clearAll() {
      for (const prop in this.jsonData)
        this.jsonData[prop] = prop === 'ruolo' ? null : '';
    }
  },
  computed: {
    emailValidation() {
      return this.jsonData.email === '' ? null : this.regexEmail.test(this.jsonData.email);
    },
    passwordValidation() {
      return this.jsonData.password === '' ? null : this.regexPassword.test(this.jsonData.password);
    },
    confermaPasswordValidation() {
      return this.confermaPassword === '' ? null : this.confermaPassword === this.jsonData.password;
    },
    cellulareValidation() {
      return this.jsonData.numeroCellulare === '' ? null : this.regexNumeroCell.test(this.jsonData.numeroCellulare);
    },
    abilitaRegistrazione() {
      return this.emailValidation === true && this.passwordValidation === true && this.confermaPasswordValidation === true && this.jsonData.nome && this.jsonData.cognome && this.cellulareValidation === true && this.jsonData.ruolo;
    }
  }
}
</script>

<style scoped>

</style>