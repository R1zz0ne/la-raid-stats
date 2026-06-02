// Playwright E2E Tests - Basic smoke tests
// @ts-nocheck

import { test, expect } from '@playwright/test'

// Dashboard tests
test('Dashboard: displays empty state when no characters', async ({ page }) => {
  await page.goto('/#')
  await expect(page.locator('h1')).toContainText('Персонажи')
  await expect(page.locator('text=Нет персонажей')).toBeVisible()
})

test('Dashboard: has add character button', async ({ page }) => {
  await page.goto('/#')
  await expect(page.locator('button:has-text("+ Добавить персонажа")').first()).toBeVisible()
})

test('Dashboard: opens add character modal when clicking button', async ({ page }) => {
  await page.goto('/#')
  await page.locator('button:has-text("+ Добавить персонажа")').first().click()
  await expect(page.locator('h3:text("Новый персонаж")')).toBeVisible()
})

// Navigation tests
test('Navigation: can navigate to raids page', async ({ page }) => {
  await page.goto('/#')
  await page.click('text=Рейды')
  await expect(page.locator('h1')).toContainText('Библиотека рейдов')
})

test('Navigation: can navigate to settings page', async ({ page }) => {
  await page.goto('/#')
  await page.click('text=Настройки')
  await expect(page.locator('h1')).toContainText('Настройки')
})

test('Navigation: can navigate back to dashboard', async ({ page }) => {
  await page.goto('/#/raids')
  await page.click('text=Персонажи')
  await expect(page.locator('h1')).toContainText('Персонажи')
})

// Raids Library tests
test('Raids: displays header with add button', async ({ page }) => {
  await page.goto('/#/raids')
  await expect(page.locator('h1')).toContainText('Библиотека рейдов')
  await expect(page.locator('text=+ Добавить рейд')).toBeVisible()
})

test('Raids: has reset to default button', async ({ page }) => {
  await page.goto('/#/raids')
  await expect(page.locator('text=Сбросить к стандартным')).toBeVisible()
})

// Settings tests
test('Settings: displays theme section', async ({ page }) => {
  await page.goto('/#/settings')
  await expect(page.locator('h2:has-text("Тема")')).toBeVisible()
})

test('Settings: displays export/import panel', async ({ page }) => {
  await page.goto('/#/settings')
  await expect(page.locator('.export-import-panel')).toBeVisible()
})

test('Settings: displays app info section', async ({ page }) => {
  await page.goto('/#/settings')
  await expect(page.locator('text=Lost Ark Raid Tracker')).toBeVisible()
})

// Theme toggle test
test('Theme: can toggle to dark theme', async ({ page }) => {
  await page.goto('/#/settings')
  
  const html = page.locator('html')
  const initialTheme = await html.getAttribute('data-theme')
  
  // Click dark theme button
  await page.locator('.settings-view__theme-btn:has-text("Тёмная")').click()
  
  // Verify theme changed
  const newTheme = await html.getAttribute('data-theme')
  expect(newTheme).not.toBe(initialTheme)
})

test('Theme: can toggle back to light theme', async ({ page }) => {
  await page.goto('/#/settings')
  
  // First set dark
  await page.locator('.settings-view__theme-btn:has-text("Тёмная")').click()
  
  const html = page.locator('html')
  const darkTheme = await html.getAttribute('data-theme')
  
  // Then set light
  await page.locator('.settings-view__theme-btn:has-text("Светлая")').click()
  
  // Verify theme changed back
  const lightTheme = await html.getAttribute('data-theme')
  expect(lightTheme).not.toBe(darkTheme)
})

// Edit mode test
test('EditMode: can enable edit mode', async ({ page }) => {
  await page.goto('/#')
  await expect(page.locator('text=Редактировать порядок')).toBeVisible()
})