<template>
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <b-card>
            <b-card-header class="text-center bg-transparent">
              <h4>Filtri Di Ricerca</h4>
            </b-card-header>
            <b-card-body>
              <b-form>
                <b-form-select
                  id="sel-centrale"
                  class="form-control"
                  size="sm"
                  @change="getArmadi"
                  v-model="filtri.centrale.selected"
                  :options="filtri.centrale.options">
                  <template #first>
                    <b-form-select-option :value="null" disabled>Scegli la centrale</b-form-select-option>
                  </template>
                </b-form-select>
              </b-form>
            </b-card-body>
          </b-card>
        </b-col>
        <b-col cols="12" class="mt-2">
          <b-card>
            <b-card-body>
              <div class="overflow-auto">
                <b-table
                  id="table-armadi"
                  striped
                  hover
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
                        <b-col cols="12" class="text-center"><b>{{ row.item.indirizzo }}</b></b-col>
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
  BFormSelect,
  BFormSelectOption,
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
    BFormSelect,
    BFormSelectOption,
  },
  data() {
    return {
      jsonData: [],
      tableIsBusy: false,
      fieldsTable: [
        {
          key: 'centrale',
          label: 'Centrale'
        },
        {
          key: 'zona',
          label: 'Zona',
          formatter: 'zonaFormatter'
        },
        {
          key: 'show_details',
          label: '',
          tdClass: 'text-center'
        }
      ],
      currentPage: 1,
      perPage: 3,
      elementiTotali: 0,
      filtri: {
        centrale: {
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
      this.getArmadi();
    },
    getArmadi() {
      this.tableIsBusy = true;
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/armadi`, {
        headers: { "Accept-Version": '1.0.0' },
        params: {
          token: sessionStorage.getItem('tokenPlm'),
          page: this.currentPage - 1,
          limit: this.perPage,
          centrale: this.filtri.centrale.selected
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
        console.log(response.data);
        this.filtri.centrale.options = response.data.data.map(item => {
          return { value: item, text: item }
        });
      })
      .catch(err => {
        console.log(err);
      });
    }
  },
  computed: {
    rows() {
      return this.elementiTotali;
    },
    smallSize() {
      return window.innerWidth <= START_MD_SIZE;
    }
  },
}
</script>

<style scoped>
.color-busy-table {
  color: #096280 !important;
}
</style>