// Lost Ark Raid Tracker - Main Entry Point
// =======================================

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import { useSettingsStore } from '@/stores/settings'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'

// Global styles
import './assets/styles/global.less'

const app = createApp(App)

// Pinia for state management
const pinia = createPinia()
app.use(pinia)

// Load all data from localStorage
const settingsStore = useSettingsStore()
const charactersStore = useCharactersStore()
const raidsStore = useRaidsStore()

settingsStore.loadFromStorage()
charactersStore.loadFromStorage()
raidsStore.loadFromStorage()

// Vue Router
app.use(router)

app.mount('#app')