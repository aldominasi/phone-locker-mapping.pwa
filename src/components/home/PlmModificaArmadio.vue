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
                    v-model="ricercaArmadi"
                    name="check-button"
                    switch>Ricerca l'armadio con l'ID</b-form-checkbox>
                </b-col>
              </b-row>
              <b-row class="mt-2">
                <b-col cols="12">
                  <plm-ricerca-armadi v-if="ricercaArmadi"></plm-ricerca-armadi>
                  <plm-ricerca-armadio v-else></plm-ricerca-armadio>
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
  BFormCheckbox,
} from 'bootstrap-vue';
import PlmRicercaArmadi from '@/components/home/ricercaArmadi/PlmRicercaArmadi';
import PlmRicercaArmadio from '@/components/home/ricercaArmadi/PlmRicercaArmadio';

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
  },
  name: "PlmModificaArmadio",
  data() {
    return {
      ricercaArmadi: false,
    }
  }
}
</script>

<style scoped>

</style>