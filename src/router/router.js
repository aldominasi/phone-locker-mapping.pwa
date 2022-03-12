import vue from 'vue';
import VueRouter from 'vue-router';
const PlmLogin = () => import ('@/components/login/PlmLogin');
const NavBar = () => import('@/components/navbar/navBar');
const PlmArmadi = () => import ('@/components/home/PlmArmadi');
const PlmUtenti = () => import('@/components/home/PlmUtenti');
const PlmRegistraUtente = () => import('@/components/home/PlmRegistraUtente');

vue.use(VueRouter);

const routes = [
  {
    "path": '/',
    "name": 'PlmLogin',
    "component": PlmLogin
  },
  {
    "path": '/home',
    "name": 'PlmHome',
    "component": NavBar,
    "children": [
      {
        "path": 'armadi',
        "component": PlmArmadi
      },
      {
        "path": 'utenti',
        "component": PlmUtenti
      },
      {
        "path": 'addUtente',
        "component": PlmRegistraUtente
      }
    ]
  }
];

const router = new VueRouter({
  routes,
  mode: "hash",
  base: process.env.BASE_URL
});

export default router