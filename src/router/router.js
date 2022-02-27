import vue from 'vue';
import VueRouter from 'vue-router';
import PlmLogin from '@/components/login/PlmLogin';

vue.use(VueRouter);

const routes = [
  {
    "path": '/',
    "name": 'PlmLogin',
    "component": PlmLogin
  }
];

const router = new VueRouter({
  routes,
  mode: "hash",
  base: process.env.BASE_URL
});

export default router