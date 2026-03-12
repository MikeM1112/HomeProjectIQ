'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  RotateCcw,
  ShieldAlert,
  Package,
  TrendingUp,
  Bell,
  CheckCheck,
  AlertTriangle,
  Zap,
  Calendar,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Mascot } from '@/components/brand/Mascot';
import { useAlerts } from '@/hooks/useIntelligence';
import { cn } from '@/lib/utils';
import type { Alert, AlertType } from '@/types/app';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const sectionConfig: Record<
  string,
  { title: string; icon: React.ReactNode; types: AlertType[] }
> = {
  repair: {
    title: 'Repair Flow',
    icon: <Wrench size={14} />,
    types: ['recommendation'],
  },
  maintenance: {
    title: 'Maintenance',
    icon: <RotateCcw size={14} />,
    types: ['maintenance'],
  },
  risk: {
    title: 'Risk Alerts',
    icon: <ShieldAlert size={14} />,
    types: ['risk', 'weather'],
  },
  lending: {
    title: 'Lending',
    icon: <Package size={14} />,
    types: ['system'],
  },
  score: {
    title: 'Score & Progress',
    icon: <TrendingUp size={14} />,
    types: ['warranty'],
  },
};

function getAlertIcon(type: AlertType, severity: string): React.ReactNode {
  const iconMap: Record<string, React.ReactNode> = {
    risk: <ShieldAlert size={16} />,
    maintenance: <RotateCcw size={16} />,
    warranty: <Calendar size={16} />,
    weather: <Zap size={16} />,
    system: <Package size={16} />,
    recommendation: <TrendingUp size={16} />,
  };
  return iconMap[type] ?? <Bell size={16} />;
}

function getAlertColor(severity: string): string {
  switch (severity) {
    case 'critical':
      return 'var(--danger)';
    case 'urgent':
      return 'var(--danger)';
    case 'warning':
      return 'var(--gold)';
    default:
      return 'var(--info)';
  }
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return `${weeks}w ago`;
}

function NotificationRow({
  alert,
  onRead,
}: {
  alert: Alert;
  onRead: (id: string) => void;
}) {
  const color = getAlertColor(alert.severity);
  const icon = getAlertIcon(alert.alert_type, alert.severity);

  return (
    <motion.div
      variants={fadeUp}
      className={cn(
        'flex items-start gap-3 py-3 px-1 border-b transition-colors',
        !alert.is_read && 'cursor-pointer'
      )}
      style={{ borderColor: 'var(--glass-border)' }}
      onClick={() => !alert.is_read && onRead(alert.id)}
    >
      {/* Unread Indicator */}
      <div className="flex flex-col items-center pt-0.5">
        <div
          className={cn(
            'w-2 h-2 rounded-full shrink-0',
            alert.is_read ? 'opacity-0' : 'opacity-100'
          )}
          style={{ background: 'var(--accent)' }}
        />
      </div>

      {/* Icon */}
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: `${color}15`, color }}
      >
        {icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm truncate',
            !alert.is_read ? 'font-semibold' : 'font-medium'
          )}
          style={{ color: 'var(--text)' }}
        >
          {alert.title}
        </p>
        <p
          className="text-xs line-clamp-2 mt-0.5"
          style={{ color: 'var(--text-sub)' }}
        >
          {alert.message}
        </p>
      </div>

      {/* Time */}
      <span
        className="text-[10px] shrink-0 pt-0.5"
        style={{ color: 'var(--text-sub)' }}
      >
        {timeAgo(alert.created_at)}
      </span>
    </motion.div>
  );
}

export function NotificationsClient() {
  const { alerts, isLoading, markRead, unreadCount } = useAlerts();

  // Group alerts by section
  const grouped = useMemo(() => {
    const sections: Record<string, Alert[]> = {};

    for (const alert of alerts.filter((a) => !a.is_dismissed)) {
      let section = 'score'; // default
      for (const [key, cfg] of Object.entries(sectionConfig)) {
        if (cfg.types.includes(alert.alert_type)) {
          section = key;
          break;
        }
      }
      if (!sections[section]) sections[section] = [];
      sections[section].push(alert);
    }

    return sections;
  }, [alerts]);

  const handleMarkAllRead = () => {
    alerts
      .filter((a) => !a.is_read)
      .forEach((a) => markRead(a.id));
  };

  return (
    <>
      <Navbar title="Notifications" showBack backHref="/dashboard" />
      <PageWrapper>
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1
                className="font-serif text-xl"
                style={{ color: 'var(--text)' }}
              >
                Notifications
              </h1>
              {unreadCount > 0 && (
                <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                  {unreadCount} unread
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleMarkAllRead}
              >
                <CheckCheck size={14} className="mr-1" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : alerts.filter((a) => !a.is_dismissed).length === 0 ? (
            <GlassPanel padding="lg" className="text-center">
              <Mascot mode="celebrate" size="lg" className="mx-auto mb-3" />
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--text)' }}
              >
                All caught up!
              </p>
              <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                No notifications right now. We will let you know when
                something needs your attention.
              </p>
            </GlassPanel>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-5"
            >
              {Object.entries(sectionConfig).map(([key, cfg]) => {
                const sectionAlerts = grouped[key];
                if (!sectionAlerts || sectionAlerts.length === 0) return null;

                return (
                  <motion.div key={key} variants={fadeUp}>
                    <GlassPanel padding="sm">
                      <div
                        className="flex items-center gap-2 px-1 pt-1 pb-2"
                        style={{ color: 'var(--text-sub)' }}
                      >
                        {cfg.icon}
                        <span className="text-xs font-semibold uppercase tracking-wide">
                          {cfg.title}
                        </span>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full ml-auto"
                          style={{
                            background: 'var(--chip-bg)',
                            color: 'var(--chip-text)',
                          }}
                        >
                          {sectionAlerts.length}
                        </span>
                      </div>
                      <div>
                        {sectionAlerts.map((alert) => (
                          <NotificationRow
                            key={alert.id}
                            alert={alert}
                            onRead={markRead}
                          />
                        ))}
                      </div>
                    </GlassPanel>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
