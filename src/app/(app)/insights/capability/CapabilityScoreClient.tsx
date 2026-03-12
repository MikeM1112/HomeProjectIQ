'use client';

import { motion } from 'framer-motion';
import {
  Lightbulb,
  Wrench,
  Hammer,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Mascot } from '@/components/brand/Mascot';
import { useCapabilityScore } from '@/hooks/useIntelligence';
import type { CapabilityLevel } from '@/types/app';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const levelConfig: Record<
  CapabilityLevel,
  { label: string; color: string; variant: 'success' | 'warning' | 'info' | 'default' | 'error' }
> = {
  beginner: { label: 'Beginner', color: 'var(--text-sub)', variant: 'default' },
  developing: { label: 'Developing', color: 'var(--info)', variant: 'info' },
  capable: { label: 'Capable', color: 'var(--gold)', variant: 'warning' },
  proficient: { label: 'Proficient', color: 'var(--emerald)', variant: 'success' },
  expert: { label: 'Expert', color: 'var(--accent)', variant: 'success' },
};

function ScoreRing({ score }: { score: number }) {
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80
      ? 'var(--emerald)'
      : score >= 60
        ? 'var(--gold)'
        : score >= 40
          ? 'var(--info)'
          : 'var(--text-sub)';

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--glass-border)"
          strokeWidth="12"
        />
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-bold"
          style={{ color: 'var(--text)' }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {score}
        </motion.span>
        <span className="text-xs font-medium" style={{ color: 'var(--text-sub)' }}>
          out of 100
        </span>
      </div>
    </div>
  );
}

interface CategoryBarProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  delay?: number;
}

function CategoryBar({ label, value, icon, delay = 0 }: CategoryBarProps) {
  const color =
    value >= 80
      ? 'var(--emerald)'
      : value >= 60
        ? 'var(--gold)'
        : value >= 40
          ? 'var(--info)'
          : 'var(--text-sub)';

  return (
    <div className="flex items-center gap-3">
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'var(--chip-bg)', color: 'var(--accent)' }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium" style={{ color: 'var(--text)' }}>
            {label}
          </span>
          <span className="text-xs font-semibold" style={{ color }}>
            {value}
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: 'var(--glass-border)' }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: color }}
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay }}
          />
        </div>
      </div>
    </div>
  );
}

const defaultImprovements = [
  {
    title: 'Add more tools to your toolbox',
    description: 'Increase your tool readiness score by cataloging what you own.',
    icon: <Wrench size={16} />,
  },
  {
    title: 'Complete a maintenance task',
    description: 'Stay on top of scheduled maintenance to boost your score.',
    icon: <ClipboardCheck size={16} />,
  },
  {
    title: 'Upload home documents',
    description: 'Warranties, manuals, and receipts improve your documentation score.',
    icon: <FileText size={16} />,
  },
];

export function CapabilityScoreClient() {
  const { score: capScore, isLoading, recalculate, isCalculating } =
    useCapabilityScore();

  if (isLoading) {
    return (
      <>
        <Navbar title="Capability Score" showBack backHref="/intelligence" />
        <PageWrapper>
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        </PageWrapper>
      </>
    );
  }

  if (!capScore) {
    return (
      <>
        <Navbar title="Capability Score" showBack backHref="/intelligence" />
        <PageWrapper>
          <div className="text-center py-12">
            <Mascot mode="idea" size="lg" className="mx-auto mb-4" />
            <p
              className="text-sm font-semibold mb-1"
              style={{ color: 'var(--text)' }}
            >
              No score calculated yet
            </p>
            <p
              className="text-xs mb-4"
              style={{ color: 'var(--text-sub)' }}
            >
              Set up your property and tools to calculate your capability score.
            </p>
            <Button onClick={() => recalculate()} loading={isCalculating}>
              Calculate Score
            </Button>
          </div>
        </PageWrapper>
      </>
    );
  }

  const lvl = levelConfig[capScore.capability_level] ?? levelConfig.beginner;
  const suggestions = (capScore.suggestions ?? []) as Array<{
    title?: string;
    description?: string;
  }>;
  const improvements =
    suggestions.length > 0
      ? suggestions.slice(0, 3).map((s, i) => ({
          title: s.title ?? `Improvement ${i + 1}`,
          description: s.description ?? '',
          icon: defaultImprovements[i]?.icon ?? <Lightbulb size={16} />,
        }))
      : defaultImprovements;

  return (
    <>
      <Navbar title="Capability Score" showBack backHref="/intelligence" />
      <PageWrapper>
        <motion.div
          className="space-y-5"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Score Ring */}
          <motion.div variants={fadeUp}>
            <GlassPanel padding="lg" className="text-center">
              <ScoreRing score={capScore.overall_score} />
              <div className="mt-3">
                <Badge variant={lvl.variant}>{lvl.label}</Badge>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => recalculate()}
                loading={isCalculating}
                className="mt-3 mx-auto"
              >
                <RefreshCw size={14} className="mr-1" />
                Recalculate
              </Button>
            </GlassPanel>
          </motion.div>

          {/* Change Over Time (placeholder) */}
          <motion.div variants={fadeUp}>
            <GlassPanel padding="md">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={16} style={{ color: 'var(--accent)' }} />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Change Over Time
                </h3>
              </div>
              <div
                className="h-20 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--chip-bg)' }}
              >
                <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                  Score history chart coming soon
                </p>
              </div>
            </GlassPanel>
          </motion.div>

          {/* Category Breakdown */}
          <motion.div variants={fadeUp}>
            <GlassPanel padding="md">
              <h3
                className="text-sm font-semibold mb-4"
                style={{ color: 'var(--text)' }}
              >
                Category Breakdown
              </h3>
              <div className="space-y-4">
                <CategoryBar
                  label="Tool Readiness"
                  value={capScore.tool_readiness}
                  icon={<Wrench size={14} />}
                  delay={0}
                />
                <CategoryBar
                  label="Repair Experience"
                  value={capScore.repair_experience}
                  icon={<Hammer size={14} />}
                  delay={0.1}
                />
                <CategoryBar
                  label="Maintenance Completion"
                  value={capScore.maintenance_completion}
                  icon={<ClipboardCheck size={14} />}
                  delay={0.2}
                />
                <CategoryBar
                  label="Documentation"
                  value={capScore.documentation_score}
                  icon={<FileText size={14} />}
                  delay={0.3}
                />
                <CategoryBar
                  label="Emergency Preparedness"
                  value={capScore.emergency_preparedness}
                  icon={<ShieldCheck size={14} />}
                  delay={0.4}
                />
              </div>
            </GlassPanel>
          </motion.div>

          {/* Top 3 Ways to Improve */}
          <motion.div variants={fadeUp}>
            <GlassPanel padding="md">
              <div className="flex items-center gap-2 mb-3">
                <Mascot mode="idea" size="sm" />
                <h3
                  className="text-sm font-semibold"
                  style={{ color: 'var(--text)' }}
                >
                  Top Ways to Improve
                </h3>
              </div>
              <div className="space-y-3">
                {improvements.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{
                        background: 'var(--chip-bg)',
                        color: 'var(--accent)',
                      }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-xs font-semibold"
                        style={{ color: 'var(--text)' }}
                      >
                        {item.title}
                      </p>
                      {item.description && (
                        <p
                          className="text-[11px]"
                          style={{ color: 'var(--text-sub)' }}
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                    <ChevronRight
                      size={14}
                      className="shrink-0 mt-1"
                      style={{ color: 'var(--text-sub)' }}
                    />
                  </div>
                ))}
              </div>
            </GlassPanel>
          </motion.div>
        </motion.div>
      </PageWrapper>
    </>
  );
}
