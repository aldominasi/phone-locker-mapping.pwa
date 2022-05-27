<template>
  <!-- Popup per richiedere di aggiungere il portale web nella homepage dello smartphone -->
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
    // Evento generato prima di richiedere di aggiungere il sito web sulla homepage dello smartphone
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault(); // Non eseguire l'azione di default scaturita dall'evento
      this.installEvent = e;
      this.$refs["toast-pwa-install"].show(); // Visualizza il popup all'utente
    })
  },
  methods: {
    installPwa() { // Metodo che gestisce la scelta dell'utente
      this.installEvent.prompt();
      this.installEvent.userChoice
        .then((choice) => {
          if (choice.outcome === 'accepted') { // L'utente sceglie di aggiungere il sito web alla sua homepage
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