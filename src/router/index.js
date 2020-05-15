import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/users/User.vue'
import Right from '../components/power/Rights.vue'
import Role from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import List from '../components/goods/List.vue'
import Params from '../components/goods/Params.vue'

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
      { path: '/params', component: Params }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 如果访问的是我的login页面，，直接下一步进入登录y页面
  if (to.path === '/login') return next()
  // 获取token
  const token = window.sessionStorage.getItem('token')
  // 通过判断有没有token来判断有没有用户的登录，然后进行相关的业务逻辑跳转
  if (!token) return next({ path: '/login' })
  // 如果登录直接跳到相关的页面
  next()
})

export default router
