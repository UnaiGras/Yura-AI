import Constants from 'expo-constants';

const configExtra = (Constants.expoConfig?.extra ?? {}) as Record<string, unknown>;
const manifestExtra = (Constants.manifest as Record<string, unknown> | undefined)?.extra;
const extra = {
  ...(typeof manifestExtra === 'object' && manifestExtra !== null ? manifestExtra : {}),
  ...configExtra,
} as Record<string, unknown>;

const apiKeyFromEnv = process.env.EXPO_PUBLIC_REVENUECAT_API_KEY;
const entitlementIdFromEnv = process.env.EXPO_PUBLIC_REVENUECAT_ENTITLEMENT_ID;

export const REVENUECAT_API_KEY: string =
  (typeof apiKeyFromEnv === 'string' && apiKeyFromEnv.trim().length > 0
    ? apiKeyFromEnv.trim()
    : typeof extra.revenueCatApiKey === 'string'
      ? extra.revenueCatApiKey
      : '').trim();

export const REVENUECAT_ENTITLEMENT_ID: string | null =
  (typeof entitlementIdFromEnv === 'string' && entitlementIdFromEnv.trim().length > 0
    ? entitlementIdFromEnv.trim()
    : typeof extra.revenueCatEntitlementId === 'string'
      ? extra.revenueCatEntitlementId
      : '').trim() || null;

export const HAS_REVENUECAT_KEY = REVENUECAT_API_KEY.length > 0;
