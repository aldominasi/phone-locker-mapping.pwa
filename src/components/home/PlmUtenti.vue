<template>
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <b-card>
            <b-card-header class="text-center bg-transparent">
              <h3>Lista utenti</h3>
            </b-card-header>
            <b-card-body>
              <b-row>
                <b-col cols="12" class="mt-2">
                  <div class="overflow-auto">
                    <b-table
                      id="table-utenti"
                      striped
                      hover
                      borderless
                      responsive
                      :busy="tableIsBusy"
                      :fields="fieldsUtenti"
                      :items="jsonData.utenti">
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
                      aria-controls="table-armadi"></b-pagination>
                  </div>
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
  BPagination,
  BTable,
  BSpinner,
} from 'bootstrap-vue';
import axios from 'axios';

export default {
  name: 'PlmUtenti',
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
  },
  data() {
    return {
      jsonData: {
        utenti: []
      },
      currentPage: 1,
      perPage: 3,
      elementiTotali: 0,
      tableIsBusy: false,
      fieldsUtenti: [
        {
          key: 'email',
          label: 'Email',
        },
        {
          key: 'nome',
          label: 'Nome',
        },
        {
          key: 'cognome',
          label: 'Cognome',
        },
        {
          key: 'ruolo',
          label: 'Ruolo',
        }
      ],
    }
  },
  mounted() {
    this.getUtenti(1);
  },
  methods: {
    getUtenti(page) {
      this.tableIsBusy = true;
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/utenti`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: {
          token: sessionStorage.getItem('tokenPlm'),
          page: page - 1,
          limit: this.perPage
        }
      })
      .then(response => {
        if (!response.data.success) {
          this.tableIsBusy = false;
          return console.log(response.data.msg);
        }
        this.jsonData.utenti = response.data.data.utenti;
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
    }
  }
}
</script>

<style scoped>

</style>