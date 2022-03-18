<template>
  <div>
    <b-navbar
      id="navbar-1"
      title="Navbar"
      type="dark"
      toggleable="lg">
      <b-navbar-toggle target="nav-collapse" class="mr-2"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item class="ml-1">
            <router-link v-if="permessiUtente.readArmadi" :to="linkArmadi">Armadi</router-link>
          </b-nav-item>
          <b-nav-item class="ml-1">
            <router-link v-if="permessiUtente.readUtenti" :to="linkUtenti">Utenti</router-link>
          </b-nav-item>
          <b-nav-item class="ml-1">
            <router-link v-if="permessiUtente.writeUtenti" :to="linkRegistraUtente">Registra utente</router-link>
          </b-nav-item>
          <b-nav-item class="ml-1">
            <router-link :to="linkLogout">Esci</router-link>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
import {
  BNavbarToggle,
  BNavbar,
  BNavbarNav,
  BNavItem,
  BCollapse,
} from 'bootstrap-vue';
import axios from 'axios';

export default {
  name: 'navBar',
  components: {
    BNavbarToggle,
    BNavbar,
    BNavbarNav,
    BNavItem,
    BCollapse,
  },
  data() {
    return {
      title: 'Home',
      linkArmadi: 'armadi',
      linkUtenti: 'utenti',
      linkRegistraUtente: 'addUtente',
      linkLogout: '/logout',
      permessiUtente: {
        readUtenti: false,
        writeUtenti: false,
        readArmadi: true,
        writeArmadi: true
      }
    }
  },
  mounted() {
    axios.get(`${process.env.VUE_APP_URL_BACKEND}/utenti/me`, {
      headers: { 'Accept-Version': '1.0.0' },
      params: {
        token: sessionStorage.getItem('tokenPlm')
      }
    })
    .then(response => {
      if (!response.data.success)
        return console.log(response.data.msg);
      this.permessiUtente = response.data.data.permessi;
    })
    .catch(err => {
      console.log(err);
    });
  },
}
</script>

<style scoped>

</style>