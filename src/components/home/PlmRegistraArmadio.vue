<template>
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <b-card>
            <b-card-header class="text-center bg-transparent">
              <h3>Nuovo armadio</h3>
            </b-card-header>
            <b-card-body>
              <b-row>
                <b-col cols="12">
                  <b-form novalidate>
                    <b-row class="mt-2">
                      <b-col sm="12" md="6" lg="6" xl="6">
                        <b-form-input
                          placeholder="Inserisci la centrale"
                          class="inputCustomSecondary"
                          v-model="jsonData.centrale"></b-form-input>
                      </b-col>
                      <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                        <b-form-input
                          placeholder="Inserisci il progressivo"
                          class="inputCustomSecondary"
                          v-model="jsonData.progressivo"></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col sm="12" md="6" lg="6" xl="6">
                        <b-form-input
                          placeholder="Inserisci la zona"
                          class="inputCustomSecondary"
                          v-model="jsonData.zona.info1"></b-form-input>
                      </b-col>
                      <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                        <b-form-input
                          placeholder="Tipologia di armadio"
                          class="inputCustomSecondary"
                          v-model="jsonData.tipoArmadio"></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12">
                        <b-form-input
                          placeholder="Inserisci indirizzo"
                          class="inputCustomSecondary"
                          v-model="jsonData.indirizzo"></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12">
                        <b-form-textarea
                          placeholder="Inserisci una nota"
                          class="inputCustomSecondary"
                          v-model="jsonData.nota"></b-form-textarea>
                      </b-col>
                    </b-row>
                    <b-row class="mt-3">
                      <b-col class="text-center">
                        <b-button class="btnCustomPrimary" :disabled="!abilitaConferma">Invia</b-button>
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
  BCardHeader,
  BCardBody,
  BForm,
  BFormInput,
  BFormTextarea,
  BButton,
} from 'bootstrap-vue';

export default {
  name: "PlmRegistraArmadio",
  components: {
    BContainer,
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    BForm,
    BFormInput,
    BFormTextarea,
    BButton,
  },
  data() {
    return {
      jsonData: {
        centrale: '',
        progressivo: '',
        zona: {
          info1: '',
          info2: ''
        },
        tipoArmadio: '',
        indirizzo: '',
        nota: ''
      }
    }
  },
  computed: {
    abilitaConferma() {
      return true;
    }
  }
}
</script>

<style scoped>

</style>