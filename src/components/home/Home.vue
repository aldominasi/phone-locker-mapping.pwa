<template>
  <div>
    <side-bar></side-bar>

  </div>
</template>

<script>
import SideBar from '@/components/navbar/navBar';
import axios from 'axios';

export default {
  name: 'PlmHome',
  components: {
    SideBar
  },
  mounted() {
    axios.get(`${process.env.VUE_APP_URL_BACKEND}/armadi`, {
      headers: {
        "Accept-Version": '1.0.0'
      },
      params: {
        page: 0,
        limit: 10
      }
    })
      .then(response => {
        console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
</script>

<style scoped>

</style>