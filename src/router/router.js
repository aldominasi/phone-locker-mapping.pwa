import vue from 'vue';
import VueRouter from 'vue-router';
const Login = () => import ('@/components/login/PlmLogin');
const NavBar = () => import('@/components/navbar/navBar');
const Armadi = () => import ('@/components/home/Armadi');
const Utenti = () => import('@/components/home/Utenti');

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
    "component": NavBar,
    "children": [
      {
        "path": 'armadi',
        "component": Armadi
      },
      {
        "path": 'utenti',
        "component": Utenti
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