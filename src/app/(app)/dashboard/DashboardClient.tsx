'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  TrendingUp,
  Shield,
  Star,
  Camera,
  Telescope,
  Wrench,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { AIAssessmentFlow } from '@/components/advisor/AIAssessmentFlow';
import { Mascot, MascotGreeting } from '@/components/brand/Mascot';
import { BrandIcon } from '@/components/brand/BrandIcon';
import { useAdvisorStore } from '@/stores/advisorStore';
import { useUser } from '@/hooks/useUser';
import { useProjects } from '@/hooks/useProjects';
import { useToolbox } from '@/hooks/useToolbox';
import { useCapabilityScore, useRiskRadar, useAlerts } from '@/hooks/useIntelligence';
import { ROUTES } from '@/lib/constants';

/* ── Animation variants ── */
const cardContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const cardItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

/* ── Glass card wrapper ── */
function GlassCard({
  children,
  className = '',
  onClick,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}) {
  const content = (
    <motion.div
      variants={cardItem}
      whileTap={{ scale: 0.985 }}
      className={`relative overflow-hidden rounded-[20px] border transition-shadow duration-200 hover:shadow-[var(--card-shadow-hover)] ${className}`}
      style={{
        background: 'var(--glass)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderColor: 'var(--glass-border)',
        boxShadow: 'var(--card-shadow)',
      }}
    >
      {children}
    </motion.div>
  );

  if (href) return <Link href={href}>{content}</Link>;
  if (onClick) return <div onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && onClick()} className="cursor-pointer">{content}</div>;
  return content;
}

/* ── Circular score gauge ── */
function CircularScore({
  score,
  max = 100,
  size = 72,
  strokeWidth = 7,
  color = 'var(--accent)',
  label,
}: {
  score: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(score / max, 1);
  const offset = circumference * (1 - pct);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--glass-border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>{score}</span>
        {label && <span className="text-[9px] font-semibold" style={{ color }}>{label}</span>}
      </div>
    </div>
  );
}

/* ── Risk level badge ── */
function RiskBadge({ level }: { level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL' }) {
  const map = {
    LOW: { color: 'var(--emerald)', bg: 'var(--emerald-soft)' },
    MODERATE: { color: 'var(--gold)', bg: 'var(--gold-soft)' },
    HIGH: { color: 'var(--danger)', bg: 'var(--danger-soft)' },
    CRITICAL: { color: 'var(--danger)', bg: 'var(--danger-soft)' },
  };
  const { color, bg } = map[level];
  return (
    <span
      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
      style={{ background: bg, color }}
    >
      {level}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD CLIENT — COMMAND CENTER
   ═══════════════════════════════════════════════════════════════ */
export function DashboardClient() {
  const router = useRouter();
  const { selectCategory } = useAdvisorStore();
  const [showAI, setShowAI] = useState(false);
  const { user } = useUser();
  const { projects } = useProjects();
  const { tools: toolboxTools } = useToolbox();
  const { score: capScore } = useCapabilityScore();
  const { criticalCount, highCount } = useRiskRadar();
  const { unreadCount: alertCount } = useAlerts();

  // Computed values with safe defaults
  const xpTotal = user?.total_xp ?? 0;
  const xpLevel = user?.level ?? 1;
  const xpLabel = xpLevel >= 5 ? 'Master' : xpLevel >= 4 ? 'Skilled' : xpLevel >= 3 ? 'Handy' : xpLevel >= 2 ? 'Apprentice' : 'Rookie';
  const fitnessScore = capScore?.overall_score ?? 0;
  const totalSavings = projects.reduce(
    (sum, p) => {
      const proAvg = ((p.estimated_pro_lo ?? 0) + (p.estimated_pro_hi ?? 0)) / 2;
      const diyAvg = ((p.estimated_diy_lo ?? 0) + (p.estimated_diy_hi ?? 0)) / 2;
      return sum + Math.max(0, proAvg - diyAvg);
    },
    0
  );
  const activeIssues = projects.filter(
    (p) => p.status === 'in_progress'
  );
  const toolCount = toolboxTools.length;
  const suggestedProject = projects.find(
    (p) => p.status === 'planning'
  );

  // Listen for scan button from BottomNav
  useEffect(() => {
    const handler = () => setShowAI(true);
    window.addEventListener('homeiq:start-assessment', handler);
    return () => window.removeEventListener('homeiq:start-assessment', handler);
  }, []);

  if (showAI) {
    return (
      <>
        <Navbar title="AI Assessment" showBack onBack={() => setShowAI(false)} />
        <PageWrapper>
          <AIAssessmentFlow />
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Navbar title="HomeProjectIQ" />
      <PageWrapper withGlow>
        <motion.div
          variants={cardContainer}
          initial="hidden"
          animate="show"
          className="space-y-5"
        >
          {/* Welcome header */}
          <motion.div variants={cardItem} className="flex items-center gap-3 mb-1">
            <Mascot mode="default" size="md" />
            <div>
              <MascotGreeting name={user?.display_name?.split(' ')[0] ?? 'there'} />
            </div>
          </motion.div>

          {/* ═══════ 1. AI SUGGESTED PROJECT — Hero Card ═══════ */}
          <GlassCard href={suggestedProject ? `/project/${suggestedProject.id}` : ROUTES.DIAGNOSE}>
            {/* Gradient shimmer overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.05]"
              style={{ backgroundImage: 'var(--accent-gradient)' }}
            />
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                  Recommended For You
                </span>
              </div>
              <h2 className="text-lg font-bold text-[var(--text)] mb-3">
                {suggestedProject?.title ?? 'Replace Bathroom Faucet Cartridge'}
              </h2>
              <div className="space-y-1.5 mb-4">
                <p className="text-xs text-[var(--text-sub)] flex items-center gap-2">
                  <span className="text-sm">🔧</span>
                  You already own {Math.min(toolCount, 3)} of 4 tools
                </p>
                <p className="text-xs text-[var(--text-sub)] flex items-center gap-2">
                  <span className="text-sm">💰</span>
                  Estimated savings: ${suggestedProject
                    ? Math.max(0, ((suggestedProject.estimated_pro_lo ?? 0) - (suggestedProject.estimated_diy_lo ?? 0)))
                    : 145}
                </p>
                <p className="text-xs text-[var(--text-sub)] flex items-center gap-2">
                  <span className="text-sm">⏱️</span>
                  Time required: 25 minutes
                </p>
              </div>
              <div className="flex gap-2">
                <div
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white"
                  style={{
                    backgroundImage: 'var(--accent-gradient)',
                    boxShadow: '0 4px 16px var(--accent-glow)',
                  }}
                >
                  Start Project
                </div>
                <div
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold"
                  style={{
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-sub)',
                  }}
                >
                  View Steps
                  <ChevronRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ═══════ 2. DIY SAVINGS OPPORTUNITY ═══════ */}
          <GlassCard href={ROUTES.INTELLIGENCE}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4" style={{ color: 'var(--emerald)' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--emerald)' }}>
                  DIY Savings Opportunity
                </span>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-[var(--text-dim)] mb-0.5">Estimated savings this year:</p>
                  <p className="text-3xl font-bold gradient-text">
                    ${totalSavings > 0 ? totalSavings.toLocaleString() : '1,240'}
                  </p>
                  <p className="text-xs text-[var(--text-sub)] mt-1">
                    Projects identified: {activeIssues.length > 0 ? activeIssues.length : 3}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{
                    background: 'var(--emerald-soft)',
                    color: 'var(--emerald)',
                    border: '1px solid rgba(16,185,129,0.15)',
                  }}
                >
                  See Savings
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ═══════ 3. HOME FITNESS SCORE ═══════ */}
          <GlassCard href={ROUTES.INTELLIGENCE}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                  Home Fitness Score
                </span>
              </div>
              <div className="flex items-center gap-5">
                <CircularScore
                  score={fitnessScore > 0 ? fitnessScore : 78}
                  label={fitnessScore >= 80 ? 'Great' : fitnessScore >= 60 ? 'Good' : 'Fair'}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[var(--text)] mb-2">Improve score by:</p>
                  <div className="space-y-1.5">
                    {['Replace HVAC filter', 'Flush water heater', 'Reseal deck boards'].map((task) => (
                      <div key={task} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                        <span className="text-[11px] text-[var(--text-sub)]">{task}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <div
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{
                    background: 'var(--accent-soft)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(6,156,168,0.15)',
                  }}
                >
                  Improve Score
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ═══════ 4. HANDYHERO XP ═══════ */}
          <GlassCard>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">⚡</span>
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
                  HandyHero Level {xpLevel}
                </span>
              </div>
              <div className="flex items-center gap-5 mb-4">
                <div>
                  <p className="text-2xl font-bold" style={{ color: 'var(--text)' }}>
                    {xpTotal > 0 ? xpTotal.toLocaleString() : '2,340'}
                  </p>
                  <p className="text-[10px] text-[var(--text-dim)]">Total XP</p>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-sub)' }}>
                      Level {xpLevel} — {xpLabel}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--gold)' }}>
                      Next: 160 XP
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--xp-bar-bg)' }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: '72%', backgroundImage: 'var(--xp-gradient)' }}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1.5 mb-3">
                <p className="text-[10px] font-semibold text-[var(--text-dim)]">RECENT XP</p>
                {[
                  { label: 'Faucet Repair', xp: '+120' },
                  { label: 'Tool Loan', xp: '+40' },
                  { label: 'Maintenance Task', xp: '+80' },
                ].map((entry) => (
                  <div key={entry.label} className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-sub)]">{entry.label}</span>
                    <span className="text-xs font-bold" style={{ color: 'var(--emerald)' }}>
                      {entry.xp}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Link
                  href={ROUTES.TIMELINE}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{
                    background: 'var(--gold-soft)',
                    color: 'var(--gold)',
                    border: '1px solid rgba(251,191,36,0.15)',
                  }}
                >
                  View Achievements
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </GlassCard>

          {/* ═══════ 5. PROJECTSCOPEPRO ═══════ */}
          <GlassCard href={ROUTES.SCOPE}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <Telescope className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                  ProjectScopePro
                </span>
              </div>
              <h3 className="text-base font-bold text-[var(--text)] mb-2">Plan a Bigger Project</h3>
              <p className="text-xs text-[var(--text-sub)] mb-3 leading-relaxed">
                Upload photos and AI will generate:
              </p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {['Scope of work', 'Materials list', 'Labor estimate', 'Total project cost'].map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                    <span className="text-[11px] text-[var(--text-sub)]">{item}</span>
                  </div>
                ))}
              </div>

              {/* Example output teaser */}
              <div
                className="rounded-xl p-3 mb-4"
                style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)' }}
              >
                <p className="text-[10px] font-semibold text-[var(--text-dim)] mb-1.5">EXAMPLE OUTPUT</p>
                <p className="text-xs font-bold text-[var(--text)] mb-1">Bathroom Vanity Replacement</p>
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-[10px] text-[var(--text-dim)]">DIY Cost</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--emerald)' }}>$280</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[var(--text-dim)]">Contractor</p>
                    <p className="text-sm font-bold" style={{ color: 'var(--gold)' }}>$1,150</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <div
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white"
                  style={{
                    backgroundImage: 'var(--accent-gradient)',
                    boxShadow: '0 4px 16px var(--accent-glow)',
                  }}
                >
                  <Camera className="w-3.5 h-3.5" />
                  Start Project Scope
                </div>
                <div
                  className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold"
                  style={{
                    background: 'var(--glass)',
                    border: '1px solid var(--glass-border)',
                    color: 'var(--text-sub)',
                  }}
                >
                  View Example
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ═══════ 6. HOME RISK RADAR ═══════ */}
          <GlassCard href={ROUTES.INTELLIGENCE}>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-4 h-4" style={{ color: 'var(--gold)' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
                  Home Risk Radar
                </span>
              </div>
              <div className="space-y-2.5 mb-4">
                {[
                  { system: 'Water Heater', level: 'HIGH' as const },
                  { system: 'HVAC', level: 'MODERATE' as const },
                  { system: 'Plumbing', level: 'MODERATE' as const },
                  { system: 'Roof', level: 'LOW' as const },
                ].map((item) => (
                  <div key={item.system} className="flex items-center justify-between">
                    <span className="text-sm text-[var(--text)]">{item.system}</span>
                    <RiskBadge level={item.level} />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <div
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                  style={{
                    background: 'var(--gold-soft)',
                    color: 'var(--gold)',
                    border: '1px solid rgba(251,191,36,0.15)',
                  }}
                >
                  View Details
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* ═══════ 7. ACTIVE ISSUES ═══════ */}
          <GlassCard>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                  Active Issues
                </span>
              </div>

              {activeIssues.length > 0 ? (
                <div className="space-y-3">
                  {activeIssues.slice(0, 3).map((issue) => (
                    <Link key={issue.id} href={`/project/${issue.id}`}>
                      <div
                        className="flex items-center gap-3 rounded-xl p-3 transition-colors"
                        style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)' }}
                      >
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--gold)' }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[var(--text)] truncate">{issue.title}</p>
                          <p className="text-[10px] text-[var(--text-dim)]">
                            {issue.verdict === 'hire_pro' ? 'Hire Pro' : 'DIY Worth It'}
                          </p>
                        </div>
                        <div
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold"
                          style={{
                            backgroundImage: 'var(--accent-gradient)',
                            color: 'white',
                          }}
                        >
                          Continue
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                /* Default demo-style active issue */
                <div
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)' }}
                >
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: 'var(--gold)' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[var(--text)]">Kitchen Faucet Leak</p>
                    <p className="text-[10px] text-[var(--text-dim)]">Medium &bull; DIY Worth It</p>
                  </div>
                  <Link
                    href={ROUTES.DIAGNOSE}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold text-white"
                    style={{ backgroundImage: 'var(--accent-gradient)' }}
                  >
                    Continue Repair
                  </Link>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </PageWrapper>
    </>
  );
}
