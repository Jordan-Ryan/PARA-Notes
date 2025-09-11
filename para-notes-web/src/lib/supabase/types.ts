// Database types for PARA Notes application
// Generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Type aliases for easier use
export type ParaCategory = "projects" | "areas" | "resources" | "archive"
export type TemplateType = "note" | "project" | "area" | "resource" | "meeting" | "review"
export type ReviewFrequency = "daily" | "weekly" | "monthly" | "quarterly" | "yearly"

// Table row types
export type User = {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export type Profile = {
  user_id: string
  display_name: string | null
  settings: Json
  created_at: string
  updated_at: string
}

export type Folder = {
  id: string
  user_id: string
  name: string
  description: string | null
  parent_id: string | null
  para_category: ParaCategory
  path: string | null
  sort_index: number
  created_at: string
  updated_at: string
}

export type Note = {
  id: string
  user_id: string
  folder_id: string | null
  title: string
  content: string | null
  encrypted_content: string | null
  is_encrypted: boolean
  tags: string[]
  version: number
  created_at: string
  updated_at: string
}

export type Attachment = {
  id: string
  note_id: string
  storage_path: string
  mime_type: string
  size: number
  created_at: string
}

export type GuidanceEvent = {
  id: string
  user_id: string
  note_id: string | null
  suggested_category: ParaCategory
  accepted: boolean | null
  rule_id: string | null
  created_at: string
}

export type Template = {
  id: string
  user_id: string
  template_type: TemplateType
  name: string
  content: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export type Review = {
  id: string
  user_id: string
  area_folder_id: string
  due_on: string
  completed_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

// Insert types
export type UserInsert = Omit<User, 'created_at' | 'updated_at'> & {
  created_at?: string
  updated_at?: string
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  created_at?: string
  updated_at?: string
}

export type FolderInsert = Omit<Folder, 'id' | 'created_at' | 'updated_at' | 'path'> & {
  id?: string
  created_at?: string
  updated_at?: string
  path?: string | null
}

export type NoteInsert = Omit<Note, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type AttachmentInsert = Omit<Attachment, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type GuidanceEventInsert = Omit<GuidanceEvent, 'id' | 'created_at'> & {
  id?: string
  created_at?: string
}

export type TemplateInsert = Omit<Template, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

export type ReviewInsert = Omit<Review, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}

// Update types
export type UserUpdate = Partial<Omit<User, 'id' | 'created_at'>>
export type ProfileUpdate = Partial<Omit<Profile, 'user_id' | 'created_at'>>
export type FolderUpdate = Partial<Omit<Folder, 'id' | 'user_id' | 'created_at' | 'path'>>
export type NoteUpdate = Partial<Omit<Note, 'id' | 'user_id' | 'created_at'>>
export type AttachmentUpdate = Partial<Omit<Attachment, 'id' | 'created_at'>>
export type GuidanceEventUpdate = Partial<Omit<GuidanceEvent, 'id' | 'user_id' | 'created_at'>>
export type TemplateUpdate = Partial<Omit<Template, 'id' | 'user_id' | 'created_at'>>
export type ReviewUpdate = Partial<Omit<Review, 'id' | 'user_id' | 'created_at'>>

// Function return types
export type ParaSuggestion = {
  suggested_category: ParaCategory
  confidence_score: number
  reasoning: string
  suggested_folder_id: string
  suggested_folder_name: string
}

export type SearchResult = {
  id: string
  title: string
  content: string | null
  folder_id: string | null
  folder_name: string | null
  para_category: ParaCategory | null
  tags: string[]
  created_at: string
  updated_at: string
  rank: number
}

export type FolderHierarchy = {
  id: string
  name: string
  description: string | null
  para_category: ParaCategory
  parent_id: string | null
  path: string | null
  sort_index: number
  level: number
  created_at: string
  updated_at: string
}

export type FolderNotesCount = {
  folder_id: string
  folder_name: string
  para_category: ParaCategory
  notes_count: number
}

// Extended types with relationships
export type NoteWithFolder = Note & {
  folder?: Folder | null
}

export type FolderWithNotes = Folder & {
  notes?: Note[]
  notes_count?: number
  children?: FolderWithNotes[]
}

export type FolderWithHierarchy = Folder & {
  level: number
  children?: FolderWithHierarchy[]
}

// API response types
export type ApiResponse<T> = {
  data?: T
  error?: string
  success: boolean
}

export type PaginatedResponse<T> = {
  data: T[]
  count: number
  page: number
  limit: number
  hasMore: boolean
}

// Search and filter types
export type SearchFilters = {
  query?: string
  para_category?: ParaCategory
  folder_id?: string
  tags?: string[]
  is_encrypted?: boolean
  date_from?: string
  date_to?: string
}

export type SortOptions = {
  field: 'created_at' | 'updated_at' | 'title' | 'rank'
  direction: 'asc' | 'desc'
}

// Settings types
export type UserSettings = {
  theme: 'light' | 'dark' | 'system'
  default_para_category: ParaCategory
  auto_save: boolean
  encryption_enabled: boolean
  sync_enabled: boolean
  notifications: {
    email: boolean
    push: boolean
    review_reminders: boolean
  }
  editor: {
    font_size: number
    font_family: string
    line_height: number
    auto_save_interval: number
  }
}

// Template content types
export type TemplateContent = {
  title: string
  content: string
  tags?: string[]
  metadata?: Record<string, any>
}

// Guidance rule types
export type GuidanceRule = {
  id: string
  name: string
  description: string
  keywords: string[]
  para_category: ParaCategory
  confidence_threshold: number
  enabled: boolean
}

// Review types
export type ReviewSchedule = {
  area_folder_id: string
  frequency: ReviewFrequency
  next_due: string
  last_completed?: string
}

// Storage types
export type FileUpload = {
  file: File
  note_id: string
  metadata?: {
    title?: string
    description?: string
  }
}

export type FileValidation = {
  valid: boolean
  error?: string
  max_size?: number
  file_size?: number
  allowed_types?: string[]
  file_type?: string
}