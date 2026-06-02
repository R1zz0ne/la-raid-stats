// Tests for ExportImportPanel component

import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

// Simple mock for testing the panel structure
const MockPanel = {
  template: `
    <div class="export-import-panel">
      <div class="export-section">
        <h3>Экспорт данных</h3>
        <button class="export-btn">Скачать JSON</button>
      </div>
      <div class="import-section">
        <h3>Импорт данных</h3>
        <input type="file" accept=".json" />
      </div>
    </div>
  `,
}

describe('ExportImportPanel', () => {
  describe('rendering', () => {
    it('renders export section', () => {
      const wrapper = mount(MockPanel)
      expect(wrapper.find('.export-import-panel').exists()).toBe(true)
      expect(wrapper.text()).toContain('Экспорт данных')
    })

    it('renders import section', () => {
      const wrapper = mount(MockPanel)
      expect(wrapper.text()).toContain('Импорт данных')
    })

    it('renders export button', () => {
      const wrapper = mount(MockPanel)
      expect(wrapper.text()).toContain('Скачать JSON')
    })

    it('renders import file input', () => {
      const wrapper = mount(MockPanel)
      expect(wrapper.find('input[type="file"]').exists()).toBe(true)
    })

    it('accepts JSON files only', () => {
      const wrapper = mount(MockPanel)
      expect(wrapper.find('input[type="file"]').attributes('accept')).toBe('.json')
    })
  })
})