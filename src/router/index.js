import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () =>import ( /* webpackChunkName:"login_home_welcaome"*/ '../components/Login.vue')
// import Login from '../components/Login.vue'
const Home = () =>import ( /* webpackChunkName:"login_home_welcaome"*/ '../components/Home.vue')
// import Home from '../components/Home.vue'
const Welcome = () =>import ( /* webpackChunkName:"login_home_welcaome"*/ '../components/Welcome.vue')
// import Welcome from '../components/Welcome.vue'
const User = () =>import ( /* webpackChunkName:"users"*/ '../components/users/User.vue')
// import User from '../components/users/User.vue'
const Right = () =>import ( /* webpackChunkName:"power"*/ '../components/power/Rights.vue')
// import Right from '../components/power/Rights.vue'
const Role = () =>import ( /* webpackChunkName:"power"*/ '../components/power/Roles.vue')
// import Role from '../components/power/Roles.vue'
const Cate = () =>import ( /* webpackChunkName:"goods"*/ '../components/goods/Cate.vue')
// import Cate from '../components/goods/Cate.vue'
const List = () =>import ( /* webpackChunkName:"goods"*/ '../components/goods/List.vue')
// import List from '../components/goods/List.vue'
const addList = () =>import ( /* webpackChunkName:"goods"*/ '../components/goods/list/addList.vue')
// import addList from '../components/goods/list/addList.vue'
const Params = () =>import ( /* webpackChunkName:"goods"*/ '../components/goods/Params.vue')
// import Params from '../components/goods/Params.vue'
const Order = () =>import ( /* webpackChunkName:"order"*/ '../components/order/Order.vue')
// import Order from '../components/order/Order.vue'
const Report = () =>import ( /* webpackChunkName:"report"*/ '../components/report/Report.vue')
// import Report from '../components/report/Report.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: User },
      { path: '/rights', component: Right },
      { path: '/roles', component: Role },
      { path: '/categories', component: Cate },
      { path: '/goods', component: List },
      { path: '/goods/add', component: addList },
      { path: '/params', component: Params },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果访问的是我的login页面，，直接下一步进入登录页面
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem('token')
  // 通过判断有没有token来判断有没有用户的登录，然后进行相关的业务逻辑跳转
  if (!token) return next({ path: '/login' })
  // 如果登录直接跳到相关的页面
  next()
})

export default router
