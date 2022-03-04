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
          <b-nav-item href="#" @click="changeComponent(0, 'Home')">Home</b-nav-item>
          <b-nav-item href="#" @click="changeComponent(1, 'Utenti')">Utenti</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <home v-if="indexComponent === 0"></home>
    <utenti v-else-if="indexComponent === 1"></utenti>
  </div>
</template>

<script>
import Home from '@/components/home/Home';
import Utenti from '@/components/home/Utenti';

export default {
  name: 'navBar',
  components: {
    Home,
    Utenti
  },
  data() {
    return {
      title: 'Home',
      indexComponent: 0
    }
  },
  methods: {
    changeComponent: function (indexComponent, title) {
      this.indexComponent = indexComponent;
      this.title = title;
    }
  }
}
</script>

<style scoped>

</style>