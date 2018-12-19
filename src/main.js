// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

// core plugins
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import service from './utils/request'
import VueAMap from 'vue-amap'
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

Vue.use(VueAMap)
// 初始化vue-amap
VueAMap.initAMapApiLoader({
  // 高德的key
  key: '40e435061433109f36b48cf4f2399859',
  // 插件集合
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  // 高德 sdk 版本，默认为 1.4.4
  v: '1.4.4'
})

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

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
