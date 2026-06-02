// Unit tests for transliterate utility

import { describe, it, expect } from 'vitest'
import { transliterate, generateUniqueSlug } from '@/utils/transliterate'

describe('transliterate', () => {
  it('transliterates English text to lowercase slug', () => {
    expect(transliterate('Lost Ark')).toBe('lost-ark')
  })

  it('transliterates Russian text to Latin', () => {
    expect(transliterate('Абиссас')).toBe('abissas')
    expect(transliterate('Вершинный босс')).toContain('vershinnyj')
  })

  it('removes special characters', () => {
    expect(transliterate('Test!@#$%')).toBe('test')
  })

  it('replaces spaces with hyphens', () => {
    expect(transliterate('hello world')).toBe('hello-world')
  })

  it('removes leading and trailing hyphens', () => {
    expect(transliterate('  test  ')).toBe('test')
  })

  it('handles multiple consecutive spaces', () => {
    expect(transliterate('hello   world')).toBe('hello-world')
  })

  it('handles empty string', () => {
    expect(transliterate('')).toBe('')
  })

  it('handles mixed English and Russian', () => {
    expect(transliterate('Lost Ark Абиссас')).toContain('lost-ark')
  })

  it('handles all Cyrillic characters', () => {
    // Test a few key mappings
    expect(transliterate('абвгд')).toBe('abvgd')
    expect(transliterate('жзхцч')).toBe('zhzkhcch')
    expect(transliterate('юя')).toBe('yuya')  // ю=y u + я=ya
  })

  it('preserves Latin characters', () => {
    expect(transliterate('ABCDEF')).toBe('abcdef')
    expect(transliterate('123abc')).toBe('123abc')
  })

  it('handles numbers in text', () => {
    expect(transliterate('Raid 1')).toBe('raid-1')
    expect(transliterate('Test 123')).toBe('test-123')
  })

  it('collapses multiple hyphens', () => {
    expect(transliterate('test---raid')).toBe('test-raid')
    expect(transliterate('a--b--c')).toBe('a-b-c')
  })
})

describe('generateUniqueSlug', () => {
  it('returns slug if not in existing list', () => {
    expect(generateUniqueSlug('Test Raid', [])).toBe('test-raid')
  })

  it('returns slug if not duplicate', () => {
    expect(generateUniqueSlug('Test Raid', ['other-slug'])).toBe('test-raid')
  })

  it('appends counter if slug exists', () => {
    expect(generateUniqueSlug('Test Raid', ['test-raid'])).toBe('test-raid-1')
  })

  it('increments counter for multiple duplicates', () => {
    expect(generateUniqueSlug('Test Raid', ['test-raid', 'test-raid-1'])).toBe('test-raid-2')
  })

  it('finds next available slot after gaps', () => {
    expect(generateUniqueSlug('Test Raid', ['test-raid', 'test-raid-2'])).toBe('test-raid-1')
  })

  it('handles Russian names', () => {
    const slug = generateUniqueSlug('Абиссас', [])
    expect(slug).toBe('abissas')
  })

  it('handles empty existing list', () => {
    expect(generateUniqueSlug('Test', [])).toBe('test')
  })

  it('generates unique slug for Russian with existing duplicates', () => {
    expect(generateUniqueSlug('Абиссас', ['abissas', 'abissas-1'])).toBe('abissas-2')
  })
})