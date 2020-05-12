import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入我的全局样式
import './assets/manage.less'
// 导入我的字体文件
import './assets/fonts/iconfont.css'
// 导入我的axios
import axios from 'axios'
import { Message } from 'element-ui'
// 配置公共的url
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 将我的axios加入到vue实例当中
Vue.prototype.$axios = axios
// 消息提示
Vue.prototype.$message = Message

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
