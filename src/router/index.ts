// Lost Ark Raid Tracker - Vue Router Configuration
// ==============================================

import { createRouter, createWebHashHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { title: 'Персонажи' },
  },
  {
    path: '/raids',
    name: 'raids',
    component: () => import('@/views/RaidLibraryView.vue'),
    meta: { title: 'Библиотека рейдов' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { title: 'Настройки' },
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

// Update page title on navigation
router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} | Lost Ark Raid Tracker` : 'Lost Ark Raid Tracker'
})

export default router