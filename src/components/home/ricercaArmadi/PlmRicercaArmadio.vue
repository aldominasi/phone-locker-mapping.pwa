<template>
  <!-- Componente per la ricerca dell'armadio utilizzando l'id dell'armadio -->
  <div>
    <b-row>
      <b-col cols="12">
        <b-form novalidate class="text-center">
          <b-row>
            <b-col sm="12" md="10" lg="10" xl="10">
              <!-- Input ID -->
              <b-form-input
                placeholder="ID dell'armadio"
                v-model="idArmadio"
                class="inputCustomSecondary mb-2 mr-sm-2 mb-sm-0"></b-form-input>
            </b-col>
            <b-col sm="12" md="2" lg="2" xl="2">
              <!-- Button cerca armadio -->
              <b-button
                @click="getArmadio"
                :disabled="!abilitaRicerca"
                class="btnCustomPrimary">Cerca</b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-col>
      <!-- Visualizzazione delle informazioni dell'armadio -->
      <b-col cols="12" class="mt-2" v-if="armadio != null">
        <strong>Centrale: </strong>
        <span>{{ armadio.centrale.nome }}</span>
      </b-col>
      <b-col cols="12" class="mt-2" v-if="armadio != null">
        <strong>Progressivo: </strong>
        <span>{{ armadio.progressivo }}</span>
      </b-col>
      <b-col cols="12" class="mt-2" v-if="armadio != null">
        <strong>Zona: </strong>
        <span>{{ armadio.zona['info1'] }}</span>
      </b-col>
      <b-col cols="12" class="mt-2" v-if="armadio != null">
        <strong>Tipo: </strong>
        <span>{{ armadio.tipoArmadio }}</span>
      </b-col>
      <b-col cols="12" class="mt-2" v-if="armadio != null">
        <strong>Indirizzo: </strong>
        <span>{{ armadio.indirizzo }}</span>
      </b-col>
      <b-col cols="12" class="mt-2" v-if="armadio != null">
        <strong>Note: </strong>
        <span>{{ armadio.nota }}</span>
      </b-col>
      <b-col cols="12" class="mt-2" v-if="armadio != null">
        <l-map
          ref="myMapInfo"
          style="height: 300px;width: 100%"
          :zoom="zoom"
          :center="center">
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-control position="bottomleft">
            <div class="legend">
              <h4>Legenda</h4>
              <i style="background-color: #2b82cb"></i>
              <span>Armadio</span>
            </div>
          </l-control>
          <l-marker v-if="armadio != null" :lat-lng="armadio.localizzazione.coordinates"></l-marker>
        </l-map>
      </b-col>
      <!-- Button per la selezione dell'armadio -->
      <b-col cols="12" class="text-center mt-2" v-if="armadio != null">
        <b-button
          class="btnCustomPrimary"
          @click="selezionaArmadio">Seleziona</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {
  BRow,
  BCol,
  BForm,
  BFormInput,
  BButton,
} from 'bootstrap-vue';
import 'leaflet/dist/leaflet.css';
import {
  LMap,
  LTileLayer,
  LMarker,
  LControl,
} from 'vue2-leaflet';
import { Icon } from 'leaflet';
import axios from 'axios';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  components: {
    BRow,
    BCol,
    BForm,
    BFormInput,
    BButton,
    LMap,
    LTileLayer,
    LMarker,
    LControl,
  },
  name: "PlmRicercaArmadio",
  data() {
    return {
      idArmadio: '',
      armadio: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15, //Zoom sulla mappa
      center: [], // Latitudine e longitudine su cui centrare la mappa
    }
  },
  methods: {
    getArmadio() {
      // Metodo utilizzato per richiedere al server le informazioni dell'armadio
      const loader = this.showLoadingOverlay();
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/armadi/${this.idArmadio}`, {
        headers: { "Accept-Version": '1.0.0' },
        params: { token: sessionStorage.getItem('tokenPlm') }
      })
      .then(response => {
        this.hideLoadingOverlay(loader);
        if (!response.data.success)
          this.apiErrorHandler(response);
        else
          this.armadio = response.data.data;
        this.center = response.data.data.localizzazione.coordinates;
      })
      .catch(() => {
        this.hideLoadingOverlay(loader);
        this.notificaErrore();
      });
    },
    selezionaArmadio() { // Emette l'evento al componente genitore per indicare l'armadio selezionato
      this.$emit('armadioSelezionato', this.armadio);
    }
  },
  computed: {
    abilitaRicerca() { return this.idArmadio !== '' } // Abilita il pulsante per l'invio dei dati
  }
}
</script>

<style scoped>

</style>