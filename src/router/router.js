import vue from 'vue';
import VueRouter from 'vue-router';
const PlmLogin = () => import ('@/components/login/PlmLogin');
const NavBar = () => import('@/components/navbar/navBar');
const PlmArmadi = () => import ('@/components/home/PlmArmadi');
const PlmUtenti = () => import('@/components/home/PlmUtenti');
const PlmRegistraUtente = () => import('@/components/home/PlmRegistraUtente');
const PlmPwdLost = () => import('@/components/password/PlmPwdLost');
const PlmPwdChange = () => import('@/components/password/PlmPwdChange');

vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'PlmLogin',
    component: PlmLogin
  },
  {
    path: '/home',
    name: 'PlmHome',
    component: NavBar,
    children: [
      {
        path: 'armadi',
        component: PlmArmadi
      },
      {
        path: 'utenti',
        component: PlmUtenti
      },
      {
        path: 'addUtente',
        component: PlmRegistraUtente
      },
      {
        path: 'pwdChange',
        component: PlmPwdChange
      }
    ]
  },
  {
    path: '/logout',
    name: 'PlmLogout',
    component: {
      beforeRouteEnter(to, from, next) {
        sessionStorage.clear();
        next({
          path: '/',
          replace: true
        });
      }
    }
  },
  {
    path: '/pwdLost',
    name: 'PlmPwdLost',
    component: PlmPwdLost
  }
];

const router = new VueRouter({
  routes,
  mode: "hash",
  base: process.env.BASE_URL
});

export default router