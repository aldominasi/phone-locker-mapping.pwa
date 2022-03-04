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
          <b-nav-item href="/#/home/armadi">Home</b-nav-item>
          <b-nav-item href="/#/home/utenti">Utenti</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />
  </div>
</template>

<script>

export default {
  name: 'navBar',
  data() {
    return {
      title: 'Home'
    }
  },
}
</script>

<style scoped>

</style>