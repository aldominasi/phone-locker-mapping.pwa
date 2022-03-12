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
                      <b-form-row class="mt-2">
                        <b-form-input
                          placeholder="Inserisci password"
                          type="password"
                          class="inputCustomSecondary"
                          v-model="jsonData.password"></b-form-input>
                      </b-form-row>
                      <b-form-row class="mt-2">
                        <b-form-input
                          placeholder="Inserisci cellulare"
                          class="inputCustomSecondary"
                          v-model="jsonData.numeroCellulare"></b-form-input>
                      </b-form-row>
                      <b-form-row class="mt-2">
                        <b-form-input
                          placeholder="Inserisci nome"
                          class="inputCustomSecondary"
                          v-model="jsonData.nome"></b-form-input>
                      </b-form-row>
                      <b-form-row class="mt-2">
                        <b-form-input
                          placeholder="Inserisci cognome"
                          class="inputCustomSecondary"
                          v-model="jsonData.cognome"></b-form-input>
                      </b-form-row>
                      <b-form-row class="mt-2">
                        <b-form-select
                          v-model="jsonData.ruolo"
                          :options="optionsRuolo"
                          class="form-control selectCustomPrimary">
                          <template #first>
                            <b-form-select-option :value="null" disabled>Scegli il ruolo</b-form-select-option>
                          </template>
                        </b-form-select>
                      </b-form-row>
                      <b-row>
                        <b-col>
                          <b-button class="btnCustomPrimary">Registra</b-button>
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
      optionsRuolo: [],
      regexEmail: /^[A-z0-9.+_-]+@[A-z0-9._-]+\.[A-z]{2,6}$/
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
          return console.log(response.data.msg);
        this.optionsRuolo = response.data.data.map(item => item._id);
      })
      .catch(err => {
        console.log(err);
      });
    }
  },
  computed: {
    emailValidation() {
      return this.jsonData.email === '' ? null : this.regexEmail.test(this.jsonData.email);
    }
  }
}
</script>

<style scoped>

</style>