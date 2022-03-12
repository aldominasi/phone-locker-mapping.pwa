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
                <b-col cols="12">
                  <b-form novalidate>
                    <b-form-row>
                      <b-form-input
                        placeholder="Inserisci email"
                        type="email"
                        :state="validationEmail"
                        class="inputCustomSecondary"
                        v-model="filtri.email"></b-form-input>
                    </b-form-row>
                    <b-form-row class="mt-2">
                      <b-form-select
                        v-model="filtri.ruolo.selected"
                        :options="filtri.ruolo.options"
                        class="form-control selectCustomPrimary">
                        <template #first>
                          <b-form-select-option :value="null">Scegli il ruolo</b-form-select-option>
                        </template>
                      </b-form-select>
                    </b-form-row>
                    <b-row class="mt-2">
                      <b-col>
                        <b-button class="btnCustomPrimary" @click="resetFiltri">Reset</b-button>
                        <b-button class="btnCustomSecondary ml-2" :disabled="validationEmail === false" @click="getUtenti(1)">Cerca</b-button>
                      </b-col>
                    </b-row>
                  </b-form>
                </b-col>
                <b-col cols="12" class="mt-2">
                  <div class="overflow-auto">
                    <b-table
                      id="table-utenti"
                      striped
                      hover
                      borderless
                      responsive
                      stacked="sm"
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
  BForm,
  BFormRow,
  BFormInput,
  BFormSelect,
  BFormSelectOption,
  BButton,
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
    BForm,
    BFormRow,
    BFormInput,
    BFormSelect,
    BFormSelectOption,
    BButton,
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
      filtri: {
        email: '',
        ruolo: {
          selected: null,
          options: []
        }
      },
      regexEmail: /^[A-z0-9.+_-]+@[A-z0-9._-]+\.[A-z]{2,6}$/
    }
  },
  mounted() {
    this.getRuoli();
    this.getUtenti(1);
  },
  methods: {
    getUtenti(page) {
      if (this.validationEmail === false)
        return;
      this.tableIsBusy = true;
      const queryDiRicerca = {
        token: sessionStorage.getItem('tokenPlm'),
        page: page - 1,
        limit: this.perPage
      };
      if (this.validationEmail != null)
        queryDiRicerca.email = this.filtri.email;
      if (this.filtri.ruolo.selected != null)
        queryDiRicerca.ruolo = this.filtri.ruolo.selected;
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/utenti`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: queryDiRicerca
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
    },
    getRuoli() {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/ruoli`, {
        headers: { 'Accept-Version': '1.0.0' }
      })
      .then(response => {
        if (!response.data.success) {
          return console.log(response.data.msg);
        }
        this.filtri.ruolo.options = response.data.data.map(item => item._id)
      })
      .catch(err => {
        console.log(err);
      });
    },
    resetFiltri() {
      this.filtri.email = '';
      this.filtri.ruolo.selected = null;
      this.currentPage = 1;
      this.elementiTotali = 0;
      this.getUtenti(1);
    }
  },
  computed: {
    rows() {
      return this.elementiTotali;
    },
    validationEmail() {
      return this.filtri.email === '' ? null : this.regexEmail.test(this.filtri.email)
    }
  }
}
</script>

<style scoped>

</style>