/**
 * Server-side ONLY backend address map
 * Maps base64-encoded config to backend addresses
 * 
 * ⚠️ SECURITY: This file must NEVER be imported in client components
 * All access must go through Server Actions
 */

type BackendAddressMap = Record<string, string>;

let addressMapCache: BackendAddressMap | null = null;

/**
 * Loads backend address map from environment variable
 * Expected format in .env:
 * BACKEND_ADDRESS_MAP='{"base64ConfigToken":"https://api1.com","anotherToken":"https://api2.com"}'
 * Where the key is base64 of {"companyName":"...","cnpj":"..."}
 */
function loadAddressMap(): BackendAddressMap {
  if (addressMapCache) {
    return addressMapCache;
  }

  const addressMapJson = process.env.BACKEND_ADDRESS_MAP;

  if (!addressMapJson) {
    console.warn('BACKEND_ADDRESS_MAP not found in environment variables');
    return {};
  }

  try {
    addressMapCache = JSON.parse(addressMapJson) as BackendAddressMap;
    return addressMapCache;
  } catch (error) {
    console.error('Failed to parse BACKEND_ADDRESS_MAP:', error);
    return {};
  }
}

/**
 * Gets backend address from config token (base64 of config)
 * SERVER-SIDE ONLY
 */
export function getBackendAddress(configToken: string): string | null {
  const addressMap = loadAddressMap();
  return addressMap[configToken] || null;
}

/**
 * Validates if a config token exists
 * SERVER-SIDE ONLY
 */
export function isValidConfigToken(configToken: string): boolean {
  const addressMap = loadAddressMap();
  return configToken in addressMap;
}
