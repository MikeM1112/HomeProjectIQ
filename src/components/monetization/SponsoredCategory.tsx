'use client';

import { isEnabled } from '@/lib/flags';

interface SponsoredCategoryProps {
  brandName: string;
  brandUrl: string;
}

export function SponsoredCategory({ brandName, brandUrl }: SponsoredCategoryProps) {
  if (!isEnabled('ENABLE_CATEGORY_SPONSORS')) return null;

  return (
    <p className="text-[10px] text-ink-dim mt-2">
      Sponsored by{' '}
      <a href={brandUrl} target="_blank" rel="noopener noreferrer" className="underline">
        {brandName}
      </a>
    </p>
  );
}
