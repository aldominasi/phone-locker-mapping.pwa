<template>
  <div>
    <b-row>
      <b-col cols="12">
        <b-form novalidate>
          <b-row class="mt-2">
            <b-col sm="12" md="6" lg="6" xl="6">
              <b-form-select
                v-model="filtri.provincia.selected"
                :options="filtri.provincia.options"
                @change="getComuni"
                class="form-control selectCustomPrimary">
                <template #first>
                  <b-form-select-option :value="null" disabled>Scegli la provincia</b-form-select-option>
                </template>
              </b-form-select>
            </b-col>
            <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
              <b-form-select
                v-model="filtri.comune.selected"
                :options="filtri.comune.options"
                :disabled="!provinciaScelta"
                @change="comuneScelto()"
                class="form-control selectCustomPrimary">
                <template #first>
                  <b-form-select-option :value="null" disabled>Scegli il comune</b-form-select-option>
                </template>
              </b-form-select>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col cols="12">
              <b-form-select
                v-model="filtri.zona.selected"
                :options="filtri.zona.options"
                :disabled="!abilitaZone"
                @change="getArmadi(1)"
                class="form-control selectCustomPrimary">
                <template #first>
                  <b-form-select-option :value="null">Scegli la zona</b-form-select-option>
                </template>
              </b-form-select>
            </b-col>
          </b-row>
        </b-form>
      </b-col>
      <b-col cols="12" class="mt-2" v-if="armadi.length > 0">
        <div class="overflow-auto">
          <b-table
            id="tableAggiornaArmadi"
            striped
            hover
            borderless
            responsive
            @row-clicked="armadioScelto"
            :busy="tabella.isBusy"
            :fields="tabella.fields"
            :items="armadi">
            <template #table-busy>
              <div class="text-center color-busy-table my-2">
                <b-spinner class="align-middle"></b-spinner>
                <strong> Caricamento...</strong>
              </div>
            </template>
          </b-table>
          <b-pagination
            align="center"
            v-model="tabella.currentPage"
            :total-rows="rows"
            :per-page="tabella.perPage"
            @change="cambiaPagina"
            aria-controls="table-update-armadi"></b-pagination>
        </div>
      </b-col>
      <b-col cols="12" class="text-center mt-4" v-else>
        <b-img src="/plm/img/empty.svg" width="100%" center fluid alt="Nessun dato"></b-img>
        <label>Elenco vuoto</label>
      </b-col>
    </b-row>
  </div>
</template>

<script>
//TODO: IMPLEMENTARE LA LISTA DELLE PROVINCE DELLE CENTRALI PRESENTI NEL DB
//TODO: IMPLEMENTARE LA LISTA DELLE CENTRALI DI UNA PROVINCIA
import {
  BRow,
  BCol,
  BForm,
  BFormSelect,
  BFormSelectOption,
  BTable,
  BPagination,
  BImg,
  BSpinner,
} from 'bootstrap-vue';
import axios from 'axios';

const START_MD_SIZE = 768;

export default {
  components: {
    BRow,
    BCol,
    BForm,
    BFormSelect,
    BFormSelectOption,
    BTable,
    BPagination,
    BImg,
    BSpinner,
  },
  name: "PlmRicercaArmadi",
  data() {
    return {
      armadi: [],
      filtri: {
        provincia: {
          selected: null,
          options: []
        },
        comune: {
          selected: null,
          options: []
        },
        zona: {
          selected: null,
          options: []
        }
      },
      tabella: {
        isBusy: false,
        fields: [
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
        armadioSelezionato: null
      },
    }
  },
  mounted() {
    if (this.smallSize)
      this.tabella.perPage = 3;
    else
      this.tabella.perPage = 5;
    this.getProvince();
  },
  methods: {
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
    getZone() {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/zone`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: {
          token: sessionStorage.getItem('tokenPlm'),
          codiceCentrale: this.filtri.comune.selected.codice
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
    getComuni() {
      this.filtri.comune.selected = null;
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/comuni/byProvincia`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: {
          codice: this.filtri.provincia.selected.codice
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
    getArmadi(page) {
      this.tabella.isBusy = true;
      const queryStringGetArmadi = {
        token: sessionStorage.getItem('tokenPlm'),
        page: page - 1,
        limit: this.tabella.perPage,
        codiceCentrale: this.filtri.comune.selected.codice
      };
      if (this.filtri.zona.selected)
        queryStringGetArmadi.zona = this.filtri.zona.selected;
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/armadi`, {
        headers: { "Accept-Version": '1.0.0' },
        params: queryStringGetArmadi
      })
        .then(response => {
          if (!response.data.success) {
            this.tabella.isBusy = false;
            this.apiErrorHandler(response);
          }
          else {
            this.armadi = response.data.data.armadi;
            this.tabella.elementiTotali = response.data.data.documentiTotali;
            this.tabella.isBusy = false;
          }
        })
        .catch(() => {
          this.tabella.isBusy = false;
          this.notificaErrore();
        });
    },
    comuneScelto() {
      this.getArmadi(1);
      this.getZone();
    },
    cambiaPagina(page) {
      this.tabella.currentPage = page;
      this.getArmadi(page);
    },
    armadioScelto(item) {
      this.$emit('armadioSelezionato', item);
    },
    zonaFormatter(zona) {
      return zona['info1'];
    },
  },
  computed: {
    rows() { return this.tabella.elementiTotali; },
    smallSize() { return window.innerWidth <= START_MD_SIZE; },
    provinciaScelta() { return this.filtri.provincia.selected != null; },
    abilitaZone() {
      return this.filtri.comune.selected != null;
    }
  }
}
</script>

<style scoped>

</style>