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
      variantToast: ''
    }
  },
  methods: {
    aggiornaNote() {
      const loader = this.showLoadingOverlay();
      const body = [{
          operation: 'replace',
          path: 'nota',
          value: this.jsonData.nota
        }];
      axios.patch(`${process.env.VUE_APP_URL_BACKEND}/armadi/${this.$props.armadio._id}`, body, {
        headers: {
          'Accept-Version': '1.0.0',
          'Content-Type': 'application/json-patch+json'
        },
        params: { token: sessionStorage.getItem('tokenPlm') }
      })
      .then(response => {
        this.hideLoadingOverlay(loader);
        if (!response.data.success)
          this.apiErrorHandler(response);
        else {
          this.$props.armadio.nota = response.data.data.nota;
          this.variantToast = 'success';
          this.titleToast = 'Operazine riuscita';
          this.resultUpdate = 'Le note sono state aggiornate correttamente';
          this.$refs["toast-res-patch-nota"].show();
        }
      })
      .catch(() => {
        this.hideLoadingOverlay(loader);
        this.variantToast = 'danger';
        this.titleToast = 'Operazine non riuscita';
        this.resultUpdate = 'Si è verificato un errore. Riprova più tardi';
        this.$refs["toast-res-patch-nota"].show();
      })
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