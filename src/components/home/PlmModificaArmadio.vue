<template>
  <div>
    <b-container class="mt-10">
      <b-row>
        <b-col cols="12">
          <b-card>
            <b-card-header class="text-center bg-transparent">
              <h3>Modifica armadio</h3>
            </b-card-header>
            <b-card-body>
              <b-row>
                <b-col cols="12">
                  <b-form-checkbox
                    class="ml-2 float-right"
                    v-model="ricercaAvanzata"
                    name="check-button"
                    size="lg"
                    switch></b-form-checkbox>
                  <label class="float-right mt-1">Cambia modalità</label>
                </b-col>
              </b-row>
              <b-row>
                <b-col cols="12">
                  <plm-ricerca-armadi ref="ricercaArmadi" @armadioSelezionato="armadioSelezionato" v-if="!ricercaAvanzata"></plm-ricerca-armadi>
                  <plm-ricerca-armadio @armadioSelezionato="armadioSelezionato" v-else></plm-ricerca-armadio>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
        </b-col>
      </b-row>
      <b-modal
        ref="modalModificaArmadio"
        hide-footer
        size="lg">
        <b-container fluid>
          <b-form>
            <b-row>
              <b-col sm="12" md="6" lg="6" xl="6">
                <b-form-group
                  id="groupProvincia"
                  label="Provincia"
                  label-for="selectProvincia">
                  <b-form-select
                    id="selectProvincia"
                    v-model="armadio.provincia"
                    :options="filtri.provincia.options"
                    @change="getComuni"
                    class="form-control selectCustomPrimary">
                    <template #first>
                      <b-form-select-option :value="null">Scegli la provincia</b-form-select-option>
                    </template>
                  </b-form-select>
                </b-form-group>
              </b-col>
              <b-col sm="12" md="6" lg="6" xl="6" class="mt-2 mt-md-0 mt-lg-0 mt-xl-0">
                <b-form-group
                  id="groupCentrale"
                  label="Centrale"
                  label-for="selectCentrale">
                  <b-form-select
                    id="selectCentrale"
                    v-model="armadio.centrale"
                    :options="filtri.comune.options"
                    :disabled="!provinciaScelta"
                    class="form-control selectCustomPrimary">
                    <template #first>
                      <b-form-select-option :value="null">Scegli il comune</b-form-select-option>
                    </template>
                  </b-form-select>
                </b-form-group>
              </b-col>
              <b-col sm="12" md="6" lg="6" xl="6" class="mt-2">
                <b-form-group
                  id="groupProgressivo"
                  label="Progressivo"
                  label-for="selectProgressivo">
                  <b-form-input
                    id="selectProgressivo"
                    placeholder="Inserisci il progressivo"
                    class="inputCustomSecondary"
                    v-model="armadio.progressivo"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="12" md="6" lg="6" xl="6" class="mt-2">
                <b-form-group
                  id="groupZona"
                  label="Zona"
                  label-for="inputZona">
                  <b-form-input
                    id="inputZona"
                    placeholder="Inserisci la zona"
                    class="inputCustomSecondary"
                    v-model="armadio.zona.info1"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="12" md="6" lg="6" xl="6" class="mt-2">
                <b-form-group
                  id="groupTipoArmadio"
                  label="Tipo Armadio"
                  label-for="inputTipoArmadio">
                  <b-form-input
                    id="inputTipoArmadio"
                    placeholder="Inserisci il tipo di armadio"
                    class="inputCustomSecondary"
                    v-model="armadio.tipoArmadio"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col sm="12" md="6" lg="6" xl="6" class="mt-2">
                <b-form-group
                  id="groupIndirizzo"
                  label="Indirizzo"
                  label-for="inputIndirizzo">
                  <b-form-input
                    id="inputIndirizzo"
                    placeholder="Inserisci l'indirizzo"
                    class="inputCustomSecondary"
                    v-model="armadio.indirizzo"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col cols="12" class="mt-2">
                <b-form-group
                  id="groupNote"
                  label="Zona"
                  label-for="textAreaNote">
                  <b-form-textarea
                    id="textAreaNote"
                    placeholder="Inserisci le note"
                    class="inputCustomSecondary"
                    v-model="armadio.nota"></b-form-textarea>
                </b-form-group>
              </b-col>
              <b-col cols="12" class="mt-2">
                <b-form-group
                  id="groupMap"
                  label="Posizione armadio"
                  label-for="mapAggiornaArmadio">
                  <l-map
                    id="mapAggiornaArmadio"
                    ref="mapAggiornaArmadio"
                    style="height: 300px"
                    @click="aggiornaPosizione"
                    :zoom="zoom"
                    :center="center">
                    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
                    <l-marker v-if="armadio.localizzazione.coordinates.length === 2" :lat-lng="armadio.localizzazione.coordinates"></l-marker>
                  </l-map>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col class="text-center">
                <b-button
                  class="btnCustomPrimary"
                  @click="aggiornaArmadio">Aggiorna</b-button>
              </b-col>
              <b-col class="text-center">
                <b-button
                  class="btnCustomDanger"
                  @click="eliminaArmadio">Elimina</b-button>
              </b-col>
            </b-row>
          </b-form>
        </b-container>
      </b-modal>
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
  BFormCheckbox,
  BForm,
  BFormSelect,
  BFormSelectOption,
  BModal,
  BFormInput,
  BFormTextarea,
  BButton,
  BFormGroup,
} from 'bootstrap-vue';
import {
  LMap,
  LTileLayer,
  LMarker,
} from 'vue2-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import PlmRicercaArmadi from '@/components/home/ricercaArmadi/PlmRicercaArmadi';
import PlmRicercaArmadio from '@/components/home/ricercaArmadi/PlmRicercaArmadio';
import axios from 'axios';
delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  components: {
    PlmRicercaArmadio,
    PlmRicercaArmadi,
    BContainer,
    BRow,
    BCol,
    BCard,
    BCardHeader,
    BCardBody,
    BFormCheckbox,
    BForm,
    BFormSelect,
    BFormSelectOption,
    BModal,
    BFormInput,
    LMap,
    LTileLayer,
    LMarker,
    BFormTextarea,
    BButton,
    BFormGroup,
  },
  name: "PlmModificaArmadio",
  data() {
    return {
      ricercaAvanzata: false,
      armadio: {
        _id: '',
        centrale: null,
        provincia: null,
        progressivo: 0,
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
          options: []
        },
        comune: {
          options: []
        }
      },
      zoom: 15,
      center: [41.073723741325, 14.3423023542596],
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }
  },
  mounted() {
    this.getProvince();
  },
  methods: {
    armadioSelezionato(armadio){
      this.armadio = armadio;
      this.center = armadio.localizzazione.coordinates;
      this.getComuni();
      this.$refs.modalModificaArmadio.show();
      setTimeout(() => this.$refs.mapAggiornaArmadio.mapObject.invalidateSize(), 20);
    },
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
          this.notificaErrore()
        });
    },
    getComuni() {
      const loader = this.showLoadingOverlay();
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/comuni/byProvincia`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: {
          codice: this.armadio.provincia.codice
        }
      })
        .then(response => {
          this.hideLoadingOverlay(loader);
          if (!response.data.success)
            this.apiErrorHandler(response);
          else {
            this.filtri.comune.options = response.data.data.map(item => {
              return { value: item, text: item.nome }
            });
          }
        })
        .catch(() => {
          this.hideLoadingOverlay(loader);
          this.notificaErrore()
        });
    },
    eliminaArmadio() {
      const loader = this.showLoadingOverlay();
      axios.delete(`${process.env.VUE_APP_URL_BACKEND}/armadi/${this.armadio._id}`, {
        headers: { 'Accept-Version': '1.0.0' },
        params: { token: sessionStorage.getItem('tokenPlm') }
      })
        .then(response => {
          this.$refs.modalModificaArmadio.hide();
          let me = this;
          if (response.status === 200) {
            setTimeout(() => {
              me.hideLoadingOverlay(loader);
              me.apiErrorHandler(response);
            }, 200);
          } else {
            setTimeout(() => {
              me.hideLoadingOverlay(loader);
              this.$refs.ricercaArmadi.getArmadi(this.$refs.ricercaArmadi.getPage());
            }, 200);
          }
        })
        .catch(() => {
          this.$refs.modalModificaArmadio.hide();
          let me = this;
          setTimeout(() => {
            me.notificaErrore();
            me.hideLoadingOverlay(loader);
          }, 200);
        });
    },
    aggiornaArmadio() {
      const loader = this.showLoadingOverlay();
      axios.put(`${process.env.VUE_APP_URL_BACKEND}/armadi/${this.armadio._id}`, this.armadio, {
        headers: { 'Accept-Version': '1.0.0' },
        params: { token: sessionStorage.getItem('tokenPlm') }
      })
      .then(response => {
        this.$refs.modalModificaArmadio.hide();
        let me =this;
        if (!response.data.success) {
          setTimeout(() => {
            me.hideLoadingOverlay(loader);
            me.apiErrorHandler(response);
          }, 200);
        }
        else {
          setTimeout(() => {
            me.hideLoadingOverlay(loader);
            me.$alert({
              title: 'Operazione riuscita',
              content: 'L\'aggiornamento dell\'armadio è avvenuto con successo'
            });
          }, 200);
        }
      })
      .catch(() => {
        this.$refs.modalModificaArmadio.hide();
        let me = this;
        setTimeout(() => {
          me.notificaErrore();
          me.hideLoadingOverlay(loader);
        }, 200);
      })
    },
    aggiornaPosizione(e) {
      this.armadio.localizzazione.coordinates = [ e.latlng.lat, e.latlng.lng ];
    }
  },
  computed: {
    provinciaScelta() { return this.armadio.provincia != null; },
  },
}
</script>

<style scoped>

</style>