<template>
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <b-card>
            <b-card-header class="text-center bg-transparent">
              <h3>Modifica armadio</h3>
            </b-card-header>
            <b-card-body>
              <b-row>
                <b-col cols="12">
                  <b-form-checkbox
                    class="ml-2 float-right"
                    v-model="ricercaAvanzata"
                    name="check-button"
                    size="lg"
                    switch></b-form-checkbox>
                  <label class="float-right mt-1">Cambia modalità</label>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12">
                  <plm-ricerca-armadi @armadioSelezionato="armadioSelezionato" v-if="!ricercaAvanzata"></plm-ricerca-armadi>
                  <plm-ricerca-armadio @armadioSelezionato="armadioSelezionato" v-else></plm-ricerca-armadio>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <b-modal
        ref="modalModificaArmadio"
        hide-footer
        size="lg">
        <b-container fluid>
          <b-form class="mt-2">
            <b-row>
              <b-col sm="12" md="6" lg="6" xl="6">
                <b-form-select
                  v-model="armadio.provincia"
                  :options="filtri.provincia.options"
                  @change="getComuni"
                  class="form-control selectCustomPrimary">
                  <template #first>
                    <b-form-select-option :value="null">Scegli la provincia</b-form-select-option>
                  </template>
                </b-form-select>
              </b-col>
              <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                <b-form-select
                  v-model="armadio.centrale"
                  :options="filtri.comune.options"
                  :disabled="!provinciaScelta"
                  class="form-control selectCustomPrimary">
                  <template #first>
                    <b-form-select-option :value="null">Scegli il comune</b-form-select-option>
                  </template>
                </b-form-select>
              </b-col>
            </b-row>
          </b-form>
        </b-container>
      </b-modal>
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
  BFormCheckbox,
  BForm,
  BFormSelect,
  BFormSelectOption,
  BModal,
} from 'bootstrap-vue';
import PlmRicercaArmadi from '@/components/home/ricercaArmadi/PlmRicercaArmadi';
import PlmRicercaArmadio from '@/components/home/ricercaArmadi/PlmRicercaArmadio';
import axios from 'axios';

export default {
  components: {
    PlmRicercaArmadio,
    PlmRicercaArmadi,
    BContainer,
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    BFormCheckbox,
    BForm,
    BFormSelect,
    BFormSelectOption,
    BModal,
  },
  name: "PlmModificaArmadio",
  data() {
    return {
      ricercaAvanzata: false,
      armadio: {
        centrale: null,
        provincia: null,
        progressivo: 0,
        zona: null,
        tipoArmadio: '',
        indirizzo: '',
        localizzazione: {
          type: 'Point',
          coordinates: []
        },
        nota: ''
      },
      filtri: {
        provincia: {
          options: []
        },
        comune: {
          options: []
        }
      },
    }
  },
  mounted() {
    this.getProvince();
  },
  methods: {
    armadioSelezionato(armadio){
      this.armadio = armadio;
      this.getComuni();
      this.$refs.modalModificaArmadio.show();
    },
    getProvince() {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/province`, {
        headers: { 'Accept-Version': '1.0.0' }
      })
        .then(response => {
          if (!response.data.success)
            this.apiErrorHandler(response);
          else {
            this.filtri.provincia.options = response.data.data.map(item => {
              return { value: item, text: item.nome };
            });
          }
        })
        .catch(() => this.notificaErrore())
    },
    getComuni() {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/comuni/byProvincia`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: {
          codice: this.armadio.provincia.codice
        }
      })
        .then(response => {
          if (!response.data.success)
            this.apiErrorHandler(response);
          else {
            this.filtri.comune.options = response.data.data.map(item => {
              return { value: item, text: item.nome }
            });
          }
        })
        .catch(() => this.notificaErrore())
    },
  },
  computed: {
    provinciaScelta() { return this.armadio.provincia != null; }
  },
}
</script>

<style scoped>

</style>