// utils/crypto.js
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
// Convert base64 key to buffer directly
const key = Buffer.from(process.env.CRYPTO_SECRET, 'base64');

export function encryptText(text) {
  // Generate a random 16-byte IV
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  
  // Encrypt the text
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  // Return IV and encrypted content both in base64
  return `${iv.toString('base64')}:${encrypted}`;
}

export function decryptText(encryptedText) {
  try {
    // Split the IV and encrypted content
    const [ivBase64, encrypted] = encryptedText.split(':');
    
    // Convert IV from base64 to buffer
    const iv = Buffer.from(ivBase64, 'base64');
    
    // Create decipher
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    
    // Decrypt the content
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    // Return empty string or original content if decryption fails
    // This helps handle any non-encrypted content during transition
    return '';
  }
}