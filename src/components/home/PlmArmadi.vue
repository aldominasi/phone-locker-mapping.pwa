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
              <plm-ricerca-armadi @armadioSelezionato="armadioScelto"></plm-ricerca-armadi>
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
            <b-tab title="Posizione" lazy>
              <b-row>
                <b-col cols="12">
                  <plm-map-get-armadi
                    :lat="armadioSelezionato ? armadioSelezionato.localizzazione.coordinates[0] : 0"
                    :lng="armadioSelezionato ? armadioSelezionato.localizzazione.coordinates[1] : 0"
                  ></plm-map-get-armadi>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="Dettagli">
              <PlmInfoArmadio :armadio="armadioSelezionato"></PlmInfoArmadio>
            </b-tab>
            <b-tab title="Note">
              <plm-modifica-nota :armadio="armadioSelezionato"></plm-modifica-nota>
            </b-tab>
            <b-tab title="Aggiorna posizione" lazy>
              <plm-agg-pos-armadio :armadio="armadioSelezionato"></plm-agg-pos-armadio>
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
  BTabs,
  BTab,
  BModal,
} from 'bootstrap-vue';
import PlmMapGetArmadi from '@/components/home/modalInfoArmadio/PlmMapGetArmadi';
import PlmInfoArmadio from '@/components/home/modalInfoArmadio/PlmInfoArmadio';
import PlmModificaNota from '@/components/home/modalInfoArmadio/PlmModificaNota';
import PlmAggPosArmadio from '@/components/home/modalInfoArmadio/PlmAggPosArmadio';
import PlmRicercaArmadi from '@/components/home/ricercaArmadi/PlmRicercaArmadi';
const START_MD_SIZE = 768;

export default {
  name: 'PlmArmadi',
  components: {
    PlmRicercaArmadi,
    BContainer,
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    BTabs,
    BTab,
    BModal,
    PlmMapGetArmadi,
    PlmInfoArmadio,
    PlmModificaNota,
    PlmAggPosArmadio,
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
      armadioSelezionato: null
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
      this.armadioSelezionato = item;
      this.$refs.modalPlmArmadi.show();
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
      const loader = this.showLoadingOverlay();
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/centrali`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: { token: sessionStorage.getItem('tokenPlm') }
      })
      .then(response => {
        this.hideLoadingOverlay(loader);
        if (response.data.success)
          this.filtri.centrale.options = response.data.data.map(item => {
            return { value: item, text: item }
          });
      })
      .catch(() => {
        this.hideLoadingOverlay(loader);
        this.notificaErrore();
      });
    },
    getZone() {
      const loader = this.showLoadingOverlay();
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/zone`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: {
          token: sessionStorage.getItem('tokenPlm'),
          centrale: this.filtri.centrale.selected
        }
      })
      .then(response => {
        this.hideLoadingOverlay(loader);
        if (!response.data.success)
          this.apiErrorHandler(response);
        else
          this.filtri.zona.options = response.data.data;
      })
      .catch(() => {
        this.hideLoadingOverlay(loader);
        this.notificaErrore();
      })
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