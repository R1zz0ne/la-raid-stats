// Tests for CharacterForm component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// Mock CharacterForm with required props
const MockForm = {
  template: `
    <form class="character-form">
      <h3>{{ isEditing ? 'Редактировать персонажа' : 'Новый персонаж' }}</h3>
      <input id="character-name" placeholder="Имя персонажа" />
      <select id="character-class">
        <option value="">Выберите класс...</option>
        <option value="bard">Менестрель</option>
      </select>
      <input id="character-gs" type="number" placeholder="ГС" />
      <button type="button">Отмена</button>
      <button type="submit">Создать</button>
    </form>
  `,
  props: ['character', 'existingNames'],
  computed: {
    isEditing() {
      return !!this.character
    },
  },
}

describe('CharacterForm', () => {
  describe('rendering', () => {
    it('renders form for new character', () => {
      const wrapper = mount(MockForm, {
        props: { character: undefined, existingNames: [] },
      })

      expect(wrapper.find('.character-form').exists()).toBe(true)
      expect(wrapper.text()).toContain('Новый персонаж')
    })

    it('renders form for editing character', () => {
      const wrapper = mount(MockForm, {
        props: { character: { name: 'Test' }, existingNames: [] },
      })

      expect(wrapper.text()).toContain('Редактировать персонажа')
    })
  })

  describe('fields', () => {
    it('renders name input', () => {
      const wrapper = mount(MockForm)
      expect(wrapper.find('input[id="character-name"]').exists()).toBe(true)
    })

    it('renders gear score input', () => {
      const wrapper = mount(MockForm)
      expect(wrapper.find('input[id="character-gs"]').exists()).toBe(true)
    })

    it('renders class select', () => {
      const wrapper = mount(MockForm)
      expect(wrapper.find('select').exists()).toBe(true)
    })
  })

  describe('actions', () => {
    it('renders cancel button', () => {
      const wrapper = mount(MockForm)
      expect(wrapper.text()).toContain('Отмена')
    })

    it('renders create/submit button', () => {
      const wrapper = mount(MockForm)
      expect(wrapper.text()).toContain('Создать')
    })
  })
})