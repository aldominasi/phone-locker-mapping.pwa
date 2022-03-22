import vue from 'vue';
import VueRouter from 'vue-router';
import { verifyAuthModPwd } from '@/utilityMixin/utility';
const PlmLogin = () => import('@/components/login/PlmLogin');
const NavBar = () => import('@/components/navbar/navBar');
const PlmArmadi = () => import('@/components/home/PlmArmadi');
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
    component: PlmPwdLost,
  }
];

const router = new VueRouter({
  routes,
  mode: "hash",
  base: process.env.BASE_URL
});

router.beforeEach((to, from, next) => {
  if (to.name === 'PlmPwdLost') {
    if (to.query == null || to.query.tkn == null)
      return false;
    verifyAuthModPwd(to.query.tkn)
      .then(() => {
        next();
      })
      .catch(() => {
        next('/');
      });
  } else if (to.name === 'PlmLogin')
    next();
  else {
    if (sessionStorage.getItem('tokenPlm') == null)
      next('/');
    else
      next();
  }
})

export default router