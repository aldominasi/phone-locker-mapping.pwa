<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="12">
          <l-map
            ref="myMap"
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
            <l-marker :lat-lng="markerLatLng"></l-marker>
          </l-map>
        </b-col>
        <b-col cols="12" class="text-center mt-2">
          <b-button class="btnCustomPrimary" @click="indicazioniStradali">Indicazioni stradali</b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Icon } from 'leaflet';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});
import {
  LMap,
  LTileLayer,
  LMarker,
  LControl,
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BContainer,
  BRow,
  BCol,
  BButton,
} from 'bootstrap-vue';

export default {
  name: "PlmMapGetArmadi",
  props: {
    lat: Number,
    lng: Number
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    BContainer,
    BRow,
    BCol,
    BButton,
    LControl,
  },
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      center: [this.$props.lat, this.$props.lng],
      markerLatLng: [this.$props.lat, this.$props.lng]
    }
  },
  mounted() {
    setTimeout(() => this.$refs.myMap.mapObject.invalidateSize(), 20);
  },
  methods: {
    indicazioniStradali() {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        const query = `api=1&origin=${latitude},${longitude}&destination=${this.markerLatLng[0]},${this.markerLatLng[1]}&travelmode=driving&dir_action=navigate`
        if ((navigator.platform.indexOf('iPhone') !== -1) ||
          (navigator.platform.indexOf('iPad') !== -1) ||
          (navigator.platform.indexOf('iPod') !== -1))
          window.open(`maps://maps.google.com/maps?daddr=${this.armadioSelezionato.lat},${this.armadioSelezionato.lng}&amp;ll=`);
        else
          window.open(`https://www.google.com/maps/dir/?${query}`);
      }, (err) => {
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
    },
  }
}
</script>

<style scoped>

</style>