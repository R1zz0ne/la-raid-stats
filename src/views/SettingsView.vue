<script setup lang="ts">
import { computed } from 'vue'
import { useSettingsStore } from '@/stores/settings'
import ExportImportPanel from '@/components/organisms/ExportImportPanel.vue'

const settingsStore = useSettingsStore()

const isDark = computed(() => settingsStore.isDark)
</script>

<template>
  <div class="settings-view">
    <h1>Настройки</h1>

    <div class="settings-view__sections">
      <!-- Theme Section -->
      <section class="settings-view__section">
        <h2>Тема</h2>
        <div class="settings-view__theme">
          <button
            class="settings-view__theme-btn"
            :class="{ 'settings-view__theme-btn--active': !isDark }"
            @click="settingsStore.setTheme('light')"
          >
            <span class="settings-view__theme-icon">☀️</span>
            <span>Светлая</span>
          </button>
          <button
            class="settings-view__theme-btn"
            :class="{ 'settings-view__theme-btn--active': isDark }"
            @click="settingsStore.setTheme('dark')"
          >
            <span class="settings-view__theme-icon">🌙</span>
            <span>Тёмная</span>
          </button>
        </div>
      </section>

      <!-- Export/Import Section -->
      <section class="settings-view__section">
        <h2>Данные</h2>
        <ExportImportPanel />
      </section>

      <!-- Info Section -->
      <section class="settings-view__section">
        <h2>О приложении</h2>
        <div class="settings-view__info">
          <p><strong>Lost Ark Raid Tracker</strong></p>
          <p>Версия: 1.0.0</p>
          <p>Frontend-приложение для учёта пройденных рейдов и полученного золота в Lost Ark.</p>
          <p>Создано: <a href="https://github.com/R1zz0ne" target="_blank" rel="noopener">R1zz0ne</a></p>
          <p class="settings-view__info-note">
            Все данные хранятся локально в браузере. Для резервного копирования используйте экспорт.
          </p>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.settings-view {
  max-width: 800px;
  margin: 0 auto;
}

.settings-view h1 {
  font-size: var(--text-2xl);
  font-weight: 700;
  margin-bottom: var(--spacing-xl);
}

.settings-view__sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.settings-view__section {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.settings-view__section h2 {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-md);
}

.settings-view__theme {
  display: flex;
  gap: var(--spacing-md);
}

.settings-view__theme-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background-color: var(--color-bg);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.settings-view__theme-btn:hover {
  border-color: var(--color-primary);
}

.settings-view__theme-btn--active {
  border-color: var(--color-primary);
  background-color: var(--color-primary-light);
}

.settings-view__theme-icon {
  font-size: var(--text-3xl);
}

.settings-view__info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  color: var(--color-text);
}

.settings-view__info p {
  margin: 0;
}

.settings-view__info-note {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
}

.settings-view__info a {
  color: var(--color-primary);
  text-decoration: none;
}

.settings-view__info a:hover {
  text-decoration: underline;
}
</style>