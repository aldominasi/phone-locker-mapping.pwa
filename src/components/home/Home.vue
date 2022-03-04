<template>
  <div class="overflow-auto">
    <b-table
      id="table-armadi"
      striped
      hover
      :items="jsonData"></b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      @change="changePageTable"
      aria-controls="table-armadi"></b-pagination>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'PlmHome',
  data() {
    return {
      jsonData: [],
      currentPage: 1,
      perPage: 5,
      elementiTotali: 0
    }
  },
  mounted() {
    this.getArmadi();
  },
  methods: {
    changePageTable(page) {
      this.currentPage = page;
      this.getArmadi();
    },
    getArmadi() {
      axios.get(`${process.env.VUE_APP_URL_BACKEND}/armadi`, {
        headers: {
          "Accept-Version": '1.0.0'
        },
        params: {
          token: sessionStorage.getItem('tokenPlm'),
          page: this.currentPage - 1,
          limit: this.perPage
        },
        withCredentials: true
      })
        .then(response => {
          if (!response.data.success)
            return console.log('not success');
          this.jsonData = response.data.data.armadi;
          this.elementiTotali = response.data.data.documentiTotali;
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    rows() {
      return this.elementiTotali;
    }
  }
}
</script>

<style scoped>

</style>