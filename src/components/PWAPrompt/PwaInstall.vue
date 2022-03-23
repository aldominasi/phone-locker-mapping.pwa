<template>
  <b-toast
    ref="toast-pwa-install"
    toaster="b-toaster-bottom-full"
    title="PhoneLockerMapping"
    solid
    no-auto-hide>
    <b-row>
      <b-col>
        <p>Clicca sul pulsante aggiungi per avere l'app sempre con te.</p>
        <b-button class="mr-2 float-right" variant="primary" @click="installPwa">Aggiungi</b-button>
      </b-col>
    </b-row>
  </b-toast>
</template>

<script>
import {
  BToast,
  BRow,
  BCol,
  BButton
} from 'bootstrap-vue';

export default {
  name: 'PwaInstall',
  components: {
    BToast,
    BRow,
    BCol,
    BButton
  },
  data() {
    return {
      installEvent: null,
    }
  },
  beforeMount() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installEvent = e;
      this.$refs["toast-pwa-install"].show();
    })
  },
  methods: {
    installPwa() {
      this.installEvent.prompt();
      this.installEvent.userChoice
        .then((choice) => {
          if (choice.outcome === 'accepted') {
            console.log('accepted');
          } else {
            console.log('not accepted');
          }
        })
        .catch();
    }
  }
}
</script>

<style scoped>

</style>