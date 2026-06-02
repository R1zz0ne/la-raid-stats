/// <reference types="@playwright/test" />

import type {
  test as PlaywrightTest,
  expect as PlaywrightExpect,
  describe as PlaywrightDescribe,
  beforeEach as PlaywrightBeforeEach,
  afterEach as PlaywrightAfterEach,
  beforeAll as PlaywrightBeforeAll,
  afterAll as PlaywrightAfterAll,
} from '@playwright/test'

declare global {
  const test: typeof PlaywrightTest
  const expect: typeof PlaywrightExpect
  const describe: typeof PlaywrightDescribe
  const beforeEach: typeof PlaywrightBeforeEach
  const afterEach: typeof PlaywrightAfterEach
  const beforeAll: typeof PlaywrightBeforeAll
  const afterAll: typeof PlaywrightAfterAll
}

export {}