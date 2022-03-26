<template>
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <b-card>
            <b-card-header class="text-center bg-transparent">
              <h3>Lista armadi</h3>
            </b-card-header>
            <b-card-body>
              <b-row>
                <b-col cols="12">
                  <b-form novalidate>
                    <b-form-row>
                      <b-form-input
                        placeholder="Scegli la centrale"
                        v-model="filtri.centrale.selected"
                        debounce="200"
                        class="inputCustomSecondary"
                        list="list-centrali"></b-form-input>
                      <b-form-datalist
                        id="list-centrali"
                        :options="filtri.centrale.options"></b-form-datalist>
                    </b-form-row>
                    <b-form-row class="mt-2">
                      <b-form-select
                        v-model="filtri.zona.selected"
                        :options="filtri.zona.options"
                        :disabled="!centraleScelta"
                        class="form-control selectCustomPrimary">
                        <template #first>
                          <b-form-select-option :value="null">Scegli la zona</b-form-select-option>
                        </template>
                      </b-form-select>
                    </b-form-row>
                    <b-row class="mt-2">
                      <b-col>
                        <b-button class="btnCustomPrimary" @click="resetFiltri">Reset</b-button>
                        <b-button class="btnCustomSecondary ml-2" @click="getArmadi(1)" :disabled="!centraleScelta">Cerca</b-button>
                      </b-col>
                    </b-row>
                  </b-form>
                </b-col>
                <b-col cols="12" class="mt-2" v-if="jsonData.length > 0">
                  <div class="overflow-auto">
                    <b-table
                      id="table-armadi"
                      striped
                      hover
                      borderless
                      responsive
                      @row-clicked="armadioScelto"
                      :busy="tableIsBusy"
                      :fields="fieldsTable"
                      :items="jsonData">
                      <template #table-busy>
                        <div class="text-center color-busy-table my-2">
                          <b-spinner class="align-middle"></b-spinner>
                          <strong> Caricamento...</strong>
                        </div>
                      </template>
                      <template #row-details="row">
                        <b-card>
                          <b-row class="mb-2">
                            <b-col cols="12" class="text-center"><b>{{ row.item.tipoArmadio }}</b></b-col>
                          </b-row>
                        </b-card>
                      </template>
                    </b-table>
                    <b-pagination
                      align="center"
                      v-model="currentPage"
                      :total-rows="rows"
                      :per-page="perPage"
                      @change="changePageTable"
                      aria-controls="table-armadi"></b-pagination>
                  </div>
                </b-col>
                <b-col cols="12" class="text-center mt-4" v-else>
                  <b-img src="/plm/img/empty.svg" width="100%" center fluid alt="Nessun dato"></b-img>
                  <label>Elenco vuoto</label>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <b-modal
        ref="modalPlmArmadi"
        hide-footer
        size="lg">
        <b-container fluid>
          <b-tabs content-class="mt-2">
            <b-tab title="Posizione">
              <b-row>
                <b-col cols="12">
                  <plm-map-get-armadi
                    :lat="armadioSelezionato.lat"
                    :lng="armadioSelezionato.lng"
                  ></plm-map-get-armadi>
                </b-col>
                <b-col cols="12" class="text-center mt-3">
                  <b-button class="btnCustomPrimary" @click="indicazioniStradali">Indicazioni stradali</b-button>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="Dettagli">
              Dettagli
            </b-tab>
          </b-tabs>
        </b-container>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
import axios from 'axios';
import {
  BContainer,
  BRow,
  BCol,
  BCard,
  BCardHeader,
  BCardBody,
  BPagination,
  BTable,
  BSpinner,
  BButton,
  BForm,
  BFormRow,
  BFormInput,
  BFormDatalist,
  BFormSelect,
  BFormSelectOption,
  BImg,
  BTabs,
  BTab,
  BModal,
} from 'bootstrap-vue';
import PlmMapGetArmadi from '@/components/home/maps/PlmMapGetArmadi';
const START_MD_SIZE = 768;

export default {
  name: 'PlmArmadi',
  components: {
    BContainer,
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    BPagination,
    BTable,
    BSpinner,
    BButton,
    BForm,
    BFormRow,
    BFormInput,
    BFormDatalist,
    BFormSelect,
    BFormSelectOption,
    BImg,
    BTabs,
    BTab,
    BModal,
    PlmMapGetArmadi,
  },
  data() {
    return {
      jsonData: [],
      tableIsBusy: false,
      fieldsTable: [
        {
          key: 'zona',
          label: 'Zona',
          formatter: 'zonaFormatter',
          tdClass: window.innerWidth <= START_MD_SIZE ? 'tdTableSm' : ''
        },
        {
          key: 'indirizzo',
          label: 'Indirizzo',
          tdClass: window.innerWidth <= START_MD_SIZE ? 'tdTableSm' : ''
        },
        {
          key: 'tipoArmadio',
          label: 'Armadio',
          tdClass: window.innerWidth <= START_MD_SIZE ? 'tdTableSm' : ''
        }
      ],
      currentPage: 1,
      perPage: 3,
      elementiTotali: 0,
      centraleScelta: false,
      filtri: {
        centrale: {
          selected: '',
          options: []
        },
        zona: {
          selected: null,
          options: []
        }
      },
      armadioSelezionato: {
        lat: 0,
        lng: 0
      }
    }
  },
  mounted() {
    if (this.smallSize)
      this.perPage = 3;
    else
      this.perPage = 5;
    this.getCentrali();
  },
  methods: {
    armadioScelto(item) {
      this.armadioSelezionato.lat = item.localizzazione.coordinates[0];
      this.armadioSelezionato.lng = item.localizzazione.coordinates[1];
      this.$refs.modalPlmArmadi.show();
    },
    indicazioniStradali() {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const query = `api=1&origin=${latitude},${longitude}&destination=${this.armadioSelezionato.lat},${this.armadioSelezionato.lng}&travelmode=driving&dir_action=navigate`
        if ((navigator.platform.indexOf('iPhone') !== -1) ||
          (navigator.platform.indexOf('iPad') !== -1) ||
          (navigator.platform.indexOf('iPod') !== -1))
          window.open(`maps://maps.google.com/maps?daddr=${this.armadioSelezionato.lat},${this.armadioSelezionato.lng}&amp;ll=`);
        else
          window.open(`https://www.google.com/maps/dir/?${query}`);
      }, (err) => {
        const modalAlert = {
          title: 'Attenzione',
          content: ''
        };
        if (err.code === 1)
          modalAlert.content = 'La piattaforma non ha i permessi per accedere alla localizzazione del dispositivo';
        else
          modalAlert.content = 'Si è verificato un errore. Riprova più tardi';
        alert(modalAlert);
      });
    },
    zonaFormatter(zona) {
      return zona['info1'];
    },
    changePageTable(page) {
      this.currentPage = page;
      this.getArmadi(this.currentPage);
    },
    getArmadi(page) {
      this.tableIsBusy = true;
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/armadi`, {
        headers: { "Accept-Version": '1.0.0' },
        params: {
          token: sessionStorage.getItem('tokenPlm'),
          page: page - 1,
          limit: this.perPage,
          centrale: this.filtri.centrale.selected,
          zona: this.filtri.zona.selected
        }
      })
        .then(response => {
          if (!response.data.success) {
            this.tableIsBusy = false;
            this.apiErrorHandler(response);
          }
          else {
            this.jsonData = response.data.data.armadi;
            this.elementiTotali = response.data.data.documentiTotali;
            this.tableIsBusy = false;
          }
        })
        .catch(() => {
          this.tableIsBusy = false;
          this.notificaErrore();
        });
    },
    getCentrali() {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/centrali`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: { token: sessionStorage.getItem('tokenPlm') }
      })
      .then(response => {
        if (response.data.success)
          this.filtri.centrale.options = response.data.data.map(item => {
            return { value: item, text: item }
          });
      })
      .catch(() => this.notificaErrore() );
    },
    getZone() {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/zone`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: {
          token: sessionStorage.getItem('tokenPlm'),
          centrale: this.filtri.centrale.selected
        }
      })
      .then(response => {
        if (!response.data.success)
          this.apiErrorHandler(response);
        else
          this.filtri.zona.options = response.data.data;
      })
      .catch(() => this.notificaErrore())
    },
    resetFiltri() {
      this.filtri.centrale.selected = '';
      this.filtri.zona.selected = null;
      this.jsonData = [];
      this.currentPage = 1;
      this.elementiTotali = 0;
    }
  },
  computed: {
    rows() {
      return this.elementiTotali;
    },
    smallSize() {
      return window.innerWidth <= START_MD_SIZE;
    },
  },
  watch: {
    'filtri.centrale.selected'(){
      if (this.filtri.centrale.options.find(item => item.value === this.filtri.centrale.selected)) {
        this.centraleScelta = true;
        this.filtri.zona.selected = null;
        this.getZone();
      }
      else
        this.centraleScelta = false;
    }
  }
}
</script>

<style scoped>
.color-busy-table {
  color: #096280 !important;
}
</style>