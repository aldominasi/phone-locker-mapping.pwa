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
          <b-nav-item href="#" @click="changeComponent(0, 'Home')">Link</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <home v-if="indexComponent === 0"></home>
  </div>
</template>

<script>
import Home from '@/components/home/Home';

export default {
  name: 'navBar',
  components: {
    Home
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