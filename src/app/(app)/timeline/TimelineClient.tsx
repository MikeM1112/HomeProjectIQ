'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wrench,
  RotateCcw,
  Search,
  ShoppingCart,
  ClipboardCheck,
  Calendar,
  Zap,
  ArrowUpCircle,
  FileText,
  Filter,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Mascot } from '@/components/brand/Mascot';
import { useTimeline } from '@/hooks/useTimeline';
import { formatCurrency, formatDate, cn } from '@/lib/utils';
import type { TimelineEvent, TimelineEventType } from '@/types/app';
import { ROUTES } from '@/lib/constants';

type FilterType = 'all' | 'repair' | 'maintenance' | 'purchase' | 'inspection';

const filters: { key: FilterType; label: string; icon: React.ReactNode }[] = [
  { key: 'all', label: 'All', icon: <Filter size={12} /> },
  { key: 'repair', label: 'Repairs', icon: <Wrench size={12} /> },
  { key: 'maintenance', label: 'Maintenance', icon: <RotateCcw size={12} /> },
  { key: 'purchase', label: 'Purchases', icon: <ShoppingCart size={12} /> },
  { key: 'inspection', label: 'Inspections', icon: <Search size={12} /> },
];

const typeIcons: Record<string, React.ReactNode> = {
  repair: <Wrench size={14} />,
  maintenance: <RotateCcw size={14} />,
  inspection: <ClipboardCheck size={14} />,
  purchase: <ShoppingCart size={14} />,
  warranty: <FileText size={14} />,
  incident: <Zap size={14} />,
  upgrade: <ArrowUpCircle size={14} />,
  other: <Calendar size={14} />,
};

const typeColors: Record<string, string> = {
  repair: 'var(--accent)',
  maintenance: 'var(--info)',
  inspection: 'var(--gold)',
  purchase: 'var(--emerald)',
  warranty: 'var(--text-sub)',
  incident: 'var(--danger)',
  upgrade: 'var(--accent)',
  other: 'var(--text-sub)',
};

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

function TimelineEventCard({ event }: { event: TimelineEvent }) {
  const icon = typeIcons[event.event_type] ?? typeIcons.other;
  const color = typeColors[event.event_type] ?? typeColors.other;
  const hasImage =
    event.photo_urls && event.photo_urls.length > 0;

  return (
    <div className="flex gap-3">
      {/* Timeline dot + line connector */}
      <div className="flex flex-col items-center">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2"
          style={{
            background: 'var(--glass)',
            borderColor: color,
            color,
          }}
        >
          {icon}
        </div>
      </div>

      {/* Card */}
      <GlassPanel padding="sm" className="flex-1 min-w-0 mb-0">
        <div className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span
                className="text-sm font-semibold truncate"
                style={{ color: 'var(--text)' }}
              >
                {event.title}
              </span>
              <Badge variant="default">
                {event.event_type.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>
              {formatDate(event.event_date)}
            </p>
            {event.description && (
              <p
                className="text-xs mt-1 line-clamp-2"
                style={{ color: 'var(--text-sub)' }}
              >
                {event.description}
              </p>
            )}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {event.cost != null && event.cost > 0 && (
                <span
                  className="text-[11px] font-semibold"
                  style={{ color: 'var(--accent)' }}
                >
                  {formatCurrency(event.cost)}
                </span>
              )}
              {event.project_id && (
                <Badge variant="info">Linked Project</Badge>
              )}
            </div>
          </div>
          {hasImage && (
            <div
              className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border"
              style={{ borderColor: 'var(--glass-border)' }}
            >
              <img
                src={event.photo_urls[0]}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </GlassPanel>
    </div>
  );
}

export function TimelineClient() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const { events, isLoading } = useTimeline();

  const filtered = useMemo(() => {
    if (activeFilter === 'all') return events;
    return events.filter((e) => e.event_type === activeFilter);
  }, [events, activeFilter]);

  // Group by date (YYYY-MM)
  const grouped = useMemo(() => {
    const groups: Record<string, TimelineEvent[]> = {};
    for (const event of filtered) {
      const date = new Date(event.event_date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(event);
    }
    // Sort groups descending
    return Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  return (
    <>
      <Navbar title="Timeline & Records" showBack backHref={ROUTES.DASHBOARD} />
      <PageWrapper>
        <div className="space-y-4">
          {/* Filter Chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActiveFilter(f.key)}
                className={cn(
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0',
                  activeFilter === f.key
                    ? 'text-white shadow-[0_2px_8px_var(--accent-glow)]'
                    : 'border text-[var(--text-sub)] hover:text-[var(--text)]'
                )}
                style={
                  activeFilter === f.key
                    ? { background: 'var(--accent-gradient, var(--accent))' }
                    : {
                        background: 'var(--glass)',
                        borderColor: 'var(--glass-border)',
                      }
                }
              >
                {f.icon}
                {f.label}
              </button>
            ))}
          </div>

          {/* Timeline */}
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner size="lg" />
            </div>
          ) : filtered.length === 0 ? (
            <GlassPanel padding="lg" className="text-center">
              <Mascot mode="checklist" size="lg" className="mx-auto mb-3" />
              <p
                className="text-sm font-semibold mb-1"
                style={{ color: 'var(--text)' }}
              >
                No events yet
              </p>
              <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                {activeFilter === 'all'
                  ? 'Your home history will appear here as you complete projects and maintenance.'
                  : `No ${activeFilter} events found. Try a different filter.`}
              </p>
            </GlassPanel>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFilter}
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-6"
              >
                {grouped.map(([monthKey, monthEvents]) => {
                  const [year, month] = monthKey.split('-');
                  const label = new Date(
                    Number(year),
                    Number(month) - 1
                  ).toLocaleDateString('en-US', {
                    month: 'long',
                    year: 'numeric',
                  });

                  return (
                    <motion.div key={monthKey} variants={fadeUp}>
                      <h3
                        className="text-xs font-semibold uppercase tracking-wide mb-3"
                        style={{ color: 'var(--text-sub)' }}
                      >
                        {label}
                      </h3>
                      <div className="space-y-3 relative">
                        {/* Vertical timeline line */}
                        <div
                          className="absolute left-[15px] top-4 bottom-4 w-[2px]"
                          style={{ background: 'var(--glass-border)' }}
                        />
                        {monthEvents.map((event, idx) => (
                          <motion.div
                            key={event.id}
                            variants={fadeUp}
                            className="relative"
                          >
                            <TimelineEventCard event={event} />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </PageWrapper>
    </>
  );
}
