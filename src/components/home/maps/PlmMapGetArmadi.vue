<template>
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <l-map
            ref="myMap"
            style="height: 300px"
            :zoom="zoom"
            :center="center">
            <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
            <l-marker :lat-lng="markerLatLng"></l-marker>
          </l-map>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import { Icon } from 'leaflet';
import {
  LMap,
  LTileLayer,
  LMarker
} from 'vue2-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  BContainer,
  BRow,
  BCol,
} from 'bootstrap-vue';

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

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
  },
  data() {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      zoom: 15,
      center: [this.$props.lat, this.$props.lng],
      markerLatLng: [this.$props.lat, this.$props.lng]
    }
  },
  mounted() {
    setTimeout(() => this.$refs.myMap.mapObject.invalidateSize(), 20);
  }
}
</script>

<style scoped>

</style>