// Tests for CharacterTable component

import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import CharacterTable from '@/components/organisms/CharacterTable.vue'
import type { Character, CharacterRaid, GoldSummary, Raid } from '@/types'

vi.mock('@/stores/raids', () => ({
  useRaidsStore: () => ({
    getRaidById: vi.fn().mockImplementation((id: string): Raid => ({
      id,
      name: 'Valtan',
      difficulties: [
        { type: 'normal', requiredGearScore: 1500, regularGold: 100, limitedGold: 50 },
      ],
    })),
    raids: [],
  }),
}))

vi.mock('@/stores/characters', () => ({
  useCharactersStore: () => ({
    goldRecipientCount: vi.fn().mockReturnValue(1),
    getRaidsForCharacter: vi.fn().mockReturnValue([]),
    getGoldSummary: vi.fn().mockReturnValue({
      regular: 0,
      limited: 0,
      total: 0,
    } as GoldSummary),
  }),
}))

describe('CharacterTable', () => {
  const mockCharacter: Character = {
    id: 'char1',
    name: 'TestChar',
    gearScore: 1700,
    characterClass: 'bard',
    order: 0,
    isGoldRecipient: true,
  }

  const mockCharacter2: Character = {
    id: 'char2',
    name: 'AltChar',
    gearScore: 1650,
    characterClass: 'deathblade',
    order: 1,
    isGoldRecipient: false,
  }

  const mockRaids: CharacterRaid[] = []

  describe('rendering', () => {
    it('renders table structure', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: false,
        },
      })

      expect(wrapper.find('table.character-table__table').exists()).toBe(true)
      expect(wrapper.find('thead.character-table__head').exists()).toBe(true)
      expect(wrapper.find('tbody.character-table__body').exists()).toBe(true)
    })

    it('renders column headers', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: false,
        },
      })

      expect(wrapper.text()).toContain('Имя')
      expect(wrapper.text()).toContain('Класс')
      expect(wrapper.text()).toContain('ГС')
      expect(wrapper.text()).toContain('Рейды')
    })

    it('renders character data in table row', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: false,
        },
      })

      expect(wrapper.text()).toContain('TestChar')
      expect(wrapper.text()).toContain('Менестрель')
      // Gear score: 1700 formatted with locale (ru-RU uses nbsp between 1 and 700)
      // Check that the digits appear in sequence (with any separator)
      expect(wrapper.text()).toMatch(/1700|1\u00a0700/)
    })

    it('renders gold recipients with gold row style', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: false,
        },
      })

      expect(wrapper.find('.character-table__row--gold').exists()).toBe(true)
    })
  })

  describe('gold recipient styling', () => {
    it('applies gold row style to gold recipients', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: false,
        },
      })

      expect(wrapper.find('.character-table__row--gold').exists()).toBe(true)
    })

    it('does not apply gold style to non-recipients', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter2],
          editing: false,
        },
      })

      expect(wrapper.find('.character-table__row--gold').exists()).toBe(false)
    })
  })

  describe('editing mode', () => {
    it('shows actions column when editing is true', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: true,
        },
      })

      // Actions column contains .character-table__actions container
      expect(wrapper.findAll('.character-table__actions')).toHaveLength(1)
    })

    it('does not show actions column when editing is false', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: false,
        },
      })

      const actions = wrapper.findAll('.character-table__actions')
      expect(actions.length).toBe(0)
    })

    it('renders edit and delete buttons in actions', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: true,
        },
      })

      const actions = wrapper.findAll('.character-table__actions')
      expect(actions.length).toBeGreaterThan(0)
    })
  })

  describe('empty state', () => {
    it('shows empty message when no characters', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [],
          editing: false,
        },
      })

      expect(wrapper.text()).toContain('Нет персонажей')
      expect(wrapper.find('.character-table__row--empty').exists()).toBe(true)
    })

    it('shows add character button in empty state', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [],
          editing: false,
        },
      })

      expect(wrapper.find('button').text()).toContain('Добавить персонажа')
    })
  })

  describe('events', () => {
    it('emits editCharacter when edit button clicked', async () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: true,
        },
      })

      // Find edit button by its content (✎) inside actions
      const editButton = wrapper.find('.character-table__actions button.base-button--secondary')
      expect(editButton.exists()).toBe(true)
      await editButton.trigger('click')

      expect(wrapper.emitted('editCharacter')).toBeTruthy()
    })

    it('emits deleteCharacter when delete button clicked', async () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: true,
        },
      })

      const deleteButton = wrapper.find('.character-table__actions button.base-button--danger')
      expect(deleteButton.exists()).toBe(true)
      await deleteButton.trigger('click')

      expect(wrapper.emitted('deleteCharacter')).toBeTruthy()
    })

    it('emits addCharacter when add button clicked in empty state', async () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [],
          editing: false,
        },
      })

      await wrapper.find('button').trigger('click')

      expect(wrapper.emitted('addCharacter')).toBeTruthy()
    })

    it('emits addRaid when add raid button clicked', async () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter],
          editing: true,
        },
      })

      const addRaidButton = wrapper.find('.character-table__add-raid-btn')
      await addRaidButton.trigger('click')

      expect(wrapper.emitted('addRaid')).toBeTruthy()
    })
  })

  describe('character grouping', () => {
    it('renders both gold recipients and other characters', () => {
      const wrapper = mount(CharacterTable, {
        props: {
          characters: [mockCharacter, mockCharacter2],
          editing: false,
        },
      })

      expect(wrapper.text()).toContain('TestChar')
      expect(wrapper.text()).toContain('AltChar')
    })
  })
})