import { validateEmail, validatePassword } from '@/lib/utils/validation'

describe('Validation Utils', () => {
  describe('validateEmail', () => {
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

  describe('validatePassword', () => {
    it('should validate strong passwords', () => {
      const result = validatePassword('StrongPass123')
      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should reject weak passwords', () => {
      const result = validatePassword('weak')
      expect(result.valid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should require minimum length', () => {
      const result = validatePassword('Short1')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters')
    })

    it('should require uppercase letter', () => {
      const result = validatePassword('lowercase123')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
    })

    it('should require lowercase letter', () => {
      const result = validatePassword('UPPERCASE123')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one lowercase letter')
    })

    it('should require number', () => {
      const result = validatePassword('NoNumbers')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one number')
    })
  })
})
