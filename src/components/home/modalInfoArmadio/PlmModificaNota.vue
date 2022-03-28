<template>
  <div>
    <b-container>
      <b-row>
        <b-col cols="12" class="text-center">
          <strong>AGGIORNA LE NOTE</strong>
        </b-col>
        <b-col cols="12" class="mt-2">
          <b-form-textarea v-model="jsonData.nota"></b-form-textarea>
        </b-col>
      </b-row>
      <b-row class="mt-2">
        <b-col cols="12" class="text-center">
          <b-button
            class="btnCustomPrimary"
            :disabled="!noteModificate"
            @click="aggiornaNote">Aggiorna le note</b-button>
        </b-col>
      </b-row>
      <b-toast
        ref="toast-res-patch-nota"
        toaster="b-toaster-bottom-full"
        :title="titleToast"
        solid>
        <span :class="classSpanToast">{{ resultUpdate }}</span>
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
  BFormTextarea,
  BToast,
} from 'bootstrap-vue';
import axios from 'axios';

export default {
  components: {
    BContainer,
    BRow,
    BCol,
    BButton,
    BFormTextarea,
    BToast,
  },
  props: {
    armadio: Object
  },
  name: "PlmModificaNota",
  data() {
    return {
      jsonData: {
        nota: this.$props.armadio.nota
      },
      titleToast: '',
      resultUpdate: '',
      classSpanToast: ''
    }
  },
  methods: {
    aggiornaNote() {
      const body = [{
          operation: 'replace',
          path: 'nota',
          value: this.jsonData.nota
        }];
      axios.patch(`${process.env.VUE_APP_URL_BACKEND}/armadi/${this.$props.armadio._id}`, body, {
        headers: { 'Accept-Version': '1.0.0' },
        params: {
          token: sessionStorage.getItem('tokenPlm'),
        }
      })
      .then(response => {
        if (!response.data.success)
          this.apiErrorHandler(response);
        else {
          this.$props.armadio.nota = response.data.data.nota;
          this.classSpanToast = 'text-success';
          this.titleToast = 'Operazine Riuscita';
          this.resultUpdate = 'Le note sono state aggiornate correttamente';
          this.$refs["toast-res-patch-nota"].show();
        }
      })
      .catch(() => this.notificaErrore())
    }
  },
  computed: {
    noteModificate() {
      return this.jsonData.nota !== this.$props.armadio.nota
    }
  }
}
</script>

<style scoped>

</style>