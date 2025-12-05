/**
 * Server-side ONLY configuration map
 * Maps encoded config tokens to backend domains
 * 
 * ⚠️ SECURITY: This file must NEVER be imported in client components
 * All access must go through Server Actions
 */

export interface ConfigMapping {
  domain: string;
  companyName: string;
}

type ConfigMapType = Record<string, ConfigMapping>;

let configMapCache: ConfigMapType | null = null;

/**
 * Loads configuration map from environment variable
 * Expected format in .env:
 * BACKEND_CONFIG_MAP='{"token1":{"domain":"https://api1.com","companyName":"Company1"},"token2":{...}}'
 */
function loadConfigMap(): ConfigMapType {
  if (configMapCache) {
    return configMapCache;
  }

  const configMapJson = process.env.BACKEND_CONFIG_MAP;

  if (!configMapJson) {
    console.warn('BACKEND_CONFIG_MAP not found in environment variables');
    return {};
  }

  try {
    configMapCache = JSON.parse(configMapJson) as ConfigMapType;
    return configMapCache;
  } catch (error) {
    console.error('Failed to parse BACKEND_CONFIG_MAP:', error);
    return {};
  }
}

/**
 * Gets backend domain from config token
 * SERVER-SIDE ONLY
 */
export function getBackendDomain(configToken: string): string | null {
  const configMap = loadConfigMap();
  const config = configMap[configToken];
  return config?.domain || null;
}

/**
 * Gets full config mapping from token
 * SERVER-SIDE ONLY
 */
export function getConfigMapping(configToken: string): ConfigMapping | null {
  const configMap = loadConfigMap();
  return configMap[configToken] || null;
}

/**
 * Validates if a config token exists
 * SERVER-SIDE ONLY
 */
export function isValidConfigToken(configToken: string): boolean {
  const configMap = loadConfigMap();
  return configToken in configMap;
}
