<template>
  <div>
    <b-navbar
      id="navbar-1"
      title="Navbar"
      type="dark"
      toggleable="md">
      <b-navbar-toggle target="nav-collapse" class="mr-2"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item v-if="permessiUtente.readArmadi" class="ml-1">
            <router-link :to="linkArmadi">Armadi</router-link>
          </b-nav-item>
          <b-nav-item v-if="permessiUtente.readUtenti" class="ml-1">
            <router-link :to="linkUtenti">Utenti</router-link>
          </b-nav-item>
          <b-nav-item v-if="permessiUtente.writeUtenti" class="ml-1">
            <router-link :to="linkRegistraUtente">Registra utente</router-link>
          </b-nav-item>
          <b-nav-item v-if="permessiUtente.writeArmadi" class="ml-1">
            <router-link :to="linkModificaUtente">Modifica armadio</router-link>
          </b-nav-item>
          <b-nav-item v-if="permessiUtente.writeArmadi" class="ml-1">
            <router-link :to="linkRegistraArmadio">Nuovo armadio</router-link>
          </b-nav-item>
        </b-navbar-nav>
        <b-navbar-nav>
          <b-nav-item-dropdown class="ml-1">
            <template #button-content>
              <font-awesome-icon style="color: white;" icon="fa-regular fa-user"/>
            </template>
            <b-dropdown-item>
              <router-link :to="linkModPwd">Modifica password</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link :to="linkLogout">Esci</router-link>
            </b-dropdown-item>
          </b-nav-item-dropdown>
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
  BNavItemDropdown,
  BDropdownItem,
} from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import axios from 'axios';
library.add(faUser);
export default {
  name: 'navBar',
  components: {
    BNavbarToggle,
    BNavbar,
    BNavbarNav,
    BNavItem,
    BCollapse,
    BNavItemDropdown,
    FontAwesomeIcon,
    BDropdownItem,
  },
  data() {
    return {
      title: 'Home',
      linkArmadi: 'armadi',
      linkUtenti: 'utenti',
      linkRegistraUtente: 'addUtente',
      linkModificaUtente: 'updateArmadio',
      linkRegistraArmadio: 'addArmadio',
      linkModPwd: 'pwdChange',
      linkLogout: '/logout',
      permessiUtente: {
        readUtenti: false,
        writeUtenti: false,
        readArmadi: true,
        writeArmadi: false
      }
    }
  },
  beforeCreate() {
    axios.get(`${process.env.VUE_APP_URL_BACKEND}/utenti/me`, {
      headers: { 'Accept-Version': '1.0.0' },
      params: {
        token: sessionStorage.getItem('tokenPlm')
      }
    })
      .then(response => {
        if (!response.data.success)
          this.apiErrorHandler(response);
        else
          this.permessiUtente = response.data.data.permessi;
      })
      .catch(() => {
        this.notificaErrore()
      });
  }
}
</script>

<style scoped>

</style>