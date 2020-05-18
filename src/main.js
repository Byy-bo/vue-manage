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
// 导入树形表格插件
import TreeTable from 'vue-table-with-tree-grid'
// import { Message, MessageBox } from 'element-ui'
// 导入文本编辑插件
import vueQuillEditor from 'vue-quill-editor'
// 导入样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 注册
Vue.component('tree-table', TreeTable)
// 全局注册
Vue.use(vueQuillEditor)
// 配置公共的url
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 将我的axios加入到vue实例当中
Vue.prototype.$axios = axios
// 请求拦截器，，请求之前配置我的token
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
// // 消息提示
// Vue.prototype.$message = Message
// // 消息弹框
// Vue.prototype.$confirm = MessageBox

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
