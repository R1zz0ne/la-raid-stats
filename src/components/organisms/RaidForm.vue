<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Raid, DifficultyFormData, DifficultyType } from '@/types'
import { DIFFICULTY_TYPES } from '@/constants/difficultyTypes'
import { validateRaid } from '@/utils/validators'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseSelect from '@/components/atoms/BaseSelect.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps<{
  raid?: Raid
}>()

const emit = defineEmits<{
  submit: [data: { name: string; difficulties: DifficultyFormData[] }]
  cancel: []
}>()

// Form state
const name = ref(props.raid?.name ?? '')
const difficulties = ref<Array<{
  type: DifficultyType
  requiredGearScoreStr: string
  regularGoldStr: string
  limitedGoldStr: string
}>>([])
const errors = ref<string[]>([])
const touched = ref(false)

// Watch for prop changes
watch(() => props.raid, (newRaid) => {
  if (newRaid) {
    name.value = newRaid.name
    difficulties.value = newRaid.difficulties.map(d => ({
      type: d.type,
      requiredGearScoreStr: String(d.requiredGearScore),
      regularGoldStr: String(d.regularGold),
      limitedGoldStr: String(d.limitedGold),
    }))
  } else {
    name.value = ''
    difficulties.value = []
  }
  errors.value = []
  touched.value = false
}, { immediate: true })

// Options for difficulty select
const difficultyOptions = DIFFICULTY_TYPES.map(d => ({
  value: d.value,
  label: d.label,
}))

// Available difficulty types (not yet added)
const availableDifficultyTypes = computed(() => {
  const addedTypes = difficulties.value.map(d => d.type)
  return difficultyOptions.filter(o => !addedTypes.includes(o.value as DifficultyType))
})

// Is editing
const isEditing = computed(() => !!props.raid)

// Submit handler
function handleSubmit() {
  touched.value = true

  const data = {
    name: name.value.trim(),
    difficulties: difficulties.value.map(d => ({
      type: d.type,
      requiredGearScore: Number(d.requiredGearScoreStr) || 0,
      regularGold: Number(d.regularGoldStr) || 0,
      limitedGold: Number(d.limitedGoldStr) || 0,
    })),
  }

  const result = validateRaid(data)

  if (!result.valid) {
    errors.value = result.errors
    return
  }

  emit('submit', data)
}

// Add difficulty
function addDifficulty() {
  if (availableDifficultyTypes.value.length === 0) return

  difficulties.value.push({
    type: availableDifficultyTypes.value[0].value as DifficultyType,
    requiredGearScoreStr: '0',
    regularGoldStr: '0',
    limitedGoldStr: '0',
  })
}

// Remove difficulty
function removeDifficulty(index: number) {
  difficulties.value.splice(index, 1)
}

// Cancel handler
function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <form class="raid-form" @submit.prevent="handleSubmit">
    <h3 class="raid-form__title">
      {{ isEditing ? 'Редактировать рейд' : 'Новый рейд' }}
    </h3>

    <div class="raid-form__fields">
      <BaseInput
        v-model="name"
        type="text"
        placeholder="Название рейда"
        label="Название"
        id="raid-name"
      />

      <div class="raid-form__difficulties">
        <div class="raid-form__difficulties-header">
          <span class="raid-form__difficulties-label">Сложности</span>
          <BaseButton
            v-if="availableDifficultyTypes.length > 0"
            type="button"
            variant="secondary"
            size="sm"
            @click="addDifficulty"
          >
            + Добавить сложность
          </BaseButton>
        </div>

        <div class="raid-form__difficulties-scroll">
          <div v-if="difficulties.length === 0" class="raid-form__difficulties-empty">
            <p>Нет сложностей. Добавьте хотя бы одну.</p>
          </div>

          <div v-else class="raid-form__difficulties-list">
            <div
              v-for="(diff, index) in difficulties"
              :key="index"
              class="raid-form__difficulty"
            >
              <div class="raid-form__difficulty-header">
                <BaseSelect
                  v-model="diff.type"
                  :options="difficultyOptions"
                  label="Тип"
                  :id="`difficulty-type-${index}`"
                />
                <BaseButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  @click="removeDifficulty(index)"
                >
                  ✕
                </BaseButton>
              </div>

              <div class="raid-form__difficulty-fields">
                <BaseInput
                  v-model="diff.requiredGearScoreStr"
                  type="number"
                  min="0"
                  placeholder="Требуемый ГС"
                  label="Требуемый ГС"
                  :id="`difficulty-gs-${index}`"
                />
                <BaseInput
                  v-model="diff.regularGoldStr"
                  type="number"
                  min="0"
                  placeholder="Обычное золото"
                  label="Обычное золото"
                  :id="`difficulty-regular-${index}`"
                />
                <BaseInput
                  v-model="diff.limitedGoldStr"
                  type="number"
                  min="0"
                  placeholder="Лимитированное"
                  label="Лимитированное золото"
                  :id="`difficulty-limited-${index}`"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="raid-form__actions">
      <BaseButton type="button" variant="secondary" @click="handleCancel">
        Отмена
      </BaseButton>
      <BaseButton type="submit" variant="primary">
        {{ isEditing ? 'Сохранить' : 'Создать' }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.raid-form {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.raid-form__title {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.raid-form__fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.raid-form__difficulties {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.raid-form__difficulties-scroll {
  max-height: 400px;
  overflow-y: auto;
}

.raid-form__difficulties-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.raid-form__difficulties-label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-muted);
}

.raid-form__difficulties-empty {
  padding: var(--spacing-md);
  text-align: center;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  background-color: var(--color-surface-hover);
  border-radius: var(--radius-md);
}

.raid-form__difficulties-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.raid-form__difficulty {
  background-color: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.raid-form__difficulty-header {
  display: flex;
  gap: var(--spacing-md);
  align-items: flex-end;
}

.raid-form__difficulty-fields {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
}

.raid-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .raid-form__difficulty-fields {
    grid-template-columns: 1fr;
  }
}
</style>