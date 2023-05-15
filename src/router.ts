import { createRouter, createWebHashHistory } from 'vue-router'

import Iterative from './pages/Iterative.vue'
import Normal from './pages/Normal.vue'

const routes = [
  { path: '/iterative', component: Iterative },
  { path: '/normal', component: Normal },
  { path: '/:pathMatch(.*)*', redirect: '/iterative' },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
