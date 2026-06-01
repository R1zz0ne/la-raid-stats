<script setup lang="ts">
import { ref } from 'vue'
import { useCharactersStore } from '@/stores/characters'
import { useRaidsStore } from '@/stores/raids'
import { useSettingsStore } from '@/stores/settings'
import { validateImportData } from '@/utils/validators'
import type { ExportData, ImportScope } from '@/types'
import BaseButton from '@/components/atoms/BaseButton.vue'
import ImportOptionsModal from '@/components/organisms/ImportOptionsModal.vue'

const emit = defineEmits<{
  export: []
  import: []
}>()

const charactersStore = useCharactersStore()
const raidsStore = useRaidsStore()
const settingsStore = useSettingsStore()

const isExporting = ref(false)
const isImporting = ref(false)
const importError = ref('')
const showImportModal = ref(false)
const pendingImportData = ref<ExportData | null>(null)

// Export data
async function handleExport() {
  isExporting.value = true

  try {
    const exportData: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      characters: [...charactersStore.characters],
      characterRaids: [...charactersStore.characterRaids],
      raids: [...raidsStore.raids],
      settings: {
        theme: settingsStore.theme,
      },
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `lost-ark-raids-${new Date().toISOString().split('T')[0]}.json`
    link.click()

    URL.revokeObjectURL(url)
    emit('export')
  } finally {
    isExporting.value = false
  }
}

// Import data
async function handleImport() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'

  input.onchange = async (event) => {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (!file) return

    importError.value = ''

    try {
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate
      const result = validateImportData(data)
      if (!result.valid) {
        importError.value = result.errors.join(', ')
        return
      }

      // Store data and show modal
      pendingImportData.value = data
      showImportModal.value = true
    } catch (err) {
      importError.value = 'Не удалось прочитать файл'
    }
  }

  input.click()
}

// Execute import after modal confirmation
function executeImport(scope: ImportScope) {
  const data = pendingImportData.value
  if (!data) return

  isImporting.value = true
  showImportModal.value = false

  try {
    // Create backup first
    const backupKey = 'la-raid-stats-backup'
    const backupData: ExportData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      characters: [...charactersStore.characters],
      characterRaids: [...charactersStore.characterRaids],
      raids: [...raidsStore.raids],
      settings: { theme: settingsStore.theme },
    }
    localStorage.setItem(backupKey, JSON.stringify(backupData))

    // Import based on selected scope
    if (scope === 'all' || scope === 'characters') {
      // Get allowed raid IDs: from imported raids if importing all, or from current raids
      const allowedRaidIds = scope === 'all'
        ? new Set(data.raids.map(r => r.id))
        : new Set(raidsStore.raids.map(r => r.id))

      charactersStore.importData({
        characters: data.characters,
        characterRaids: data.characterRaids,
      }, allowedRaidIds)
    }

    if (scope === 'all' || scope === 'raids') {
      raidsStore.importData({ raids: data.raids })
    }

    if (data.settings?.theme) {
      settingsStore.setTheme(data.settings.theme)
    }

    emit('import')
    pendingImportData.value = null
  } catch (err) {
    importError.value = 'Ошибка при импорте данных'
  } finally {
    isImporting.value = false
  }
}

function closeImportModal() {
  showImportModal.value = false
  pendingImportData.value = null
}
</script>

<template>
  <div class="export-import-panel">
    <h3 class="export-import-panel__title">Экспорт / Импорт данных</h3>

    <div class="export-import-panel__actions">
      <div class="export-import-panel__action">
        <div class="export-import-panel__action-info">
          <span class="export-import-panel__action-label">Экспорт</span>
          <span class="export-import-panel__action-desc">
            Сохранит все данные в JSON-файл
          </span>
        </div>
        <BaseButton
          variant="primary"
          :loading="isExporting"
          @click="handleExport"
        >
          📥 Экспортировать
        </BaseButton>
      </div>

      <div class="export-import-panel__action">
        <div class="export-import-panel__action-info">
          <span class="export-import-panel__action-label">Импорт</span>
          <span class="export-import-panel__action-desc">
            Загрузит данные из JSON-файла
          </span>
        </div>
        <BaseButton
          variant="secondary"
          :loading="isImporting"
          @click="handleImport"
        >
          📤 Импортировать
        </BaseButton>
      </div>
    </div>

    <div v-if="importError" class="export-import-panel__error">
      {{ importError }}
    </div>

    <!-- Import Options Modal -->
    <ImportOptionsModal
      v-if="showImportModal && pendingImportData"
      :character-count="pendingImportData.characters.length"
      :raid-count="pendingImportData.raids.length"
      @close="closeImportModal"
      @confirm="executeImport"
    />
  </div>
</template>

<style scoped>
.export-import-panel {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.export-import-panel__title {
  font-size: var(--text-lg);
  font-weight: 600;
}

.export-import-panel__actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.export-import-panel__action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.export-import-panel__action-info {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.export-import-panel__action-label {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-text);
}

.export-import-panel__action-desc {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
}

.export-import-panel__error {
  padding: var(--spacing-sm);
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-danger);
  border-radius: var(--radius-md);
  color: var(--color-danger);
  font-size: var(--text-sm);
}
</style>