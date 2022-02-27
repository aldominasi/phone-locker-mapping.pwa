<template>
  <div v-if="shown">
    Add app to home screen?
    <b-button @click="installPwa">Install</b-button>
    <b-button @click="dismissPrompt">No, thanks</b-button>
  </div>
</template>

<script>
export default {
  name: 'PwaInstall',
  data() {
    return {
      shown: false,
      installEvent: null,
    }
  },
  beforeMount() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installEvent = e;
      this.shown = true;
    })
  },
  methods: {
    dismissPrompt() {
      this.shown = false;
    },
    installPwa() {
      this.installEvent.prompt();
      this.installEvent.userChoice
        .then((choice) => {
          this.dismissPrompt();
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