// Mock Supabase client first
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(() => ({
        data: {
          subscription: {
            unsubscribe: jest.fn(),
          },
        },
      })),
      getUser: jest.fn(),
    },
  })),
}))

const mockSupabaseClient = {
  auth: {
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    getUser: jest.fn(),
  },
}

import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@supabase/supabase-js'

// Mock the auth store
const mockAuthStore = {
  user: null,
  session: null,
  isLoading: false,
  error: null,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  setUser: jest.fn(),
  setSession: jest.fn(),
  setLoading: jest.fn(),
  setError: jest.fn(),
  clearAuth: jest.fn(),
}

jest.mock('@/stores/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return initial auth state', () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    expect(result.current.user).toBeNull()
    expect(result.current.isLoading).toBe(false)
    expect(typeof result.current.login).toBe('function')
    expect(typeof result.current.signup).toBe('function')
    expect(typeof result.current.logout).toBe('function')
  })

  it('should handle successful sign in', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {},
    }

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
    }

    (createClient().auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.login({ email: 'test@example.com', password: 'password' })
    })

    expect(createClient().auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
    })
    expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser)
  })

  it('should handle sign in error', async () => {
    const mockError = {
      message: 'Invalid credentials',
      status: 400,
    }

    mockSupabaseClient.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      const loginResult = await result.current.login({ email: 'test@example.com', password: 'wrong-password' })
      expect(loginResult.success).toBe(false)
      expect(loginResult.error).toEqual(mockError.message)
    })

    expect(mockSupabaseClient.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'wrong-password',
    })
    expect(mockAuthStore.setUser).not.toHaveBeenCalled()
  })

  it('should handle successful sign up', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {},
    }

    const mockSession = {
      user: mockUser,
      access_token: 'mock-token',
      refresh_token: 'mock-refresh-token',
    }

    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.signup({ email: 'test@example.com', password: 'password', fullName: 'Test User' })
    })

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password',
      options: {
        data: {
          full_name: 'Test User',
        },
      },
    })
    expect(mockAuthStore.setUser).toHaveBeenCalledWith(mockUser)
  })

  it('should handle sign up error', async () => {
    const mockError = {
      message: 'Email already registered',
      status: 422,
    }

    mockSupabaseClient.auth.signUp.mockResolvedValue({
      data: { user: null, session: null },
      error: mockError,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      try {
        await result.current.signup({ email: 'test@example.com', password: 'password', fullName: 'Test User' })
      } catch (error) {
        expect(error).toEqual(mockError)
      }
    })

    expect(mockSupabaseClient.auth.signUp).toHaveBeenCalled()
    expect(mockAuthStore.signUp).not.toHaveBeenCalled()
  })

  it('should handle sign out', async () => {
    mockSupabaseClient.auth.signOut.mockResolvedValue({
      error: null,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      await result.current.logout()
    })

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
    expect(mockAuthStore.signOut).toHaveBeenCalled()
  })

  it('should handle sign out error', async () => {
    const mockError = {
      message: 'Sign out failed',
      status: 500,
    }

    mockSupabaseClient.auth.signOut.mockResolvedValue({
      error: mockError,
    })

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      try {
        await result.current.logout()
      } catch (error) {
        expect(error).toEqual(mockError)
      }
    })

    expect(mockSupabaseClient.auth.signOut).toHaveBeenCalled()
    expect(mockAuthStore.signOut).not.toHaveBeenCalled()
  })

  it('should set loading state during async operations', async () => {
    let resolvePromise: (value: any) => void
    const promise = new Promise((resolve) => {
      resolvePromise = resolve
    })

    mockSupabaseClient.auth.signInWithPassword.mockReturnValue(promise)

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    act(() => {
      result.current.login({ email: 'test@example.com', password: 'password' })
    })

    // Check that loading state is set
    expect(mockAuthStore.setLoading).toHaveBeenCalledWith(true)

    // Resolve the promise
    await act(async () => {
      resolvePromise!({
        data: { user: null, session: null },
        error: null,
      })
    })

    // Check that loading state is cleared
    expect(mockAuthStore.setLoading).toHaveBeenCalledWith(false)
  })

  it('should handle network errors', async () => {
    const networkError = new Error('Network error')
    mockSupabaseClient.auth.signInWithPassword.mockRejectedValue(networkError)

    const { result } = renderHook(() => useAuth(), {
      wrapper: createWrapper(),
    })

    await act(async () => {
      try {
        await result.current.login({ email: 'test@example.com', password: 'password' })
      } catch (error) {
        expect(error).toEqual(networkError)
      }
    })

    expect(mockAuthStore.setLoading).toHaveBeenCalledWith(false)
  })
})
