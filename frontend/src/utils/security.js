import CryptoJS from "crypto-js";
import DOMPurify from "dompurify";
import env from "../consts/env";

const SECRET_KEY = env.viteEncryptionKey;

//--------------------------------------------
// Encrypt plain text using AES
//--------------------------------------------
export const encrypt = (text) => {
  try {
    if (!text) return "";
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch (e) {
    console.error("🔒 Encryption failed:", e);
    return "";
  }
};

//---------------------------------------------
//  Decrypt AES cipher to plain text
//---------------------------------------------
export const decrypt = (cipher) => {
  try {
    if (!cipher) return "";
    const bytes = CryptoJS.AES.decrypt(cipher, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (e) {
    console.error("Decryption failed:", e);
    return "";
  }
};

//---------------------------------------------------------------------------------
// Sanitize HTML to prevent XSS
//    - Use sanitizeHTML right before rendering HTML in dangerouslySetInnerHTML.
//    - Optional: sanitize input before sending to backend.
//    - Always use it for any HTML content from untrusted sources.
//---------------------------------------------------------------------------------
export const sanitizeHTML = (html) => DOMPurify.sanitize(html);

//------------------------------------------------------
//  * Secure wrapper around sessionStorage
//  * Automatically encrypts and decrypts stored values
//------------------------------------------------------
export const secureStorage = {
  //----------------------------------------
  // Store value (auto-encrypted)
  //----------------------------------------
  set: (key, value) => {
    try {
      const sanitizedKey = sanitizeHTML(key);
      const sanitizedValue = sanitizeHTML(JSON.stringify(value));
      const encrypted = encrypt(sanitizedValue);
      sessionStorage.setItem(sanitizedKey, encrypted);
    } catch (err) {
      console.error(`Failed to set item "${key}" in secureStorage:`, err);
    }
  },

  //-----------------------------------------
  // Retrieve and decrypt value
  //-----------------------------------------
  get: (key) => {
    try {
      const data = sessionStorage.getItem(key);
      if (!data) return null;

      const decrypted = decrypt(data);
      if (!decrypted) return null;

      return JSON.parse(decrypted);
    } catch (err) {
      console.error(`Failed to get item "${key}" from secureStorage:`, err);
      return null;
    }
  },

  //-----------------------------------------
  // Remove key from sessionStorage
  //-----------------------------------------
  remove: (key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (err) {
      console.error(`Failed to remove item "${key}" from secureStorage:`, err);
    }
  },

  //-----------------------------------------
  // Clear all keys (optional helper)
  //-----------------------------------------
  clear: () => {
    try {
      sessionStorage.clear();
    } catch (err) {
      console.error("Failed to clear secureStorage:", err);
    }
  },
};
