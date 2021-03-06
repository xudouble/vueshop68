import Vue from 'vue'
import App from './App'
import router from './router'
// 引入elementui组件库
import Element from 'element-ui'
// 引入icon图标样式文件
import './assets/fonts/iconfont.css'
// 引入全局控制css 样式文件
import './assets/css/global.css'
// Vue.config.productionTip = false
// 引入axios
import axios from 'axios'
Vue.use(Element)
// 配置axios
axios.defaults.baseURL = 'http://127.0.0.1:11333/api/private/v1/'
// axios"请求拦截器"

axios.interceptors.request.use(
  function(config) {
    // 给axios配置token
    // console.dir(axios)
    // console.dir(config)
    var token = window.sessionStorage.getItem('token')
    if (token !== null) {
      config.headers.Authorization = token
    }
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)
Vue.prototype.$http = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
