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
                        <b-form-input
                          placeholder="Inserisci la centrale"
                          class="inputCustomSecondary"
                          v-model="jsonData.centrale"></b-form-input>
                      </b-col>
                      <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                        <b-form-input
                          placeholder="Inserisci il progressivo"
                          class="inputCustomSecondary"
                          v-model="jsonData.progressivo"></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col sm="12" md="6" lg="6" xl="6">
                        <b-form-input
                          placeholder="Inserisci la zona"
                          class="inputCustomSecondary"
                          v-model="jsonData.zona.info1"></b-form-input>
                      </b-col>
                      <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                        <b-form-input
                          placeholder="Tipologia di armadio"
                          class="inputCustomSecondary"
                          v-model="jsonData.tipoArmadio"></b-form-input>
                      </b-col>
                    </b-row>
                    <b-row class="mt-2">
                      <b-col cols="12">
                        <b-form-input
                          placeholder="Inserisci indirizzo"
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
                        <l-map
                          ref="mapCreateArmadio"
                          style="height: 300px"
                          :zoom="zoom"
                          :center="center">
                          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                          <!--                          <l-marker :lat-lng="jsonData.localizzazione.coordinates"></l-marker>-->
                        </l-map>
                      </b-col>
                    </b-row>
                    <b-row class="mt-3">
                      <b-col class="text-center">
                        <b-button class="btnCustomPrimary" :disabled="!abilitaConferma">Invia</b-button>
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
} from 'bootstrap-vue';
import {
  LMap,
  LTileLayer,
  // LMarker,
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
    // LMarker,
  },
  data() {
    return {
      jsonData: {
        centrale: '',
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
    })
  },
  methods: {
    invia() {
      axios.post(`${process.env.VUE_APP_URL_BACKEND}/armadi`, this.jsonData, {
        headers: { 'Accept-Version': '1.0.0' },
        params: { token: sessionStorage.getItem('tokenPlm') }
      })
      .then(response => {
        if (!response.data.success)
          this.apiErrorHandler(response);
        else
          this.$alert({
            title: 'Operazione riuscita',
            content: 'La registrazione dell\'armadio è avvenuta con successo'
          });
      })
      .catch(() => this.notificaErrore());
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
    }
  }
}
</script>

<style scoped>

</style>