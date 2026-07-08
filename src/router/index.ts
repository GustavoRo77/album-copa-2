// src/router/index.ts
import { createRouter, createWebHistory } from '@ionic/vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/register',
    component: () => import('../views/RegisterView.vue')
  },
  {
    path: '/reset-password',
    component: () => import('../views/ResetPasswordView.vue')
  },
  {
    path: '/album',
    component: () => import('../views/AlbumView.vue')
  },
  {
    path: '/collected',
    component: () => import('../views/CollectedView.vue')
  },
  {
    path: '/profile',
    component: () => import('../views/ProfileView.vue')
  },
  {
    path: '/about',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/achievements',
    component: () => import('../views/AchievementsView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router