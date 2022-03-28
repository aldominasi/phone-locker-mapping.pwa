<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="12">
          <l-map
            ref="myMapUpdate"
            style="height: 300px"
            :zoom="zoom"
            :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-control position="bottomleft">
              <div class="legend">
                <h4>Legenda</h4>
                <i style="background-color: #2b82cb"></i>
                <span>Armadio</span><br>
                <i style="background-color: #cb2940"></i>
                <span>Tu</span>
              </div>
            </l-control>
            <l-marker :lat-lng="armadio.localizzazione.coordinates"></l-marker>
            <l-marker
              :icon="iconMyPosition"
              v-if="jsonData.posizioneDispositivo.length === 2"
              :lat-lng="jsonData.posizioneDispositivo"></l-marker>
          </l-map>
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
} from 'bootstrap-vue';
import {
  LMap,
  LTileLayer,
  LMarker,
  LControl,
} from 'vue2-leaflet';
import {Icon, icon} from "leaflet";
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
    LMap,
    LTileLayer,
    LMarker,
    LControl,
  },
  props: {
    armadio: Object,
  },
  name: "PlmAggPosArmadio",
  data() {
    return {
      jsonData: {
        posizioneDispositivo: []
      },
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 13,
      center: this.$props.armadio.localizzazione.coordinates,
      abilitaAggiornamento: false,
      iconMyPosition: icon({
        iconRetinaUrl: require('../../../assets/custom/marker-icon-2x-red.png'),
        iconUrl: require('../../../assets/custom/marker-icon-red.png'),
        shadowUrl: require('../../../assets/custom/marker-shadow.png'),
      }),
    };
  },
  mounted() {
    this.getMyCoords();
    setTimeout(() => this.$refs.myMapUpdate.mapObject.invalidateSize(), 20);
  },
  methods: {
    getMyCoords() {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        this.jsonData.posizioneDispositivo = [latitude, longitude];
        this.abilitaAggiornamento = true;
      }, err => {
        this.abilitaAggiornamento = false;
        const modalAlert = {
          title: 'Attenzione',
          content: ''
        };
        if (err.code === 1)
          modalAlert.content = 'La piattaforma non ha i permessi per accedere alla localizzazione del dispositivo';
        else
          modalAlert.content = 'Si è verificato un errore. Riprova più tardi';
        alert(modalAlert);
      });
    }
  }
}
</script>

<style scoped>

</style>