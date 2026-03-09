'use client';

import { isEnabled } from '@/lib/flags';

interface AffiliateBuyButtonProps {
  href: string;
  label: string;
  store: string;
  sku: string;
}

export function AffiliateBuyButton({ href, label, store, sku }: AffiliateBuyButtonProps) {
  const affiliateHref = isEnabled('ENABLE_AFFILIATE_LINKS')
    ? `${href}${href.includes('?') ? '&' : '?'}ref=homeprojectiq&sku=${sku}`
    : href;

  return (
    <a
      href={affiliateHref}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg tap"
    >
      Buy at {store}
    </a>
  );
}
