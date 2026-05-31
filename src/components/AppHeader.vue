<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()

const navLinks = [
  { to: '/', name: 'dashboard', label: 'Персонажи' },
  { to: '/raids', name: 'raids', label: 'Рейды' },
  { to: '/settings', name: 'settings', label: 'Настройки' },
]

const isActive = (linkName: string) => computed(() => route.name === linkName)
</script>

<template>
  <header class="app-header">
    <div class="header-container">
      <RouterLink to="/" class="logo">
        <span class="logo-icon">⚔️</span>
        <span class="logo-text">Lost Ark Raid Tracker</span>
      </RouterLink>

      <nav class="nav-links">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link--active': isActive(link.name).value }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <ThemeToggle />
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-lg);
}

.logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  text-decoration: none;
  color: var(--color-text);
  font-weight: 600;
  font-size: var(--text-lg);
  transition: opacity var(--transition-fast);
}

.logo:hover {
  opacity: 0.8;
}

.logo-icon {
  font-size: var(--text-xl);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.nav-link {
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  text-decoration: none;
  font-size: var(--text-sm);
  font-weight: 500;
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text);
  background-color: var(--color-surface-hover);
}

.nav-link--active {
  color: var(--color-primary);
  background-color: var(--color-primary-light);
}

@media (max-width: 640px) {
  .header-container {
    padding: var(--spacing-sm) var(--spacing-md);
  }

  .logo-text {
    display: none;
  }

  .nav-link {
    padding: var(--spacing-sm);
    font-size: var(--text-xs);
  }
}
</style>