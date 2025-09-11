// AES-256-GCM encryption utilities using Web Crypto API

const TEXT_ENCODER = new TextEncoder();
const TEXT_DECODER = new TextDecoder();

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    TEXT_ENCODER.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey'],
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 100_000, hash: 'SHA-256' },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}

export async function encryptStringGCM(plaintext: string, passphrase: string): Promise<string> {
  if (!passphrase || passphrase.length === 0) {
    throw new Error('Passphrase cannot be empty');
  }
  
  if (!global.TextEncoder) {
    throw new Error('TextEncoder is not available');
  }
  
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await deriveKey(passphrase, salt);
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, TEXT_ENCODER.encode(plaintext));
  // Concatenate salt|iv|ciphertext and base64 encode
  const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(ciphertext), salt.length + iv.length);
  return btoa(String.fromCharCode(...combined));
}

export async function decryptStringGCM(payloadB64: string, passphrase: string): Promise<string> {
  if (!global.TextDecoder) {
    throw new Error('TextDecoder is not available');
  }
  
  try {
    const bytes = Uint8Array.from(atob(payloadB64), c => c.charCodeAt(0));
    const salt = bytes.slice(0, 16);
    const iv = bytes.slice(16, 28);
    const data = bytes.slice(28);
    const key = await deriveKey(passphrase, salt);
    const plaintext = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return TEXT_DECODER.decode(plaintext);
  } catch (error) {
    throw new Error('Decryption failed: Invalid data or passphrase');
  }
}


