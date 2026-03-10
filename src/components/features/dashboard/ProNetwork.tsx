'use client';

import { Card } from '@/components/ui/Card';
import type { ProRecommendation } from '@/lib/demo-data';

interface ProNetworkProps {
  recommendations: ProRecommendation[];
}

export function ProNetwork({ recommendations }: ProNetworkProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-serif text-lg" style={{ color: 'var(--text)' }}>
          👥 Friend-Recommended Pros
        </h3>
      </div>
      <div className="space-y-2">
        {recommendations.map((pro) => (
          <Card key={pro.id} padding="sm">
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{ background: 'var(--accent-soft)' }}
              >
                {pro.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
                  {pro.proName}
                </p>
                <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>
                  {pro.company} &middot; {pro.specialty}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[11px]" style={{ color: 'var(--gold)' }}>
                    {'★'.repeat(Math.floor(pro.rating))} {pro.rating}
                  </span>
                  <span className="text-[10px]" style={{ color: 'var(--text-dim)' }}>
                    &middot; {pro.cost}
                  </span>
                </div>
                <div
                  className="mt-2 p-2 rounded-lg text-[11px] leading-relaxed"
                  style={{ background: 'var(--glass)', color: 'var(--text-sub)' }}
                >
                  &ldquo;{pro.review}&rdquo;
                  <span className="block mt-1 font-medium" style={{ color: 'var(--accent)' }}>
                    &mdash; {pro.recommenderAvatar} {pro.recommendedBy}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
