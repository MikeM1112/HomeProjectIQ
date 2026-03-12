'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Thermometer,
  Droplets,
  Zap,
  Home,
  Layers,
  Shield,
  Plus,
  Calendar,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { Mascot } from '@/components/brand/Mascot';
import { useProperties, usePropertySystems } from '@/hooks/useProperties';
import { cn, formatDate } from '@/lib/utils';
import type { HomeSystem, ConditionLevel, SystemType } from '@/types/app';

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

const systemIcons: Record<string, React.ReactNode> = {
  hvac: <Thermometer size={18} />,
  plumbing: <Droplets size={18} />,
  electrical: <Zap size={18} />,
  roofing: <Home size={18} />,
  foundation: <Layers size={18} />,
  security: <Shield size={18} />,
  appliance: <Zap size={18} />,
  exterior: <Home size={18} />,
  interior: <Home size={18} />,
  landscaping: <Home size={18} />,
  other: <Layers size={18} />,
};

const conditionConfig: Record<
  ConditionLevel,
  { label: string; variant: 'success' | 'warning' | 'error' | 'info' | 'default'; color: string }
> = {
  excellent: { label: 'Excellent', variant: 'success', color: 'var(--emerald)' },
  good: { label: 'Good', variant: 'success', color: 'var(--emerald)' },
  fair: { label: 'Fair', variant: 'warning', color: 'var(--gold)' },
  poor: { label: 'Poor', variant: 'error', color: 'var(--danger)' },
  critical: { label: 'Critical', variant: 'error', color: 'var(--danger)' },
};

function LifespanBar({ system }: { system: HomeSystem }) {
  if (!system.install_date || !system.expected_lifespan_years) return null;

  const installYear = new Date(system.install_date).getFullYear();
  const currentYear = new Date().getFullYear();
  const ageYears = currentYear - installYear;
  const pct = Math.min(100, Math.round((ageYears / system.expected_lifespan_years) * 100));
  const remaining = Math.max(0, system.expected_lifespan_years - ageYears);

  const barColor =
    pct >= 90
      ? 'var(--danger)'
      : pct >= 70
        ? 'var(--gold)'
        : 'var(--emerald)';

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-medium" style={{ color: 'var(--text-sub)' }}>
          Lifespan
        </span>
        <span className="text-[10px] font-semibold" style={{ color: barColor }}>
          {remaining > 0 ? `~${remaining}yr remaining` : 'Past expected life'}
        </span>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'var(--glass-border)' }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function SystemCard({ system }: { system: HomeSystem }) {
  const cond = conditionConfig[system.condition] ?? conditionConfig.fair;
  const icon = systemIcons[system.system_type] ?? systemIcons.other;

  const riskLevel =
    system.condition === 'critical'
      ? 'High Risk'
      : system.condition === 'poor'
        ? 'Medium Risk'
        : null;

  return (
    <GlassPanel padding="md" hover>
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{
            background: 'var(--chip-bg)',
            color: 'var(--accent)',
          }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className="text-sm font-semibold truncate"
              style={{ color: 'var(--text)' }}
            >
              {system.name}
            </span>
            <Badge variant={cond.variant}>{cond.label}</Badge>
          </div>

          {system.brand && (
            <p className="text-[11px]" style={{ color: 'var(--text-sub)' }}>
              {system.brand}
              {system.model ? ` ${system.model}` : ''}
            </p>
          )}

          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {system.install_date && (
              <span
                className="text-[10px] flex items-center gap-1"
                style={{ color: 'var(--text-sub)' }}
              >
                <Calendar size={10} />
                Installed {formatDate(system.install_date)}
              </span>
            )}
            {system.last_serviced_at && (
              <span
                className="text-[10px] flex items-center gap-1"
                style={{ color: 'var(--text-sub)' }}
              >
                <Calendar size={10} />
                Serviced {formatDate(system.last_serviced_at)}
              </span>
            )}
          </div>

          <LifespanBar system={system} />

          {riskLevel && (
            <div
              className="flex items-center gap-1 mt-2 text-[10px] font-semibold"
              style={{
                color:
                  system.condition === 'critical'
                    ? 'var(--danger)'
                    : 'var(--gold)',
              }}
            >
              <AlertTriangle size={12} />
              {riskLevel}
            </div>
          )}
        </div>
        <ChevronRight
          size={16}
          className="shrink-0 mt-1"
          style={{ color: 'var(--text-sub)' }}
        />
      </div>
    </GlassPanel>
  );
}

export function SystemsClient() {
  const { properties, isLoading: propertiesLoading } = useProperties();
  const primaryProperty = properties[0];
  const { systems, isLoading: systemsLoading } = usePropertySystems(
    primaryProperty?.id
  );

  const isLoading = propertiesLoading || systemsLoading;

  if (isLoading) {
    return (
      <>
        <Navbar title="Home Systems" showBack backHref="/dashboard" />
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
      <Navbar title="Home Systems" showBack backHref="/dashboard" />
      <PageWrapper>
        <motion.div
          className="space-y-4"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Header */}
          <motion.div
            variants={fadeUp}
            className="flex items-center justify-between"
          >
            <div>
              <h1
                className="font-serif text-xl"
                style={{ color: 'var(--text)' }}
              >
                Home Systems
              </h1>
              {primaryProperty && (
                <p className="text-xs" style={{ color: 'var(--text-sub)' }}>
                  {primaryProperty.name}
                </p>
              )}
            </div>
            <Button size="sm">
              <Plus size={16} className="mr-1" />
              Add System
            </Button>
          </motion.div>

          {/* Systems List */}
          {systems.length === 0 ? (
            <motion.div variants={fadeUp}>
              <GlassPanel padding="lg" className="text-center">
                <Mascot mode="checklist" size="lg" className="mx-auto mb-3" />
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: 'var(--text)' }}
                >
                  No systems tracked yet
                </p>
                <p
                  className="text-xs mb-4"
                  style={{ color: 'var(--text-sub)' }}
                >
                  Add your home systems to track maintenance, lifespan, and risk.
                </p>
                <Button size="sm">
                  <Plus size={16} className="mr-1" />
                  Add Your First System
                </Button>
              </GlassPanel>
            </motion.div>
          ) : (
            systems.map((system) => (
              <motion.div key={system.id} variants={fadeUp}>
                <SystemCard system={system} />
              </motion.div>
            ))
          )}
        </motion.div>
      </PageWrapper>
    </>
  );
}
