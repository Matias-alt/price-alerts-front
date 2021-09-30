import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue')
  },
  {
    path: '/price-alert/:id/:origin_id/:destiny_id/:travel_id',
    name: 'PriceAlertDetail',
    
    component: () => import(/* webpackChunkName: "about" */ '../views/PriceAlertDetail.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
