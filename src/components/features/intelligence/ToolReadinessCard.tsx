'use client';

import { Card } from '@/components/ui/Card';
import { useToolReadiness } from '@/hooks/useIntelligence';
import { TOOLS } from '@/lib/constants';

function getToolName(toolId: string): string {
  return TOOLS.find((t) => t.id === toolId)?.name ?? toolId;
}

function getToolEmoji(toolId: string): string {
  return TOOLS.find((t) => t.id === toolId)?.emoji ?? '🔧';
}

export function ToolReadinessCard({ projectId }: { projectId: string }) {
  const { readiness, isLoading } = useToolReadiness(projectId);

  if (isLoading) return <Card><div className="text-sm text-[var(--text-sub)]">Checking tools...</div></Card>;
  if (!readiness) return null;

  const color = readiness.readiness === 'FULLY_READY'
    ? 'var(--success)'
    : readiness.readiness === 'PARTIALLY_READY'
    ? 'var(--warning)'
    : 'var(--danger)';

  const label = readiness.readiness === 'FULLY_READY'
    ? 'Ready to Go'
    : readiness.readiness === 'PARTIALLY_READY'
    ? 'Almost Ready'
    : 'Tools Needed';

  return (
    <Card>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-[var(--text)]">Tool Readiness</h4>
          <span
            className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
            style={{ background: `${color}20`, color }}
          >
            {label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-2 rounded-full bg-[var(--glass-border)]">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${readiness.readiness_percent}%`, background: color }}
          />
        </div>

        {readiness.owned.length > 0 && (
          <div>
            <p className="text-[10px] uppercase font-semibold text-[var(--text-sub)] mb-1">You have</p>
            <div className="flex flex-wrap gap-1">
              {readiness.owned.map((id) => (
                <span key={id} className="text-xs px-2 py-0.5 rounded-full bg-[var(--success)]/10 text-[var(--success)]">
                  {getToolEmoji(id)} {getToolName(id)}
                </span>
              ))}
            </div>
          </div>
        )}

        {readiness.borrowable.length > 0 && (
          <div>
            <p className="text-[10px] uppercase font-semibold text-[var(--text-sub)] mb-1">Can borrow</p>
            <div className="flex flex-wrap gap-1">
              {readiness.borrowable.map((b) => (
                <span key={b.tool_id} className="text-xs px-2 py-0.5 rounded-full bg-[var(--accent)]/10 text-[var(--accent)]">
                  {getToolEmoji(b.tool_id)} {getToolName(b.tool_id)} ({b.from[0]})
                </span>
              ))}
            </div>
          </div>
        )}

        {readiness.missing.length > 0 && (
          <div>
            <p className="text-[10px] uppercase font-semibold text-[var(--text-sub)] mb-1">Need to get</p>
            <div className="flex flex-wrap gap-1">
              {readiness.missing.map((id) => (
                <span key={id} className="text-xs px-2 py-0.5 rounded-full bg-[var(--danger)]/10 text-[var(--danger)]">
                  {getToolEmoji(id)} {getToolName(id)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
