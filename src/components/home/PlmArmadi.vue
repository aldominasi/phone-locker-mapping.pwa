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
                  <b-form>
                    <b-form-row>
                      <b-form-input
                        placeholder="Scegli la centrale"
                        v-model="filtri.centrale.selected"
                        debounce="200"
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
                        class="form-control">
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
                      :busy="tableIsBusy"
                      :fields="fieldsTable"
                      :items="jsonData">
                      <template #table-busy>
                        <div class="text-center color-busy-table my-2">
                          <b-spinner class="align-middle"></b-spinner>
                          <strong> Caricamento...</strong>
                        </div>
                      </template>
                      <template #cell(show_details)="row">
                        <b-button
                          style="width: max-content"
                          @click="row.toggleDetails">
                          {{ row.detailsShowing ? 'Nascondi' : 'Mostra' }} Dettagli
                        </b-button>
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
} from 'bootstrap-vue';
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
        // {
        //   key: 'show_details',
        //   label: '',
        //   tdClass: 'text-center'
        // }
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
            return console.log(response.data.msg);
          }
          this.jsonData = response.data.data.armadi;
          this.elementiTotali = response.data.data.documentiTotali;
          this.tableIsBusy = false;
        })
        .catch(err => {
          this.tableIsBusy = false;
          console.log(err);
        });
    },
    getCentrali() {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/centrali`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: { token: sessionStorage.getItem('tokenPlm') }
      })
      .then(response => {
        if (!response.data.success)
          return console.log(response.data.msg);
        this.filtri.centrale.options = response.data.data.map(item => {
          return { value: item, text: item }
        });
      })
      .catch(err => {
        console.log(err);
      });
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
          return console.log(response.data.msg);
        this.filtri.zona.options = response.data.data;
      })
      .catch(err => console.log(err))
    },
    resetFiltri() {
      this.filtri.centrale.selected = '';
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