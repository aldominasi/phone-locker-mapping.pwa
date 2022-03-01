<template>
  <div>
    <b-table
      striped
      hover
      :items="jsonData"></b-table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PlmHome',
  data() {
    return {
      jsonData: [],
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
        if (!response.data.success)
          return console.log('not success');
        console.log(response.data.data);
        this.jsonData = response.data.data.armadi;
      })
      .catch(err => {
        console.log(err);
      });
  }
}
</script>

<style scoped>

</style>