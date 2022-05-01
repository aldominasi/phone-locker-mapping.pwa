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
                        <b-form-select
                          v-model="filtri.provincia.selected"
                          :options="filtri.provincia.options"
                          @change="getComuni"
                          class="form-control selectCustomPrimary">
                          <template #first>
                            <b-form-select-option :value="null">Scegli la provincia *</b-form-select-option>
                          </template>
                        </b-form-select>
                      </b-col>
                      <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                        <b-form-select
                          v-model="jsonData.centrale"
                          :options="filtri.centrale.options"
                          :disabled="!provinciaScelta"
                          class="form-control selectCustomPrimary">
                          <template #first>
                            <b-form-select-option :value="null">Scegli la centrale *</b-form-select-option>
                          </template>
                        </b-form-select>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12">
                        <b-form-input
                          placeholder="Inserisci il progressivo *"
                          class="inputCustomSecondary"
                          v-model="jsonData.progressivo"></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col sm="12" md="6" lg="6" xl="6">
                        <b-form-input
                          placeholder="Inserisci la zona *"
                          class="inputCustomSecondary"
                          v-model="jsonData.zona.info1"></b-form-input>
                      </b-col>
                      <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                        <b-form-input
                          placeholder="Tipologia di armadio *"
                          class="inputCustomSecondary"
                          v-model="jsonData.tipoArmadio"></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12">
                        <b-form-input
                          placeholder="Inserisci indirizzo *"
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
                    <b-row class="mt-2">
                      <b-col cols="12">
                        <label>Clicca sulla mappa per inserire la posizione dell'armadio *</label>
                      </b-col>
                      <b-col cols="12">
                        <l-map
                          @click="aggiungiMarker"
                          ref="mapCreateArmadio"
                          style="height: 300px"
                          :zoom="zoom"
                          :center="center">
                          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                          <l-marker v-if="jsonData.localizzazione.coordinates.length === 2" :lat-lng="jsonData.localizzazione.coordinates"></l-marker>
                        </l-map>
                      </b-col>
                      <b-col cols="12" class="text-right">
                        <span class="small">* Campi obbligatori</span>
                      </b-col>
                    </b-row>
                    <b-row class="mt-3">
                      <b-col class="text-center">
                        <b-button class="btnCustomPrimary" :disabled="!abilitaConferma" @click="invia">Invia</b-button>
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
  BFormSelect,
  BFormSelectOption,
} from 'bootstrap-vue';
import {
  LMap,
  LTileLayer,
  LMarker,
} from 'vue2-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
    LMap,
    LTileLayer,
    LMarker,
    BFormSelect,
    BFormSelectOption,
  },
  data() {
    return {
      jsonData: {
        centrale: null,
        progressivo: '',
        zona: {
          info1: '',
          info2: ''
        },
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
          selected: null,
          options: []
        },
        centrale: {
          options: []
        }
      },
      centraleScelta: false,
      zoom: 15,
      center: [41.073723741325, 14.3423023542596],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }
  },
  mounted() {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      this.center = [ latitude, longitude ];
    }, (err) => {
      const modalAlert = {
        title: 'Attenzione',
        content: ''
      };
      if (err.code === 1)
        modalAlert.content = 'La piattaforma non ha i permessi per accedere alla localizzazione del dispositivo';
      else
        modalAlert.content = 'Si è verificato un errore. Riprova più tardi';
      this.$alert(modalAlert);
    });
    this.getProvince();
  },
  methods: {
    getProvince() {
      const loader = this.showLoadingOverlay();
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/province`, {
        headers: { 'Accept-Version': '1.0.0' }
      })
      .then(response => {
        this.hideLoadingOverlay(loader);
        if (!response.data.success)
          this.apiErrorHandler(response);
        else {
          this.filtri.provincia.options = response.data.data.map(item => {
            return { value: item, text: item.nome };
          });
        }
      })
      .catch(() => {
        this.hideLoadingOverlay(loader);
        this.notificaErrore();
      })
    },
    getComuni() {
      const loader = this.showLoadingOverlay();
      this.jsonData.centrale = null;
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/comuni/byProvincia`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: {
          codice: this.filtri.provincia.selected.codice
        }
      })
      .then(response => {
        this.hideLoadingOverlay(loader);
        if (!response.data.success)
          this.apiErrorHandler(response);
        else {
          this.filtri.centrale.options = response.data.data.map(item => {
            return { value: item, text: item.nome }
          });
        }
      })
      .catch(() => {
        this.hideLoadingOverlay(loader);
        this.notificaErrore();
      });
    },
    invia() {
      const loader = this.showLoadingOverlay();
      axios.post(`${process.env.VUE_APP_URL_BACKEND}/armadi`, this.jsonData, {
        headers: { 'Accept-Version': '1.0.0' },
        params: { token: sessionStorage.getItem('tokenPlm') }
      })
      .then(response => {
        this.hideLoadingOverlay(loader);
        if (!response.data.success)
          this.apiErrorHandler(response);
        else {
          this.$alert({
            title: 'Operazione riuscita',
            content: 'La registrazione dell\'armadio è avvenuta con successo'
          });
          this.clearAll();
        }
      })
      .catch(() => {
        this.hideLoadingOverlay(loader);
        this.notificaErrore();
      });
    },
    aggiungiMarker(e) {
      this.jsonData.localizzazione.coordinates = [ e.latlng.lat, e.latlng.lng ];
    },
    clearAll() {
      this.jsonData.centrale = null;
      this.jsonData.progressivo = '';
      this.jsonData.zona.info1 = '';
      this.jsonData.tipoArmadio = '';
      this.jsonData.indirizzo = '';
      this.jsonData.localizzazione.coordinates = [];
      this.jsonData.nota = '';
    }
  },
  computed: {
    abilitaConferma() {
      return this.jsonData.centrale !== '' &&
        this.jsonData.progressivo !== '' &&
        this.jsonData.tipoArmadio !== '' &&
        this.jsonData.indirizzo !== '' &&
        this.jsonData.zona.info1 !== '' &&
        this.jsonData.localizzazione.coordinates.length === 2
    },
    provinciaScelta() {
      return this.filtri.provincia.selected !== null;
    }
  }
}
</script>

<style scoped>

</style>