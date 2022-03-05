<template>
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <b-card
            class="container card_container">
            <b-card-body>
              <div class="overflow-auto">
                <b-table
                  id="table-armadi"
                  striped
                  hover
                  responsive
                  stacked="sm"
                  :busy="tableIsBusy"
                  :fields="fieldsTable"
                  :items="jsonData">
                  <template #table-busy>
                    <div class="text-center color-busy-table my-2">
                      <b-spinner class="align-middle"></b-spinner>
                      <strong> Caricamento...</strong>
                    </div>
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
  BCardBody,
  BPagination,
  BTable,
  BSpinner,
} from 'bootstrap-vue';
const START_MD_SIZE = 768;

export default {
  name: 'PlmArmadi',
  components: {
    BContainer,
    BRow,
    BCol,
    BCard,
    BCardBody,
    BPagination,
    BTable,
    BSpinner,
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
          key: 'progressivo',
          label: 'Progressivo',
        },
        {
          key: 'zona',
          label: 'Zona',
          formatter: 'zonaFormatter'
        },
        {
          key: 'tipoArmadio',
          label: 'Armadio'
        },
        {
          key: 'indirizzo',
          label: 'Indirizzo'
        }
      ],
      currentPage: 1,
      perPage: 3,
      elementiTotali: 0
    }
  },
  mounted() {
    if (this.smallSize)
      this.perPage = 3;
    else
      this.perPage = 5;
    this.getArmadi();
  },
  methods: {
    zonaFormatter(zona) {
      return `${zona['info1']} - ${zona['info2']}`;
    },
    changePageTable(page) {
      this.currentPage = page;
      this.getArmadi();
    },
    getArmadi() {
      this.tableIsBusy = true;
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/armadi`, {
        headers: {
          "Accept-Version": '1.0.0'
        },
        params: {
          token: sessionStorage.getItem('tokenPlm'),
          page: this.currentPage - 1,
          limit: this.perPage
        }
      })
        .then(response => {
          if (!response.data.success) {
            this.tableIsBusy = false;
            return console.log('not success');
          }
          console.log(response.data.data);
          this.jsonData = response.data.data.armadi;
          this.elementiTotali = response.data.data.documentiTotali;
          this.tableIsBusy = false;
        })
        .catch(err => {
          this.tableIsBusy = false;
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