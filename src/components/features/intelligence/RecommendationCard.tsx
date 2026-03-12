'use client';

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useRecommendations } from '@/hooks/useIntelligence';

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-[var(--text-sub)]',
  medium: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-400',
};

const TYPE_ICONS: Record<string, string> = {
  preventative: '🛡️',
  upgrade: '⬆️',
  repair: '🔧',
  maintenance: '🔄',
  efficiency: '💡',
  safety: '⚠️',
};

export function RecommendationCard({ compact }: { compact?: boolean }) {
  const { recommendations, isLoading, complete, dismiss } = useRecommendations();

  if (isLoading) return null;
  if (recommendations.length === 0) return null;

  const displayed = compact ? recommendations.slice(0, 3) : recommendations;

  return (
    <div className="space-y-2">
      {!compact && <h3 className="font-semibold text-[var(--text)] text-sm">Recommendations</h3>}
      {displayed.map((rec) => (
        <Card key={rec.id} padding="sm">
          <div className="flex items-start gap-2">
            <span className="flex-shrink-0 text-lg">{TYPE_ICONS[rec.recommendation_type] ?? '📋'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--text)] truncate">{rec.title}</p>
                <span className={`text-xs capitalize ${PRIORITY_COLORS[rec.priority]}`}>{rec.priority}</span>
              </div>
              {!compact && <p className="text-xs text-[var(--text-sub)] mt-0.5">{rec.description}</p>}
              {!compact && rec.estimated_savings && (
                <p className="text-xs text-green-400 mt-1">Potential savings: ${rec.estimated_savings}</p>
              )}
              {!compact && (
                <div className="flex gap-2 mt-2">
                  <Button size="sm" onClick={() => complete(rec.id)}>Done</Button>
                  <Button size="sm" variant="ghost" onClick={() => dismiss(rec.id)}>Dismiss</Button>
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
