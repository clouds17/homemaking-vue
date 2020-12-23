import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import axios from 'axios'
import '../src/assets/css/global.css'

// 设置基准地址
axios.defaults.baseURL = 'http://localhost:3000/'
// 设置每次发送的请求头
axios.interceptors.request.use(config => {
  // 每次请求都在请求头上面加上token
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false

// 设置时间格式化过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  var y = dt.getFullYear()
  var m = (dt.getMonth() + 1 + '').padStart(2, '0')
  var d = (dt.getDate() + '').padStart(2, '0')

  var hh = (dt.getHours() + '').padStart(2, '0')
  var mm = (dt.getMinutes() + '').padStart(2, '0')
  var ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
