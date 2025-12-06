/**
 * Backend configuration types and utilities
 */

export interface BackendConfig {
  companyName: string;
  cnpj: string;
}

/**
 * Decodes a URL-safe base64 encoded configuration string
 * @param encodedConfig - Base64 URL-safe encoded JSON string
 * @returns Decoded BackendConfig object or null if decoding fails
 * 
 * @example
 * const config = decodeConfig('eyJkb21haW4iOiJodHRwczovL2FwaS5leGFtcGxlLmNvbSIsImNvbXBhbnlOYW1lIjoiRXhhbXBsZSBDb21wYW55In0');
 * // Returns: { domain: "https://api.example.com", companyName: "Example Company" }
 */
export function decodeConfig(encodedConfig: string): BackendConfig | null {
  try {
    // Convert URL-safe base64 to standard base64
    const base64 = encodedConfig.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64 to JSON string
    const jsonString = atob(base64);
    
    // Parse JSON
    const config = JSON.parse(jsonString) as BackendConfig;
    
    // Validate required fields
    if (!config.companyName || !config.cnpj) {
      throw new Error('Invalid config: missing required fields');
    }
    
    return config;
  } catch (error) {
    console.error('Failed to decode config:', error);
    return null;
  }
}

/**
 * Encodes a BackendConfig object to URL-safe base64 string
 * @param config - BackendConfig object to encode
 * @returns URL-safe base64 encoded string
 * 
 * @example
 * const encoded = encodeConfig({ 
 *   domain: "https://api.example.com", 
 *   companyName: "Example Company" 
 * });
 */
export function encodeConfig(config: BackendConfig): string {
  const jsonString = JSON.stringify(config);
  const base64 = btoa(jsonString);
  // Convert to URL-safe base64
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Validates if a string is a valid backend domain
 */
export function isValidDomain(domain: string): boolean {
  try {
    new URL(domain);
    return true;
  } catch {
    return false;
  }
}
