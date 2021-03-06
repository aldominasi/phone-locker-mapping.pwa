<template>
  <!-- Componente per la modifica della password corrente dopo aver effettuato l'accesso -->
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <b-card>
            <b-card-header class="text-center bg-transparent">
              <h3>Modifica password</h3>
            </b-card-header>
            <b-card-body>
              <b-row>
                <b-col cols="12">
                  <b-form novalidate>
                    <b-row class="mt-2">
                      <b-col>
                        <!-- Input per la password corrente -->
                        <b-form-input
                          placeholder="Inserisci la password corrente"
                          class="inputCustomSecondary"
                          :type="typeOldPwd"
                          v-model="jsonData.oldPwd"></b-form-input>
                        <!-- anchor per la funzione mostra/nascondi password -->
                        <span class="float-right mr-2">
                          <b-link class="anchorPwd" @click.prevent="showHideOldPwd">{{ textOldPwd }}</b-link>
                        </span>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col>
                        <!-- Input per la nuova password -->
                        <b-form-input
                          placeholder="Inserisci la nuova password"
                          class="inputCustomSecondary"
                          :state="validationNewPwd"
                          :type="typeNewPwd"
                          v-model="jsonData.newPwd"></b-form-input>
                        <!-- anchor per la funzione mostra/nascondi password -->
                        <span class="float-right mr-2">
                          <b-link class="anchorPwd" @click.prevent="showHideNewPwd">{{ textNewPwd }}</b-link>
                        </span>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col>
                        <!-- Input per confermare la nuova password -->
                        <b-form-input
                          placeholder="Conferma la nuova password"
                          class="inputCustomSecondary"
                          :state="validationPwd2"
                          :type="typePwd2"
                          v-model="pwd2"></b-form-input>
                        <!-- anchor per la funzione mostra/nascondi password -->
                        <span class="float-right mr-2">
                          <b-link class="anchorPwd" @click.prevent="showHidePwd2">{{ textPwd2 }}</b-link>
                        </span>
                      </b-col>
                    </b-row>
                    <b-row class="mt-3">
                      <!-- Button per l'invio della nuova password -->
                      <b-col class="text-center">
                        <b-button class="btnCustomPrimary" :disabled="!abilitaInvio" @click="inviaDati">Invia</b-button>
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
  BRow,
  BCol,
  BContainer,
  BCard,
  BCardHeader,
  BCardBody,
  BForm,
  BFormInput,
  BButton,
  BLink,
} from 'bootstrap-vue';
import axios from 'axios';
export default {
  name: 'PlmPwdChange',
  components: {
    BRow,
    BCol,
    BContainer,
    BCard,
    BCardHeader,
    BCardBody,
    BForm,
    BFormInput,
    BButton,
    BLink,
  },
  data() {
    return {
      jsonData: {
        oldPwd: '',
        newPwd: ''
      },
      pwd2: '',
      typeOldPwd: 'password',
      typeNewPwd: 'password',
      typePwd2: 'password',
      regexPassword: /^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/,
    }
  },
  methods: {
    showHideOldPwd() {
      this.typeOldPwd = this.typeOldPwd === 'password' ? 'text' : 'password';
    },
    showHideNewPwd() {
      this.typeNewPwd = this.typeNewPwd === 'password' ? 'text' : 'password';
    },
    showHidePwd2() {
      this.typePwd2 = this.typePwd2 === 'password' ? 'text' : 'password';
    },
    inviaDati() {
      /*
      Metodo per l'invio dei dati per sostituire la password corrente
      con quella inserita nella form
       */
      const loader = this.showLoadingOverlay();
      // HTTP POST per modificare la password
      axios.post(`${process.env.VUE_APP_URL_BACKEND}/modificapwd`, this.jsonData, {
        headers: { 'Accept-Version': '1.0.0' },
        params: { token: sessionStorage.getItem('tokenPlm') } // Token di accesso alle funzionalità\
      })
      .then(response => {
        this.hideLoadingOverlay(loader);
        if (!response.data.success)
          this.apiErrorHandler();
        else
          this.$alert({ // Visualizza all'utente l'esito dell'operazione
            title: 'Esito operazione',
            content: response.data.success ? response.data.data : response.data.msg
          });
        this.clearAll();
        this.$router.replace('/');
      })
      .catch(() => {
        this.hideLoadingOverlay(loader);
        this.notificaErrore();
      });
    },
    clearAll() {
      this.jsonData.oldPwd = '';
      this.jsonData.newPwd = '';
      this.pwd2 = '';
    }
  },
  computed: {
    textOldPwd() {
      return this.typeOldPwd === 'password' ? 'mostra password' : 'nascondi password';
    },
    textNewPwd() {
      return this.typeNewPwd === 'password' ? 'mostra password' : 'nascondi password';
    },
    textPwd2() {
      return this.typePwd2 === 'password' ? 'mostra password' : 'nascondi password';
    },
    validationNewPwd() { // Validazione della nuova password
      return this.jsonData.newPwd === '' ? null : this.regexPassword.test(this.jsonData.newPwd);
    },
    validationPwd2() { // Validazione del campo conferma password
      return this.pwd2 === '' ? null : this.pwd2 === this.jsonData.newPwd;
    },
    abilitaInvio() { // Abilita/Disabilita il button per l'invio dei dati
      return this.jsonData.oldPwd !== '' && this.validationNewPwd === true && this.validationPwd2 === true;
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