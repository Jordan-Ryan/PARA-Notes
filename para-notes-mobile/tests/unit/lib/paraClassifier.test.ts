import { classifyNote, recordUserCorrection } from '@/lib/guidance/paraClassifier'
import type { ClassificationInput } from '@/types/guidance'

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

if (!global.localStorage) {
  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
  })
} else {
  // If localStorage already exists, replace its methods
  Object.assign(global.localStorage, localStorageMock)
}

describe('PARA Classifier', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('classifyNote', () => {
    it('should classify a project note correctly', async () => {
      const input: ClassificationInput = {
        text: 'This is a project with deadlines and milestones',
        title: 'Project Planning',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.suggestions.some(s => s.category === 'projects')).toBe(true)
      expect(result.best?.category).toBe('projects')
    })

    it('should classify an area note correctly', async () => {
      const input: ClassificationInput = {
        text: 'This is an area for ongoing maintenance and policies',
        title: 'Area Management',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.suggestions.some(s => s.category === 'areas')).toBe(true)
      expect(result.best?.category).toBe('areas')
    })

    it('should return empty suggestions for no matches', async () => {
      const input: ClassificationInput = {
        text: 'Some random content with no keywords',
        title: 'Random Note',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      expect(result.suggestions).toHaveLength(0)
      expect(result.best).toBeUndefined()
    })

    it('should handle empty text input', async () => {
      const input: ClassificationInput = {
        text: '',
        title: '',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      expect(result.suggestions).toHaveLength(0)
      expect(result.best).toBeUndefined()
    })

    it('should handle missing userId', async () => {
      const input: ClassificationInput = {
        text: 'This is a project with deadlines',
        title: 'Project Note',
      }

      const result = await classifyNote(input)

      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.best?.category).toBe('projects')
    })
  })

  describe('recordUserCorrection', () => {
    it('should record user correction and update learning', async () => {
      await recordUserCorrection({
        userId: 'test-user',
        noteId: 'test-note',
        finalCategory: 'projects',
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'para_guidance_learning_v1',
        expect.stringContaining('test-user:projects')
      )
    })

    it('should handle missing userId', async () => {
      await recordUserCorrection({
        finalCategory: 'projects',
      })

      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'para_guidance_learning_v1',
        expect.stringContaining('anon:projects')
      )
    })
  })
})
