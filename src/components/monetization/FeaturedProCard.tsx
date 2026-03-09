'use client';

import { isEnabled } from '@/lib/flags';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface FeaturedProCardProps {
  contractorName: string;
  rating: number;
  serviceArea: string;
  specialty: string;
  ctaText: string;
  ctaHref: string;
}

export function FeaturedProCard({ contractorName, rating, serviceArea, specialty, ctaText, ctaHref }: FeaturedProCardProps) {
  if (!isEnabled('ENABLE_FEATURED_PROS')) return null;

  return (
    <Card className="border-brand/20">
      <Badge variant="default">Sponsored</Badge>
      <h4 className="font-semibold mt-2">{contractorName}</h4>
      <p className="text-xs text-ink-sub">{specialty} · {serviceArea}</p>
      <p className="text-xs text-warning mt-1">{'★'.repeat(Math.round(rating))} {rating}</p>
      <a
        href={ctaHref}
        className="mt-3 inline-block bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg tap"
      >
        {ctaText}
      </a>
    </Card>
  );
}
