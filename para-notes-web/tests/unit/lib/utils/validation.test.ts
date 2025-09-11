import { z } from 'zod'
import { validateEmail, validatePassword, validateNote, validateParaItem } from '@/lib/utils/validation'

// Mock validation schemas and functions
const noteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  content: z.string(),
  para_category: z.enum(['projects', 'areas', 'resources', 'archive']),
  tags: z.array(z.string()).max(10),
  is_encrypted: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
})

const userSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().min(1).max(100),
  avatar_url: z.string().url().nullable(),
})

const projectSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500),
  area_id: z.string().uuid().nullable(),
  status: z.enum(['active', 'completed', 'on_hold', 'cancelled']),
  due_date: z.string().datetime().nullable(),
})

// Validation utility functions
const validateNoteData = (data: unknown) => {
  try {
    return { success: true, data: noteSchema.parse(data) }
  } catch (error) {
    return { success: false, error: error instanceof z.ZodError ? error.errors : [error] }
  }
}

const validateUser = (data: unknown) => {
  try {
    return { success: true, data: userSchema.parse(data) }
  } catch (error) {
    return { success: false, error: error instanceof z.ZodError ? error.errors : [error] }
  }
}

const validateProject = (data: unknown) => {
  try {
    return { success: true, data: projectSchema.parse(data) }
  } catch (error) {
    return { success: false, error: error instanceof z.ZodError ? error.errors : [error] }
  }
}

const sanitizeHtml = (html: string): string => {
  // Simple HTML sanitization for testing
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:[^"]*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const validateUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

const validateUuid = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

describe('Data Validation Utilities', () => {
  describe('Note Validation', () => {
    it('should validate a valid note', () => {
      const validNote = {
        title: 'Test Note',
        content: 'This is test content',
        category: 'projects',
        tags: ['test', 'example'],
        isEncrypted: false,
      }

      const result = validateNote(validNote)

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject note with empty title', () => {
      const invalidNote = {
        title: '',
        content: 'This is test content',
        category: 'projects',
        tags: ['test'],
        isEncrypted: false,
      }

      const result = validateNote(invalidNote)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Title is required')
    })

    it('should reject note with invalid category', () => {
      const invalidNote = {
        title: 'Test Note',
        content: 'This is test content',
        category: 'invalid-category',
        tags: ['test'],
        isEncrypted: false,
      }

      const result = validateNote(invalidNote)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should reject note with too many tags', () => {
      const invalidNote = {
        title: 'Test Note',
        content: 'This is test content',
        category: 'projects',
        tags: Array.from({ length: 15 }, (_, i) => `tag${i}`),
        isEncrypted: false,
      }

      const result = validateNote(invalidNote)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should reject note with missing content', () => {
      const invalidNote = {
        title: 'Test Note',
        content: '',
        category: 'projects',
        tags: ['test'],
        isEncrypted: false,
      }

      const result = validateNote(invalidNote)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Content is required')
    })
  })

  describe('User Validation', () => {
    it('should validate email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('invalid-email')).toBe(false)
    })

    it('should validate passwords', () => {
      const validResult = validatePassword('ValidPass123')
      expect(validResult.valid).toBe(true)
      expect(validResult.errors).toEqual([])

      const invalidResult = validatePassword('weak')
      expect(invalidResult.valid).toBe(false)
      expect(invalidResult.errors.length).toBeGreaterThan(0)
    })
  })

  describe('Project Validation', () => {
    it('should validate a valid para item', () => {
      const validParaItem = {
        title: 'Test Project',
        description: 'This is a test project',
        category: 'projects',
        status: 'active',
        priority: 'medium',
        dueDate: new Date('2024-12-31T23:59:59Z'),
        tags: ['test'],
      }

      const result = validateParaItem(validParaItem)

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should validate para item with optional fields', () => {
      const validParaItem = {
        title: 'Test Project',
        description: 'This is a test project',
        category: 'projects',
        status: 'active',
        priority: 'medium',
        tags: [],
      }

      const result = validateParaItem(validParaItem)

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject para item with invalid status', () => {
      const invalidParaItem = {
        title: 'Test Project',
        description: 'This is a test project',
        category: 'projects',
        status: 'invalid-status',
        priority: 'medium',
        tags: [],
      }

      const result = validateParaItem(invalidParaItem)

      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })
  })

  describe('HTML Sanitization', () => {
    it('should remove script tags', () => {
      const html = '<p>Hello</p><script>alert("xss")</script><p>World</p>'
      const sanitized = sanitizeHtml(html)

      expect(sanitized).toBe('<p>Hello</p><p>World</p>')
      expect(sanitized).not.toContain('<script>')
    })

    it('should remove iframe tags', () => {
      const html = '<p>Hello</p><iframe src="malicious.com"></iframe><p>World</p>'
      const sanitized = sanitizeHtml(html)

      expect(sanitized).toBe('<p>Hello</p><p>World</p>')
      expect(sanitized).not.toContain('<iframe>')
    })

    it('should remove event handlers', () => {
      const html = '<p onclick="alert(\'xss\')">Hello</p>'
      const sanitized = sanitizeHtml(html)

      expect(sanitized).toBe('<p >Hello</p>')
      expect(sanitized).not.toContain('onclick')
    })

    it('should remove javascript: protocols', () => {
      const html = '<a href="javascript:alert(\'xss\')">Click me</a>'
      const sanitized = sanitizeHtml(html)

      expect(sanitized).toBe('<a href="">Click me</a>')
      expect(sanitized).not.toContain('javascript:')
    })

    it('should preserve safe HTML', () => {
      const html = '<p><strong>Bold</strong> and <em>italic</em> text</p>'
      const sanitized = sanitizeHtml(html)

      expect(sanitized).toBe(html)
    })
  })

  describe('Email Validation', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true)
      expect(validateEmail('user.name@domain.co.uk')).toBe(true)
      expect(validateEmail('user+tag@example.org')).toBe(true)
    })

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false)
      expect(validateEmail('@example.com')).toBe(false)
      expect(validateEmail('test@')).toBe(false)
      expect(validateEmail('test.example.com')).toBe(false)
      expect(validateEmail('')).toBe(false)
    })
  })

  describe('URL Validation', () => {
    it('should validate correct URLs', () => {
      expect(validateUrl('https://example.com')).toBe(true)
      expect(validateUrl('http://localhost:3000')).toBe(true)
      expect(validateUrl('https://subdomain.example.com/path?query=value')).toBe(true)
    })

    it('should reject invalid URLs', () => {
      expect(validateUrl('not-a-url')).toBe(false)
      expect(validateUrl('')).toBe(false)
    })
  })

  describe('UUID Validation', () => {
    it('should validate correct UUIDs', () => {
      expect(validateUuid('123e4567-e89b-12d3-a456-426614174000')).toBe(true)
      expect(validateUuid('ffffffff-ffff-ffff-ffff-ffffffffffff')).toBe(true)
    })

    it('should reject invalid UUIDs', () => {
      expect(validateUuid('invalid-uuid')).toBe(false)
      expect(validateUuid('123e4567-e89b-12d3-a456')).toBe(false)
      expect(validateUuid('123e4567-e89b-12d3-a456-426614174000-extra')).toBe(false)
      expect(validateUuid('')).toBe(false)
    })
  })
})
