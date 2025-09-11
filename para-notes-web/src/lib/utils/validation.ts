import { z } from 'zod';

// Install zod if not already installed
// npm install zod

export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const paraItemSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  category: z.enum(['projects', 'areas', 'resources', 'archive']),
  status: z.enum(['active', 'completed', 'archived']).default('active'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  dueDate: z.date().optional(),
  tags: z.array(z.string()).default([]),
  metadata: z.record(z.unknown()).optional(),
});

export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(1, 'Content is required'),
  category: z.enum(['projects', 'areas', 'resources', 'archive']),
  paraItemId: z.string().optional(),
  tags: z.array(z.string()).max(10, 'Too many tags').default([]),
  isEncrypted: z.boolean().default(false),
  isPinned: z.boolean().default(false),
  metadata: z.record(z.unknown()).optional(),
});

export const userPreferencesSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  language: z.string().default('en'),
  timezone: z.string().default('UTC'),
  dateFormat: z.string().default('MM/DD/YYYY'),
  timeFormat: z.enum(['12h', '24h']).default('12h'),
  defaultNoteCategory: z.enum(['projects', 'areas', 'resources', 'archive']).default('projects'),
  autoSave: z.boolean().default(true),
  autoSaveInterval: z.number().min(5).max(300).default(30),
  encryptionEnabled: z.boolean().default(false),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    reminders: z.boolean().default(true),
  }).default({}),
});

export function validateEmail(email: string): boolean {
  return emailSchema.safeParse(email).success;
}

export function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const result = passwordSchema.safeParse(password);
  return {
    valid: result.success,
    errors: result.success ? [] : result.error.issues.map(e => e.message),
  };
}

export function validateParaItem(data: unknown): { valid: boolean; errors: string[] } {
  const result = paraItemSchema.safeParse(data);
  if (result.success) {
    return { valid: true, errors: [] };
  } else {
    return { 
      valid: false, 
      errors: result.error.issues.map(e => e.message) 
    };
  }
}

export function validateNote(data: unknown): { valid: boolean; errors: string[] } {
  const result = noteSchema.safeParse(data);
  if (result.success) {
    return { valid: true, errors: [] };
  } else {
    return { 
      valid: false, 
      errors: result.error.issues.map(e => e.message) 
    };
  }
}
