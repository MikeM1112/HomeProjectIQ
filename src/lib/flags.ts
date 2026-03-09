export const flags = {
  ENABLE_AFFILIATE_LINKS: false,
  ENABLE_FEATURED_PROS: false,
  ENABLE_CATEGORY_SPONSORS: false,
  ENABLE_PRO_LEAD_GEN: false,
  ENABLE_BUSINESS_SUBSCRIPTIONS: false,
  ENABLE_ANALYTICS_EXPORT: false,
  ENABLE_API_PARTNER_ACCESS: false,
  ENABLE_AGGREGATE_INSIGHTS: false,
} as const;

export type FlagName = keyof typeof flags;

export function isEnabled(flag: FlagName): boolean {
  // Only read from environment variables (never from window to prevent client-side overrides)
  const envKey = `NEXT_PUBLIC_FLAG_${flag}`;
  const envVal = process.env[envKey];

  if (envVal === 'true') return true;
  if (envVal === 'false') return false;

  return flags[flag];
}
