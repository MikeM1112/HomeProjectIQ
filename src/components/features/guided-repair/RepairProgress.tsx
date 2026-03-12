'use client';

import { Card } from '@/components/ui/Card';

export function RepairProgress({ current, total, status }: { current: number; total: number; status: string }) {
  const progress = total > 0 ? Math.round((current / total) * 100) : 0;

  return (
    <Card padding="sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-[var(--text)]">
          {status === 'completed' ? 'Repair Complete' : status === 'paused' ? 'Repair Paused' : 'Guided Repair'}
        </span>
        <span className="text-sm text-[var(--text-sub)]">{current}/{total} steps</span>
      </div>
      <div className="h-2 bg-[var(--glass)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[image:var(--accent-gradient)] transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {status === 'active' && (
        <p className="text-xs text-[var(--text-sub)] mt-1.5">
          {progress === 0 ? 'Upload a photo to verify each step' : `${progress}% complete`}
        </p>
      )}
    </Card>
  );
}
