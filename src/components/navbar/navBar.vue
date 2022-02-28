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
          <b-nav-item href="#">Link</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
const Home = Symbol("Home");
let component = Home;

export default {
  name: 'navBar',
  data() {
    return {
      title: component.description,
      armadi: [],
    }
  },
  methods: {
    changeComponent: function (value) {
      component = value;
    }
  }
}
</script>

<style scoped>

</style>