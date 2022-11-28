import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
 
]

const history = createWebHistory();

const router = createRouter({
  history,
  routes,
});

export default router
