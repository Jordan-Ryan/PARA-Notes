import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthProvider from '@/app/AuthProvider'

// Create a custom render function that includes providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  })


  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </QueryClientProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

// Re-export everything
export * from '@testing-library/react'
export { customRender as render }

// Test utilities
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  full_name: 'Test User',
  avatar_url: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockNote = (overrides = {}) => ({
  id: 'test-note-id',
  title: 'Test Note',
  content: 'Test content',
  para_category: 'projects' as const,
  para_area: null,
  para_project: null,
  para_resource: null,
  tags: ['test'],
  is_encrypted: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  synced_at: null,
  ...overrides,
})

export const createMockProject = (overrides = {}) => ({
  id: 'test-project-id',
  name: 'Test Project',
  description: 'Test project description',
  area_id: null,
  status: 'active' as const,
  due_date: null,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockArea = (overrides = {}) => ({
  id: 'test-area-id',
  name: 'Test Area',
  description: 'Test area description',
  color: '#FF6B6B',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockResource = (overrides = {}) => ({
  id: 'test-resource-id',
  name: 'Test Resource',
  description: 'Test resource description',
  url: 'https://example.com',
  type: 'website' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockFolder = (overrides = {}) => ({
  id: 'test-folder-id',
  name: 'Test Folder',
  description: 'Test folder description',
  parent_id: null,
  path: 'test-folder-id',
  para_category: 'projects' as const,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockAttachment = (overrides = {}) => ({
  id: 'test-attachment-id',
  note_id: 'test-note-id',
  filename: 'test-file.pdf',
  content_type: 'application/pdf',
  size: 1024,
  url: 'https://example.com/test-file.pdf',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockGuidanceEvent = (overrides = {}) => ({
  id: 'test-guidance-id',
  user_id: 'test-user-id',
  event_type: 'suggestion_served',
  category: 'projects',
  confidence: 0.85,
  properties: {},
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

// Mock data arrays
export const createMockNotes = (count = 5) =>
  Array.from({ length: count }, (_, i) =>
    createMockNote({
      id: `note-${i}`,
      title: `Test Note ${i + 1}`,
      content: `Content for note ${i + 1}`,
    })
  )

export const createMockProjects = (count = 3) =>
  Array.from({ length: count }, (_, i) =>
    createMockProject({
      id: `project-${i}`,
      name: `Test Project ${i + 1}`,
    })
  )

export const createMockAreas = (count = 2) =>
  Array.from({ length: count }, (_, i) =>
    createMockArea({
      id: `area-${i}`,
      name: `Test Area ${i + 1}`,
    })
  )

// Mock Supabase responses
export const createMockSupabaseResponse = (data: any, error = null) => ({
  data,
  error,
  status: error ? 400 : 200,
  statusText: error ? 'Bad Request' : 'OK',
})

export const createMockSupabaseError = (message = 'Test error') => ({
  message,
  details: 'Test error details',
  hint: 'Test error hint',
  code: 'TEST_ERROR',
})

// Mock navigation
export const createMockRouter = () => ({
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
})

// Mock search params
export const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams(params)
  return {
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
    keys: () => searchParams.keys(),
    values: () => searchParams.values(),
    entries: () => searchParams.entries(),
    forEach: (callback: (value: string, key: string) => void) => {
      searchParams.forEach(callback)
    },
    toString: () => searchParams.toString(),
  }
}

// Test helpers
export const waitFor = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms))

export const mockFetch = (response: any, status = 200) => {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(response),
    text: () => Promise.resolve(JSON.stringify(response)),
  })
}

export const mockFetchError = (message = 'Network error') => {
  global.fetch = jest.fn().mockRejectedValue(new Error(message))
}

// Cleanup helper
export const cleanup = () => {
  jest.clearAllMocks()
  global.fetch = jest.fn()
}
