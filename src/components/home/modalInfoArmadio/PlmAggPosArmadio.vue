<template>
  <!-- Componente che visualizza la posizione geografica dell'armadio e dell'utente e
   offre la possibilità di aggiornare la posizione dell'armadio con quella recuperata dal dispositivo-->
  <div>
    <b-container>
      <b-row>
        <b-col cols="12">
          <!-- Mappa -->
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
            <!-- Markers -->
            <l-marker :lat-lng="armadio.localizzazione.coordinates"></l-marker>
            <l-marker
              :icon="iconMyPosition"
              v-if="jsonData.posizioneDispositivo.length === 2"
              :lat-lng="jsonData.posizioneDispositivo"></l-marker>
          </l-map>
        </b-col>
        <b-col cols="12" class="mt-2 text-center">
          <b-button
            class="btnCustomPrimary"
            :disabled="!abilitaAggiornamento"
            @click="invia">Invia posizione</b-button>
        </b-col>
      </b-row>
      <!-- Visualizza il messaggio relativo all'esito dell'operazione di aggiornamento della posizione dell'armadio -->
      <b-toast
        ref="toast-res-patch-pos"
        toaster="b-toaster-bottom-full"
        :variant="variantToast"
        :title="titleToast"
        solid>
        <span>{{ resultUpdate }}</span>
      </b-toast>
    </b-container>
  </div>
</template>

<script>
import {
  BContainer,
  BRow,
  BCol,
  BButton,
  BToast,
} from 'bootstrap-vue';
import {
  LMap,
  LTileLayer,
  LMarker,
  LControl,
} from 'vue2-leaflet';
import {Icon, icon} from 'leaflet';
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
    LMap,
    LTileLayer,
    LMarker,
    LControl,
    BButton,
    BToast,
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
      zoom: 18,
      center: this.$props.armadio.localizzazione.coordinates,
      iconMyPosition: icon({
        iconRetinaUrl: require('../../../assets/custom/marker-icon-2x-red.png'),
        iconUrl: require('../../../assets/custom/marker-icon-red.png'),
        shadowUrl: require('../../../assets/custom/marker-shadow.png'),
      }),
      titleToast: '',
      resultUpdate: '',
      variantToast: ''
    };
  },
  mounted() {
    this.getMyCoords();
    setTimeout(() => this.$refs.myMapUpdate.mapObject.invalidateSize(), 20);
  },
  methods: {
    getMyCoords() {
      // Metodo che chiede all'utente di recuperare la propria posizione
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        this.jsonData.posizioneDispositivo = [latitude, longitude];
      }, err => {
        const modalAlert = {
          title: 'Attenzione',
          content: ''
        };
        if (err.code === 1)
          modalAlert.content = 'La piattaforma non ha i permessi per accedere alla localizzazione del dispositivo';
        else
          modalAlert.content = 'Si è verificato un errore. Riprova più tardi';
        alert(modalAlert.content);
      });
    },
    invia() {
      // Metodo utilizzato per l'invio dei dati
      const loader = this.showLoadingOverlay();
      const body = [{
        operation: 'replace',
        path: 'localizzazione.coordinates',
        value: this.jsonData.posizioneDispositivo
      }];
      axios.patch(`${process.env.VUE_APP_URL_BACKEND}/armadi/${this.$props.armadio._id}`, body, {
        headers: {
          'Accept-Version': '1.0.0',
          'Content-Type': 'application/json-patch+json'
        },
        params: {
          token: sessionStorage.getItem('tokenPlm'),
        }
      })
      .then(response => {
        this.hideLoadingOverlay(loader);
        if (!response.data.success)
          this.apiErrorHandler(response);
        else {
          this.$props.armadio.localizzazione.coordinates = response.data.data.localizzazione.coordinates;
          this.variantToast = 'success';
          this.titleToast = 'Operazine riuscita';
          this.resultUpdate = 'La posizione dell\'armadio è stata aggiornata correttamente';
          this.$refs["toast-res-patch-pos"].show();
        }
      })
      .catch(() => {
        this.hideLoadingOverlay(loader);
        this.variantToast = 'danger';
        this.titleToast = 'Operazine non riuscita';
        this.resultUpdate = 'Si è verificato un errore. Riprova più tardi';
        this.$refs["toast-res-patch-pos"].show();
      });
    }
  },
  computed: {
    abilitaAggiornamento() { // Abilita/Disabilita il button di invio dati
      return this.jsonData.posizioneDispositivo.length === 2;
    }
  }
}
</script>

<style scoped>

</style>