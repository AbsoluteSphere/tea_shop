import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect:'/home'
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/Home.vue")
  },
  {
    path: "/list",
    name: "List",
    component: () => import("../views/List.vue"),
  },
  {
    path: "/cart",
    name: "Cart",
    component: () => import("../views/Cart.vue"),
  },
  {
    path: "/my",
    name: "My",
    component: () => import("../views/My.vue"),
  },
  // 搜索路由
  {
    path: "/search",
    name: "Search",
    children:[
      {
        // 点击搜索后的默认路由
        path:'/',
        name:'index',
        component: () => import("@/views/search/Search-index.vue")
      },
      {
        path:'/list',
        name:'list',
        component: () => import("@/views/search/Search-list.vue")
      }
    ],
    component: () => import("@/views/Search.vue"),
  },
  // 商品详情页路由
  {
    path:'/detail',
    name:'Detail',
    component: () => import("../views/Detail.vue")
  },
  // 初始登录页面，手机号登录路由
  {
    path:'/login',
    name:'Login',
    component:() => import("@/views/login/Login.vue")
  },
  // 密码登录路由
  {
    path:'/userLogin',
    name:'UserLogin',
    component:()=> import("@/views/login/UserLogin.vue")
  },
  // 点击注册路由
  {
    path:'/register',
    name:'Register',
    component:() => import("@/views/login/Register.vue")
  },
  // 找回密码
  {
    path: "/recovery",
    name: "Recovery",
  children:[
    {
      path: "/",
      name: "index",
      component: () =>
        import("@/views/recorvery/RecorveryIndex.vue"),
    },
    {
      path: "/btn",
      name: "btn",
      component: () =>
        import("@/views/recorvery/RecoveryBtn.vue"),
    }
  ],
    component: () => import("../views/Search.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
