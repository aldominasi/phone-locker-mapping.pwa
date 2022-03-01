<template>
  <div>
    <side-bar></side-bar>
    <p>{{jsonData.toString()}}</p>
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
  data() {
    return {
      jsonData: null,
    }
  },
  mounted() {
    axios.get(`${process.env.VUE_APP_URL_BACKEND}/armadi`, {
      headers: {
        "Accept-Version": '1.0.0'
      },
      params: {
        page: 0,
        limit: 10
      },
      withCredentials: true
    })
      .then(response => {
        this.jsonData = response.data;
        //console.log(response.data);
      })
      .catch(err => {
        console.log(err);
      });
  }
}
</script>

<style scoped>

</style>