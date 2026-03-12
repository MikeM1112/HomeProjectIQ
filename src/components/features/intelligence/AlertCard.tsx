'use client';

import { Card } from '@/components/ui/Card';
import { useAlerts } from '@/hooks/useIntelligence';

const SEVERITY_STYLES: Record<string, { icon: string; color: string; bg: string }> = {
  info: { icon: 'ℹ️', color: 'text-blue-400', bg: 'border-blue-400/20' },
  warning: { icon: '⚠️', color: 'text-yellow-400', bg: 'border-yellow-400/20' },
  urgent: { icon: '🔔', color: 'text-orange-400', bg: 'border-orange-400/20' },
  critical: { icon: '🚨', color: 'text-red-400', bg: 'border-red-400/20' },
};

export function AlertCard({ compact }: { compact?: boolean }) {
  const { alerts, unreadCount, markRead, dismiss } = useAlerts();

  if (alerts.length === 0) return null;

  const displayed = compact ? alerts.slice(0, 2) : alerts;

  return (
    <div className="space-y-2">
      {!compact && unreadCount > 0 && (
        <p className="text-sm font-medium text-[var(--text)]">{unreadCount} unread alert{unreadCount !== 1 ? 's' : ''}</p>
      )}
      {displayed.map((alert) => {
        const style = SEVERITY_STYLES[alert.severity] ?? SEVERITY_STYLES.info;
        return (
          <Card key={alert.id} padding="sm" className={`border-l-2 ${style.bg}`}>
            <div className="flex items-start gap-2">
              <span className="flex-shrink-0">{style.icon}</span>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${style.color}`}>{alert.title}</p>
                {!compact && <p className="text-xs text-[var(--text-sub)] mt-0.5">{alert.message}</p>}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {!alert.is_read && (
                  <button onClick={() => markRead(alert.id)} className="text-xs text-[var(--text-sub)] hover:text-[var(--text)]">Read</button>
                )}
                <button onClick={() => dismiss(alert.id)} className="text-xs text-[var(--text-sub)] hover:text-[var(--text)]">×</button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
