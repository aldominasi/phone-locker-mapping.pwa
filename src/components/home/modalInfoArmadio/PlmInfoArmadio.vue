<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="12">
          <b-row class="mt-2">
            <b-col cols="12" class="text-center">
              <strong>CENTRALE</strong>
            </b-col>
            <b-col cols="12">
              <span>{{ armadio.centrale.nome }}</span>
            </b-col>
          </b-row>
          <hr>
          <b-row class="mt-2">
            <b-col cols="12" class="text-center">
              <strong>ZONA</strong>
            </b-col>
            <b-col cols="12">
              <span>{{ armadio.zona.info1 }}</span>
            </b-col>
          </b-row>
          <hr>
          <b-row class="mt-2">
            <b-col cols="12" class="text-center">
              <strong>TIPO DI ARMADIO</strong>
            </b-col>
            <b-col cols="12">
              <span>{{ armadio.tipoArmadio }}</span>
            </b-col>
          </b-row>
          <hr>
          <b-row class="mt-2">
            <b-col cols="12" class="text-center">
              <strong>INDIRIZZO</strong>
            </b-col>
            <b-col cols="12">
              <span>{{ armadio.indirizzo }}</span>
            </b-col>
          </b-row>
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

export default {
  props: {
    armadio: Object
  },
  components: {
    BContainer,
    BRow,
    BCol,
  },
  name: "PlmModificaArmadio"
}
</script>

<style scoped>

</style>