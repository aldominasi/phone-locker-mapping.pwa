<template>
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <b-form inline novalidate>
            <label class="sr-only" for="inlineIdInput">ID armadio</label>
            <b-form-input
              id="inlineIdInput"
              placeholder="Inserisci ID dell'armadio"
              v-model="idArmadio"
              class="inputCustomSecondary mb-2 mr-sm-2 mb-sm-0"></b-form-input>
            <b-button
              @click="getArmadio"
              :disabled="!abilitaRicerca"
              class="btnCustomPrimary">Cerca</b-button>
          </b-form>
        </b-col>
        <b-col cols="12" class="mt-2" v-if="armadio != null">
          <b-row>
            <b-col cols="12">
              <strong>Centrale: </strong>
              <span>{{ armadio.centrale }}</span>
            </b-col>
            <b-col cols="12" class="mt-2">
              <strong>Progressivo: </strong>
              <span>{{ armadio.progressivo }}</span>
            </b-col>
            <b-col cols="12" class="mt-2">
              <strong>Zona: </strong>
              <span>{{ armadio.zona['info1'] }}</span>
            </b-col>
            <b-col cols="12" class="mt-2">
              <strong>Tipo: </strong>
              <span>{{ armadio.tipoArmadio }}</span>
            </b-col>
            <b-col cols="12" class="mt-2">
              <strong>Indirizzo: </strong>
              <span>{{ armadio.indirizzo }}</span>
            </b-col>
            <b-col cols="12" class="mt-2">
              <strong>Note: </strong>
              <span>{{ armadio.nota }}</span>
            </b-col>
          </b-row>
          <b-row class="mt-2">
            <b-col cols="12">
              <l-map
                ref="myMapInfo"
                style="height: 300px"
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
          </b-row>
          <b-row class="mt-2">
            <b-col cols="12" class="text-center">
              <b-button
                class="btnCustomPrimary"
                @click="selezionaArmadio"></b-button>
            </b-col>
          </b-row>
        </b-col>
        <b-col cols="12" class="text-center mt-2" v-else>
          <b-img src="/plm/img/empty.svg" width="100%" center fluid alt="Nessun dato"></b-img>
          <label>Nessun Armadio</label>
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
  BForm,
  BFormInput,
  BImg,
  BButton,
} from 'bootstrap-vue';
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
    BContainer,
    BRow,
    BCol,
    BForm,
    BFormInput,
    BImg,
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
      zoom: 15,
      center: [],
    }
  },
  methods: {
    getArmadio() {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/armadi/${this.idArmadio}`, {
        headers: { "Accept-Version": '1.0.0' },
        params: { token: sessionStorage.getItem('tokenPlm') }
      })
      .then(response => {
        if (!response.data.success)
          this.apiErrorHandler(response);
        else
          this.armadio = response.data.data;
      })
      .catch(() => { this.notificaErrore(); })
    },
    selezionaArmadio() {
      this.$emit('armadioSelezionato', this.armadio);
    }
  },
  computed: {
    abilitaRicerca() { return this.idArmadio !== '' }
  }
}
</script>

<style scoped>

</style>