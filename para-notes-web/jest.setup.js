// Jest setup file for web app
import '@testing-library/jest-dom'

// Set up test environment variables
process.env.NEXT_PUBLIC_SUPABASE_URL = 'http://localhost:54321'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Next.js dynamic imports
jest.mock('next/dynamic', () => () => {
  const DynamicComponent = () => null
  DynamicComponent.displayName = 'LoadableComponent'
  DynamicComponent.preload = jest.fn()
  return DynamicComponent
})

// Mock Supabase client
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      signInWithPassword: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
      getUser: jest.fn(),
      admin: {
        createUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id', email: 'test@example.com' } },
          error: null
        }),
        deleteUser: jest.fn().mockResolvedValue({ data: null, error: null }),
      },
    },
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      neq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      single: jest.fn(),
      range: jest.fn().mockReturnThis(),
    })),
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        remove: jest.fn(),
        getPublicUrl: jest.fn(),
      })),
    },
    rpc: jest.fn().mockResolvedValue({ data: [], error: null }),
    functions: {
      invoke: jest.fn(),
    },
  })),
}))

// Mock @tanstack/react-query
jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  useQueryClient: jest.fn(),
  QueryClient: jest.fn(),
  QueryClientProvider: ({ children }) => children,
  useInfiniteQuery: jest.fn(),
}))

// Mock zustand
jest.mock('zustand', () => ({
  create: jest.fn(),
  subscribeWithSelector: jest.fn(),
}))

// Mock crypto-js
jest.mock('crypto-js', () => ({
  AES: {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
  },
  enc: {
    Utf8: {
      stringify: jest.fn(),
      parse: jest.fn(),
    },
    Base64: {
      stringify: jest.fn(),
      parse: jest.fn(),
    },
  },
  mode: {
    CBC: {},
  },
  pad: {
    Pkcs7: {},
  },
}))

// Mock Web Crypto API
let mockEncryptionPassphrase = null

// Reset function for tests
global.resetCryptoMock = () => {
  mockEncryptionPassphrase = null
}

Object.defineProperty(global, 'crypto', {
  value: {
    subtle: {
      importKey: jest.fn().mockImplementation((format, keyData, algorithm, extractable, keyUsages) => {
        // Store the passphrase for validation
        if (format === 'raw' && keyData instanceof ArrayBuffer) {
          const textDecoder = new TextDecoder()
          mockEncryptionPassphrase = textDecoder.decode(keyData)
        }
        return Promise.resolve({
          algorithm,
          extractable,
          type: 'raw',
          usages: keyUsages,
          keyData, // Store the key data for validation
        })
      }),
      deriveKey: jest.fn().mockImplementation((algorithm, baseKey, derivedKeyType, extractable, keyUsages) => {
        const baseKeyPassphrase = baseKey?.keyData ? new TextDecoder().decode(baseKey.keyData) : null
        
        // Only store the passphrase if we don't have one yet (during encryption)
        if (baseKeyPassphrase && !mockEncryptionPassphrase) {
          mockEncryptionPassphrase = baseKeyPassphrase
        }
        
        return Promise.resolve({
          algorithm: derivedKeyType,
          extractable,
          type: 'secret',
          usages: keyUsages,
          baseKey, // Store the base key for validation
          passphrase: baseKeyPassphrase, // Store the passphrase for validation
        })
      }),
      encrypt: jest.fn().mockImplementation((algorithm, key, data) => {
        // Convert data to Uint8Array if it's not already
        const dataArray = data instanceof Uint8Array ? data : new Uint8Array(data)
        const originalLength = dataArray.length
        const mockEncrypted = new Uint8Array(originalLength + 16) // Add some padding for IV
        
        // Store the original data length in the first 4 bytes
        mockEncrypted[0] = originalLength & 0xFF
        mockEncrypted[1] = (originalLength >> 8) & 0xFF
        mockEncrypted[2] = (originalLength >> 16) & 0xFF
        mockEncrypted[3] = (originalLength >> 24) & 0xFF
        
        // Copy the original data after the length header
        for (let i = 0; i < originalLength; i++) {
          mockEncrypted[i + 4] = dataArray[i]
        }
        
        // Store the passphrase used for encryption
        if (key && key.passphrase) {
          mockEncryptionPassphrase = key.passphrase
        }
        
        return Promise.resolve(mockEncrypted.buffer)
      }),
      decrypt: jest.fn().mockImplementation((algorithm, key, data) => {
        // Convert data to Uint8Array if it's not already
        const dataArray = data instanceof Uint8Array ? data : new Uint8Array(data)
        
        // Check if this is a test for error handling
        if (dataArray.length < 20) { // Invalid payload size
          return Promise.reject(new Error('Decryption failed: Invalid data'))
        }
        
        // Check if the passphrase matches the one used for encryption
        if (key && key.passphrase && key.passphrase !== mockEncryptionPassphrase) {
          return Promise.reject(new Error('Decryption failed: Invalid data or passphrase'))
        }
        
        // Extract the original data length from the encrypted data
        const originalLength = dataArray[0] | (dataArray[1] << 8) | (dataArray[2] << 16) | (dataArray[3] << 24)
        
        if (originalLength > dataArray.length - 4) {
          return Promise.reject(new Error('Decryption failed: Invalid data'))
        }
        
        const mockDecrypted = new Uint8Array(originalLength)
        
        // Copy the original data back
        for (let i = 0; i < originalLength; i++) {
          mockDecrypted[i] = dataArray[i + 4]
        }
        
        return Promise.resolve(mockDecrypted.buffer)
      }),
    },
    getRandomValues: jest.fn((arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    }),
  },
})

// Mock TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder

// Mock btoa/atob
global.btoa = (str) => Buffer.from(str, 'binary').toString('base64')
global.atob = (str) => Buffer.from(str, 'base64').toString('binary')

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock sessionStorage
Object.defineProperty(window, 'sessionStorage', {
  value: localStorageMock,
})

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock lowlight module
jest.mock('lowlight', () => ({
  all: {},
  registerLanguage: jest.fn(),
  highlight: jest.fn(),
}))

// Mock fetch
global.fetch = jest.fn()

// Mock console methods to reduce noise in tests
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalConsoleError.call(console, ...args)
  }
  console.warn = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('componentWillReceiveProps')
    ) {
      return
    }
    originalConsoleWarn.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks()
  localStorageMock.clear()
})
