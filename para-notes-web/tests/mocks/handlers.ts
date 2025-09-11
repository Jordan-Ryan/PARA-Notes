import { http, HttpResponse } from 'msw'
import { createMockUser, createMockNote, createMockProject, createMockArea, createMockResource } from '../utils/test-utils'

const baseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL'] || 'http://localhost:54321'

// Auth handlers
export const authHandlers = [
  // Sign in
  http.post(`${baseUrl}/auth/v1/token?grant_type=password`, async ({ request }) => {
    const body = await request.json() as any
    if ('test@example.com' === 'test@example.com' && body.password === 'password') {
      return HttpResponse.json({
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: createMockUser({ email: 'test@example.com' }),
      })
    }
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 400 }
    )
  }),

  // Sign up
  http.post(`${baseUrl}/auth/v1/signup`, async ({ request: _request }) => {
    return HttpResponse.json({
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token',
      expires_in: 3600,
      token_type: 'bearer',
      user: createMockUser({ email: 'test@example.com' }),
    })
  }),

  // Sign out
  http.post(`${baseUrl}/auth/v1/logout`, () => {
    return HttpResponse.json({})
  }),

  // Get user
  http.get(`${baseUrl}/auth/v1/user`, () => {
    return HttpResponse.json({
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {},
      app_metadata: {},
      aud: 'authenticated',
      created_at: '2024-01-01T00:00:00Z',
    })
  }),
]

// Database handlers
export const databaseHandlers = [
  // Notes
  http.get(`${baseUrl}/rest/v1/notes`, ({ request }) => {
    const url = new URL(request.url)
    const userId = url.searchParams.get('user_id')
    
    if (userId !== 'test-user-id') {
      return HttpResponse.json([], { status: 200 })
    }

    const notes = [
      createMockNote({ id: 'note-1', title: 'First Note' }),
      createMockNote({ id: 'note-2', title: 'Second Note' }),
    ]

    return HttpResponse.json(notes)
  }),

  http.post(`${baseUrl}/rest/v1/notes`, async ({ request }) => {
    const body = await request.json() as any
    const newNote = createMockNote({
      id: 'new-note-id',
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    return HttpResponse.json([newNote], { status: 201 })
  }),

  http.patch(`${baseUrl}/rest/v1/notes`, async ({ request }) => {
    const body = await request.json() as any
    const updatedNote = createMockNote({
      ...body,
      updated_at: new Date().toISOString(),
    })
    return HttpResponse.json([updatedNote], { status: 200 })
  }),

  http.delete(`${baseUrl}/rest/v1/notes`, () => {
    return HttpResponse.json([], { status: 204 })
  }),

  // Projects
  http.get(`${baseUrl}/rest/v1/projects`, () => {
    const projects = [
      createMockProject({ id: 'project-1', name: 'First Project' }),
      createMockProject({ id: 'project-2', name: 'Second Project' }),
    ]
    return HttpResponse.json(projects)
  }),

  // Areas
  http.get(`${baseUrl}/rest/v1/areas`, () => {
    const areas = [
      createMockArea({ id: 'area-1', name: 'First Area' }),
      createMockArea({ id: 'area-2', name: 'Second Area' }),
    ]
    return HttpResponse.json(areas)
  }),

  // Resources
  http.get(`${baseUrl}/rest/v1/resources`, () => {
    const resources = [
      createMockResource({ id: 'resource-1', name: 'First Resource' }),
      createMockResource({ id: 'resource-2', name: 'Second Resource' }),
    ]
    return HttpResponse.json(resources)
  }),

  // RPC functions
  http.post(`${baseUrl}/rest/v1/rpc/para_suggest`, async ({ request: _request }) => {
    return HttpResponse.json({
      suggestions: [
        {
          category: 'projects',
          confidence: 0.85,
          reasons: ['Contains project-related keywords'],
        },
      ],
    })
  }),

  http.post(`${baseUrl}/rest/v1/rpc/search_notes`, async ({ request }) => {
    const body = await request.json() as any
    const query = body.search_query || ''
    
    const notes = [
      createMockNote({ 
        id: 'search-1', 
        title: `Search Result for "${query}"`,
        content: `Content matching ${query}`,
      }),
    ]
    
    return HttpResponse.json(notes)
  }),
]

// Storage handlers
export const storageHandlers = [
  // Upload file
  http.post(`${baseUrl}/storage/v1/object/attachments/*`, async ({ request }) => {
    const url = new URL(request.url)
    const path = url.pathname.replace('/storage/v1/object/attachments/', '')
    
    return HttpResponse.json({
      path,
      id: 'mock-file-id',
      fullPath: `attachments/${path}`,
    })
  }),

  // Download file
  http.get(`${baseUrl}/storage/v1/object/attachments/*`, () => {
    return HttpResponse.arrayBuffer(new ArrayBuffer(1024))
  }),

  // Delete file
  http.delete(`${baseUrl}/storage/v1/object/attachments/*`, () => {
    return HttpResponse.json({})
  }),

  // Get public URL
  http.get(`${baseUrl}/storage/v1/object/public/attachments/*`, () => {
    return HttpResponse.redirect('https://example.com/mock-file-url')
  }),
]

// Edge functions handlers
export const edgeFunctionHandlers = [
  // Guidance classification
  http.post(`${baseUrl}/functions/v1/guidance-classify`, async ({ request: _request }) => {
    return HttpResponse.json({
      suggestions: [
        {
          category: 'projects',
          confidence: 0.9,
          reasons: ['AI classification based on content'],
          source: 'server',
        },
      ],
      best: {
        category: 'projects',
        confidence: { value: 0.9, reasons: ['AI classification'] },
        source: 'server',
        keywordsMatched: [],
      },
    })
  }),
]

// Combine all handlers
export const handlers = [
  ...authHandlers,
  ...databaseHandlers,
  ...storageHandlers,
  ...edgeFunctionHandlers,
]

// Error handlers for testing error scenarios
export const errorHandlers = [
  // Network error
  http.get(`${baseUrl}/rest/v1/notes`, () => {
    return HttpResponse.error()
  }),

  // Auth error
  http.post(`${baseUrl}/auth/v1/token?grant_type=password`, () => {
    return HttpResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // Database error
  http.post(`${baseUrl}/rest/v1/notes`, () => {
    return HttpResponse.json(
      { error: 'Database error', code: 'DB_ERROR' },
      { status: 500 }
    )
  }),
]
