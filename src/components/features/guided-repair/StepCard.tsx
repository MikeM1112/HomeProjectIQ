'use client';

import { Card } from '@/components/ui/Card';
import { PhotoCheckpoint } from './PhotoCheckpoint';
import type { StepCheckpoint } from '@/types/app';

const STATUS_STYLES: Record<string, { icon: string; color: string }> = {
  pending: { icon: '⏳', color: 'text-[var(--text-sub)]' },
  passed: { icon: '✅', color: 'text-green-400' },
  failed: { icon: '❌', color: 'text-red-400' },
  skipped: { icon: '⏭️', color: 'text-yellow-400' },
};

export function StepCard({
  checkpoint,
  sessionId,
  isActive,
}: {
  checkpoint: StepCheckpoint;
  sessionId: string;
  isActive?: boolean;
}) {
  const status = STATUS_STYLES[checkpoint.ai_validation_status] ?? STATUS_STYLES.pending;

  return (
    <Card padding="md" variant={isActive ? 'selected' : 'default'}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--glass)] border border-[var(--glass-border)] flex items-center justify-center text-sm font-bold text-[var(--text)]">
          {checkpoint.step_number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-[var(--text)] truncate">{checkpoint.title}</h4>
            <span className={status.color}>{status.icon}</span>
          </div>
          {checkpoint.instructions && (
            <p className="text-sm text-[var(--text-sub)] mt-1">{checkpoint.instructions}</p>
          )}
          {checkpoint.ai_feedback && (
            <p className="text-xs text-[var(--accent)] mt-2 bg-[var(--accent)]/5 p-2 rounded-lg">{checkpoint.ai_feedback}</p>
          )}
          {isActive && checkpoint.ai_validation_status === 'pending' && (
            <div className="mt-3">
              <PhotoCheckpoint checkpointId={checkpoint.id} sessionId={sessionId} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
