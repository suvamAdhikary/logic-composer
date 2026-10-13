import { describe, it, expect } from 'vitest'
import { generateId } from './uid'

describe('uid', () => {
  describe('generateId', () => {
    it('should generate a string ID', () => {
      const id = generateId()
      expect(typeof id).toBe('string')
      expect(id.length).toBeGreaterThan(0)
    })

    it('should generate unique IDs', () => {
      const ids = new Set<string>()
      const iterations = 1000

      for (let i = 0; i < iterations; i++) {
        ids.add(generateId())
      }

      expect(ids.size).toBe(iterations)
    })

    it('should generate valid UUID format', () => {
      const id = generateId()
      const uuidRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
      expect(id).toMatch(uuidRegex)
    })

    it('should generate different IDs on consecutive calls', () => {
      const id1 = generateId()
      const id2 = generateId()
      const id3 = generateId()

      expect(id1).not.toBe(id2)
      expect(id2).not.toBe(id3)
      expect(id1).not.toBe(id3)
    })
  })
})
