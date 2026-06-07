<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Character, CharacterFormData } from '@/types'
import { CHARACTER_CLASSES } from '@/constants/characterClasses'
import { validateCharacter } from '@/utils/validators'
import BaseInput from '@/components/atoms/BaseInput.vue'
import BaseSelect from '@/components/atoms/BaseSelect.vue'
import BaseButton from '@/components/atoms/BaseButton.vue'

const props = defineProps<{
  character?: Character
  existingNames?: string[]
}>()

const emit = defineEmits<{
  submit: [data: CharacterFormData, oldName?: string]
  cancel: []
}>()

// Store current name when editing (for updating related data)
const currentName = ref(props.character?.name)

// Form state
const name = ref(props.character?.name ?? '')
const gearScoreStr = ref(String(props.character?.gearScore ?? 0))
const characterClass = ref<string>(props.character?.characterClass ?? '')
const customClassName = ref(props.character?.customClassName ?? '')
const touched = ref(false)

// Watch for prop changes
watch(() => props.character, (newChar) => {
  if (newChar) {
    name.value = newChar.name
    currentName.value = newChar.name
    gearScoreStr.value = String(newChar.gearScore)
    characterClass.value = newChar.characterClass
    customClassName.value = newChar.customClassName ?? ''
  } else {
    name.value = ''
    currentName.value = ''
    gearScoreStr.value = '0'
    characterClass.value = ''
    customClassName.value = ''
  }
  touched.value = false
}, { immediate: true })

// Options for select (with empty placeholder)
const classOptions = [
  { value: '', label: 'Выберите класс...' },
  ...CHARACTER_CLASSES.map(c => ({ value: c.value, label: c.label })),
]

// Is editing
const isEditing = computed(() => !!props.character)

// Custom class name required
const showCustomClassName = computed(() => characterClass.value === 'custom')

// Name field error
const nameError = computed(() => {
  if (!touched.value) return ''

  const trimmedName = name.value.trim()

  // Check for duplicate name (exclude current name when editing)
  const otherNames = props.existingNames?.filter(n => n !== currentName.value) ?? []
  if (trimmedName && otherNames.includes(trimmedName)) {
    return 'Персонаж с таким именем уже существует'
  }

  const nameErrors = validateCharacter({
    name: trimmedName,
    gearScore: Number(gearScoreStr.value) || 0,
    characterClass: characterClass.value,
    customClassName: showCustomClassName.value ? customClassName.value.trim() : undefined,
  }).errors.filter(e => e.toLowerCase().includes('имя'))
  return nameErrors[0] ?? ''
})

// Class field error
const classError = computed(() => {
  if (!touched.value) return ''
  const classErrors = validateCharacter({
    name: name.value.trim(),
    gearScore: Number(gearScoreStr.value) || 0,
    characterClass: characterClass.value,
    customClassName: showCustomClassName.value ? customClassName.value.trim() : undefined,
  }).errors.filter(e => e.toLowerCase().includes('класс'))
  return classErrors[0] ?? ''
})

// Submit handler
function handleSubmit() {
  touched.value = true

  const trimmedName = name.value.trim()

  // Check for duplicate name before validation (exclude current name when editing)
  const otherNames = props.existingNames?.filter(n => n !== currentName.value) ?? []
  if (trimmedName && otherNames.includes(trimmedName)) {
    return
  }

  const data = {
    name: trimmedName,
    gearScore: Number(gearScoreStr.value) || 0,
    characterClass: characterClass.value,
    customClassName: showCustomClassName.value ? customClassName.value.trim() : undefined,
  } as CharacterFormData

  const result = validateCharacter(data)

  if (!result.valid) {
    return
  }

  // Emit old name when editing for updating related data
  emit('submit', data, isEditing.value ? currentName.value : undefined)
}

// Cancel handler
function handleCancel() {
  emit('cancel')
}
</script>

<template>
  <form class="character-form" data-testid="character-form" @submit.prevent="handleSubmit">
    <h3 class="character-form__title">
      {{ isEditing ? 'Редактировать персонажа' : 'Новый персонаж' }}
    </h3>

    <div class="character-form__fields">
      <BaseInput
        v-model="name"
        type="text"
        placeholder="Имя персонажа"
        label="Имя"
        :error="nameError"
        id="character-name"
      />

      <BaseSelect
        v-model="characterClass"
        :options="classOptions"
        placeholder="Поиск класса..."
        label="Класс"
        :error="classError"
        id="character-class"
        searchable
      />

      <BaseInput
        v-if="showCustomClassName"
        v-model="customClassName"
        type="text"
        placeholder="Введите название класса"
        label="Название класса"
        id="custom-class-name"
      />

      <BaseInput
        v-model="gearScoreStr"
        type="number"
        min="0"
        step="0.01"
        placeholder="Например: 1700.50"
        label="ГС (Уровень персонажа)"
        id="character-gs"
      />
    </div>

    <div class="character-form__actions">
      <BaseButton type="button" variant="secondary" data-testid="cancel-btn" @click="handleCancel">
        Отмена
      </BaseButton>
      <BaseButton type="submit" variant="primary" data-testid="submit-btn">
        {{ isEditing ? 'Сохранить' : 'Создать' }}
      </BaseButton>
    </div>
  </form>
</template>

<style scoped>
.character-form {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.character-form__title {
  font-size: var(--text-lg);
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
}

.character-form__fields {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.character-form__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}
</style>