// Test setup file
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend expect with Testing Library matchers
expect.extend(matchers)