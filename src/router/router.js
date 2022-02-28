import vue from 'vue';
import VueRouter from 'vue-router';
const Login = () => import ('@/components/login/PlmLogin');
const Home = () => import('@/components/home/Home');

vue.use(VueRouter);

const routes = [
  {
    "path": '/',
    "name": 'PlmLogin',
    "component": Login
  },
  {
    "path": '/home',
    "name": 'PlmHome',
    "component": Home
  }
];

const router = new VueRouter({
  routes,
  mode: "hash",
  base: process.env.BASE_URL
});

export default router