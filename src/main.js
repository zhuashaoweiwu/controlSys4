
// core plugins
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import service from './utils/request'
import lodash from 'lodash'
// import VueAMap from 'vue-amap'
import 'jquery'
import './../static/js/child.js'
import './../static/js/GooFunc.js'
import './../static/js/GooFlow.js'
// style
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css

import '@/permission' // permission control
import echarts from 'echarts'
import config from './config/config'
import filter from '@/utils/filter'

// Vue.prototype.$aMap = VueAMap
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.conf = Vue.prototype.$config = config
Vue.hub = Vue.prototype.$hub = new Vue()
Vue._ = Vue.prototype.$_ = lodash
Vue.use(ElementUI)

// 更佳优雅的引入
Object.defineProperty(Vue.prototype, '$HTTP', {value: service})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
