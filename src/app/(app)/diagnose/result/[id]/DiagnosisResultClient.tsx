'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Hammer,
  HardHat,
  ShieldAlert,
  Sparkles,
  Wrench,
  ArrowRight,
  BookmarkPlus,
  Brain,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Mascot } from '@/components/brand/Mascot';

/* ── Animation variants ── */
const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

/* ── Demo/placeholder data ── */
const DEMO_RESULT = {
  title: 'Leaking Kitchen Faucet',
  severity: 'moderate' as const,
  confidence: 87,
  recommendation: 'DIY' as const,
  diyCost: { lo: 15, hi: 45 },
  proCost: { lo: 150, hi: 300 },
  estimatedSavings: 200,
  toolsReady: 4,
  toolsRequired: 5,
  whyAiThinks:
    'Based on the visible drip pattern and faucet type, this appears to be a worn O-ring or cartridge. The single-handle design makes this a straightforward replacement that most homeowners can handle with basic tools.',
  riskIfIgnored:
    'A slow leak can waste up to 3,000 gallons of water per year and may cause water damage to the cabinet below. Left untreated, this can lead to mold growth and structural damage.',
  flags: ['Water damage potential', 'Mold risk if ignored'],
};

function getSeverityConfig(severity: 'low' | 'moderate' | 'high' | 'critical') {
  switch (severity) {
    case 'low':
      return { label: 'Low', variant: 'success' as const, color: 'var(--emerald)' };
    case 'moderate':
      return { label: 'Moderate', variant: 'warning' as const, color: 'var(--gold)' };
    case 'high':
      return { label: 'High', variant: 'error' as const, color: 'var(--danger)' };
    case 'critical':
      return { label: 'Critical', variant: 'error' as const, color: 'var(--danger)' };
  }
}

function getRecommendationConfig(rec: 'DIY' | 'HIRE_PRO' | 'CONSIDER_BOTH') {
  switch (rec) {
    case 'DIY':
      return {
        label: 'DIY Recommended',
        icon: Hammer,
        color: 'var(--emerald)',
        bg: 'var(--emerald-soft)',
      };
    case 'HIRE_PRO':
      return {
        label: 'Hire a Pro',
        icon: HardHat,
        color: 'var(--danger)',
        bg: 'var(--danger-soft)',
      };
    case 'CONSIDER_BOTH':
      return {
        label: 'Consider Both Options',
        icon: Sparkles,
        color: 'var(--gold)',
        bg: 'var(--gold-soft)',
      };
  }
}

interface DiagnosisResultClientProps {
  id: string;
}

export function DiagnosisResultClient({ id }: DiagnosisResultClientProps) {
  const router = useRouter();
  const [showWhyAI, setShowWhyAI] = useState(false);

  const result = DEMO_RESULT;
  const severityConfig = getSeverityConfig(result.severity);
  const recConfig = getRecommendationConfig(result.recommendation);
  const RecIcon = recConfig.icon;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-[480px] lg:max-w-2xl mx-auto px-4 py-6 space-y-4"
    >
      {/* Title + badges row */}
      <motion.div variants={item}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h1
            className="text-xl font-bold leading-tight"
            style={{
              fontFamily: "var(--font-instrument-serif, 'Instrument Serif', serif)",
              color: 'var(--text)',
            }}
          >
            {result.title}
          </h1>
          <Mascot size="sm" mode="idea" animate={false} />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={severityConfig.variant}>
            {severityConfig.label} Severity
          </Badge>
          <Badge variant="gradient">
            {result.confidence}% Confidence
          </Badge>
        </div>
      </motion.div>

      {/* Recommendation panel */}
      <motion.div
        variants={item}
        className="rounded-[20px] p-4"
        style={{
          background: 'var(--glass)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: recConfig.bg }}
          >
            <RecIcon className="w-5 h-5" style={{ color: recConfig.color }} />
          </div>
          <div>
            <p className="text-sm font-bold" style={{ color: recConfig.color }}>
              {recConfig.label}
            </p>
            <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
              Based on difficulty, tools, and skill level
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cost comparison panel */}
      <motion.div
        variants={item}
        className="rounded-[20px] p-4"
        style={{
          background: 'var(--glass)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Cost Comparison
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* DIY cost */}
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: 'var(--emerald-soft)' }}
          >
            <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--emerald)' }}>
              DIY Cost
            </p>
            <p className="text-lg font-bold" style={{ color: 'var(--emerald)' }}>
              ${result.diyCost.lo}&ndash;${result.diyCost.hi}
            </p>
          </div>

          {/* Pro cost */}
          <div
            className="rounded-xl p-3 text-center"
            style={{ background: 'var(--accent-soft)' }}
          >
            <p className="text-[10px] uppercase tracking-wider font-semibold mb-1" style={{ color: 'var(--accent)' }}>
              Pro Cost
            </p>
            <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
              ${result.proCost.lo}&ndash;${result.proCost.hi}
            </p>
          </div>
        </div>

        {/* Savings highlight */}
        <div
          className="rounded-xl p-3 flex items-center justify-between"
          style={{
            background: 'linear-gradient(135deg, var(--emerald-soft), var(--accent-soft))',
          }}
        >
          <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
            Estimated Savings
          </p>
          <p className="text-lg font-bold" style={{ color: 'var(--emerald)' }}>
            ~${result.estimatedSavings}
          </p>
        </div>
      </motion.div>

      {/* Tool readiness summary */}
      <motion.div
        variants={item}
        className="rounded-[20px] p-4"
        style={{
          background: 'var(--glass)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Tool Readiness
            </p>
          </div>
          <Badge variant={result.toolsReady === result.toolsRequired ? 'success' : 'warning'}>
            {result.toolsReady}/{result.toolsRequired} owned
          </Badge>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-2 rounded-full mt-3 overflow-hidden"
          style={{ background: 'var(--xp-bar-bg)' }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: result.toolsReady / result.toolsRequired }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="h-full rounded-full origin-left"
            style={{ background: 'var(--accent-gradient)' }}
          />
        </div>
      </motion.div>

      {/* Why AI thinks this -- expandable */}
      <motion.div
        variants={item}
        className="rounded-[20px] overflow-hidden"
        style={{
          background: 'var(--glass)',
          backdropFilter: 'blur(16px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--card-shadow)',
        }}
      >
        <button
          onClick={() => setShowWhyAI(!showWhyAI)}
          className="w-full flex items-center justify-between p-4 transition-colors hover:bg-[var(--card-hover)]"
        >
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>
              Why AI thinks this
            </p>
          </div>
          {showWhyAI ? (
            <ChevronUp className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
          ) : (
            <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
          )}
        </button>

        <AnimatePresence>
          {showWhyAI && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4">
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                  {result.whyAiThinks}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Risk if ignored warning card */}
      <motion.div
        variants={item}
        className="rounded-[20px] p-4"
        style={{
          background: 'var(--danger-soft)',
          border: '1px solid rgba(248,113,113,0.2)',
        }}
      >
        <div className="flex items-start gap-3">
          <div
            className="w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center mt-0.5"
            style={{ background: 'rgba(248,113,113,0.15)' }}
          >
            <ShieldAlert className="w-5 h-5" style={{ color: 'var(--danger)' }} />
          </div>
          <div>
            <p className="text-sm font-semibold mb-1" style={{ color: 'var(--danger)' }}>
              Risk if Ignored
            </p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
              {result.riskIfIgnored}
            </p>

            {result.flags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {result.flags.map((flag) => (
                  <span
                    key={flag}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(248,113,113,0.12)',
                      color: 'var(--danger)',
                    }}
                  >
                    <AlertTriangle className="w-3 h-3" />
                    {flag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* CTA row */}
      <motion.div variants={item} className="flex flex-col gap-3 pt-2 pb-4">
        <Button
          size="lg"
          className="w-full"
          onClick={() => router.push('/guided-repair/new')}
        >
          <CheckCircle2 className="w-5 h-5" />
          Start Guided Repair
          <ArrowRight className="w-4 h-4 ml-auto" />
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => router.push('/dashboard')}
          >
            <HardHat className="w-4 h-4" />
            Find a Pro
          </Button>

          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => router.push('/logbook')}
          >
            <BookmarkPlus className="w-4 h-4" />
            Save Project
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
