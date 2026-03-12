'use client';

import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ShieldAlert,
  DollarSign,
  ArrowRight,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Mascot } from '@/components/brand/Mascot';
import { useRiskRadar } from '@/hooks/useIntelligence';
import { formatCurrency } from '@/lib/utils';
import type { RiskLevel, RiskScore } from '@/types/app';

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

const riskConfig: Record<
  RiskLevel,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info'; color: string; bg: string }
> = {
  low: { label: 'Low', variant: 'success', color: 'var(--emerald)', bg: 'var(--emerald-soft)' },
  moderate: { label: 'Moderate', variant: 'warning', color: 'var(--gold)', bg: 'var(--gold-soft)' },
  high: { label: 'High', variant: 'error', color: 'var(--danger)', bg: 'var(--danger-soft)' },
  critical: { label: 'Critical', variant: 'error', color: 'var(--danger)', bg: 'var(--danger-soft)' },
};

function RiskItem({ risk }: { risk: RiskScore }) {
  const config = riskConfig[risk.risk_level] ?? riskConfig.moderate;
  const factors = (risk.contributing_factors ?? []) as string[];

  return (
    <GlassPanel padding="md" hover>
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: config.bg }}
        >
          <ShieldAlert size={18} style={{ color: config.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-sm font-semibold capitalize"
              style={{ color: 'var(--text)' }}
            >
              {risk.system_type.replace('_', ' ')}
            </span>
            <Badge variant={config.variant}>{config.label}</Badge>
          </div>

          {factors.length > 0 && (
            <p className="text-xs mb-1.5" style={{ color: 'var(--text-sub)' }}>
              {factors[0]}
            </p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            {risk.estimated_repair_cost != null && (
              <span
                className="text-[11px] flex items-center gap-1 font-medium"
                style={{ color: config.color }}
              >
                <DollarSign size={12} />
                Est. {formatCurrency(risk.estimated_repair_cost)}
              </span>
            )}
            {risk.time_to_failure_days != null && risk.time_to_failure_days > 0 && (
              <span
                className="text-[11px] flex items-center gap-1"
                style={{ color: 'var(--text-sub)' }}
              >
                <TrendingUp size={12} />
                ~{risk.time_to_failure_days}d to potential failure
              </span>
            )}
          </div>

          <div className="mt-2">
            <Button size="sm" variant="ghost" className="text-xs px-0">
              View Recommended Actions <ArrowRight size={12} className="ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </GlassPanel>
  );
}

export function RiskRadarClient() {
  const { risks, isLoading, recalculate, isCalculating } = useRiskRadar();

  const totalExposure = risks.reduce(
    (sum, r) => sum + (r.estimated_repair_cost ?? 0),
    0
  );

  const sorted = [...risks].sort((a, b) => {
    const order: Record<string, number> = {
      critical: 0,
      high: 1,
      moderate: 2,
      low: 3,
    };
    return (order[a.risk_level] ?? 3) - (order[b.risk_level] ?? 3);
  });

  const highRiskCount = risks.filter(
    (r) => r.risk_level === 'critical' || r.risk_level === 'high'
  ).length;

  if (isLoading) {
    return (
      <>
        <Navbar title="Risk Radar" showBack backHref="/intelligence" />
        <PageWrapper>
          <div className="flex items-center justify-center py-16">
            <Spinner size="lg" />
          </div>
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Navbar title="Risk Radar" showBack backHref="/intelligence" />
      <PageWrapper>
        <motion.div
          className="space-y-4"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Summary Card */}
          <motion.div variants={fadeUp}>
            <GlassPanel padding="lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2
                    className="font-serif text-lg"
                    style={{ color: 'var(--text)' }}
                  >
                    Total Exposure
                  </h2>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: totalExposure > 0 ? 'var(--danger)' : 'var(--emerald)' }}
                  >
                    {formatCurrency(totalExposure)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                    {risks.length} system{risks.length !== 1 ? 's' : ''} tracked
                  </p>
                  {highRiskCount > 0 && (
                    <Badge variant="error">
                      {highRiskCount} high risk
                    </Badge>
                  )}
                </div>
              </div>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => recalculate()}
                loading={isCalculating}
                className="w-full"
              >
                <RefreshCw size={14} className="mr-1" />
                Recalculate Risk
              </Button>
            </GlassPanel>
          </motion.div>

          {/* High Risk Mascot Callout */}
          {highRiskCount > 0 && (
            <motion.div variants={fadeUp}>
              <GlassPanel padding="md">
                <div className="flex items-center gap-3">
                  <Mascot mode="arms-crossed" size="sm" />
                  <div className="flex-1">
                    <p
                      className="text-xs font-semibold"
                      style={{ color: 'var(--danger)' }}
                    >
                      Attention Needed
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                      {highRiskCount} system{highRiskCount !== 1 ? 's' : ''} need
                      attention soon. Address high-risk items to protect your home.
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          )}

          {/* Risk List */}
          {sorted.length === 0 ? (
            <motion.div variants={fadeUp}>
              <GlassPanel padding="lg" className="text-center">
                <Mascot mode="celebrate" size="lg" className="mx-auto mb-3" />
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: 'var(--text)' }}
                >
                  No risks detected
                </p>
                <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                  Add systems to your property to start tracking risk.
                </p>
              </GlassPanel>
            </motion.div>
          ) : (
            sorted.map((risk) => (
              <motion.div key={risk.id} variants={fadeUp}>
                <RiskItem risk={risk} />
              </motion.div>
            ))
          )}
        </motion.div>
      </PageWrapper>
    </>
  );
}
