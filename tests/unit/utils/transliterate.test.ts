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
})