'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Users,
  ShoppingCart,
  ChevronRight,
  ArrowRight,
  Wrench,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Mascot } from '@/components/brand/Mascot';
import { useToolReadiness } from '@/hooks/useIntelligence';
import { cn } from '@/lib/utils';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function ReadinessRing({ percent }: { percent: number }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const color =
    percent >= 80
      ? 'var(--emerald)'
      : percent >= 50
        ? 'var(--gold)'
        : 'var(--danger)';

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="var(--glass-border)"
          strokeWidth="10"
        />
        <motion.circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
          {percent}%
        </span>
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-sub)' }}>
          Ready
        </span>
      </div>
    </div>
  );
}

export function ReadinessClient() {
  const params = useParams();
  const projectId = params.id as string;
  const { readiness, isLoading } = useToolReadiness(projectId);

  if (isLoading) {
    return (
      <>
        <Navbar title="Tool Readiness" showBack backHref={`/project/${projectId}`} />
        <PageWrapper>
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        </PageWrapper>
      </>
    );
  }

  if (!readiness) {
    return (
      <>
        <Navbar title="Tool Readiness" showBack backHref={`/project/${projectId}`} />
        <PageWrapper>
          <div className="text-center py-12">
            <Mascot mode="tool" size="lg" className="mx-auto mb-4" />
            <p className="text-sm" style={{ color: 'var(--text-sub)' }}>
              No readiness data available for this project.
            </p>
          </div>
        </PageWrapper>
      </>
    );
  }

  const {
    readiness: readinessLevel,
    required,
    owned,
    borrowable,
    missing,
    readiness_percent,
  } = readiness;

  const readinessLabel =
    readinessLevel === 'FULLY_READY'
      ? 'Fully Ready'
      : readinessLevel === 'PARTIALLY_READY'
        ? 'Partially Ready'
        : 'Not Ready';

  const readinessVariant =
    readinessLevel === 'FULLY_READY'
      ? 'success'
      : readinessLevel === 'PARTIALLY_READY'
        ? 'warning'
        : 'error';

  return (
    <>
      <Navbar title="Tool Readiness" showBack backHref={`/project/${projectId}`} />
      <PageWrapper>
        <motion.div
          className="space-y-5"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Readiness Score */}
          <motion.div variants={fadeUp}>
            <GlassPanel padding="lg" className="text-center">
              <ReadinessRing percent={readiness_percent} />
              <div className="mt-3 flex items-center justify-center gap-2">
                <Badge variant={readinessVariant}>{readinessLabel}</Badge>
              </div>
              <p
                className="text-xs mt-2"
                style={{ color: 'var(--text-sub)' }}
              >
                {owned.length} of {required.length} required tools owned
              </p>
            </GlassPanel>
          </motion.div>

          {/* Required Tools - Owned */}
          {owned.length > 0 && (
            <motion.div variants={fadeUp}>
              <h3
                className="font-semibold text-sm mb-2 flex items-center gap-2"
                style={{ color: 'var(--text)' }}
              >
                <CheckCircle2 size={16} style={{ color: 'var(--emerald)' }} />
                Tools You Own ({owned.length})
              </h3>
              <div className="space-y-2">
                {owned.map((tool) => (
                  <GlassPanel key={tool} padding="sm">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--emerald-soft)' }}
                      >
                        <CheckCircle2 size={16} style={{ color: 'var(--emerald)' }} />
                      </div>
                      <span
                        className="text-sm font-medium flex-1"
                        style={{ color: 'var(--text)' }}
                      >
                        {tool}
                      </span>
                      <Badge variant="success">Owned</Badge>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </motion.div>
          )}

          {/* Borrowable Tools */}
          {borrowable.length > 0 && (
            <motion.div variants={fadeUp}>
              <h3
                className="font-semibold text-sm mb-2 flex items-center gap-2"
                style={{ color: 'var(--text)' }}
              >
                <Users size={16} style={{ color: 'var(--info)' }} />
                Borrow from Friends ({borrowable.length})
              </h3>
              <div className="space-y-2">
                {borrowable.map((item) => (
                  <GlassPanel key={item.tool_id} padding="sm" hover>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--info-soft)' }}
                      >
                        <Users size={16} style={{ color: 'var(--info)' }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span
                          className="text-sm font-medium block"
                          style={{ color: 'var(--text)' }}
                        >
                          {item.tool_id}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: 'var(--text-sub)' }}
                        >
                          Available from {item.from.join(', ')}
                        </span>
                      </div>
                      <Button size="sm" variant="secondary">
                        <span className="flex items-center gap-1">
                          Ask <ChevronRight size={14} />
                        </span>
                      </Button>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </motion.div>
          )}

          {/* Missing Tools */}
          {missing.length > 0 && (
            <motion.div variants={fadeUp}>
              <h3
                className="font-semibold text-sm mb-2 flex items-center gap-2"
                style={{ color: 'var(--text)' }}
              >
                <XCircle size={16} style={{ color: 'var(--danger)' }} />
                Missing Tools ({missing.length})
              </h3>
              <div className="space-y-2">
                {missing.map((tool) => (
                  <GlassPanel key={tool} padding="sm">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center"
                        style={{ background: 'var(--danger-soft)' }}
                      >
                        <XCircle size={16} style={{ color: 'var(--danger)' }} />
                      </div>
                      <span
                        className="text-sm font-medium flex-1"
                        style={{ color: 'var(--text)' }}
                      >
                        {tool}
                      </span>
                      <Button size="sm" variant="secondary">
                        <span className="flex items-center gap-1">
                          <ShoppingCart size={14} /> Buy
                        </span>
                      </Button>
                    </div>
                  </GlassPanel>
                ))}
              </div>
            </motion.div>
          )}

          {/* Mascot Callout */}
          <motion.div variants={fadeUp}>
            <GlassPanel padding="md">
              <div className="flex items-center gap-3">
                <Mascot
                  mode={readinessLevel === 'FULLY_READY' ? 'celebrate' : 'tool'}
                  size="sm"
                />
                <p className="text-xs flex-1" style={{ color: 'var(--text-sub)' }}>
                  {readinessLevel === 'FULLY_READY'
                    ? 'You have everything you need! Time to get started.'
                    : readinessLevel === 'PARTIALLY_READY'
                      ? 'Almost there! See if you can borrow what you need from friends.'
                      : 'You might want to pick up a few tools before tackling this one.'}
                </p>
              </div>
            </GlassPanel>
          </motion.div>

          {/* CTAs */}
          <motion.div variants={fadeUp} className="space-y-2 pb-6">
            {borrowable.length > 0 && (
              <Button variant="secondary" className="w-full">
                <Users size={16} className="mr-2" />
                Request Borrows
              </Button>
            )}
            {missing.length > 0 && (
              <Button variant="secondary" className="w-full">
                <ShoppingCart size={16} className="mr-2" />
                Buy Missing Tools
              </Button>
            )}
            <Button className="w-full">
              <Wrench size={16} className="mr-2" />
              {readinessLevel === 'FULLY_READY'
                ? 'Start Repair'
                : 'Continue Anyway'}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </PageWrapper>
    </>
  );
}
