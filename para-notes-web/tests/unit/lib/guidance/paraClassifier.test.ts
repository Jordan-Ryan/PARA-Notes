import { classifyNote, recordUserCorrection } from '@/lib/guidance/paraClassifier'
import { ClassificationInput, ParaCategory } from '@/types/guidance'

// Mock the guidance rules
jest.mock('@/lib/guidance/guidanceRules', () => ({
  loadRuleSet: jest.fn(() => {
    console.log('loadRuleSet called');
    const rules = {
      keywordRules: [
      {
        id: 'project-keywords',
        category: 'projects' as ParaCategory,
        keywords: ['project', 'task', 'deadline', 'milestone'],
        weight: 1.0,
      },
      {
        id: 'area-keywords',
        category: 'areas' as ParaCategory,
        keywords: ['area', 'responsibility', 'maintenance'],
        weight: 1.0,
      },
      {
        id: 'resource-keywords',
        category: 'resources' as ParaCategory,
        keywords: ['reference', 'notes', 'bookmark', 'article', 'book', 'research', 'resources'],
        weight: 1.2,
      },
      {
        id: 'archive-keywords',
        category: 'archive' as ParaCategory,
        keywords: ['completed', 'done', 'finished', 'old'],
        weight: 1.0,
      },
    ],
    contextRules: [
      {
        id: 'project-context',
        category: 'projects' as ParaCategory,
        matchPathStartsWith: '/projects',
        weight: 2.0,
      },
      {
        id: 'area-context',
        category: 'areas' as ParaCategory,
        matchPathStartsWith: '/areas',
        weight: 2.0,
      },
    ],
    userOverrides: {
      disabledRuleIds: [],
      weights: {},
    },
  };
  console.log('Rules being returned:', JSON.stringify(rules, null, 2));
  return Promise.resolve(rules);
  }),
  mergeWithUserRules: jest.fn((base, user) => ({ ...base, ...user })),
  scoreCategory: jest.fn((text, currentPath, rules) => {
    const scores = { projects: 0, areas: 0, resources: 0, archive: 0 }
    const reasons = { projects: [], areas: [], resources: [], archive: [] }
    const matches = { projects: [], areas: [], resources: [], archive: [] }

    const lowered = text.toLowerCase()
    
    // Use the actual rules for keyword matching
    for (const rule of rules.keywordRules) {
      for (const keyword of rule.keywords) {
        if (lowered.includes(keyword.toLowerCase())) {
          scores[rule.category] += rule.weight
          matches[rule.category].push(keyword)
          reasons[rule.category].push(`Matched keyword "${keyword}"`)
        }
      }
    }

    // Context matching
    for (const rule of rules.contextRules) {
      if (currentPath?.startsWith(rule.matchPathStartsWith)) {
        scores[rule.category] += rule.weight
        reasons[rule.category].push(`Context path starts with "${rule.matchPathStartsWith}"`)
      }
    }

    return { scores, reasons, matches }
  }),
}))

// Mock localStorage for learning data
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
})

describe('PARA Classifier', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockLocalStorage.getItem.mockReturnValue(null)
  })

  describe('classifyNote', () => {
    it('should classify a project note correctly', async () => {
      const input: ClassificationInput = {
        text: 'This is a project planning document with tasks and deadlines',
        title: 'Project Planning',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      expect(result.suggestions).toHaveLength(1)
      expect(result.suggestions[0].category).toBe('projects')
      expect(result.suggestions[0].confidence.value).toBeGreaterThan(0)
      expect(result.best?.category).toBe('projects')
    })

    it('should classify an area note correctly', async () => {
      const input: ClassificationInput = {
        text: 'This is about my area of responsibility and maintenance',
        title: 'Area Management',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      expect(result.suggestions).toHaveLength(1)
      expect(result.suggestions[0].category).toBe('areas')
      expect(result.best?.category).toBe('areas')
    })

    it('should classify a resource note correctly', async () => {
      const input: ClassificationInput = {
        text: 'reference article book',
        title: 'Resource Library',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      console.log('Resource test result:', JSON.stringify(result, null, 2))
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.suggestions.some(s => s.category === 'resources')).toBe(true)
      expect(result.best?.category).toBe('resources')
    })

    it('should classify an archive note correctly', async () => {
      const input: ClassificationInput = {
        text: 'This is a completed and finished task',
        title: 'Completed Work',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      console.log('Archive test result:', JSON.stringify(result, null, 2))
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.suggestions.some(s => s.category === 'archive')).toBe(true)
      expect(result.best?.category).toBe('archive')
    })

    it('should use context path for classification', async () => {
      const input: ClassificationInput = {
        text: 'Some content',
        title: 'Test Note',
        currentPath: '/projects/current-project',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      expect(result.suggestions).toHaveLength(1)
      expect(result.suggestions[0].category).toBe('projects')
      expect(result.suggestions[0].source).toBe('context')
    })

    it('should handle multiple category matches', async () => {
      const input: ClassificationInput = {
        text: 'This is a project reference and area management document',
        title: 'Multi-category Note',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      expect(result.suggestions).toHaveLength(3)
      expect(result.suggestions.map(s => s.category)).toContain('projects')
      expect(result.suggestions.map(s => s.category)).toContain('areas')
      expect(result.suggestions.map(s => s.category)).toContain('resources')
    })

    it('should return empty suggestions for no matches', async () => {
      const input: ClassificationInput = {
        text: 'Random text with no keywords',
        title: 'Random Note',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      expect(result.suggestions).toHaveLength(0)
      expect(result.best).toBeUndefined()
    })

    it('should apply learning weights', async () => {
      // Set up learning data in localStorage
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        'test-user:projects': 0.25
      }))

      const input: ClassificationInput = {
        text: 'Some content',
        title: 'Test Note',
        userId: 'test-user',
      }

      const result = await classifyNote(input)

      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.suggestions.some(s => s.category === 'projects')).toBe(true)
    })

    it('should handle user rules overrides', async () => {
      const userRules = {
        userOverrides: {
          disabledRuleIds: ['kw_deadline_project'],
          weights: { 'kw_habit_area': 2.0 },
        },
      }

      const input: ClassificationInput = {
        text: 'This is a project and area document',
        title: 'Test Note',
        userId: 'test-user',
      }

      const result = await classifyNote(input, userRules)

      // Should have suggestions but with modified weights
      expect(result.suggestions.length).toBeGreaterThan(0)
      expect(result.suggestions.some(s => s.category === 'areas')).toBe(true)
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
        text: 'This is a project note',
        title: 'Test Note',
      }

      const result = await classifyNote(input)

      expect(result.suggestions).toHaveLength(1)
      expect(result.suggestions[0].category).toBe('projects')
    })
  })

  describe('recordUserCorrection', () => {
    it('should record user correction and update learning', async () => {
      await recordUserCorrection({
        userId: 'test-user',
        noteId: 'test-note',
        finalCategory: 'projects',
      })

      // Check that learning data was saved
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'para_guidance_learning_v1',
        JSON.stringify({ 'test-user:projects': 0.25 })
      )
    })

    it('should handle missing userId', async () => {
      await recordUserCorrection({
        finalCategory: 'projects',
      })

      // Check that learning data was saved with 'anon' as userId
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'para_guidance_learning_v1',
        JSON.stringify({ 'anon:projects': 0.25 })
      )
    })
  })
})
