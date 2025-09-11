import { encryptStringGCM, decryptStringGCM } from '@/lib/editor/crypto'

describe('Crypto Functions', () => {
  beforeEach(() => {
    // Reset the mock state
    jest.clearAllMocks()
    if (global.resetCryptoMock) {
      global.resetCryptoMock()
    }
  })
  describe('encryptStringGCM', () => {
    it('should encrypt a string successfully', async () => {
      const plaintext = 'Hello, World!'
      const passphrase = 'test-passphrase'
      
      const result = await encryptStringGCM(plaintext, passphrase)
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle empty string', async () => {
      const plaintext = ''
      const passphrase = 'test-passphrase'
      
      const result = await encryptStringGCM(plaintext, passphrase)
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should handle special characters', async () => {
      const plaintext = 'Hello, 世界! 🌍'
      const passphrase = 'test-passphrase'
      
      const result = await encryptStringGCM(plaintext, passphrase)
      
      expect(result).toBeDefined()
      expect(typeof result).toBe('string')
      expect(result.length).toBeGreaterThan(0)
    })

    it('should generate different results for same input', async () => {
      const plaintext = 'Hello, World!'
      const passphrase = 'test-passphrase'
      
      const result1 = await encryptStringGCM(plaintext, passphrase)
      const result2 = await encryptStringGCM(plaintext, passphrase)
      
      // Results should be different due to different salt/iv
      expect(result1).not.toBe(result2)
    })

    it('should handle encryption errors', async () => {
      const plaintext = 'Hello, World!'
      const passphrase = ''
      
      await expect(encryptStringGCM(plaintext, passphrase)).rejects.toThrow()
    })
  })

  describe('decryptStringGCM', () => {
    it('should decrypt a string successfully', async () => {
      const plaintext = 'Hello'
      const passphrase = 'test-passphrase'
      
      const encrypted = await encryptStringGCM(plaintext, passphrase)
      const result = await decryptStringGCM(encrypted, passphrase)
      
      expect(result).toBe(plaintext)
    })

    it('should handle invalid base64 input', async () => {
      const invalidBase64 = 'invalid-base64-string'
      const passphrase = 'test-passphrase'
      
      await expect(decryptStringGCM(invalidBase64, passphrase)).rejects.toThrow()
    })

    it('should handle decryption errors', async () => {
      const invalidPayload = 'invalid-payload'
      const passphrase = 'test-passphrase'
      
      await expect(decryptStringGCM(invalidPayload, passphrase)).rejects.toThrow()
    })

    it('should handle wrong passphrase', async () => {
      const plaintext = 'Hello'
      const passphrase = 'test-passphrase'
      const wrongPassphrase = 'wrong-passphrase'
      
      const encrypted = await encryptStringGCM(plaintext, passphrase)
      
      await expect(decryptStringGCM(encrypted, wrongPassphrase)).rejects.toThrow()
    })
  })

  describe('encrypt/decrypt roundtrip', () => {
    it('should successfully encrypt and decrypt the same string', async () => {
      const plaintext = 'Hello, World! This is a test message.'
      const passphrase = 'test-passphrase'
      
      const encrypted = await encryptStringGCM(plaintext, passphrase)
      const decrypted = await decryptStringGCM(encrypted, passphrase)
      
      expect(decrypted).toBe(plaintext)
    })
  })

  describe('error handling', () => {
    it('should handle missing Web Crypto API', async () => {
      const originalCrypto = global.crypto
      // @ts-ignore
      delete global.crypto
      
      await expect(encryptStringGCM('test', 'pass')).rejects.toThrow()
      
      global.crypto = originalCrypto
    })

    it('should handle missing TextEncoder', async () => {
      const originalTextEncoder = global.TextEncoder
      // @ts-ignore
      delete global.TextEncoder
      
      await expect(encryptStringGCM('test', 'pass')).rejects.toThrow()
      
      global.TextEncoder = originalTextEncoder
    })

    it('should handle missing TextDecoder', async () => {
      const originalTextDecoder = global.TextDecoder
      // @ts-ignore
      delete global.TextDecoder
      
      await expect(decryptStringGCM('test', 'pass')).rejects.toThrow()
      
      global.TextDecoder = originalTextDecoder
    })
  })
})