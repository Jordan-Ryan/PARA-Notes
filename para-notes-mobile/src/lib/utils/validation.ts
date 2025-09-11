import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number')

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const result = passwordSchema.safeParse(password)
  return {
    valid: result.success,
    errors: result.success ? [] : (result.error?.issues?.map(e => e.message) || []),
  }
}
