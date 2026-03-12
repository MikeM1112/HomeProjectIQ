'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { StatsBar } from '@/components/features/dashboard/StatsBar';
import { XPProgress } from '@/components/features/dashboard/XPProgress';
import { RecentProjects } from '@/components/features/dashboard/RecentProjects';
import { SeasonalReminders } from '@/components/features/dashboard/SeasonalReminders';
import { CategoryGrid } from '@/components/features/advisor/CategoryGrid';
import { BadgeShowcase } from '@/components/features/dashboard/BadgeShowcase';
import { SkillTree } from '@/components/features/dashboard/SkillTree';
import { QuickTips } from '@/components/features/dashboard/QuickTips';
import { SavingsInsight } from '@/components/features/dashboard/SavingsInsight';
import { MaintenanceDashboardCompact } from '@/components/maintenance/MaintenanceDashboardCompact';
import { AIAssessmentFlow } from '@/components/advisor/AIAssessmentFlow';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Mascot, MascotGreeting } from '@/components/brand/Mascot';
import { BrandIcon } from '@/components/brand/BrandIcon';
import { useAdvisorStore } from '@/stores/advisorStore';
import { useUser } from '@/hooks/useUser';
import { useProjects } from '@/hooks/useProjects';
import { useToolbox } from '@/hooks/useToolbox';
import { useToolLoans } from '@/hooks/useToolLoans';
import { useCapabilityScore, useRiskRadar, useAlerts } from '@/hooks/useIntelligence';
import { ActiveQuotes } from '@/components/features/quotes/ActiveQuotes';
import { ROUTES } from '@/lib/constants';

export function DashboardClient() {
  const router = useRouter();
  const { selectCategory } = useAdvisorStore();
  const [showAI, setShowAI] = useState(false);
  const { user } = useUser();
  const { projects } = useProjects();
  const { tools: toolboxTools } = useToolbox();
  const { activeLoans, overdueLoans } = useToolLoans();
  const { score: capScore } = useCapabilityScore();
  const { criticalCount, highCount } = useRiskRadar();
  const { unreadCount: alertCount } = useAlerts();

  // Listen for scan button from BottomNav
  useEffect(() => {
    const handler = () => setShowAI(true);
    window.addEventListener('homeiq:start-assessment', handler);
    return () => window.removeEventListener('homeiq:start-assessment', handler);
  }, []);

  const handleCategory = (id: string) => {
    selectCategory(id);
    router.push(`/project/new?category=${id}`);
  };

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
        <div className="space-y-6">
          {/* Welcome + Mascot Header */}
          <div className="flex items-center gap-3">
            <Mascot mode="default" size="md" />
            <div>
              <MascotGreeting name={user?.display_name?.split(' ')[0] ?? 'there'} />
            </div>
          </div>

          {/* AI Photo Assessment CTA */}
          <div
            className="relative overflow-hidden rounded-[20px] border border-[var(--glass-border)]"
            style={{
              background: 'var(--glass)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              boxShadow: 'var(--card-shadow, 0 2px 16px rgba(0,0,0,0.08))',
            }}
          >
            {/* Gradient overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{ background: 'var(--accent-gradient)' }}
            />
            <div className="relative p-5 flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                <BrandIcon name="diagnose" size={56} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-serif text-lg text-[var(--text)]">Diagnose a Problem</h2>
                <p className="text-xs text-[var(--text-sub)] mt-0.5">
                  Snap a photo for instant AI diagnosis
                </p>
              </div>
              <Button onClick={() => setShowAI(true)} size="md">
                Scan
              </Button>
            </div>
          </div>

          {/* Maintenance Hub — Home Health Score */}
          <MaintenanceDashboardCompact />

          {/* Home Intelligence Summary */}
          <Link href={ROUTES.INTELLIGENCE}>
            <Card className="relative overflow-hidden">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧠</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)]">Home Intelligence</p>
                  <p className="text-xs text-[var(--text-sub)]">
                    {capScore ? `Score: ${capScore.overall_score}/100` : 'Set up your home profile'}
                    {(criticalCount > 0 || highCount > 0) &&
                      ` · ${criticalCount + highCount} risk${criticalCount + highCount !== 1 ? 's' : ''}`}
                  </p>
                </div>
                {alertCount > 0 && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[var(--danger)]/10 text-[var(--danger)]">
                    {alertCount} alert{alertCount !== 1 ? 's' : ''}
                  </span>
                )}
                <span className="text-[var(--ink-dim)] text-sm">&rsaquo;</span>
              </div>
            </Card>
          </Link>

          {/* Quick Links Grid */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { href: ROUTES.PROPERTY, icon: '🏡', label: 'Property' },
              { href: ROUTES.TIMELINE, icon: '📅', label: 'Timeline' },
              { href: ROUTES.SOCIAL, icon: '👥', label: 'Community' },
            ].map((link) => (
              <Link key={link.label} href={link.href}>
                <Card className="text-center py-3">
                  <span className="text-xl">{link.icon}</span>
                  <p className="text-[10px] font-medium text-[var(--text-sub)] mt-1">{link.label}</p>
                </Card>
              </Link>
            ))}
          </div>

          {/* Toolbox Quick Stats */}
          <Link href="/toolbox">
            <Card className="relative overflow-hidden">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🧰</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[var(--text)]">My Toolbox</p>
                  <p className="text-xs text-[var(--text-sub)]">
                    {toolboxTools.length} tool{toolboxTools.length !== 1 ? 's' : ''}
                    {activeLoans.length > 0 && ` · ${activeLoans.length} lent out`}
                  </p>
                </div>
                {overdueLoans.length > 0 && (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[var(--danger)]/10 text-[var(--danger)]">
                    {overdueLoans.length} overdue
                  </span>
                )}
                <span className="text-[var(--ink-dim)] text-sm">&rsaquo;</span>
              </div>
            </Card>
          </Link>

          {/* XP Progress */}
          <XPProgress />

          {/* Quick Tips */}
          <QuickTips />

          {/* Recent Projects */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-serif text-lg text-[var(--text)]">Recent Projects</h2>
              <Link
                href="/logbook"
                className="text-xs font-semibold text-[var(--accent)] hover:brightness-110 transition-all"
              >
                See All
              </Link>
            </div>
            <RecentProjects />
          </div>

          {/* Active Quotes */}
          <ActiveQuotes />

          {/* Stats Cards */}
          <StatsBar />

          {/* Seasonal Reminders */}
          <SeasonalReminders />

          {/* DIY Savings Insight */}
          <SavingsInsight totalSavings={0} projectCount={0} />

          {/* Skill Tree */}
          <div>
            <h2 className="font-serif text-lg mb-3 text-[var(--text)]">Skill Tree</h2>
            <SkillTree skills={user?.skills ?? {}} projects={projects} />
          </div>

          {/* Badges */}
          <div>
            <h2 className="font-serif text-lg mb-3 text-[var(--text)]">Badges</h2>
            <BadgeShowcase />
          </div>

          {/* Start a New Project */}
          <div>
            <h2 className="font-serif text-lg mb-3 text-[var(--text)]">Start a New Project</h2>
            <CategoryGrid onClick={handleCategory} />
          </div>
        </div>
      </PageWrapper>
    </>
  );
}
