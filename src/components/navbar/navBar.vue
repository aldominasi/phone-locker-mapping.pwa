<template>
  <div>
    <b-navbar
      id="navbar-1"
      title="Navbar"
      type="dark"
      toggleable="lg">
      <b-navbar-brand class="ml-2">{{title}}</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse" class="mr-2"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item>
            <router-link :to="linkArmadi">Home</router-link>
          </b-nav-item>
          <b-nav-item>
            <router-link :to="linkUtenti">Utenti</router-link>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>
import {
  BNavbarBrand,
  BNavbarToggle,
  BNavbar,
  BNavbarNav,
  BNavItem,
  BCollapse,
} from 'bootstrap-vue';

export default {
  name: 'navBar',
  components: {
    BNavbarBrand,
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
      linkUtenti: 'utenti'
    }
  },
}
</script>

<style scoped>

</style>