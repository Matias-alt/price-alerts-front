import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueSweetalert2 from 'vue-sweetalert2'
import HighchartsVue from 'highcharts-vue'
import VCalendar from 'v-calendar'


Vue.config.productionTip = false
Vue.use(HighchartsVue)
Vue.use(VCalendar)

new Vue({
  VueAxios,
  axios,
  router,
  store,
  VueSweetalert2,
  render: h => h(App)
}).$mount('#app')
